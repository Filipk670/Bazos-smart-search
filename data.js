// Databáze značek a modelů pro AUTO.BAZOS.CZ
// Pozn.: Cesty (path) u nově přidaných značek jsou odhad podle běžné URL struktury – ověř je otevřením kategorie na Bazoši.
const CAR_DATA = {
    skoda: {
        name: "Škoda",
        path: "/skoda/",
        models: ["Octavia", "Superb", "Fabia", "Kodiaq", "Karoq", "Scala", "Kamiq", "Rapid", "Yeti", "Citigo", "Enyaq", "Elroq", "Epiq", "Peaq", "Kylaq", "Slavia", "Roomster", "Felicia", "Favorit"]
    },
    vw: {
        name: "Volkswagen",
        path: "/volkswagen/",
        models: ["Golf", "Passat", "Tiguan", "Touran", "Touareg", "Polo", "Arteon", "Caddy", "Sharan", "Transporter", "Multivan", "Caravelle", "Up!", "Scirocco", "ID.3", "ID.4", "ID.5", "ID.7", "ID. Buzz", "T-Roc", "T-Cross", "Taigo", "Tayron", "Taos", "Amarok", "Crafter"]
    },
    audi: {
        name: "Audi",
        path: "/audi/",
        models: ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q5", "Q7", "Q8", "TT", "e-tron"]
    },
    bmw: {
        name: "BMW",
        path: "/bmw/",
        models: ["Řada 1", "Řada 3", "Řada 5", "Řada 7", "X1", "X3", "X5", "X6", "E36", "E39", "E46", "E90", "E91", "E60", "E61", "F10", "F11", "F30", "F31", "G20", "G30"]
    },
    mercedes: {
        name: "Mercedes-Benz",
        path: "/mercedes/",
        models: ["Třída A", "Třída B", "Třída C", "Třída E", "Třída S", "CLA", "CLS", "GLA", "GLC", "GLE", "GLS", "ML", "SLK", "Vito", "Viano", "Třída V", "Sprinter"]
    },
    ford: {
        name: "Ford",
        path: "/ford/",
        models: ["Focus", "Mondeo", "Fiesta", "Kuga", "S-Max", "C-Max", "B-Max", "Galaxy", "Fusion", "Puma", "Ranger", "Mustang", "Transit", "Tourneo"]
    },
    hyundai: {
        name: "Hyundai",
        path: "/hyundai/",
        models: ["i30", "i20", "i10", "i40", "Tucson", "Santa Fe", "Kona", "ix35", "ix20", "Getz", "Accent", "Ioniq"]
    },
    kia: {
        name: "Kia",
        path: "/kia/",
        models: ["Ceed", "Sportage", "Sorento", "Rio", "Stonic", "Picanto", "Venga", "Carens", "Proceed", "XCeed", "Niro", "EV6"]
    },
    toyota: {
        name: "Toyota",
        path: "/toyota/",
        models: ["Corolla", "Yaris", "Auris", "RAV4", "Avensis", "Aygo", "C-HR", "Camry", "Verso", "Prius", "Proace", "Hilux", "Land Cruiser"]
    },
    peugeot: {
        name: "Peugeot",
        path: "/peugeot/",
        models: ["107", "108", "206", "207", "208", "301", "307", "308", "407", "508", "2008", "3008", "5008", "Partner", "Rifter", "Boxer", "Traveller"]
    },
    renault: {
        name: "Renault",
        path: "/renault/",
        models: ["Clio", "Megane", "Laguna", "Talisman", "Thalia", "Twingo", "Captur", "Kadjar", "Arkana", "Scenic", "Espace", "Kangoo", "Trafic", "Master"]
    },
    citroen: {
        name: "Citroën",
        path: "/citroen/",
        models: ["C1", "C2", "C3", "C4", "C5", "C4 Picasso", "Berlingo", "Xsara", "Jumper", "Jumpy", "SpaceTourer"]
    },
    opel: {
        name: "Opel",
        path: "/opel/",
        models: ["Astra", "Insignia", "Corsa", "Vectra", "Zafira", "Meriva", "Mokka", "Crossland", "Grandland", "Combo", "Vivaro", "Movano"]
    },
    mazda: {
        name: "Mazda",
        path: "/mazda/",
        models: ["Mazda 2", "Mazda 3", "Mazda 5", "Mazda 6", "CX-3", "CX-30", "CX-5", "CX-7", "MX-5", "Premacy"]
    },
    volvo: {
        name: "Volvo",
        path: "/volvo/",
        models: ["C30", "S40", "V40", "V50", "S60", "V60", "V70", "S80", "S90", "V90", "XC40", "XC60", "XC70", "XC90"]
    },
    dacia: {
        name: "Dacia",
        path: "/dacia/",
        models: ["Duster", "Sandero", "Logan", "Jogger", "Dokker", "Lodgy", "Spring"]
    },
    seat: {
        name: "Seat / Cupra",
        path: "/seat/",
        models: ["Leon", "Ibiza", "Cordoba", "Altea", "Ateca", "Tarraco", "Arona", "Alhambra", "Toledo", "Formentor", "Cupra Born", "Cupra Tavascan", "Cupra Terramar", "Cupra Raval"]
    },
    fiat: {
        name: "Fiat",
        path: "/fiat/",
        models: ["Punto", "Panda", "500", "Tipo", "Bravo", "Stilo", "Doblo", "Fiorino", "Freemont", "Ducato"]
    },
    honda: {
        name: "Honda",
        path: "/honda/",
        models: ["Civic", "Accord", "CR-V", "HR-V", "Jazz"]
    },
    suzuki: {
        name: "Suzuki",
        path: "/suzuki/",
        models: ["Swift", "Vitara", "SX4", "S-Cross", "Ignis", "Jimny"]
    },
    subaru: {
        name: "Subaru",
        path: "/subaru/",
        models: ["Outback", "Forester", "Impreza", "XV", "Legacy"]
    },
    mitsubishi: {
        name: "Mitsubishi",
        path: "/mitsubishi/",
        models: ["Outlander", "ASX", "Lancer", "Colt", "Pajero", "L200", "Eclipse Cross"]
    },
    nissan: {
        name: "Nissan",
        path: "/nissan/",
        models: ["Qashqai", "X-Trail", "Juke", "Micra", "Note", "Navara", "Pathfinder", "Leaf"]
    },
    alfa: {
        name: "Alfa Romeo",
        path: "/alfa/",
        models: ["Giulietta", "Giulia", "Stelvio", "MiTo", "Brera", "147", "156", "159", "166"]
    },
    jeep: {
        name: "Jeep",
        path: "/jeep/",
        models: ["Renegade", "Compass", "Cherokee", "Grand Cherokee", "Wrangler", "Patriot", "Avenger"]
    },
    landrover: {
        name: "Land Rover",
        path: "/land-rover/",
        models: ["Defender", "Discovery", "Freelander", "Range Rover", "Range Rover Evoque", "Range Rover Sport", "Velar"]
    },
    lexus: {
        name: "Lexus",
        path: "/lexus/",
        models: ["IS", "ES", "GS", "LS", "NX", "RX", "UX", "CT", "LC"]
    },
    porsche: {
        name: "Porsche",
        path: "/porsche/",
        models: ["911", "Boxster", "Cayman", "Cayenne", "Macan", "Panamera", "Taycan"]
    },
    tesla: {
        name: "Tesla",
        path: "/tesla/",
        models: ["Model 3", "Model S", "Model X", "Model Y"]
    },
    smart: {
        name: "Smart",
        path: "/smart/",
        models: ["Fortwo", "Forfour", "#1", "#3"]
    },
    chevrolet: {
        name: "Chevrolet",
        path: "/chevrolet/",
        models: ["Aveo", "Captiva", "Camaro", "Corvette", "Cruze", "Lacetti", "Spark"]
    },
    jaecoo: {
        name: "Jaecoo",
        path: "/jaecoo/",
        models: ["Jaecoo 5", "Jaecoo 6", "Jaecoo 7", "Jaecoo 8", "Jaecoo J6", "Jaecoo J7", "Jaecoo J7 PHEV"]
    },
    omoda: {
        name: "Omoda",
        path: "/omoda/",
        models: ["Omoda 4", "Omoda 5", "Omoda 7", "Omoda 9", "Omoda X", "Omoda C5"]
    },
    mg: {
        name: "MG",
        path: "/mg/",
        models: ["MG2", "MG3", "MG4", "MG5", "MG S5", "MG S9", "ZS", "ZS EV", "HS", "RX5", "Cyber X", "Marvel R", "Cyberster", "IM5", "IM6"]
    },
    byd: {
        name: "BYD",
        path: "/byd/",
        models: ["Atto 2", "Atto 3", "Atto 8", "Dolphin", "Dolphin Surf", "Seal", "Seal U", "Seal 5 DM-i", "Seal 6 DM-i", "Sealion 5 DM-i", "Sealion 7", "Sealion 08", "Tang", "Han", "Song Plus", "Shark", "Ti7", "Dolphin G", "Atto 3 EVO"]
    },
    chery: {
        name: "Chery",
        path: "/chery/",
        models: ["Tiggo 4", "Tiggo 7", "Tiggo 8", "Tiggo 9"]
    },
    geely: {
        name: "Geely",
        path: "/geely/",
        models: ["Coolray", "Azkarra", "EX5", "Geometry C"]
    },
    leapmotor: {
        name: "Leapmotor",
        path: "/leapmotor/",
        models: ["T03", "B01", "B03", "B03X", "B05", "B10", "C10", "A05", "D99"]
    },
    polestar: {
        name: "Polestar",
        path: "/polestar/",
        models: ["Polestar 2", "Polestar 3", "Polestar 4", "Polestar 5", "Polestar 7"]
    },
    xpeng: {
        name: "XPeng",
        path: "/xpeng/",
        models: ["G6", "G9", "G9L", "P7", "P7+", "X9", "L03", "L05"]
    },
    lynk: {
        name: "Lynk & Co",
        path: "/lynk-co/",
        models: ["Lynk & Co 01", "Lynk & Co 02", "Lynk & Co 03", "Lynk & Co 05", "Lynk & Co 06", "Lynk & Co 08", "Lynk & Co 09"]
    },
    zeekr: {
        name: "Zeekr",
        path: "/zeekr/",
        models: ["Zeekr 001", "Zeekr 007", "Zeekr 009", "Zeekr X", "Zeekr 7X"]
    },
    haval: {
        name: "Haval",
        path: "/haval/",
        models: ["H6", "H9", "Jolion", "Dargo"]
    },
    nio: {
        name: "NIO",
        path: "/nio/",
        models: ["ET5", "ET7", "EC6"]
    },
    lada: {
        name: "Lada",
        path: "/lada/",
        models: ["Niva", "Samara", "2101", "2103", "2105", "2106", "2107", "Kalina", "Priora", "Granta", "Vesta", "Largus"]
    },
    tatra: {
        name: "Tatra",
        path: "/tatra/",
        models: ["603", "613", "T 700", "T 148", "T 87"]
    },
    trabant: {
        name: "Trabant",
        path: "/trabant/",
        models: ["601", "P 50"]
    },
    wartburg: {
        name: "Wartburg",
        path: "/wartburg/",
        models: ["311", "353", "Knight"]
    },
    moskvic: {
        name: "Moskvič",
        path: "/moskvic/",
        models: ["408", "412", "2140", "2141"]
    },
    uaz: {
        name: "UAZ",
        path: "/uaz/",
        models: ["469", "Hunter", "Patriot"]
    },
    gaz: {
        name: "GAZ",
        path: "/gaz/",
        models: ["69", "Volga", "Gazelle"]
    },
    saab: {
        name: "Saab",
        path: "/saab/",
        models: ["900", "9000", "9-3", "9-5"]
    },
    lancia: {
        name: "Lancia",
        path: "/lancia/",
        models: ["Delta", "Ypsilon", "Y10", "Musa", "Lybra", "Thesis", "Kappa"]
    },
    abarth: {
        name: "Abarth",
        path: "/abarth/",
        models: ["595", "500", "124", "695"]
    },
    alpine: {
        name: "Alpine",
        path: "/alpine/",
        models: ["A110"]
    },
    alpina: {
        name: "Alpina",
        path: "/alpina/",
        models: ["B3", "B5", "B7", "XB7", "D3", "D4"]
    },
    aixam: {
        name: "Aixam",
        path: "/aixam/",
        models: ["400", "500", "Crossline", "City"]
    },
    ds: {
        name: "DS",
        path: "/ds/",
        models: ["DS 3", "DS 4", "DS 5", "DS 7", "DS 9"]
    },
    jaguar: {
        name: "Jaguar",
        path: "/jaguar/",
        models: ["XE", "XF", "XJ", "XK", "X-Type", "S-Type", "F-Type", "E-Pace", "F-Pace", "I-Pace", "E-Type"]
    },
    mini: {
        name: "Mini",
        path: "/mini/",
        models: ["Cooper", "Countryman", "Clubman", "Paceman", "Cabrio", "Aceman"]
    },
    daewoo: {
        name: "Daewoo",
        path: "/daewoo/",
        models: ["Matiz", "Lanos", "Nubira", "Leganza", "Tacuma", "Kalos", "Espero"]
    },
    ssangyong: {
        name: "SsangYong",
        path: "/ssangyong/",
        models: ["Korando", "Tivoli", "Musso", "Rexton", "Torres", "Actyon", "Kyron", "Rodius"]
    },
    chrysler: {
        name: "Chrysler",
        path: "/chrysler/",
        models: ["300C", "Voyager", "Grand Voyager", "PT Cruiser", "Pacifica", "Sebring"]
    },
    dodge: {
        name: "Dodge",
        path: "/dodge/",
        models: ["Journey", "Caliber", "Nitro", "Durango", "Charger", "Challenger"]
    },
    infiniti: {
        name: "Infiniti",
        path: "/infiniti/",
        models: ["Q30", "Q50", "Q60", "QX30", "QX50", "QX60", "QX70", "QX80", "FX"]
    },
    genesis: {
        name: "Genesis",
        path: "/genesis/",
        models: ["G70", "G80", "G90", "GV60", "GV70", "GV80"]
    },
    maserati: {
        name: "Maserati",
        path: "/maserati/",
        models: ["Ghibli", "Levante", "Quattroporte", "GranTurismo", "Grecale", "MC20"]
    },
    ferrari: {
        name: "Ferrari",
        path: "/ferrari/",
        models: ["F8", "488", "Portofino", "Roma", "812", "SF90"]
    },
    lamborghini: {
        name: "Lamborghini",
        path: "/lamborghini/",
        models: ["Huracán", "Urus", "Aventador", "Gallardo"]
    },
    bentley: {
        name: "Bentley",
        path: "/bentley/",
        models: ["Continental GT", "Bentayga", "Flying Spur"]
    },
    rollsroyce: {
        name: "Rolls-Royce",
        path: "/rolls-royce/",
        models: ["Phantom", "Ghost", "Cullinan", "Wraith", "Spectre"]
    },
    astonmartin: {
        name: "Aston Martin",
        path: "/aston-martin/",
        models: ["DB11", "DB12", "Vantage", "DBX"]
    },
    lotus: {
        name: "Lotus",
        path: "/lotus/",
        models: ["Elise", "Exige", "Evora", "Emira", "Eletre"]
    },
    mclaren: {
        name: "McLaren",
        path: "/mclaren/",
        models: ["570S", "720S", "750S", "Artura"]
    },
    bugatti: {
        name: "Bugatti",
        path: "/bugatti/",
        models: ["Veyron", "Chiron"]
    },
    acura: {
        name: "Acura",
        path: "/acura/",
        models: ["Integra", "NSX", "MDX", "RDX", "TLX", "ILX"]
    },
    buick: {
        name: "Buick",
        path: "/buick/",
        models: ["Riviera", "Enclave", "Encore", "Envision", "Regal"]
    },
    cadillac: {
        name: "Cadillac",
        path: "/cadillac/",
        models: ["Escalade", "CT4", "CT5", "CT6", "XT4", "XT5", "XT6", "SRX"]
    },
    gmc: {
        name: "GMC",
        path: "/gmc/",
        models: ["Sierra", "Yukon", "Terrain", "Acadia", "Canyon"]
    },
    lincoln: {
        name: "Lincoln",
        path: "/lincoln/",
        models: ["Navigator", "Aviator", "Corsair", "Nautilus"]
    },
    daihatsu: {
        name: "Daihatsu",
        path: "/daihatsu/",
        models: ["Terios", "Sirion", "Cuore", "Materia", "Charade", "Applause", "Feroza", "Copen", "Fourtrak"]
    },
    isuzu: {
        name: "Isuzu",
        path: "/isuzu/",
        models: ["D-Max", "Trooper"]
    },
    mahindra: {
        name: "Mahindra",
        path: "/mahindra/",
        models: ["Thar", "Scorpio"]
    },
    tata: {
        name: "Tata",
        path: "/tata/",
        models: ["Nano"]
    },
    praga: {
        name: "Praga",
        path: "/praga/",
        models: ["V3S"]
    }
};

// Databáze značek a modelů pro MOTORKY.BAZOS.CZ
// Pozn.: Bazoš u motorek nemá podkategorie podle značek v URL, proto hledáme přes hlavní vyhledávání
const MOTO_DATA = {
    yamaha: {
        name: "Yamaha",
        brandQuery: "Yamaha",
        models: ["MT-03", "MT-07", "MT-09", "MT-10", "MT-125", "YZF-R1", "YZF-R6", "YZF-R3", "YZF-R125", "FZ6", "FZ1", "Fazer", "XJ6", "XSR700", "XSR900", "Tenere 700", "XT660", "XT600", "TDM", "Tracer 7", "Tracer 9", "DragStar", "Virago", "XMAX", "NMAX"]
    },
    honda: {
        name: "Honda",
        brandQuery: "Honda",
        models: ["CB 500", "CB 650", "CB 600F Hornet", "CB 750 Hornet", "CB 1000R", "CBF 600", "CBF 1000", "CBR 125", "CBR 500R", "CBR 600", "CBR 650", "CBR 1000RR", "NC 700", "NC 750", "Africa Twin", "Transalp", "Varadero", "VFR", "Shadow", "Rebel", "PCX 125", "Forza"]
    },
    kawasaki: {
        name: "Kawasaki",
        brandQuery: "Kawasaki",
        models: ["Z650", "Z750", "Z800", "Z900", "Z1000", "ER-6n", "ER-6f", "ER-5", "Ninja 400", "Ninja 650", "ZX-6R", "ZX-10R", "Versys 650", "Versys 1000", "Vulcan", "KLE 500", "Z400", "Z125"]
    },
    suzuki: {
        name: "Suzuki",
        brandQuery: "Suzuki",
        models: ["SV 650", "SV 1000", "Bandit", "GSF 600", "GSF 650", "GSF 1200", "GSX-R 600", "GSX-R 750", "GSX-R 1000", "GSX-S 750", "GSX-S 1000", "V-Strom 650", "V-Strom 1000", "GS 500", "GSR 600", "GSR 750", "Gladius", "Intruder", "Burgman"]
    },
    bmw: {
        name: "BMW",
        brandQuery: "BMW",
        models: ["R 1200 GS", "R 1250 GS", "R 1300 GS", "R 1150 GS", "F 800 GS", "F 850 GS", "F 750 GS", "F 650 GS", "G 310 GS", "G 310 R", "F 800 R", "F 900 R", "F 900 XR", "S 1000 R", "S 1000 RR", "S 1000 XR", "R nineT"]
    },
    ktm: {
        name: "KTM",
        brandQuery: "KTM",
        models: ["Duke 125", "Duke 390", "Duke 690", "Duke 790", "Duke 890", "Super Duke 1290", "Adventure 390", "Adventure 790", "Adventure 890", "Adventure 1190", "Adventure 1290", "SMC 690", "Enduro 690", "EXC", "SX"]
    },
    ducati: {
        name: "Ducati",
        brandQuery: "Ducati",
        models: ["Monster", "Multistrada", "Scrambler", "Panigale", "Hypermotard", "Streetfighter", "Supersport", "Diavel"]
    },
    triumph: {
        name: "Triumph",
        brandQuery: "Triumph",
        models: ["Street Triple", "Speed Triple", "Tiger 800", "Tiger 900", "Tiger 1200", "Bonneville", "Trident 660", "Scrambler"]
    },
    aprilia: {
        name: "Aprilia",
        brandQuery: "Aprilia",
        models: ["RS 125", "RS 660", "Tuono 125", "Tuono 660", "Tuono V4", "RSV4", "Shiver", "Dorsoduro", "Pegaso", "Tuareg 660"]
    },
    harley: {
        name: "Harley-Davidson",
        brandQuery: "Harley",
        models: ["Sportster", "Iron 883", "Forty-Eight", "Softail", "Fat Boy", "Street Bob", "Road King", "Street Glide", "Pan America"]
    },
    cfmoto: {
        name: "CFMoto",
        brandQuery: "CFMoto",
        models: ["300NK", "650NK", "800NK", "450SR", "650MT", "700MT", "800MT", "450MT", "700CL-X", "Gladiator"]
    },
    jawa: {
        name: "Jawa / ČZ",
        brandQuery: "Jawa",
        models: ["Pionýr", "Babetta", "250", "350", "634", "638", "640", "Perák", "Kývačka", "Panelka", "300 CL", "350 OHC", "ČZ 175", "ČZ 125"]
    }
};

// Orientační objem motoru (ccm) podle názvu modelu.
// Použije se jen tehdy, když objem není v inzerátu uveden (u štítku se zobrazí jako "~").
// Hodnoty jsou katalogové a orientační; u některých verzí/ročníků se můžou lišit.
const MOTO_CCM = {
    // CFMoto
    "300NK": 292, "450SR": 449, "450MT": 449, "650NK": 649, "650MT": 649, "700MT": 693, "700CL-X": 693, "800NK": 799, "800MT": 799,
    // Yamaha
    "MT-03": 321, "MT-07": 689, "MT-09": 889, "MT-10": 998, "MT-125": 125, "YZF-R1": 998, "YZF-R3": 321, "YZF-R6": 599, "YZF-R125": 125,
    "XSR700": 689, "XSR900": 888, "Tenere 700": 689, "Tracer 7": 689, "Tracer 9": 890,
    // Honda
    "CB 500": 471, "CB 650": 649, "CB 1000R": 998, "CBR 125": 125, "CBR 500R": 471, "CBR 650": 649, "CBR 1000RR": 999,
    "CBF 600": 599, "CB 600F Hornet": 599, "CB 750 Hornet": 755, "NC 750": 745, "Africa Twin": 1084, "PCX 125": 125,
    // Kawasaki
    "Z125": 124, "Z400": 399, "Z650": 649, "Z750": 748, "Z900": 948, "Z900RS": 948, "Z1000": 1043, "Ninja 400": 399,
    "Ninja 650": 649, "ZX-6R": 636, "ZX-10R": 998, "Versys 650": 649, "Versys 1000": 1043, "ER-6n": 649, "KLE 500": 498,
    // Suzuki
    "SV 650": 645, "GSX-R 750": 749, "GSX-R 1000": 999, "GSX-S 750": 749, "GSX-S 1000": 999, "V-Strom 650": 645, "Gladius": 645,
    // BMW
    "G 310 R": 313, "G 310 GS": 313, "F 750 GS": 853, "F 850 GS": 853, "F 900 R": 895, "F 900 XR": 895, "R 1250 GS": 1254, "S 1000 RR": 999,
    // KTM
    "Duke 125": 124, "Duke 390": 373, "Duke 690": 693, "Duke 790": 799, "Duke 890": 889, "Super Duke 1290": 1301,
    "Adventure 390": 373, "Adventure 790": 799, "Adventure 890": 889, "Adventure 1290": 1301, "Enduro 690": 693, "SMC 690": 693,
    // Triumph
    "Street Triple": 765, "Speed Triple": 1160, "Tiger 900": 888, "Tiger 1200": 1160, "Trident 660": 660,
    // Aprilia
    "RS 125": 125, "RS 660": 659, "Tuono 125": 125, "Tuono 660": 659
};

// Regexy používají Unicode vlastnosti (\p{L}, \p{N}), aby hranice slova fungovala i pro české znaky (á, é, ř, ů...)
const FUEL_PATTERNS = {
    diesel: {
        label: "Nafta",
        regex: /(?<!\p{L})(naft[aouyě]|naftov[aéý]|diesel|dieslov[aéý]|tdi|sdi|hdi|ehdi|bluehdi|dci|cdti|tdci|jtd|jtdm|multijet|crdi|d4d|d-4d|di-d|did|cdi|bluetec|td|tds|crd|d3|d4|d5|2\.0d|3\.0d|1\.9d|1\.7d|\d[.,]\d\s?d)(?![\p{L}\p{N}])/iu
    },
    petrol: {
        label: "Benzín",
        regex: /(?<!\p{L})(benz[ií]n\p{L}*|benzinov[aéý]|tsi|tfsi|fsi|mpi|htp|vti|puretech|tce|ecoboost|gdi|tgdi|t-gdi|vtec|i-vtec|vvti|vvt-i|skyactiv-g|skyactiv-x|16v|8v|1\.2i|1\.4i|1\.6i|1\.8i|2\.0i|1\.8t|\d[.,]\d\s?[it])(?![\p{L}\p{N}])/iu
    },
    lpg: {
        label: "LPG/CNG",
        regex: /(?<!\p{L})(lpg|cng|plyn|autoplyn)(?![\p{L}\p{N}])/iu
    },
    hybrid: {
        label: "Hybrid/EV",
        regex: /(?<!\p{L})(hybrid|hybridn[ií]|phev|mhev|elektro|elektromobil|bev|e-tron|enyaq|id\.3|id\.4|id\.5)(?![\p{L}\p{N}])/iu
    }
};

// Slova typická pro inzeráty náhradních dílů, vraků nebo výkupu.
// Záměrně bez obecných slov (disky, pneu, rozprodám, překáží), která se objevují i u normálních prodejů aut.
const SPARE_PARTS_REGEX = /(?<![\p{L}\p{N}])(na náhradní díly|náhradní díly|veškeré díly|veškeré nd|prodám díly|pouze díly|díly z vozu|díly z tohoto|díly z vozidla|na nd|vraky? na nd|koupím|vykoupím|výkup)(?![\p{L}\p{N}])/iu;

// Díly a příslušenství poznané podle NADPISU inzerátu (nadpis bývá nejspolehlivější).
// Záměrně bez barev, obecných slov a názvů částí, které se běžně objevují i v popisech prodeje aut.
const PART_TITLE_REGEX = /(?<![\p{L}\p{N}])(disk(?:y|ů|u|es)?|kola|kolo|pneu\p{L}*|pneumatik\p{L}*|gumov\p{L}*|vana|vaničk\p{L}*|koberec|koberce|kobercu|kobercích|nosič\p{L}*|nosic\p{L}*|tažn\p{L}*|lišt\p{L}*|blatník\p{L}*|nárazník\p{L}*|zrcátk\p{L}*|reflektor\p{L}*|mřížk\p{L}*|výfuk\p{L}*|kotouč\p{L}*|destičk\p{L}*|potah\p{L}*|autorádi\p{L}*|navigac\p{L}*|kamer\p{L}*|senzor\p{L}*|střešní\s+box|airbag\p{L}*|kapot\p{L}*|chladič\p{L}*|turbo\p{L}*|převodov\p{L}*|startér\p{L}*|alternátor\p{L}*|katalyzátor\p{L}*|díl|díly|příslušenství|doplněk\p{L}*|prodám\s+(?:sadu|kola|disky)|sada\s+(?:kol|disk\p{L}*))(?![\p{L}\p{N}])/iu;