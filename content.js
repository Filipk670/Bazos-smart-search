// Bazoš Smart Search – content script (v0.7)

const IS_MOTO = window.location.hostname === "motorky.bazos.cz";
const ACTIVE_DATA = IS_MOTO ? MOTO_DATA : CAR_DATA;
const STORAGE_KEY = IS_MOTO ? "bss_moto_filters" : "bss_car_filters";
const AUTOFETCH_KEY = IS_MOTO ? "bss_moto_autofetch" : "bss_car_autofetch";

const APP_VERSION = "0.7";
const MIN_YEAR = 1970;
const SLIDER_MIN_YEAR = 1999;
const MAX_YEAR = new Date().getFullYear();
const MAX_PRICE = 1000000; // horní hranice posuvníku ceny (1 000 000 Kč)
const REQUEST_DELAY_MS = 800; // pauza mezi načítáním stránek, aby to nepůsobilo jako scraping
const AUTO_FETCH_THRESHOLD = 6; // při automatickém dotahování chceme alespoň tolik vyhovujících
const MAX_PAGES_PER_SCAN = 12;

let currentOffset = 0;
let isFetchingMore = false;
let noMorePages = false;
const seenAdUrls = new Set();

// Cesty značek, které Bazoš nabízí přímo v levém menu (ověřeno na stránce).
// U ostatních značek hledáme přes hlavní vyhledávání na "/" s názvem značky.
const BAZOS_MENU_PATHS = new Set([
    "/alfa/", "/audi/", "/bmw/", "/citroen/", "/dacia/", "/fiat/", "/ford/", "/honda/", "/hyundai/", "/chevrolet/",
    "/kia/", "/mazda/", "/mercedes/", "/mitsubishi/", "/nissan/", "/opel/", "/peugeot/", "/renault/", "/seat/",
    "/suzuki/", "/skoda/", "/toyota/", "/volkswagen/", "/volvo/",
]);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Text viditelného obsahu bez <script>, <style>, <noscript> a <template> (jinak by se do textu dostala čísla z kódu stránky)
function visibleTextOf(el) {
    const clone = el.cloneNode(true);
    clone.querySelectorAll("script, style, noscript, template").forEach((node) => node.remove());
    return clone.textContent.replace(/\s+/g, " ").trim();
}

// Inzeráty načtené z jiné stránky odstraníme skripty a událostmi (onclick…) před vložením do stránky
function sanitizeAdNode(node) {
    node.querySelectorAll("script, iframe, object, embed, link, meta, base").forEach((el) => el.remove());
    node.querySelectorAll("*").forEach((el) => {
        for (const attr of [...el.attributes]) {
            const isUrlAttr = attr.name === "href" || attr.name === "src";
            if (attr.name.startsWith("on") || (isUrlAttr && /^\s*javascript:/i.test(attr.value))) {
                el.removeAttribute(attr.name);
            }
        }
    });
    return node;
}

function normalizeText(str) {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "");
}

function parseKeywords(str) {
    return str
        .split(",")
        .map((w) => normalizeText(w.trim()))
        .filter(Boolean);
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Model se hledá jako celé slovo: "A1" nesedí na "A100", ale "Mazda 3" sedí na "mazda3", "mazda-3" i "mazda 3"
function modelMatches(normalizedText, model) {
    // Alternativní označení (E320 = Třída E, 320d = Řada 3 ...) z data.js
    const aliases = Object.prototype.hasOwnProperty.call(MODEL_ALIASES, model) ? MODEL_ALIASES[model] : null;
    if (aliases) {
        return aliases.some((src) => new RegExp(`(?<![\\p{L}\\p{N}])(?:${src})(?!\\p{N})`, "u").test(normalizedText));
    }
    const tokens = normalizeText(model).split(/[\s.-]+/).filter(Boolean).map(escapeRegex);
    if (tokens.length === 0) return true;
    const pattern = tokens.join("[\\s.-]?");
    // Čistě číselný model (např. 107, 2107) nesmí sedět na část většího čísla ("107 000 km")
    const end = /^\d+$/.test(model) ? `${MODEL_CODE_END}(?![\\p{L}\\p{N}])` : "(?![\\p{L}\\p{N}])";
    const re = new RegExp(`(?<![\\p{L}\\p{N}])${pattern}${end}`, "u");
    return re.test(normalizedText);
}

function isPlausibleYear(y) {
    return Number.isInteger(y) && y >= MIN_YEAR && y <= MAX_YEAR;
}

// Převod pozice posuvníku (0–1000) na cenu v Kč:
// 0–500 (50 % délky) = 0 až 350 000 Kč (krok 5 000 Kč)
// 500–1000 (druhých 50 % délky) = 350 000 až 1 000 000 Kč (krok 10 000 Kč)
function sliderToPrice(pos) {
    const val = Number(pos);
    if (val <= 500) {
        const raw = (val / 500) * 350000;
        return Math.round(raw / 5000) * 5000;
    }
    const raw = 350000 + ((val - 500) / 500) * 650000;
    return Math.round(raw / 10000) * 10000;
}

// Opačný převod ceny v Kč na pozici posuvníku (0–1000)
function priceToSlider(price) {
    const p = Math.max(0, Math.min(MAX_PRICE, Number(price) || 0));
    if (p <= 350000) {
        return Math.round((p / 350000) * 500);
    }
    return Math.round(500 + ((p - 350000) / 650000) * 500);
}

function formatPriceLabel(price) {
    return `${price.toLocaleString("cs-CZ")} Kč`;
}

function hasActiveClientFilters(filters) {
    return Boolean(
        filters.fuel ||
        filters.ccmMin ||
        filters.ccmMax ||
        filters.powerMin ||
        filters.powerMax ||
        filters.yearMin ||
        filters.yearMax ||
        filters.kmMax ||
        filters.keywordsIn.trim() ||
        filters.keywordsOut.trim()
    );
}

function initSmartSearch() {
    if (window.location.pathname.includes("/inzerat/")) {
        initDetailBadges();
        return;
    }

    const listHeader = document.querySelector(".listainzerat.inzeratyflex");
    if (!listHeader) return;

    // Automatické dotahování se spustí jen po kliknutí na "Filtrovat inzeráty", ne při každém načtení stránky
    const shouldAutoFetch = sessionStorage.getItem(AUTOFETCH_KEY) === "1";
    sessionStorage.removeItem(AUTOFETCH_KEY);

    const pathMatch = window.location.pathname.match(/\/(\d+)\/?$/);
    const urlParams = new URLSearchParams(window.location.search);
    if (pathMatch) {
        currentOffset = parseInt(pathMatch[1], 10);
    } else if (urlParams.get("crp")) {
        currentOffset = parseInt(urlParams.get("crp"), 10);
    }

    document.querySelectorAll(".inzeraty.inzeratyflex h2.nadpis a").forEach((a) => {
        seenAdUrls.add(a.getAttribute("href"));
    });

    const panel = document.createElement("div");
    panel.id = "bss-panel";

// Dynamické pole: U aut Palivo, u motorek Objem (ccm)
    const specificFieldHtml = IS_MOTO
        ? `
      <div class="bss-field">
        <label>Objem (ccm)</label>
        <div class="bss-range">
          <input type="number" id="bss-ccm-min" placeholder="Od (např. 500)" min="0">
          <input type="number" id="bss-ccm-max" placeholder="Do" min="0">
        </div>
      </div>
    `
        : `
      <div class="bss-field">
        <label for="bss-fuel">Palivo</label>
        <select id="bss-fuel">
          <option value="">Jakékoliv</option>
          <option value="diesel">Nafta</option>
          <option value="petrol">Benzín</option>
          <option value="lpg">LPG / CNG</option>
          <option value="hybrid">Hybrid</option>
          <option value="ev">Elektro</option>
        </select>
      </div>
    `;

    panel.innerHTML = `
    <div class="bss-header">
      <div class="bss-title">
        <span>${IS_MOTO ? "🏍️" : "🚗"} Bazoš Smart Search</span>
        <span class="bss-badge">v${APP_VERSION}</span>
      </div>
      <span id="bss-status" style="font-size: 12px; font-weight: 600; color: #ff6600;">Připraveno k filtrování</span>
    </div>

    <div class="bss-grid">
      <div class="bss-field">
        <label for="bss-brand">Značka</label>
        <select id="bss-brand">
          <option value="">Všechny značky</option>
        </select>
      </div>

      <div class="bss-field">
        <label for="bss-model">Model</label>
        <select id="bss-model" disabled>
          <option value="">Nejprve vyber značku</option>
        </select>
      </div>

      ${specificFieldHtml}

      <div class="bss-field">
        <label>Výkon (kW)</label>
        <div class="bss-range">
          <input type="number" id="bss-power-min" placeholder="Od" min="0">
          <input type="number" id="bss-power-max" placeholder="${IS_MOTO ? "Do (např. 35 pro A2)" : "Do"}" min="0">
        </div>
      </div>

      <div class="bss-field">
        <div class="bss-label-row">
          <label>Rok výroby</label>
          <span id="bss-year-label" class="bss-range-value">${SLIDER_MIN_YEAR} – ${MAX_YEAR}</span>
        </div>
        <div class="bss-range">
          <input type="number" id="bss-year-from" placeholder="Od" min="1" step="1">
          <input type="number" id="bss-year-to" placeholder="Do" min="1" step="1">
        </div>
        <div class="bss-dual-slider">
          <div class="bss-slider-track">
            <div id="bss-year-fill" class="bss-slider-fill"></div>
          </div>
          <input type="range" id="bss-year-min" min="${SLIDER_MIN_YEAR}" max="${MAX_YEAR}" value="${SLIDER_MIN_YEAR}" step="1">
          <input type="range" id="bss-year-max" min="${SLIDER_MIN_YEAR}" max="${MAX_YEAR}" value="${MAX_YEAR}" step="1">
        </div>
      </div>

      <div class="bss-field">
        <label for="bss-km-max">Max. nájezd (km)</label>
        <select id="bss-km-max">
          <option value="">Jakýkoliv</option>
          <option value="25000">Do 25 000 km</option>
          <option value="50000">Do 50 000 km</option>
          <option value="100000">Do 100 000 km</option>
          <option value="150000">Do 150 000 km</option>
          <option value="200000">Do 200 000 km</option>
          <option value="250000">Do 250 000 km</option>
          <option value="300000">Do 300 000 km</option>
        </select>
      </div>

      <div class="bss-field">
        <div class="bss-label-row">
          <label>Cena</label>
          <span id="bss-price-label" class="bss-range-value">0 Kč – 1 000 000 Kč</span>
        </div>
        <div class="bss-range">
          <input type="number" id="bss-price-from" placeholder="Od (Kč)" min="1">
          <input type="number" id="bss-price-to" placeholder="Do (Kč)" min="1">
        </div>
        <div class="bss-dual-slider">
          <div class="bss-slider-track">
            <div id="bss-price-fill" class="bss-slider-fill"></div>
          </div>
          <input type="range" id="bss-price-min" min="0" max="1000" value="0" step="1">
          <input type="range" id="bss-price-max" min="0" max="1000" value="1000" step="1">
        </div>
      </div>

      <div class="bss-field">
        <label for="bss-keywords-in">Musí obsahovat (čárkou)</label>
        <input type="text" id="bss-keywords-in" placeholder="${IS_MOTO ? "např. A2, ABS, kufr" : "např. 4x4, tažné, DSG"}">
      </div>

      <div class="bss-field">
        <label for="bss-keywords-out">Nesmí obsahovat (čárkou)</label>
        <input type="text" id="bss-keywords-out" placeholder="např. bourané, bez TP, AAA">
      </div>
    </div>

    <div class="bss-footer">
      <div class="bss-checkboxes">
        <label class="bss-checkbox">
          <input type="checkbox" id="bss-hide-parts" checked>
          🧹 Skrýt náhradní díly a poptávky (výkup)
        </label>
        <label class="bss-checkbox">
          <input type="checkbox" id="bss-include-unknown">
          Zobrazit i inzeráty, kde prodejce neuvedl v textu kW / rok / km
        </label>
      </div>
      <div class="bss-actions">
        <button type="button" id="bss-reset" class="bss-btn bss-btn-secondary">Vymazat filtry</button>
        <button type="button" id="bss-submit" class="bss-btn bss-btn-primary">Filtrovat inzeráty</button>
      </div>
    </div>
  `;

    listHeader.parentNode.insertBefore(panel, listHeader);

    createLoadMoreButton();
    setupDropdowns();
    setupSliders();
    restoreSavedFilters();
    setupButtons();
    setupNativeToggles();
    processCurrentPageAds(shouldAutoFetch);
}

function createLoadMoreButton() {
    const pagination = document.querySelector(".strankovani");
    if (!pagination) return;

    const wrap = document.createElement("div");
    wrap.id = "bss-load-more-wrap";
    wrap.innerHTML = `<button type="button" id="bss-load-more-btn">📥 Najít a načíst další vyhovující inzeráty</button>`;
    pagination.parentNode.insertBefore(wrap, pagination);

    document.getElementById("bss-load-more-btn").addEventListener("click", () => {
        fetchUntilMatchesFound(5, MAX_PAGES_PER_SCAN);
    });
}

function setupDropdowns() {
    const brandSelect = document.getElementById("bss-brand");
    for (const [key, data] of Object.entries(ACTIVE_DATA)) {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = data.name;
        brandSelect.appendChild(option);
    }

    brandSelect.addEventListener("change", () => {
        populateModels(brandSelect.value);
    });
}

function populateModels(selectedBrand, selectedModel = "") {
    const modelSelect = document.getElementById("bss-model");
    modelSelect.innerHTML = "";

    if (!selectedBrand || !ACTIVE_DATA[selectedBrand]) {
        modelSelect.disabled = true;
        modelSelect.innerHTML = `<option value="">Nejprve vyber značku</option>`;
        return;
    }

    modelSelect.disabled = false;
    modelSelect.innerHTML = `<option value="">Všechny modely (${ACTIVE_DATA[selectedBrand].name})</option>`;

    ACTIVE_DATA[selectedBrand].models.forEach((model) => {
        const option = document.createElement("option");
        option.value = model;
        option.textContent = model;
        if (model === selectedModel) option.selected = true;
        modelSelect.appendChild(option);
    });
}

function clampYear(v) {
    return Math.max(SLIDER_MIN_YEAR, Math.min(MAX_YEAR, v));
}

// Nastaví číselné pole: buď zobrazenou hodnotu z posuvníku, nebo ručně zadanou (označí se jako "typed")
function setTypedField(id, displayValue, typedValue) {
    const el = document.getElementById(id);
    if (!el) return;
    if (typedValue !== null && typedValue !== undefined && typedValue !== "") {
        el.value = typedValue;
        el.dataset.typed = "1";
    } else {
        el.value = displayValue;
        el.dataset.typed = "";
    }
}

function setupSliders() {
    const yearMinInput = document.getElementById("bss-year-min");
    const yearMaxInput = document.getElementById("bss-year-max");
    const priceMinInput = document.getElementById("bss-price-min");
    const priceMaxInput = document.getElementById("bss-price-max");
    const yearFromEl = document.getElementById("bss-year-from");
    const yearToEl = document.getElementById("bss-year-to");
    const priceFromEl = document.getElementById("bss-price-from");
    const priceToEl = document.getElementById("bss-price-to");

    // Posuvníky: při pohybu se ručně zadané hodnoty nahradí hodnotami z posuvníku
    yearMinInput.addEventListener("input", () => {
        if (parseInt(yearMinInput.value, 10) > parseInt(yearMaxInput.value, 10)) {
            yearMinInput.value = yearMaxInput.value;
        }
        updateSlidersUI();
    });

    yearMaxInput.addEventListener("input", () => {
        if (parseInt(yearMaxInput.value, 10) < parseInt(yearMinInput.value, 10)) {
            yearMaxInput.value = yearMinInput.value;
        }
        updateSlidersUI();
    });

    priceMinInput.addEventListener("input", () => {
        if (parseInt(priceMinInput.value, 10) > parseInt(priceMaxInput.value, 10)) {
            priceMinInput.value = priceMaxInput.value;
        }
        updateSlidersUI();
    });

    priceMaxInput.addEventListener("input", () => {
        if (parseInt(priceMaxInput.value, 10) < parseInt(priceMinInput.value, 10)) {
            priceMaxInput.value = priceMinInput.value;
        }
        updateSlidersUI();
    });

    // Ručně zadaný rok: může být mimo rozsah posuvníku, posuvník se nastaví na nejbližší hodnotu
    yearFromEl.addEventListener("change", () => {
        const raw = parseInt(yearFromEl.value, 10);
        if (!(raw > 0)) {
            yearFromEl.value = yearMinInput.value;
            yearFromEl.dataset.typed = "";
            updateSlidersUI(false);
            return;
        }
        const pos = clampYear(raw);
        yearMinInput.value = pos;
        if (pos > parseInt(yearMaxInput.value, 10)) yearMaxInput.value = pos;
        yearFromEl.dataset.typed = "1";
        updateSlidersUI(false);
    });

    yearToEl.addEventListener("change", () => {
        const raw = parseInt(yearToEl.value, 10);
        if (!(raw > 0)) {
            yearToEl.value = yearMaxInput.value;
            yearToEl.dataset.typed = "";
            updateSlidersUI(false);
            return;
        }
        const pos = clampYear(raw);
        yearMaxInput.value = pos;
        if (pos < parseInt(yearMinInput.value, 10)) yearMinInput.value = pos;
        yearToEl.dataset.typed = "1";
        updateSlidersUI(false);
    });

    // Ručně zadaná cena: může být i nad 1 000 000 Kč (posuvník se nastaví na krajní hodnotu)
    priceFromEl.addEventListener("change", () => {
        const raw = parseInt(priceFromEl.value, 10);
        if (!(raw > 0)) {
            priceFromEl.value = sliderToPrice(priceMinInput.value);
            priceFromEl.dataset.typed = "";
            updateSlidersUI(false);
            return;
        }
        const pos = priceToSlider(raw);
        priceMinInput.value = pos;
        if (pos > parseInt(priceMaxInput.value, 10)) priceMaxInput.value = pos;
        priceFromEl.dataset.typed = "1";
        updateSlidersUI(false);
    });

    priceToEl.addEventListener("change", () => {
        const raw = parseInt(priceToEl.value, 10);
        if (!(raw > 0)) {
            priceToEl.value = sliderToPrice(priceMaxInput.value);
            priceToEl.dataset.typed = "";
            updateSlidersUI(false);
            return;
        }
        const pos = priceToSlider(raw);
        priceMaxInput.value = pos;
        if (pos < parseInt(priceMinInput.value, 10)) priceMinInput.value = pos;
        priceToEl.dataset.typed = "1";
        updateSlidersUI(false);
    });

    updateSlidersUI();
}

// syncNumbers = true: číselná pole se přepíšou hodnotami z posuvníku (ruční zadání se zruší)
function updateSlidersUI(syncNumbers = true) {
    // 1. Rok výroby
    const yearMinEl = document.getElementById("bss-year-min");
    const yearMaxEl = document.getElementById("bss-year-max");
    const yearLabel = document.getElementById("bss-year-label");
    const yearFill = document.getElementById("bss-year-fill");
    const yearFromEl = document.getElementById("bss-year-from");
    const yearToEl = document.getElementById("bss-year-to");

    if (yearMinEl && yearMaxEl) {
        const yMin = parseInt(yearMinEl.value, 10);
        const yMax = parseInt(yearMaxEl.value, 10);
        const span = MAX_YEAR - SLIDER_MIN_YEAR;
        const leftPct = ((yMin - SLIDER_MIN_YEAR) / span) * 100;
        const rightPct = ((yMax - SLIDER_MIN_YEAR) / span) * 100;

        yearFill.style.left = `${leftPct}%`;
        yearFill.style.width = `${rightPct - leftPct}%`;

        const effFrom = yearFromEl.dataset.typed === "1" ? parseInt(yearFromEl.value, 10) : yMin;
        const effTo = yearToEl.dataset.typed === "1" ? parseInt(yearToEl.value, 10) : yMax;
        yearLabel.textContent = `${effFrom} – ${effTo}`;
        yearMinEl.style.zIndex = yMin > MAX_YEAR - 2 ? "3" : "2";

        if (syncNumbers) {
            setTypedField("bss-year-from", yMin, null);
            setTypedField("bss-year-to", yMax, null);
        }
    }

    // 2. Cena
    const priceMinEl = document.getElementById("bss-price-min");
    const priceMaxEl = document.getElementById("bss-price-max");
    const priceLabel = document.getElementById("bss-price-label");
    const priceFill = document.getElementById("bss-price-fill");
    const priceFromEl = document.getElementById("bss-price-from");
    const priceToEl = document.getElementById("bss-price-to");

    if (priceMinEl && priceMaxEl) {
        const sMin = parseInt(priceMinEl.value, 10);
        const sMax = parseInt(priceMaxEl.value, 10);
        const pMin = sliderToPrice(sMin);
        const pMax = sliderToPrice(sMax);

        const leftPct = (sMin / 1000) * 100;
        const rightPct = (sMax / 1000) * 100;

        priceFill.style.left = `${leftPct}%`;
        priceFill.style.width = `${rightPct - leftPct}%`;

        const effPMin = priceFromEl.dataset.typed === "1" ? parseInt(priceFromEl.value, 10) : pMin;
        const effPMax = priceToEl.dataset.typed === "1" ? parseInt(priceToEl.value, 10) : pMax;
        priceLabel.textContent = `${formatPriceLabel(effPMin)} – ${formatPriceLabel(effPMax)}`;
        priceMinEl.style.zIndex = sMin > 950 ? "3" : "2";

        if (syncNumbers) {
            setTypedField("bss-price-from", pMin, null);
            setTypedField("bss-price-to", pMax, null);
        }
    }
}

function getFormFilters() {
    const fuelEl = document.getElementById("bss-fuel");
    const ccmMinEl = document.getElementById("bss-ccm-min");
    const ccmMaxEl = document.getElementById("bss-ccm-max");

    const yearFromEl = document.getElementById("bss-year-from");
    const yearToEl = document.getElementById("bss-year-to");
    const priceFromEl = document.getElementById("bss-price-from");
    const priceToEl = document.getElementById("bss-price-to");

    // Rok: ručně zadaná hodnota má přednost; posuvník filtruje jen mimo výchozí rozsah
    const sliderYearMin = parseInt(document.getElementById("bss-year-min").value, 10);
    const sliderYearMax = parseInt(document.getElementById("bss-year-max").value, 10);
    const yearMin =
        yearFromEl.dataset.typed === "1" ? parseInt(yearFromEl.value, 10) : sliderYearMin > SLIDER_MIN_YEAR ? sliderYearMin : null;
    const yearMax =
        yearToEl.dataset.typed === "1" ? parseInt(yearToEl.value, 10) : sliderYearMax < MAX_YEAR ? sliderYearMax : null;

    // Cena: stejná logika
    const sliderPriceMin = sliderToPrice(document.getElementById("bss-price-min").value);
    const sliderPriceMax = sliderToPrice(document.getElementById("bss-price-max").value);
    const priceFromTyped = priceFromEl.dataset.typed === "1";
    const priceToTyped = priceToEl.dataset.typed === "1";
    const priceMinNum = priceFromTyped ? parseInt(priceFromEl.value, 10) : sliderPriceMin;
    const priceMaxNum = priceToTyped ? parseInt(priceToEl.value, 10) : sliderPriceMax;

    return {
        brand: document.getElementById("bss-brand").value,
        model: document.getElementById("bss-model").value,
        fuel: fuelEl ? fuelEl.value : "",
        ccmMin: ccmMinEl ? parseInt(ccmMinEl.value, 10) || null : null,
        ccmMax: ccmMaxEl ? parseInt(ccmMaxEl.value, 10) || null : null,
        powerMin: parseInt(document.getElementById("bss-power-min").value, 10) || null,
        powerMax: parseInt(document.getElementById("bss-power-max").value, 10) || null,
        yearMin: yearMin,
        yearMax: yearMax,
        kmMax: parseInt(document.getElementById("bss-km-max").value, 10) || null,
        priceMin: priceFromTyped || sliderPriceMin > 0 ? String(priceMinNum) : "",
        priceMax: priceToTyped || sliderPriceMax < MAX_PRICE ? String(priceMaxNum) : "",
        keywordsIn: document.getElementById("bss-keywords-in").value,
        keywordsOut: document.getElementById("bss-keywords-out").value,
        hideParts: document.getElementById("bss-hide-parts").checked,
        includeUnknown: document.getElementById("bss-include-unknown").checked
    };
}

function restoreSavedFilters() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
        const filters = JSON.parse(saved);
        document.getElementById("bss-brand").value = filters.brand || "";
        populateModels(filters.brand, filters.model);

        if (!IS_MOTO && document.getElementById("bss-fuel")) {
            document.getElementById("bss-fuel").value = filters.fuel || "";
        }
        if (IS_MOTO && document.getElementById("bss-ccm-min")) {
            document.getElementById("bss-ccm-min").value = filters.ccmMin || "";
            document.getElementById("bss-ccm-max").value = filters.ccmMax || "";
        }

        document.getElementById("bss-power-min").value = filters.powerMin || "";
        document.getElementById("bss-power-max").value = filters.powerMax || "";

        const yMin = filters.yearMin ? clampYear(filters.yearMin) : SLIDER_MIN_YEAR;
        const yMax = filters.yearMax ? clampYear(filters.yearMax) : MAX_YEAR;
        document.getElementById("bss-year-min").value = yMin;
        document.getElementById("bss-year-max").value = yMax;
        setTypedField("bss-year-from", yMin, filters.yearMin || null);
        setTypedField("bss-year-to", yMax, filters.yearMax || null);

        document.getElementById("bss-km-max").value = filters.kmMax || "";

        const pMin = filters.priceMin ? priceToSlider(filters.priceMin) : 0;
        const pMax = filters.priceMax ? priceToSlider(filters.priceMax) : 1000;
        document.getElementById("bss-price-min").value = pMin;
        document.getElementById("bss-price-max").value = pMax;
        setTypedField("bss-price-from", sliderToPrice(pMin), filters.priceMin || null);
        setTypedField("bss-price-to", sliderToPrice(pMax), filters.priceMax || null);

        document.getElementById("bss-keywords-in").value = filters.keywordsIn || "";
        document.getElementById("bss-keywords-out").value = filters.keywordsOut || "";
        document.getElementById("bss-hide-parts").checked = filters.hideParts !== false;
        document.getElementById("bss-include-unknown").checked = Boolean(filters.includeUnknown);

        updateSlidersUI(false);
    } catch (e) {
        console.error("Chyba při načítání uložených filtrů:", e);
    }
}

function setupButtons() {
    const baseDomain = IS_MOTO ? "https://motorky.bazos.cz" : "https://auto.bazos.cz";

    document.getElementById("bss-submit").addEventListener("click", () => {
        const filters = getFormFilters();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));

        let targetPath = "/";
        let searchQuery = "";

        if (IS_MOTO) {
            // U motorek skládáme dotaz z názvu značky a modelu
            const brandName = filters.brand && ACTIVE_DATA[filters.brand] ? ACTIVE_DATA[filters.brand].brandQuery : "";
            searchQuery = [brandName, filters.model].filter(Boolean).join(" ");
        } else {
            const brandData = filters.brand ? ACTIVE_DATA[filters.brand] : null;
            const ownPage = Boolean(brandData && BAZOS_MENU_PATHS.has(brandData.path));
            targetPath = ownPage ? brandData.path : "/";
            // Vyhledávání na Bazoši je jen slovní: model s alternativními označeními (E320, 320d...) hledáme
            // jen podle značky a výsledky se filtrují v prohlížeči (modelMatches), jinak by se ztratily.
            const modelForServer = filters.model && !Object.prototype.hasOwnProperty.call(MODEL_ALIASES, filters.model) ? filters.model : "";
            searchQuery = [!ownPage && brandData ? brandData.name : "", modelForServer].filter(Boolean).join(" ");
        }

        const params = new URLSearchParams();
        if (searchQuery) {
            params.set("hledat", searchQuery);
            params.set("hlokalita", "");
            params.set("humkreis", "25");
        }
        if (filters.priceMin) params.set("cenaod", filters.priceMin);
        if (filters.priceMax) params.set("cenado", filters.priceMax);

        const queryString = params.toString();
        const targetUrl = `${baseDomain}${targetPath}${queryString ? "?" + queryString : ""}`;

        if (window.location.href === targetUrl) {
            processCurrentPageAds(true);
        } else {
            // Po přesměrování na novou stránku zapneme jednorázově automatické dotahování
            sessionStorage.setItem(AUTOFETCH_KEY, "1");
            window.location.href = targetUrl;
        }
    });

    document.getElementById("bss-reset").addEventListener("click", () => {
        localStorage.removeItem(STORAGE_KEY);
        window.location.href = `${baseDomain}/`;
    });
}

// Extrakce výkonu, paliva, roku výroby, nájezdu (km) a objemu (ccm) z textu inzerátu
function analyzeAdText(text, titleText = "") {
    // Odstraníme datum vložení inzerátu, např. "[29.10. 2026]", aby nepletlo rok výroby
    const stripDate = (str) => str.replace(/\[\s*\d{1,2}\.\d{1,2}\.\s*\d{4}\s*\]/g, "");
    const cleanText = stripDate(text);
    const cleanTitle = stripDate(titleText);
    const normalized = normalizeText(cleanText);

    let powerKw = null;
    let year = null;
    let mileageKm = null;
    let ccm = null;
    let ccmInferred = false;
    let match;

    // 1. Výkon v kW – podporuje desetinná čísla ("33,5kW", "33.4 kW") a slepený text
    const kwRegex = /(?<![\d.,])(\d{1,3}(?:[.,]\d{1,2})?)\s*kw(?![\p{L}\p{N}])/giu;
    const minKw = IS_MOTO ? 4 : 25;
    while ((match = kwRegex.exec(cleanText)) !== null) {
        const val = Math.round(parseFloat(match[1].replace(",", ".")));
        if (val >= minKw && val <= 800) {
            powerKw = val;
            break;
        }
    }

    // 2. Výkon v koních / PS (pokud nejsou uvedena kW)
    if (!powerKw) {
        const hpRegex = /(?<![\d.,])(\d{1,3}(?:[.,]\d{1,2})?)\s*(ps|kon[ií]|koni|hp)(?![\p{L}\p{N}])/giu;
        const minHp = IS_MOTO ? 5 : 35;
        while ((match = hpRegex.exec(cleanText)) !== null) {
            const hp = parseFloat(match[1].replace(",", "."));
            if (hp >= minHp && hp <= 1000) {
                powerKw = Math.round(hp * 0.7355);
                break;
            }
        }
    }

// 3. Rok výroby
    // Vymažeme zmínky o STK / technické (např. "STK 09/2027", "STK do 2028", "technická do 5/2026"), aby nepletly rok výroby
    const stripStk = (str) =>
        str.replace(/\b(?:stk|technick[áa]|emise)\b[^.,;\n]{0,20}?\b(?:\d{1,2}\s*[\/.]\s*)?(?:19|20)\d{2}\b/giu, " ");
    const yearText = stripStk(cleanText);
    const yearTitle = stripStk(cleanTitle);

    // a) Nejvyšší priorita: jasné slovní označení (r.v., rok výroby, vyrobeno, do provozu)
    const explicitYearMatch = yearText.match(
        /(?:\br\.?\s*v\.?|\brok(?:\s+v[ýy]roby)?|vyrobeno|do\s+provozu)\s*:?\s*(\d{4})(?!\d)/iu
    );
    if (explicitYearMatch && isPlausibleYear(parseInt(explicitYearMatch[1], 10))) {
        year = parseInt(explicitYearMatch[1], 10);
    }
    // b) Formát MM/RRRR (už očištěný od STK)
    if (year === null) {
        const monthYearMatch = yearText.match(/\b(?:0?[1-9]|1[0-2])\s*\/\s*(\d{4})(?!\d)/u);
        if (monthYearMatch && isPlausibleYear(parseInt(monthYearMatch[1], 10))) {
            year = parseInt(monthYearMatch[1], 10);
        }
    }
    // c) Holý rok v nadpisu (očištěný od STK), např. "Toyota Avensis 1.8 VVT-i, 2003"
    if (year === null) {
        for (const m of yearTitle.matchAll(/(?<!\d)(\d{4})(?!\d)/g)) {
            if (isPlausibleYear(parseInt(m[1], 10))) {
                year = parseInt(m[1], 10);
                break;
            }
        }
    }

    // 4. Nájezd v km
    const kmText = cleanText.replace(/(?<!\d)\d{1,2}\s*[\/.]\s*(?:19|20)\d{2}(?!\d)/g, " ");
    const tisKmMatch = kmText.match(/(?<!\d)(\d{1,3})\s*(?:tis\.?|t)\s*(?:km(?!\/|h(?!\p{L}))|kilometr\p{L}*)/iu);
    const fullKmMatch = kmText.match(/(?<!\d)(\d{1,3})[\s.,]*(\d{3}|xxx)\s*(?:km(?!\/|h(?!\p{L}))|kilometr\p{L}*)/iu);
    const xxxOnlyMatch = kmText.match(/(?<!\d)(\d{2,3})\s*xxx\b/iu);
    const simpleKmMatch = kmText.match(/(?<!\d)(\d{4,6})\s*(?:km(?!\/|h(?!\p{L}))|kilometr\p{L}*)/iu);
    // "stav kilometrů 4620", "Nájezd 396xxx", "najeto 180 tis" – číslo (nebo xxx/tis) za klíčovým slovem i bez "km"
    const textKmMatches = [
        ...kmText.matchAll(
            /(?:stav\s+tachometru|stav\s+km|najet[oa]|n[áa]jezd\p{L}*)\s*:?\s*(\d{1,3}(?:[\s.,]*(?:\d{3}|xxx))+|\d{1,3}\s*tis\.?|\d{4,6})(?![\d])/giu
        ),
    ];

    if (tisKmMatch) {
        mileageKm = parseInt(tisKmMatch[1], 10) * 1000;
    } else if (fullKmMatch) {
        const thousands = parseInt(fullKmMatch[1], 10);
        const hundreds = fullKmMatch[2].toLowerCase() === "xxx" ? 0 : parseInt(fullKmMatch[2], 10);
        mileageKm = thousands * 1000 + hundreds;
    } else if (xxxOnlyMatch) {
        // Zápis "396xxx" nebo "240 xxx" (i když prodejce zapomněl napsat "km")
        mileageKm = parseInt(xxxOnlyMatch[1], 10) * 1000;
    } else if (simpleKmMatch) {
        mileageKm = parseInt(simpleKmMatch[1], 10);
    } else {
        for (const m of textKmMatches) {
            const raw = m[1].toLowerCase().trim();
            if (/^\d{4}$/.test(raw) && isPlausibleYear(parseInt(raw, 10))) continue; // není to rok
            if (raw.includes("tis")) {
                mileageKm = parseInt(raw, 10) * 1000;
            } else {
                const cleaned = raw.replace(/xxx/g, "000").replace(/[\s.,]/g, "");
                mileageKm = parseInt(cleaned, 10);
            }
            break;
        }
    }

    // 5. Objem v ccm (jen motorky)
    if (IS_MOTO) {
        const ccmMatch = cleanText.match(/(?<!\d)(\d{2,4})\s*(?:ccm|cm3|cm³|cc)/iu);
        if (ccmMatch) {
            const val = parseInt(ccmMatch[1], 10);
            if (val >= 49 && val <= 2500) ccm = val;
        }
        // Když objem v textu není, odhadneme ho podle názvu modelu (tabulka MOTO_CCM v data.js)
        if (ccm === null) {
            const inferred = inferCcmFromModel(normalized, year);
            if (inferred !== null) {
                ccm = inferred;
                ccmInferred = true;
            }
        }
    }

    // 6. Palivo (jen auta)
    const detectedFuels = [];
    if (!IS_MOTO) {
        if (ELECTRIC_ONLY_REGEX.test(cleanText)) {
            detectedFuels.push("ev");
        } else {
            for (const [key, data] of Object.entries(FUEL_PATTERNS)) {
                if (data.regex.test(cleanText)) {
                    detectedFuels.push(key);
                }
            }
        }
    }

    return { powerKw, year, mileageKm, ccm, ccmInferred, detectedFuels };
}

// Najde objem motoru podle názvu modelu v už normalizovaném textu inzerátu
function inferCcmFromModel(normalizedText, year = null) {
    if (modelMatches(normalizedText, "MT-03")) {
        if (year !== null && year <= 2014) return 660;
        if (year !== null && year >= 2016) return 321;
        return null; // pokud rok nevíme, raději neodhadujeme
    }
    for (const [model, ccm] of Object.entries(MOTO_CCM)) {
        if (modelMatches(normalizedText, model)) return ccm;
    }
    return null;
}

function evaluateSingleAd(ad, filters, mustHaveWords, mustNotHaveWords) {
    const titleEl = ad.querySelector(".nadpis");
    const descEl = ad.querySelector(".popis");
    const rawText = `${titleEl ? titleEl.textContent : ""} ${descEl ? descEl.textContent : ""}`;
    const normalizedText = normalizeText(rawText);

    const adStats = ad._bssStats || analyzeAdText(rawText, titleEl ? titleEl.textContent : "");
    const vin = ad._bssVin !== undefined ? ad._bssVin : findVinInText(rawText);
    renderBadges(ad, adStats, vin);

    let matches = true;

    // 0. Skrytí náhradních dílů a výkupů
    if (filters.hideParts && (PART_TITLE_REGEX.test(titleEl ? titleEl.textContent : "") || SPARE_PARTS_REGEX.test(rawText))) {
        matches = false;
    }

    // 1. Model – jako celé slovo (viz modelMatches)
    if (matches && filters.model && !modelMatches(normalizedText, filters.model)) {
        matches = false;
    }

    // 2. Výkon (kW)
    if (matches && (filters.powerMin || filters.powerMax)) {
        if (adStats.powerKw === null) {
            if (!filters.includeUnknown) matches = false;
        } else {
            if (filters.powerMin && adStats.powerKw < filters.powerMin) matches = false;
            if (filters.powerMax && adStats.powerKw > filters.powerMax) matches = false;
        }
    }

    // 3. Rok výroby
    if (matches && (filters.yearMin || filters.yearMax)) {
        if (adStats.year === null) {
            if (!filters.includeUnknown) matches = false;
        } else {
            if (filters.yearMin && adStats.year < filters.yearMin) matches = false;
            if (filters.yearMax && adStats.year > filters.yearMax) matches = false;
        }
    }

    // 4. Nájezd (km)
    if (matches && filters.kmMax) {
        if (adStats.mileageKm === null) {
            if (!filters.includeUnknown) matches = false;
        } else if (adStats.mileageKm > filters.kmMax) {
            matches = false;
        }
    }

    // 5. Palivo (auta)
    if (matches && !IS_MOTO && filters.fuel) {
        if (adStats.detectedFuels.length === 0) {
            if (!filters.includeUnknown) matches = false;
        } else if (!adStats.detectedFuels.includes(filters.fuel)) {
            matches = false;
        }
    }

    // 5b. Objem ccm (motorky)
    if (matches && IS_MOTO && (filters.ccmMin || filters.ccmMax)) {
        if (adStats.ccm === null) {
            if (!filters.includeUnknown) matches = false;
        } else {
            if (filters.ccmMin && adStats.ccm < filters.ccmMin) matches = false;
            if (filters.ccmMax && adStats.ccm > filters.ccmMax) matches = false;
        }
    }

    // 6. Klíčová slova MUSÍ obsahovat
    if (matches && mustHaveWords.some((word) => !normalizedText.includes(word))) {
        matches = false;
    }

    // 7. Klíčová slova NESMÍ obsahovat
    if (matches && mustNotHaveWords.some((word) => normalizedText.includes(word))) {
        matches = false;
    }

    ad.style.display = matches ? "" : "none";
    return matches;
}

function processCurrentPageAds(allowAutoFetch = false) {
    const ads = document.querySelectorAll(".inzeraty.inzeratyflex");
    if (!ads.length) return;

    const filters = getFormFilters();
    const mustHaveWords = parseKeywords(filters.keywordsIn);
    const mustNotHaveWords = parseKeywords(filters.keywordsOut);

    let visibleCount = 0;
    ads.forEach((ad) => {
        if (evaluateSingleAd(ad, filters, mustHaveWords, mustNotHaveWords)) {
            visibleCount++;
        }
    });

    updateStatusText();

    enrichAdsFromDetails();

    if (
        allowAutoFetch &&
        hasActiveClientFilters(filters) &&
        visibleCount < AUTO_FETCH_THRESHOLD &&
        !isFetchingMore &&
        !noMorePages
    ) {
        fetchUntilMatchesFound(AUTO_FETCH_THRESHOLD - visibleCount, 10);
    }
}

function updateStatusText() {
    const allAds = document.querySelectorAll(".inzeraty.inzeratyflex");
    let visibleCount = 0;
    allAds.forEach((ad) => {
        if (ad.style.display !== "none") visibleCount++;
    });

    const statusEl = document.getElementById("bss-status");
    if (statusEl) {
        statusEl.textContent = `Zobrazeno ${visibleCount} vyhovujících (z ${allAds.length} prohledaných inzerátů)`;
    }
}

function buildNextPageUrl(offset) {
    const urlObj = new URL(window.location.href);
    let basePath = urlObj.pathname.replace(/\/\d+\/?$/, "/");
    if (!basePath.endsWith("/")) basePath += "/";

    urlObj.pathname = `${basePath}${offset}/`;
    if (urlObj.searchParams.has("crp")) {
        urlObj.searchParams.set("crp", offset.toString());
    }

    return urlObj.toString();
}

function setLoadingState(btn, statusEl, pageNumber, foundSoFar) {
    if (btn) {
        btn.disabled = true;
        btn.textContent = `⏳ Prohledávám stránku ${pageNumber}… (zatím +${foundSoFar})`;
    }
    if (statusEl) {
        statusEl.textContent = `⏳ Prohledávám stránku ${pageNumber}…`;
    }
}

function finishLoadingState(btn, { newlyMatchedCount, pagesScanned, stopReason }) {
    if (!btn) return;

    let label;
    let disabled = false;

    if (noMorePages) {
        disabled = true;
        label =
            newlyMatchedCount > 0
                ? `📥 Načteno +${newlyMatchedCount} – konec výsledků`
                : "✅ Prohledány všechny dostupné stránky na Bazoši";
    } else if (stopReason === "error") {
        label =
            newlyMatchedCount > 0
                ? `📥 Načteno +${newlyMatchedCount}, pak chyba – zkus to znovu`
                : "⚠️ Bazoš teď neodpověděl, zkus to za chvíli";
    } else if (newlyMatchedCount > 0) {
        label = `📥 Načteno +${newlyMatchedCount} inzerátů! Klikni pro další`;
    } else {
        label = `🔍 Nic nového v ${pagesScanned} stránkách, zkus to znovu`;
    }

    btn.disabled = disabled;
    btn.textContent = label;
}

async function fetchUntilMatchesFound(targetNewMatches = 5, maxPagesToScan = MAX_PAGES_PER_SCAN) {
    if (isFetchingMore || noMorePages) return;

    const btn = document.getElementById("bss-load-more-btn");
    const statusEl = document.getElementById("bss-status");
    const anchor = document.getElementById("bss-load-more-wrap") || document.querySelector(".strankovani");

    if (!anchor || !anchor.parentNode) {
        if (statusEl) statusEl.textContent = "Na této stránce nejde načíst další inzeráty.";
        return;
    }

    isFetchingMore = true;

    const filters = getFormFilters();
    const mustHaveWords = parseKeywords(filters.keywordsIn);
    const mustNotHaveWords = parseKeywords(filters.keywordsOut);

    let newlyMatchedCount = 0;
    let pagesScanned = 0;
    let stopReason = null; // "error" = dočasný problém, "end" = došly stránky

    while (newlyMatchedCount < targetNewMatches && pagesScanned < maxPagesToScan) {
        pagesScanned++;
        currentOffset += 20;
        const pageNumber = Math.floor(currentOffset / 20) + 1;

        setLoadingState(btn, statusEl, pageNumber, newlyMatchedCount);
        await sleep(REQUEST_DELAY_MS);

        try {
            const response = await fetch(buildNextPageUrl(currentOffset));

            // 404 = za poslední stránkou; jiné chyby (429, 5xx...) nejsou konec výsledků
            if (response.status === 404) {
                noMorePages = true;
                stopReason = "end";
                break;
            }
            if (!response.ok) {
                console.warn(`Bazoš vrátil HTTP ${response.status}, přerušuji načítání.`);
                stopReason = "error";
                break;
            }

            const htmlText = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, "text/html");
            const fetchedAds = doc.querySelectorAll(".inzeraty.inzeratyflex");

            if (fetchedAds.length === 0) {
                noMorePages = true;
                stopReason = "end";
                break;
            }

            let newUniqueAdsOnPage = 0;

            fetchedAds.forEach((ad) => {
                const linkEl = ad.querySelector("h2.nadpis a");
                const href = linkEl ? linkEl.getAttribute("href") : null;

                if (href && seenAdUrls.has(href)) return;
                if (href) seenAdUrls.add(href);

                newUniqueAdsOnPage++;

                anchor.parentNode.insertBefore(sanitizeAdNode(ad), anchor);
                if (evaluateSingleAd(ad, filters, mustHaveWords, mustNotHaveWords)) {
                    newlyMatchedCount++;
                }
            });

            if (newUniqueAdsOnPage === 0) {
                noMorePages = true;
                stopReason = "end";
                break;
            }
        } catch (err) {
            console.error("Chyba při načítání stránky Bazoše:", err);
            stopReason = "error";
            break;
        }
    }

    isFetchingMore = false;
    updateStatusText();
    finishLoadingState(btn, { newlyMatchedCount, pagesScanned, stopReason });

    enrichAdsFromDetails();
}

// Sestaví řadu štítků z výsledků analyzeAdText (používá se v seznamu i na detailu inzerátu)
function buildBadges(stats, vin = null) {
    const container = document.createElement("div");
    container.className = "bss-ad-badges";
    // Odkaz na historii vozidla je vždy jako první štítek (pokud je VIN v textu)
    if (vin) container.appendChild(buildVinCheckLink(vin));

    const add = (cls, text, title = "") => {
        const tag = document.createElement("span");
        tag.className = `bss-tag ${cls}`;
        tag.textContent = text;
        if (title) tag.title = title;
        container.appendChild(tag);
    };

    if (stats.year !== null) add("bss-tag-year", `📅 ${stats.year}`);
    if (stats.powerKw !== null) add("bss-tag-power", `⚡ ${stats.powerKw} kW`);
    if (stats.ccm !== null) {
        add(
            "bss-tag-ccm",
            `🔧 ${stats.ccmInferred ? "~" : ""}${stats.ccm} ccm`,
            stats.ccmInferred ? "Odhad podle názvu modelu – objem není v inzerátu" : ""
        );
    }
    stats.detectedFuels.forEach((key) => add("bss-tag-fuel", `⛽ ${FUEL_PATTERNS[key].label}`));
    if (stats.mileageKm !== null) add("bss-tag-km", `🛣️ ${stats.mileageKm.toLocaleString("cs-CZ")} km`);

    const hasAnyParam =
        stats.powerKw !== null || stats.year !== null || stats.mileageKm !== null || stats.ccm !== null || stats.detectedFuels.length > 0;
    if (!hasAnyParam) add("bss-tag-unknown", "ℹ️ Bez parametrů v textu");

    return container;
}

function renderBadges(ad, stats, vin = null) {
    const oldBadges = ad.querySelector(".bss-ad-badges");
    if (oldBadges) oldBadges.remove();

    const descEl = ad.querySelector(".popis");
    if (!descEl) return;

    descEl.parentNode.insertBefore(buildBadges(stats, vin), descEl);
}

// Detail inzerátu: štítky hned pod nadpisem, nad fotkami a popisem (funguje i na mobilu)
// ---- Odkaz na kontrolu historie vozidla podle VIN (autokuk.cz/vin/<VIN>) ----
// VIN = 17 znaků bez I, O, Q; musí obsahovat aspoň jedno písmeno a jednu číslici
const VIN_REGEX = /(?<![A-Z0-9])[A-HJ-NPR-Z0-9]{17}(?![A-Z0-9])/g;
const VIN_CHECK_URL = "https://autokuk.cz/vin/";

function findVinInText(text) {
    const matches = (text || "").toUpperCase().match(VIN_REGEX) || [];
    return matches.find((m) => /[A-Z]/.test(m) && /[0-9]/.test(m)) || null;
}

function buildVinCheckLink(vin) {
    const link = document.createElement("a");
    link.className = "bss-vin-check";
    link.textContent = "🔍 Historie vozidla";
    link.title = `Otevře autokuk.cz pro VIN ${vin}`;
    link.href = VIN_CHECK_URL + encodeURIComponent(vin);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    return link;
}

function initDetailBadges() {
    if (document.querySelector(".bss-detail-badges")) return;

    const h1 = document.querySelector("h1.nadpisdetail") || document.querySelector("h1");
    if (!h1) return;

    const titleText = h1.textContent || "";
    // Text popisu hledáme v okolí nadpisu; když není jasný blok, použijeme nejbližší rodič
    const descEl =
        document.querySelector(".popisdetail") ||
        document.querySelector(".popis") ||
        h1.parentElement;
    const descText = (descEl ? visibleTextOf(descEl) : "").slice(0, 4000);

    const fullText = `${titleText} ${descText}`;
    const stats = analyzeAdText(fullText, titleText);
    const vin = findVinInText(fullText);

    const bar = buildBadges(stats, vin);
    bar.classList.add("bss-detail-badges");

    const headerRow = h1.closest(".listainzerat, .inzeratydetail") || h1;
    headerRow.insertAdjacentElement("afterend", bar);
}


// ---- Doplnění údajů z detailu inzerátu ----
// Výpis Bazoše ukazuje jen zkrácený popis, takže km, rok nebo palivo často chybí.
// U inzerátů, kterým něco chybí, stáhneme detail (po jednom, s pauzou, s cache v sessionStorage).
const DETAIL_CACHE_KEY = IS_MOTO ? "bss_moto_detail_cache" : "bss_car_detail_cache";
const DETAIL_DELAY_MS = 1500;
let isEnrichingDetails = false;

function needsDetailData(stats) {
    if (IS_MOTO) return stats.ccm === null || stats.year === null || stats.mileageKm === null;
    return stats.year === null || stats.mileageKm === null || stats.detectedFuels.length === 0;
}

function readDetailCache() {
    try {
        return JSON.parse(sessionStorage.getItem(DETAIL_CACHE_KEY) || "{}");
    } catch (e) {
        return {};
    }
}

async function fetchDetailText(url) {
    if (new URL(url, window.location.href).origin !== window.location.origin) {
        throw new Error("Detail mimo Bazoš se nestahuje");
    }
    const cache = readDetailCache();
    if (cache[url]) return cache[url];

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const doc = new DOMParser().parseFromString(await response.text(), "text/html");
    const h1 = doc.querySelector("h1.nadpisdetail") || doc.querySelector("h1");
    const title = h1 ? h1.textContent.trim() : "";
    let text = doc.body ? visibleTextOf(doc.body) : "";
    const cut = text.search(/Podobné inzeráty|Odeslat zprávu|Kontakt na prodejce/i);
    if (cut > 0) text = text.slice(0, cut);

    const value = { title, text: text.slice(0, 6000) };
    cache[url] = value;
    const keys = Object.keys(cache);
    if (keys.length > 300) delete cache[keys[0]]; // omezíme velikost cache v sessionStorage
    try {
        sessionStorage.setItem(DETAIL_CACHE_KEY, JSON.stringify(cache));
    } catch (e) {
        // plná nebo nedostupná paměť – cache jen nepoužijeme
    }
    return value;
}

// Hodnoty z detailu mají přednost; když chybí, použije se výpis
function mergeStats(listStats, detailStats) {
    const pick = (key) => (detailStats[key] !== null ? detailStats[key] : listStats[key]);
    return {
        powerKw: pick("powerKw"),
        year: pick("year"),
        mileageKm: pick("mileageKm"),
        ccm: pick("ccm"),
        ccmInferred: detailStats.ccm !== null ? detailStats.ccmInferred : listStats.ccmInferred,
        detectedFuels: [...new Set([...listStats.detectedFuels, ...detailStats.detectedFuels])],
    };
}

// Najde další inzerát, kterému chybí údaje a který má smysl stáhnout (ostatní označí jako hotové)
function nextAdNeedingDetails() {
    const filters = getFormFilters();
    for (const ad of document.querySelectorAll(".inzeraty.inzeratyflex")) {
        if (ad.dataset.bssDetail === "1") continue;

        const link = ad.querySelector("h2.nadpis a");
        const titleEl = ad.querySelector(".nadpis");
        const descEl = ad.querySelector(".popis");
        const titleText = titleEl ? titleEl.textContent : "";
        const listText = `${titleText} ${descEl ? descEl.textContent : ""}`;

        const skip =
            !link ||
            (filters.hideParts && (PART_TITLE_REGEX.test(titleText) || SPARE_PARTS_REGEX.test(listText))) ||
            (filters.model && !modelMatches(normalizeText(listText), filters.model));
        if (skip) {
            ad.dataset.bssDetail = "1";
            continue;
        }

        const listStats = analyzeAdText(listText, titleText);
        if (!needsDetailData(listStats)) {
            ad.dataset.bssDetail = "1";
            continue;
        }
        return { ad, link, listStats };
    }
    return null;
}

async function enrichAdsFromDetails() {
    if (isEnrichingDetails) return;
    isEnrichingDetails = true;

    const statusEl = document.getElementById("bss-status");
    try {
        let job;
        while ((job = nextAdNeedingDetails())) {
            // Pokud uživatel mezitím kliknul na načítání dalších stránek, přerušíme dotahování detailů
            if (isFetchingMore) break;

            const { ad, link, listStats } = job;
            ad.dataset.bssDetail = "1";
            if (statusEl) statusEl.textContent = "⏳ Doplňuji údaje z detailů inzerátů…";

            try {
                const detail = await fetchDetailText(link.href);
                const fullDetailText = `${detail.title} ${detail.text}`;
                const detailStats = analyzeAdText(fullDetailText, detail.title);
                ad._bssStats = mergeStats(listStats, detailStats);
                ad._bssVin = findVinInText(fullDetailText);

                const filters = getFormFilters();
                evaluateSingleAd(ad, filters, parseKeywords(filters.keywordsIn), parseKeywords(filters.keywordsOut));
                updateStatusText();
            } catch (err) {
                console.warn("Detail inzerátu se nepodařilo načíst, doplňování zastavuji:", err);
                break; // při chybě (např. 429) nepokračujeme dál
            }
            await sleep(DETAIL_DELAY_MS);
        }
    } finally {
        isEnrichingDetails = false;
        if (!isFetchingMore) updateStatusText();
    }
}

// ---- Volitelné skrytí původního menu kategorií a vyhledávání Bazoše ----
// Dva nezávislé přepínače v horní liště, oba defaultně VYPNUTO.
const NATIVE_TOGGLES = {
    menu: { key: "bss_hide_menu", id: "bss-hide-menu" },
    search: { key: "bss_hide_search", id: "bss-hide-search" },
};
const hiddenNodes = { menu: [], search: [] };

function findMenuBlocks() {
    const menu = document.querySelector(".menuleft");
    return menu && !menu.querySelector(".inzeraty.inzeratyflex") ? [menu] : [];
}

function findSearchBlocks() {
    const form = document.getElementById("formt");
    return form && !form.querySelector(".inzeraty.inzeratyflex") ? [form] : [];
}

const NATIVE_FINDERS = { menu: findMenuBlocks, search: findSearchBlocks };

const nativeHidden = { menu: false, search: false };

function applyNativeHide(kind, hide) {
    nativeHidden[kind] = hide;
    // Boční okraje se použijí jen když je něco skryté; po vypnutí se vrátí původní vzhled
    document.body.classList.toggle("bss-compact", nativeHidden.menu || nativeHidden.search);
    if (hide) {
        if (hiddenNodes[kind].length === 0) hiddenNodes[kind] = NATIVE_FINDERS[kind]();
        hiddenNodes[kind].forEach((node) => {
            node.style.display = "none";
        });
    } else {
        hiddenNodes[kind].forEach((node) => {
            node.style.display = "";
        });
        hiddenNodes[kind] = [];
    }
}

// Slogan "... bazar pro každého" – lišta s přepínači se vloží hned za něj
function findTaglineElement() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
        if (/bazar pro každého/i.test(node.nodeValue || "") && node.parentElement) {
            return node.parentElement;
        }
    }
    return null;
}

// Záložní kotva: logo Bazoše
function findLogoElement() {
    const candidates = document.querySelectorAll('a[href="/"], a[href="https://www.bazos.cz/"], a[href="https://auto.bazos.cz/"], a[href="https://motorky.bazos.cz/"]');
    for (const a of candidates) {
        if (a.querySelector("img, svg") || /bazoš/i.test(a.textContent || "")) return a;
    }
    return null;
}

function createNativeToggleBar() {
    const bar = document.createElement("div");
    bar.id = "bss-toggle-bar";
    bar.className = "bss-toggle-bar";
    bar.innerHTML = `
      <label class="bss-switch">
        <input type="checkbox" id="${NATIVE_TOGGLES.menu.id}">
        <span class="bss-slider" aria-hidden="true"></span>
        <span>Skrýt levé menu kategorií</span>
      </label>
      <label class="bss-switch">
        <input type="checkbox" id="${NATIVE_TOGGLES.search.id}">
        <span class="bss-slider" aria-hidden="true"></span>
        <span>Skrýt původní vyhledávání</span>
      </label>
    `;
    return bar;
}

function setupNativeToggles() {
    const bar = createNativeToggleBar();
    const anchor = findTaglineElement() || findLogoElement();
    if (anchor) {
        anchor.insertAdjacentElement("afterend", bar);
    } else {
        const panel = document.getElementById("bss-panel");
        if (panel) panel.parentNode.insertBefore(bar, panel);
    }

    Object.keys(NATIVE_TOGGLES).forEach((kind) => {
        const { key, id } = NATIVE_TOGGLES[kind];
        const box = document.getElementById(id);
        if (!box) return;

        let saved = false;
        try {
            saved = localStorage.getItem(key) === "1";
        } catch (e) {
            saved = false;
        }
        box.checked = saved;
        applyNativeHide(kind, saved);

        box.addEventListener("change", () => {
            try {
                localStorage.setItem(key, box.checked ? "1" : "0");
            } catch (e) {
                // localStorage nemusí být dostupný – přepínač funguje i bez uložení
            }
            applyNativeHide(kind, box.checked);
        });
    });
}

initSmartSearch();
