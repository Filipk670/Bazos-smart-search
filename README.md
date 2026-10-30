# 🚗🏍️ Bazoš Smart Search

<img width="1265" height="349" alt="Snímek obrazovky 2026-10-30 165838" src="https://github.com/user-attachments/assets/eb6165d7-8515-49f9-bc32-ac2e12cf6e87" />

Chytré filtrování pro český Bazoš (`auto.bazos.cz` a `motorky.bazos.cz`). Rozšíření do prohlížeče, které z prastarého vyhledávání dělá moderní nástroj na úrovni Sauto / TipCars. Přidává pokročilé filtry, automaticky vyhazuje náhradní díly a na pozadí samo dotahuje další inzeráty z dalších stránek.

## 🌟 Hlavní funkce
<img width="747" height="196" alt="Snímek obrazovky 2026-10-30 170125" src="https://github.com/user-attachments/assets/830201dd-867d-410f-925f-569a6b2d894c" />

*   **Pokročilé filtry:** Filtrování podle výkonu (kW/PS), roku výroby, maximálního nájezdu, objemu motoru (ccm) a přesného modelu.
*   **Chytrá extrakce dat:** Skript čte texty inzerátů a automaticky z nich vytahuje skryté parametry, které Bazoš normálně neumí filtrovat. Zvládá přečíst i české patvary jako `najeto 185tkm` nebo `396xxx`.
*   **Vizuální štítky:** Ke každému inzerátu rovnou přidává barevné štítky s palivem, rokem a výkonem.
*   **Auto-Fetch (Nekonečné načítání):** Pokud tvému přísnému filtru vyhovují na první stránce jen 2 auta, addon sám na pozadí bleskově projde další stránky Bazoše a dosype ti na obrazovku další vyhovující inzeráty.
*   **Odstranění plevele:** Automaticky skrývá inzeráty na náhradní díly, vraky, pneumatiky a výkupy.
*   **Kontrola VIN:** Pokud prodejce uvede v textu VIN kód, addon vygeneruje tlačítko pro rychlé ověření historie vozidla přes Autokuk.cz.
*   **Čistý design:** Možnost jedním kliknutím skrýt levé menu kategorií a původní Bazoš vyhledávání pro maximální přehlednost.

## 🛠️ Instalace (Chrome, Brave, Edge)

Jelikož rozšíření zatím není v oficiálním obchodu Chrome Web Store, instaluje se v režimu pro vývojáře:

1. Stáhněte si tento repozitář (zelené tlačítko **Code** -> **Download ZIP**) a rozbalte složku do počítače.
2. Otevřete prohlížeč a do adresního řádku zadejte:
   * Chrome: `chrome://extensions/`
   * Brave: `brave://extensions/`
   * Edge: `edge://extensions/`
3. Vpravo nahoře zapněte **Režim pro vývojáře** (Developer mode).
4. Vlevo nahoře klikněte na **Načíst rozbalené** (Load unpacked) a vyberte rozbalenou složku `bazos-smart-search`.
5. Hotovo! Otevřete [auto.bazos.cz](https://auto.bazos.cz) nebo [motorky.bazos.cz](https://motorky.bazos.cz) a chytrý panel se automaticky zobrazí nahoře nad inzeráty.

## 👨‍💻 Technologie

*   Vanilla JavaScript (ES6+)
*   Manifest V3
*   CSS3
*   Bez externích závislostí a frameworků (čistý a rychlý chod).

## 📄 Licence

Tento projekt je licencován pod **MIT License**
