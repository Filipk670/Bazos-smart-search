// Bazoš Smart Search – content script (v0.6)

const IS_MOTO = window.location.hostname === "motorky.bazos.cz";
const ACTIVE_DATA = IS_MOTO ? MOTO_DATA : CAR_DATA;
const STORAGE_KEY = IS_MOTO ? "bss_moto_filters" : "bss_car_filters";
const AUTOFETCH_KEY = IS_MOTO ? "bss_moto_autofetch" : "bss_car_autofetch";

const APP_VERSION = "0.6";
const MIN_YEAR = 1970;
const MAX_YEAR = new Date().getFullYear() + 1;
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
    const tokens = normalizeText(model).split(/[\s.-]+/).filter(Boolean).map(escapeRegex);
    if (tokens.length === 0) return true;
    const pattern = tokens.join("[\\s.-]?");
    const re = new RegExp(`(?<![\\p{L}\\p{N}])${pattern}(?![\\p{L}\\p{N}])`, "u");
    return re.test(normalizedText);
}

function isPlausibleYear(y) {
    return Number.isInteger(y) && y >= MIN_YEAR && y <= MAX_YEAR;
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

    // Dynamické pole: U aut Palivo, u motorek Objem (ccm) + A2
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
          <option value="diesel">Nafta (TDI, SDI, HDi, dCi...)</option>
          <option value="petrol">Benzín (TSI, MPI, HTP, 16V...)</option>
          <option value="lpg">LPG / CNG</option>
          <option value="hybrid">Hybrid / Elektro</option>
        </select>
      </div>
    `;

    panel.innerHTML = `
    <div class="bss-header">
      <div class="bss-title">
        <span>${IS_MOTO ? "🏍️ Bazoš Smart Search – Motorky" : "🚗 Bazoš Smart Search – Auta"}</span>
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
        <label>Rok výroby</label>
        <div class="bss-range">
          <input type="number" id="bss-year-min" placeholder="Od (např. 2012)" min="${MIN_YEAR}" max="${MAX_YEAR}">
          <input type="number" id="bss-year-max" placeholder="Do" min="${MIN_YEAR}" max="${MAX_YEAR}">
        </div>
      </div>

      <div class="bss-field">
        <label for="bss-km-max">Max. nájezd (km)</label>
        <input type="number" id="bss-km-max" placeholder="např. 200000" min="0" step="10000">
      </div>

      <div class="bss-field">
        <label>Cena (Kč)</label>
        <div class="bss-range">
          <input type="number" id="bss-price-min" placeholder="Od" min="0" step="10000">
          <input type="number" id="bss-price-max" placeholder="Do" min="0" step="10000">
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

function getFormFilters() {
    const fuelEl = document.getElementById("bss-fuel");
    const ccmMinEl = document.getElementById("bss-ccm-min");
    const ccmMaxEl = document.getElementById("bss-ccm-max");

    return {
        brand: document.getElementById("bss-brand").value,
        model: document.getElementById("bss-model").value,
        fuel: fuelEl ? fuelEl.value : "",
        ccmMin: ccmMinEl ? parseInt(ccmMinEl.value, 10) || null : null,
        ccmMax: ccmMaxEl ? parseInt(ccmMaxEl.value, 10) || null : null,
        powerMin: parseInt(document.getElementById("bss-power-min").value, 10) || null,
        powerMax: parseInt(document.getElementById("bss-power-max").value, 10) || null,
        yearMin: parseInt(document.getElementById("bss-year-min").value, 10) || null,
        yearMax: parseInt(document.getElementById("bss-year-max").value, 10) || null,
        kmMax: parseInt(document.getElementById("bss-km-max").value, 10) || null,
        priceMin: document.getElementById("bss-price-min").value.trim(),
        priceMax: document.getElementById("bss-price-max").value.trim(),
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
        document.getElementById("bss-year-min").value = filters.yearMin || "";
        document.getElementById("bss-year-max").value = filters.yearMax || "";
        document.getElementById("bss-km-max").value = filters.kmMax || "";
        document.getElementById("bss-price-min").value = filters.priceMin || "";
        document.getElementById("bss-price-max").value = filters.priceMax || "";
        document.getElementById("bss-keywords-in").value = filters.keywordsIn || "";
        document.getElementById("bss-keywords-out").value = filters.keywordsOut || "";
        document.getElementById("bss-hide-parts").checked = filters.hideParts !== false;
        document.getElementById("bss-include-unknown").checked = Boolean(filters.includeUnknown);
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
            searchQuery = [!ownPage && brandData ? brandData.name : "", filters.model].filter(Boolean).join(" ");
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
    // a) z textu inzerátu, jen s jasným označením (r.v., rok, roku, vyrobeno, MM/RRRR...)
    const explicitYearMatch = cleanText.match(
        /(?:\br\.?\s*v\.?|\brok(?:u|\s+v[ýy]roby)?|vyrobeno|do\s+provozu|\b(?:0?[1-9]|1[0-2])\s*\/)\s*:?\s*(\d{4})(?!\d)/iu
    );
    if (explicitYearMatch && isPlausibleYear(parseInt(explicitYearMatch[1], 10))) {
        year = parseInt(explicitYearMatch[1], 10);
    }
    // b) jinak holý rok v nadpisu, např. "CFMOTO 700MT Adventure, DPH, 2025, 8250 km"
    if (year === null) {
        for (const m of cleanTitle.matchAll(/(?<!\d)(\d{4})(?!\d)/g)) {
            if (isPlausibleYear(parseInt(m[1], 10))) {
                year = parseInt(m[1], 10);
                break;
            }
        }
    }

    // 4. Nájezd v km
    // Datumy typu "02/2013" nebo "06.2023" nesmí být brané za km (dřív se "2013 Km" zaměnilo za nájezd)
    const kmText = cleanText.replace(/(?<!\d)\d{1,2}\s*[\/.]\s*(?:19|20)\d{2}(?!\d)/g, " ");
    const tisKmMatch = kmText.match(/(?<!\d)(\d{1,3})\s*(?:tis\.?|t)\s*(?:km(?!\/|h(?!\p{L}))|kilometr\p{L}*)/iu);
    const fullKmMatch = kmText.match(/(?<!\d)(\d{1,3})[\s.,]+(\d{3}|xxx)\s*(?:km(?!\/|h(?!\p{L}))|kilometr\p{L}*)/iu);
    const simpleKmMatch = kmText.match(/(?<!\d)(\d{4,6})\s*(?:km(?!\/|h(?!\p{L}))|kilometr\p{L}*)/iu);
    // "stav kilometrů 4620", "najeto 8250 kilometrů" – číslo bez jednotky přímo za sebou
    const textKmMatches = [
        ...kmText.matchAll(/(?:stav|najet[oa]|n[áa]jezd\p{L}*|(?<!\p{L})km)\s*:?\s*[^\d]{0,25}?(\d{1,3}(?:[\s.]\d{3})+|\d{4,6})(?!\d)/giu),
    ];

    if (tisKmMatch) {
        mileageKm = parseInt(tisKmMatch[1], 10) * 1000;
    } else if (fullKmMatch) {
        const thousands = parseInt(fullKmMatch[1], 10);
        const hundreds = fullKmMatch[2].toLowerCase() === "xxx" ? 0 : parseInt(fullKmMatch[2], 10);
        mileageKm = thousands * 1000 + hundreds;
    } else if (simpleKmMatch) {
        mileageKm = parseInt(simpleKmMatch[1], 10);
    } else {
        for (const m of textKmMatches) {
            const raw = m[1];
            if (/^\d{4}$/.test(raw) && isPlausibleYear(parseInt(raw, 10))) continue; // není to rok
            mileageKm = parseInt(raw.replace(/[\s.]/g, ""), 10);
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
            const inferred = inferCcmFromModel(normalized);
            if (inferred !== null) {
                ccm = inferred;
                ccmInferred = true;
            }
        }
    }

    // 6. Palivo (jen auta)
    const detectedFuels = [];
    if (!IS_MOTO) {
        for (const [key, data] of Object.entries(FUEL_PATTERNS)) {
            if (data.regex.test(cleanText)) {
                detectedFuels.push(key);
            }
        }
    }

    return { powerKw, year, mileageKm, ccm, ccmInferred, detectedFuels };
}

// Najde objem motoru podle názvu modelu v už normalizovaném textu inzerátu
function inferCcmFromModel(normalizedText) {
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
    renderBadges(ad, adStats, findVinInText(rawText));

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

    const stats = analyzeAdText(`${titleText} ${descText}`, titleText);
    const bar = buildBadges(stats);
    bar.classList.add("bss-detail-badges");

    const vin = findVinInText(`${titleText} ${descText}`);
    if (vin) bar.insertBefore(buildVinCheckLink(vin), bar.firstChild);

    h1.insertAdjacentElement("afterend", bar);
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
            const { ad, link, listStats } = job;
            ad.dataset.bssDetail = "1";
            if (statusEl) statusEl.textContent = "⏳ Doplňuji údaje z detailů inzerátů…";

            try {
                const detail = await fetchDetailText(link.href);
                const detailStats = analyzeAdText(`${detail.title} ${detail.text}`, detail.title);
                ad._bssStats = mergeStats(listStats, detailStats);

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
        updateStatusText();
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