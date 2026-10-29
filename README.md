# Bazoš Smart Search (Auta & Motorky)

Chrome rozšíření, které na výpisech inzerátů na `auto.bazos.cz` a `motorky.bazos.cz` přidává chytré filtrování a štítky s klíčovými údaji.

🇬🇧 [English version](README.en.md)

## Funkce

- **Filtrování výpisu:** značka, model, palivo, výkon (kW), rok výroby, max. nájezd, cena, klíčová slova (musí / nesmí obsahovat).
- **Motorky:** filtr objemu (ccm) a výkonu pro řidičský průkaz A2.
- **Štítky u každého inzerátu:** rok, výkon, palivo, nájezd a u motorek objem.
- **Doplnění údajů z detailu:** když výpis neobsahuje rok, nájezd nebo palivo (Bazoš zkracuje popis), rozšíření stáhne detail inzerátu. Stahuje postupně s pauzou 1,5 s a výsledky ukládá do paměti prohlížeče na dobu session.
- **Skrytí náhradních dílů a poptávek** (zapnuto ve výchozím stavu).
- **Načtení dalších stránek:** tlačítko najde další vyhovující inzeráty.
- **Štítky na detailu inzerátu** pod nadpisem.
- **Skrytí původního menu** (volitelné, vypnuto ve výchozím stavu): dva přepínače v horní liště. Jeden skryje levé menu kategorií, druhý původní vyhledávací řádek.

## Instalace

1. Stáhni nejnovější ZIP ze stránky **Releases** a rozbal ho.
2. V Chrome otevři `chrome://extensions`.
3. Zapni **Režim pro vývojáře** (vpravo nahoře).
4. Klikni na **Načíst rozbalený** a vyber rozbalenou složku.

Vyžaduje Chrome 79 nebo novější.

## Použití

Otevři výpis aut nebo motorek na Bazoši, nastav filtry a klikni na **Filtrovat inzeráty**. Filtry se ukládají v prohlížeči a zůstanou po načtení stránky.

## Upozornění

- Seznamy značek, modelů a objemů motorek jsou z velké části doplněné ručně a nejsou všechny ověřené. Chyby hlaste v sekci Issues.
- Rozšíření pracuje jen se stránkami Bazoše. Nic neodesílá na jiné servery a všechna nastavení zůstávají v prohlížeči.
- Projekt není spojený s Bazoš.cz. Změny na stránkách Bazoše mohou rozbít některé funkce, pak je potřeba upravit kód.

## Struktura projektu

- `manifest.json`: nastavení rozšíření
- `content.js`: logika filtrů, štítků a doplňování údajů
- `data.js`: značky, modely, objemy motorek a regulární výrazy
- `style.css`: vzhled

## Licence

Zatím bez licence. Všechna práva vyhrazena autorem.
