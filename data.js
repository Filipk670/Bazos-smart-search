// Databáze značek a modelů pro AUTO.BAZOS.CZ
// Pozn.: Cesty (path) u nově přidaných značek jsou odhad podle běžné URL struktury – ověř je otevřením kategorie na Bazoši.
const CAR_DATA = {
    skoda: {
        name: "Škoda",
        path: "/skoda/",
        models: ["Octavia", "Superb", "Fabia", "Kodiaq", "Karoq", "Scala", "Kamiq", "Rapid", "Yeti", "Citigo", "Enyaq", "Elroq", "Epiq", "Peaq", "Kylaq", "Slavia", "Roomster", "Felicia", "Favorit", "100", "105", "110", "120", "130", "135", "136"]
    },
    vw: {
        name: "Volkswagen",
        path: "/volkswagen/",
        models: ["Golf", "Passat", "Tiguan", "Touran", "Touareg", "Polo", "Arteon", "Caddy", "Sharan", "Transporter", "Multivan", "Caravelle", "Up!", "Scirocco", "ID.3", "ID.4", "ID.5", "ID.7", "ID. Buzz", "T-Roc", "T-Cross", "Taigo", "Tayron", "Taos", "Amarok", "Crafter", "Beetle", "Bora", "Jetta", "Vento", "Lupo", "Fox", "Phaeton", "Eos", "LT"]
    },
    audi: {
        name: "Audi",
        path: "/audi/",
        models: ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q5", "Q7", "Q8", "TT", "e-tron", "80", "90", "100", "R8", "Q4"]
    },
    bmw: {
        name: "BMW",
        path: "/bmw/",
        models: ["Řada 1", "Řada 3", "Řada 5", "Řada 7", "X1", "X3", "X5", "X6", "E36", "E39", "E46", "E90", "E91", "E60", "E61", "F10", "F11", "F30", "F31", "G20", "G30", "Řada 2", "Řada 4", "Řada 6", "Řada 8", "X2", "X4", "X7", "Z3", "Z4", "i3", "i4", "iX", "iX3"]
    },
    mercedes: {
        name: "Mercedes-Benz",
        path: "/mercedes/",
        models: ["Třída A", "Třída B", "Třída C", "Třída E", "Třída S", "CLA", "CLS", "GLA", "GLC", "GLE", "GLS", "ML", "SLK", "Vito", "Viano", "Třída V", "Sprinter", "Třída G", "GLK", "GLB", "CLK", "Třída R", "SL", "CL", "Citan", "Vaneo", "190", "Piano", "EQA", "EQB", "EQC", "EQE", "EQS", "EQV"]
    },
    ford: {
        name: "Ford",
        path: "/ford/",
        models: ["Focus", "Mondeo", "Fiesta", "Kuga", "S-Max", "C-Max", "B-Max", "Galaxy", "Fusion", "Puma", "Ranger", "Mustang", "Transit", "Tourneo", "Ka", "Ka+", "StreetKa", "Edge", "EcoSport", "Explorer", "Maverick", "Escort", "Sierra", "Scorpio", "Probe", "Cougar", "Cortina", "Capri", "F-150"]
    },
    hyundai: {
        name: "Hyundai",
        path: "/hyundai/",
        models: ["i30", "i20", "i10", "i40", "Tucson", "Santa Fe", "Kona", "ix35", "ix20", "Getz", "Accent", "Ioniq", "H-1", "Bayon", "ix55", "Matrix", "Atos", "Tiburon", "Sonata", "Elantra", "Lantra", "Terracan", "Galloper", "Veloster", "Staria"]
    },
    kia: {
        name: "Kia",
        path: "/kia/",
        models: ["Ceed", "Sportage", "Sorento", "Rio", "Stonic", "Picanto", "Venga", "Carens", "Proceed", "XCeed", "Niro", "EV6", "Soul", "e-Soul", "Optima", "Stinger", "Carnival", "Sedona", "Joice", "Magentis", "Cerato", "Pregio", "K2500", "K2700"]
    },
    toyota: {
        name: "Toyota",
        path: "/toyota/",
        models: ["Corolla", "Yaris", "Auris", "RAV4", "Avensis", "Aygo", "C-HR", "Camry", "Verso", "Prius", "Proace", "Hilux", "Land Cruiser", "Celica", "Supra", "MR2", "GT86", "GR86", "Highlander", "Sequoia", "Tundra", "Tacoma", "4Runner", "FJ Cruiser", "Carina", "Starlet", "Paseo", "Previa", "Hiace", "Urban Cruiser", "bZ4X"]
    },
    peugeot: {
        name: "Peugeot",
        path: "/peugeot/",
        models: ["107", "108", "206", "207", "208", "301", "307", "308", "407", "508", "2008", "3008", "5008", "Partner", "Rifter", "Boxer", "Traveller", "106", "205", "306", "309", "405", "406", "605", "607", "806", "807", "1007", "4007", "4008", "RCZ", "Expert", "Bipper"]
    },
    renault: {
        name: "Renault",
        path: "/renault/",
        models: ["Clio", "Megane", "Laguna", "Talisman", "Thalia", "Twingo", "Captur", "Kadjar", "Arkana", "Scenic", "Espace", "Kangoo", "Trafic", "Master", "Fluence", "Koleos", "Austral", "Rafale", "Symbioz", "Modus", "Vel Satis", "Avantime", "Wind", "Zoe", "R5", "R19", "R21", "Mascott"]
    },
    citroen: {
        name: "Citroën",
        path: "/citroen/",
        models: ["C1", "C2", "C3", "C4", "C5", "C4 Picasso", "Berlingo", "Xsara", "Jumper", "Jumpy", "SpaceTourer", "C-Elysée", "C6", "C8", "C-Crosser", "Saxo", "Xantia", "ZX", "BX", "AX", "XM", "Evasion", "Nemo"]
    },
    opel: {
        name: "Opel",
        path: "/opel/",
        models: ["Astra", "Insignia", "Corsa", "Vectra", "Zafira", "Meriva", "Mokka", "Crossland", "Grandland", "Combo", "Vivaro", "Movano", "Agila", "Adam", "Karl", "Antara", "Frontera", "Monterey", "Omega", "Signum", "Tigra", "Calibra", "Kadett", "Ascona", "Rekord", "Ampera", "Cascada"]
    },
    mazda: {
        name: "Mazda",
        path: "/mazda/",
        models: ["Mazda 2", "Mazda 3", "Mazda 5", "Mazda 6", "CX-3", "CX-30", "CX-5", "CX-7", "MX-5", "Premacy", "CX-60", "CX-80", "CX-9", "MX-30", "323", "626", "RX-8", "RX-7", "MX-3", "Tribute", "MPV", "B2500", "BT-50", "Xedos 6", "Xedos 9"]
    },
    volvo: {
        name: "Volvo",
        path: "/volvo/",
        models: ["C30", "S40", "V40", "V50", "S60", "V60", "V70", "S80", "S90", "V90", "XC40", "XC60", "XC70", "XC90", "C70", "C40", "EX30", "EX90", "850", "740", "940", "960", "240", "440", "460", "480"]
    },
    dacia: {
        name: "Dacia",
        path: "/dacia/",
        models: ["Duster", "Sandero", "Logan", "Jogger", "Dokker", "Lodgy", "Spring", "1300", "1310", "Pick-up", "Bigster"]
    },
    seat: {
        name: "Seat / Cupra",
        path: "/seat/",
        models: ["Leon", "Ibiza", "Cordoba", "Altea", "Ateca", "Tarraco", "Arona", "Alhambra", "Toledo", "Formentor", "Cupra Born", "Cupra Tavascan", "Cupra Terramar", "Cupra Raval", "Exeo", "Mii", "Arosa", "Inca", "Marbella"]
    },
    fiat: {
        name: "Fiat",
        path: "/fiat/",
        models: ["Punto", "Panda", "500", "Tipo", "Bravo", "Stilo", "Doblo", "Fiorino", "Freemont", "Ducato", "Scudo", "Talento", "Multipla", "Ulysse", "Sedici", "Croma", "Idea", "Linea", "Seicento", "Marea", "Barchetta", "Strada", "126", "127", "128"]
    },
    honda: {
        name: "Honda",
        path: "/honda/",
        models: ["Civic", "Accord", "CR-V", "HR-V", "Jazz", "FR-V", "ZR-V", "Prelude", "CRX", "Del Sol", "S2000", "Integra", "Legend", "Stream", "Shuttle", "Insight", "Honda e", "Odyssey"]
    },
    suzuki: {
        name: "Suzuki",
        path: "/suzuki/",
        models: ["Swift", "Vitara", "SX4", "S-Cross", "Ignis", "Jimny", "Samurai", "SJ410", "SJ413", "Grand Vitara", "Baleno", "Splash", "Wagon R+", "Alto", "Celerio", "Liana", "Kizashi", "Across", "Swace"]
    },
    subaru: {
        name: "Subaru",
        path: "/subaru/",
        models: ["Outback", "Forester", "Impreza", "XV", "Legacy", "Levorg", "BRZ", "Tribeca", "Justy", "Libero", "SVX", "Baja", "Solterra"]
    },
    mitsubishi: {
        name: "Mitsubishi",
        path: "/mitsubishi/",
        models: ["Outlander", "ASX", "Lancer", "Colt", "Pajero", "L200", "Eclipse Cross", "Carisma", "Galant", "Grandis", "Space Star", "Space Wagon", "Space Runner", "3000GT", "Canter"]
    },
    nissan: {
        name: "Nissan",
        path: "/nissan/",
        models: ["Qashqai", "X-Trail", "Juke", "Micra", "Note", "Navara", "Pathfinder", "Leaf", "Patrol", "Terrano", "Primera", "Almera", "Sunny", "Maxima", "350Z", "370Z", "GT-R", "200SX", "Murano", "Pulsar", "Tiida", "Ariya", "Primastar", "Interstar", "Cabstar", "NV200", "NV300", "NV400", "Townstar"]
    },
    alfa: {
        name: "Alfa Romeo",
        path: "/alfa/",
        models: ["Giulietta", "Giulia", "Stelvio", "MiTo", "Brera", "147", "156", "159", "166", "GT", "GTV", "Spider", "145", "146", "164", "33", "75", "Tonale", "Junior"]
    },
    jeep: {
        name: "Jeep",
        path: "/jeep/",
        models: ["Renegade", "Compass", "Cherokee", "Grand Cherokee", "Wrangler", "Patriot", "Avenger", "Commander", "Gladiator", "Wagoneer"]
    },
    landrover: {
        name: "Land Rover",
        path: "/land-rover/",
        models: ["Defender", "Discovery", "Freelander", "Range Rover", "Range Rover Evoque", "Range Rover Sport", "Velar", "Discovery Sport"]
    },
    lexus: {
        name: "Lexus",
        path: "/lexus/",
        models: ["IS", "ES", "GS", "LS", "NX", "RX", "UX", "CT", "LC", "SC", "RC", "GX", "LX", "LBX", "RZ"]
    },
    porsche: {
        name: "Porsche",
        path: "/porsche/",
        models: ["911", "Boxster", "Cayman", "Cayenne", "Macan", "Panamera", "Taycan", "924", "944", "928", "968"]
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
        models: ["Aveo", "Captiva", "Camaro", "Corvette", "Cruze", "Lacetti", "Spark", "Orlando", "Trax", "Epica", "Evanda", "Malibu", "Matiz", "Kalos", "Tacuma", "Nubira", "HHR", "Tahoe", "Suburban", "Silverado", "Avalanche", "Blazer", "Astro", "Express"]
    },
    jaecoo: {
        name: "Jaecoo",
        path: "/jaecoo/",
        models: ["Jaecoo 5", "Jaecoo 6", "Jaecoo 7", "Jaecoo 8"]
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
        models: ["Korando", "Tivoli", "Musso", "Rexton", "Torres", "Actyon", "Kyron", "Rodius", "Musso Grand"]
    },
    chrysler: {
        name: "Chrysler",
        path: "/chrysler/",
        models: ["300C", "Voyager", "Grand Voyager", "PT Cruiser", "Pacifica", "Sebring", "Crossfire", "Stratus", "Neon", "LHS", "Concorde", "Town & Country"]
    },
    dodge: {
        name: "Dodge",
        path: "/dodge/",
        models: ["Journey", "Caliber", "Nitro", "Durango", "Charger", "Challenger", "RAM", "Magnum", "Avenger", "Viper", "Dakota"]
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
    },
    iveco: {
        name: "Iveco",
        path: "/iveco/",
        models: ["Daily", "Massif", "Eurocargo"]
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
        label: "Hybrid",
        regex: /(?<!\p{L})(hybrid|hybridn[ií]|phev|mhev)(?![\p{L}\p{N}])/iu
    },
    ev: {
        label: "Elektro",
        regex: /(?<!\p{L})(elektro|elektromobil\p{L}*|bev|e-tron|enyaq|id\.3|id\.4|id\.5|kona\s?(?:ev|electric))(?![\p{L}\p{N}])/iu
    }
};

// Modely, které se u žádné verze neprodávají se spalovacím motorem ani jako hybrid.
// U nich je palivo vždy Elektro (i když popis zmiňuje něco jiného, např. "16V" u baterie).
// Záměrně bez modelů s hybridní nebo spalovací verzí (Kona, Niro, Ioniq, MG ZS, Seal U, Mazda MX-30 ...).
const ELECTRIC_ONLY_REGEX = /(?<![\p{L}\p{N}])(tesla|model\s?[3sxy]|enyaq|elroq|epiq|id[\s.]?(?:3|4|5|7|buzz)|e-?tron|ev\s?6|e-?soul|ioniq\s?[56]|atto\s?[23]|dolphin|seal(?!\s?(?:u|5|6)(?![\p{L}\p{N}]))|sealion\s?7|leaf|ariya|zoe|bz4x|solterra|ex30|ex90|c40|dacia\s?spring|taycan|i-?pace|eq[abces]|eqv|zs\s?ev|cyberster|cupra\s?(?:born|tavascan)|polestar\s?(?:[2-5]|7)|aceman|honda\s?e|eletre|nio\s?(?:et[57]|ec6)|zeekr\s?(?:001|007|009|7x|x)|xpeng\s?(?:g6|g9|p7)|lexus\s?rz|smart\s?#[13])(?![\p{L}\p{N}])/iu;

// Slova typická pro inzeráty náhradních dílů, vraků nebo výkupu.
// Záměrně bez obecných slov (disky, pneu, rozprodám, překáží), která se objevují i u normálních prodejů aut.
const SPARE_PARTS_REGEX = /(?<![\p{L}\p{N}])(na náhradní díly|náhradní díly|veškeré díly|veškeré nd|prodám díly|pouze díly|díly z vozu|díly z tohoto|díly z vozidla|na nd|vraky? na nd|koupím|vykoupím|výkup)(?![\p{L}\p{N}])/iu;

// Díly a příslušenství poznané podle NADPISU inzerátu (nadpis bývá nejspolehlivější).
// Záměrně bez barev, obecných slov a názvů částí, které se běžně objevují i v popisech prodeje aut.
const PART_TITLE_REGEX = /(?<![\p{L}\p{N}])(disk(?:y|ů|u|es)?|kola|kolo|pneu\p{L}*|pneumatik\p{L}*|gumov\p{L}*|vana|vaničk\p{L}*|koberec|koberce|kobercu|kobercích|nosič\p{L}*|nosic\p{L}*|tažn\p{L}*|lišt\p{L}*|blatník\p{L}*|nárazník\p{L}*|zrcátk\p{L}*|reflektor\p{L}*|mřížk\p{L}*|výfuk\p{L}*|kotouč\p{L}*|destičk\p{L}*|potah\p{L}*|autorádi\p{L}*|navigac\p{L}*|kamer\p{L}*|senzor\p{L}*|střešní\s+box|airbag\p{L}*|kapot\p{L}*|chladič\p{L}*|turbo\p{L}*|převodov\p{L}*|startér\p{L}*|alternátor\p{L}*|katalyzátor\p{L}*|díl|díly|příslušenství|doplněk\p{L}*|prodám\s+(?:sadu|kola|disky)|sada\s+(?:kol|disk\p{L}*))(?![\p{L}\p{N}])/iu;

// ---- Alternativní označení modelů ----
// Hledání podle názvu zachytí i označení, která prodejci na Bazoši běžně píšou
// (E 320 = Třída E, 320d = Řada 3, W211 = Třída E, Yuan Plus = Atto 3, R56 = Mini Cooper ...).
// Vzory jsou psané pro normalizovaný text (malá písmena, bez diakritiky).
// Pokud má model záznam zde, použijí se JEN tyto vzory – proto obsahují i základní název.
// Označení, které patří více modelům téže značky (např. T5, Avant, Sportback), záměrně NEPŘIŘAZUJI,
// aby se inzerát nezobrazil u špatného modelu.

// Za číslem nesmí být další číslice (aby "E 220 000 km" nebylo E 220)
const MODEL_CODE_END = "(?!\\s?\\d{3}|[.,]\\d|\\p{N})";
// Kód nesmí být součástí většího čísla nebo desetinného čísla ("1.8v" není "8v")
const MODEL_CODE_PRE = "(?<![\\p{L}\\p{N}.,])";
// Kód nesmí pokračovat dalším písmenem nebo číslicí
const MODEL_WORD_END = "(?![\\p{L}\\p{N}])";

const modelCode = (src) => `${MODEL_CODE_PRE}(?:${src})${MODEL_WORD_END}`;
const modelNum = (src) => `${MODEL_CODE_PRE}(?:${src})${MODEL_CODE_END}`;
const bmwSeries = (n) => `(?:rada|serie)\\s?${n}${MODEL_CODE_END}`;

const MODEL_ALIASES = {
    // ŠKODA
    "Octavia": ["octavi[ae]", "oktavi[ae]", "oktavka", "laura", modelCode("1[uz]|5e|o[1-4]")],
    "Superb": ["superb", modelCode("3[tuv]|s[1-4]")],
    "Fabia": ["fabi[aei]", modelCode("6y|5j|nj|pj|f[1-4]")],
    "Kodiaq": ["kodia[kq]"],
    "Karoq": ["karo[qk]"],
    "Scala": ["scal[au]"],
    "Kamiq": ["kami[qk]"],
    "Rapid": ["rapid", "spaceback"],
    "Yeti": ["yeti", "yetti"],
    "Citigo": ["citi[\\s-]?go", "citigo-?e"],
    "Enyaq": ["enyaq", "enyaq\\s?iv"],
    "Roomster": ["roomster", "praktik"],
    "Felicia": ["felic[ie]a?", "felicii", "felda"],
    "Favorit": ["favorit[a]?", "forman"],

    // VOLKSWAGEN
    // Pozn.: T5/T6 jsou společné generace Transporteru, Multivanu a Caravelle – tyto modely se u T-označení překrývají
    "Golf": ["golf", modelCode("g[4-8]|mk[1-8]")],
    "Passat": ["passat[ua]?", "pasat", "alltrack", modelCode("b[5-9](?:\\.5)?")],
    "Tiguan": ["tiguan[au]?", "allspace"],
    "Touran": ["touran[ua]?", "crosstouran"],
    "Touareg": ["touare[gk][au]?", "tuareg"],
    "Polo": ["polo", "pola", "crosspolo", modelCode("6[nrc]|9n")],
    "Arteon": ["arteon", "shooting brake"],
    "Caddy": ["caddy", "caddy\\s?(?:maxi|life)", "kasten"],
    "Sharan": ["sharan[a]?"],
    "Transporter": ["transporter", "doka", `t[3-7](?:[.\\s]?\\d)?${MODEL_CODE_END}`],
    "Multivan": ["multivan[a]?", `t[4-7](?:[.\\s]?\\d)?${MODEL_CODE_END}`],
    "Caravelle": ["caravel+[ae]", `t[4-6](?:[.\\s]?\\d)?${MODEL_CODE_END}`],
    "Up!": ["up!?(?!\\p{L})", "e-?up!?(?!\\p{L})"],
    "Scirocco": ["scirocc[oa]", "sirocco"],
    "ID. Buzz": ["id\\.?\\s?buzz", "idbuzz"],
    "T-Roc": ["t[\\s-]?roc"],
    "T-Cross": ["t[\\s-]?cross"],
    "Amarok": ["amarok[a]?"],
    "Crafter": ["crafter[a]?"],

    // AUDI (S / RS verze stejného modelu; Avant, Sportback, allroad nepřiřazuji – patří více modelům)
    "A3": ["a3", "s3", "rs3", modelCode("8[lpvy]")],
    "A4": ["a4", "s4", "rs4", modelCode("b[5-9]")],
    "A5": ["a5", "s5", "rs5"],
    "A6": ["a6", "s6", "rs6", modelCode("c[4-8]|4[fgk]")],
    "A7": ["a7", "s7", "rs7"],
    "A8": ["a8", "s8", "rs8", "a8l", modelCode("d[2-5]")],
    "Q2": ["q2", "sq2"],
    "Q3": ["q3", "sq3", "rsq3"],
    "Q5": ["q5", "sq5", "rsq5"],
    "Q7": ["q7", "sq7", "rsq7", modelCode("4l")],
    "Q8": ["q8", "sq8", "rsq8", modelCode("4m")],
    "TT": ["tt(?:s|rs)?(?!\\p{L})", modelCode("8[njs]")],
    "e-tron": ["(?<!q[48]\\s?)e-?tron"],

    // BMW
    // Generace s vlastním záznamem v seznamu (E36, E39, E46, E60, E61, E90, E91, F10, F11, F30, F31, G20, G30) řadě nepřiřazuji,
    // aby jedno označení nepatřilo dvěma modelům.
    "Řada 1": [bmwSeries(1), "1er", modelCode("1[1-4]\\d\\s?(?:xd|[idx])"), modelCode("m1\\d{2}i"), modelCode("e8[1278]|f2[01]|f40")],
    "Řada 3": [bmwSeries(3), modelCode("3[1-5]\\d\\s?(?:xd|tds|[idxe])"), "m3", modelCode("m3\\d{2}i"), modelCode("e30|e92|e93|f34|g21")],
    "Řada 5": [bmwSeries(5), modelCode("5[1-4]\\d\\s?(?:xd|tds|[idx])"), "m5", modelCode("m5\\d{2}[dix]"), modelCode("e28|e34|f07|g31")],
    "Řada 7": [bmwSeries(7), modelCode("7[2-6]\\d\\s?(?:ld|tds|[idx])"), modelCode("e3[28]|e6[56]|f0[12]|g1[12]|g70")],
    "X1": ["x1", modelCode("e84|f48|u11")],
    "X3": ["x3", "x3m", modelCode("e83|f25|g01|g45")],
    "X5": ["x5", "x5m", modelCode("e53|e70|f15|g05")],
    "X6": ["x6", "x6m", modelCode("e71|f16|g06")],

    // MERCEDES-BENZ
    // Třída C vylučuje kódy karoserií jiných modelů (CLA 117/118, CLS 218/219/257, GLC 253, GLE 292), Třída S vylučuje S 204/205/211–213
    "Třída A": ["trida\\s?a(?!\\p{L})", "a-?class", modelNum("a\\s?\\d{2,3}"), modelCode("w1(?:68|69|76|77)")],
    "Třída B": ["trida\\s?b(?!\\p{L})", "b-?class", modelNum("b\\s?\\d{2,3}"), modelCode("w24[567]")],
    "Třída C": ["trida\\s?c(?!\\p{L})", "c-?class", modelNum("c\\s?(?!11[78]|21[89]|25[37]|29[23])\\d{2,3}"), modelCode("w20[2-6]"), modelCode("s20[45]")],
    "Třída E": ["trida\\s?e(?!\\p{L})", "e-?class", modelNum("e\\s?\\d{2,3}"), modelCode("w12[4]|w21[0-4]|s21[123]")],
    "Třída S": ["trida\\s?s(?!\\p{L})", "s-?class", "mamut", modelNum("s\\s?(?!20[45]|21[123])\\d{2,3}"), modelCode("w14[02]|w22[0-3]")],
    "Třída V": ["trida\\s?v(?!\\p{L})", "v-?class", modelNum("v\\s?\\d{3}")],
    "CLA": ["cla(?!\\p{L})", "shooting brake", modelCode("c11[78]|x11[78]")],
    "CLS": ["cls(?!\\p{L})", modelCode("w21[89]|c21[89]|w257|c257")],
    "GLA": ["gla(?!\\p{L})", modelCode("x156|h247")],
    "GLC": ["glc(?!\\p{L})", modelCode("x25[34]|c25[34]")],
    "GLE": ["gle(?!\\p{L})", modelCode("w16[67]|c292")],
    "GLS": ["gls(?!\\p{L})", modelCode("x16[4-7]")],
    "ML": [`ml\\s?\\d{2,3}${MODEL_CODE_END}`, modelCode("w16[34]")],
    "SLK": ["slk(?!\\p{L})", "slc(?!\\p{L})", modelCode("r17[012]")],
    "Vito": ["vito", "vita", "mixto", modelCode("w638|w447|w639|1(?:08|10|11|14|15|16|19)\\s?cdi|1(?:08|10)d")],
    // Pozn.: W639 je u Vito i Viana (stejný podvozek) – překryv je záměrný a nelze ho odstranit
    "Viano": ["viano", "viana", modelCode("w639")],
    "Sprinter": ["sprinter[a]?", modelCode("w90[367]"), modelNum("(?:208|211|213|311|313|315|316|318|319)\\s?cdi|208d")],

    // FORD (MK generace a Custom/Connect/Courier vynechány – patří více modelům)
    "Focus": ["focus[eu]?", "fokus"],
    "Mondeo": ["mondea?[a]?"],
    "Fiesta": ["fiest[au]"],
    "Kuga": ["kug[au]"],
    "S-Max": ["s[\\s-]?max[e]?"],
    "C-Max": ["c[\\s-]?max", "grand\\s?c[\\s-]?max"],
    "B-Max": ["b[\\s-]?max"],
    "Galaxy": ["galax[iy]"],
    "Fusion": ["fusion[a]?"],
    "Puma": ["pum[aiuy]"],
    "Ranger": ["ranger[a]?", "wildtrak", "raptor"],
    "Mustang": ["mustang[a]?", "mach[\\s-]?1"],
    "Transit": ["transit[a]?", "tranzit"],
    "Tourneo": ["tourne[oa]"],

    // HYUNDAI
    "i30": ["i[\\s]?30"],
    "i20": ["i[\\s]?20"],
    "i10": ["i[\\s]?10"],
    "i40": ["i[\\s]?40"],
    "Tucson": ["tucson[u]?", "tukson"],
    "Santa Fe": ["santa[\\s-]?fe[a]?"],
    "Kona": ["kon[ayu]", "kona\\s?electric"],
    "ix35": ["ix[\\s]?35"],
    "ix20": ["ix[\\s]?20"],
    "Getz": ["getz[e]?"],
    "Accent": ["accent[a]?"],
    "Ioniq": ["ioniq"],

    // KIA (Ceed bez XCeed a ProCeed; "x ceed", "x-ceed", "pro_cee'd", "proceed" patří jiným modelům)
    "Ceed": ["(?<!x[\\s-]?)(?<!pro[\\s_-]?)(?<![\\p{L}\\p{N}_-])cee['’´]?d", "ceed\\s?sw", "sportswagon"],
    "XCeed": ["x[\\s-]?cee['’´]?d"],
    "Proceed": ["pro[\\s_-]?cee['’´]?d"],
    "Sportage": ["sportag[ae]", "sportaz"],
    "Sorento": ["sorent[ao]"],
    "Rio": ["rio", "ria"],
    "Picanto": ["picant[oa]", "pikanto"],
    "Venga": ["veng[au]"],
    "Niro": ["niro", "e-niro"],
    "EV6": ["ev[\\s-]?6"],

    // TOYOTA (Corolla a Avensis bez "Verso"; Verso bez Proace a Yaris Verso se nepřiřazuje)
    "Corolla": ["corol+[au]?(?!\\s?verso)", "korola", modelCode("e1[125]")],
    "Yaris": ["yaris[e]?", "gr\\s?yaris", "yaris\\s?cross"],
    "Auris": ["auris[e]?"],
    "RAV4": ["rav[\\s-]?4", "ravka"],
    "Avensis": ["avensis(?!\\s?verso)[e]?", modelCode("t2[257]")],
    "Aygo": ["aygo", "ayga"],
    "C-HR": ["c[\\s-]?hr"],
    "Verso": ["(?<!proace\\s)verso"],
    "Prius": ["prius[e]?", "prius\\+"],
    "Proace": ["proace(?:\\s?(?:city|verso))?"],
    "Hilux": ["hilux[e]?", "hi[\\s-]?lux"],
    "Land Cruiser": ["land[\\s-]?cruiser", "prado", modelNum("lc\\s?\\d{2,3}")],

    // PEUGEOT (číselné modely řeší kód; Expert a Bipper zatím nejsou v seznamu)
    "Partner": ["partner[a]?", "tepee", "teepee"],
    "Rifter": ["rifter[a]?"],
    "Boxer": ["boxer[a]?", modelCode("l[1-4]h[1-3]")],
    "Traveller": ["traveller[a]?"],

    // RENAULT (Grandtour, RS, CC, Coupe, Cabrio a Scénic u Megane vynechány – patří jiným modelům)
    "Clio": ["clio", "clia", "klio", "storia"],
    "Megane": ["megan[ae]"],
    "Laguna": ["lagun[au]"],
    "Talisman": ["talisman[a]?"],
    "Thalia": ["thali[ie]"],
    "Twingo": ["twing[ao]"],
    "Captur": ["captur[a]?", "kaptur"],
    "Kadjar": ["kadjar[a]?"],
    "Arkana": ["arkan[au]"],
    "Scenic": ["sc[eé]nic[a]?", "grand\\s?scenic", "rx4"],
    "Espace": ["espace"],
    "Kangoo": ["kango[o]?", "kangoo\\s?express"],
    "Trafic": ["traf[ií]c[a]?", "traffic"],
    "Master": ["master[a]?"],

    // CITROËN (C4 bez Picasso a SpaceTourer; Jumpy bez SpaceTourer)
    "C1": ["c1(?!\\p{N})"],
    "C2": ["c2(?!\\p{N})"],
    "C3": ["c3(?!\\p{N})", "c3\\s?(?:picasso|aircross)"],
    "C4": ["c4(?!\\s?(?:grand\\s?)?picasso|\\s?spacetourer)(?!\\p{N})", "c4\\s?(?:cactus|x)"],
    "C5": ["c5(?!\\p{N})", "c5\\s?(?:aircross|x)"],
    "C4 Picasso": ["c4\\s?(?:grand\\s?)?picasso"],
    "Berlingo": ["berling[oa]", "multispace"],
    "Xsara": ["xsar[au](?:\\s?picasso)?"],
    "Jumper": ["jumper[a]?"],
    "Jumpy": ["jumpy"],
    "SpaceTourer": ["space[\\s-]?tourer"],

    // OPEL (Caravan, Sports Tourer, OPC, Life, Tour, GTS nepřiřazuji – patří více modelům)
    "Astra": ["astr[au]", "gtc", "twintop", "bertone"],
    "Insignia": ["insigni[ie]", "country\\s?tourer"],
    "Vectra": ["vectr[au]"],
    "Zafira": ["zafir[au]"],
    "Meriva": ["meriv[au]"],
    "Mokka": ["mokk[au]", "mokka[\\s-]?[xe]"],
    "Combo": ["combo[a]?", "comba"],
    "Vivaro": ["vivar[ao]"],
    "Movano": ["movan[ao]"],
    "Corsa": ["corsa", "corsu"],
    "Crossland": ["crosslan[dx]"],
    "Grandland": ["grandlan[dx]"],

    // MAZDA (BK/BL/BM apod. jsou kódy generací; MPS a Wagon nepřiřazuji – patří více modelům)
    "Mazda 2": ["mazda[\\s-]?2", "demio"],
    "Mazda 3": ["mazda[\\s-]?3", modelCode("bk|bl|bm|bn|bp")],
    "Mazda 5": ["mazda[\\s-]?5", modelCode("cr|cw")],
    "Mazda 6": ["mazda[\\s-]?6", modelCode("g[gyhjl]")],
    "MX-5": ["mx[\\s-]?5", "miata", modelCode("n[abcd]")],

    // SEAT / CUPRA
    "Leon": ["leon[a]?", "cupra\\s?leon", modelCode("1[mp]|5f|kl")],
    "Ibiza": ["ibiz[aeu]", modelCode("6[kljp]|kj")],
    "Cordoba": ["cordob[au]", "vario"],
    "Altea": ["altea?u?", "altea\\s?xl", "freetrack"],
    "Ateca": ["atec[au]", "cupra\\s?ateca"],
    "Tarraco": ["tarrac[oa]"],
    "Arona": ["aron[au]"],
    "Alhambra": ["alhambr[au]"],
    "Toledo": ["toled[oa]"],
    "Formentor": ["formentor[a]?", "cupra\\s?formentor"],
    "Cupra Born": ["born"],
    "Cupra Tavascan": ["tavascan"],
    "Cupra Terramar": ["terramar"],
    "Cupra Raval": ["raval"],

    // FIAT (500 bez částek)
    "500": [`500${MODEL_CODE_END}`, "cinquecento"],
    "Punto": ["punt[oa]", "grande\\s?punto"],
    "Panda": ["pand[au]"],
    "Tipo": ["tip[ao]"],
    "Bravo": ["bravo[a]?", "brava"],
    "Stilo": ["stil[oa]", "multiwagon"],
    "Doblo": ["doblo[a]?", "dobla", "doblo\\s?cargo"],
    "Fiorino": ["fiorin[oa]", "qubo"],
    "Freemont": ["freemont[a]?"],
    "Ducato": ["ducat[oa]", modelCode("l[1-4]h[1-3]")],

    // HONDA (Civic 6G–8G a Accord 6G–8G se překrývají – Civic 6G–8G nepřiřazuji; Tourer nepřiřazuji)
    "Civic": ["civic[a]?", "ufo", "type[\\s-]?r", "aerodeck", modelCode("5g|9g|10g|11g|eg|ek|ep3|fn2|fk2|fk8")],
    "Accord": ["accord[a]?", "type[\\s-]?s", modelCode("6g|7g|8g")],
    "CR-V": ["cr[\\s-]?v"],
    "HR-V": ["hr[\\s-]?v"],
    "Jazz": ["jazz"],

    // SUZUKI (SX4 bez S-Cross)
    "Swift": ["swift[a]?"],
    "Vitara": ["(?<!grand\\s?)vitar[au]", "xl[\\s-]?7"],
    "SX4": ["sx[\\s-]?4(?!\\s?s[\\s-]?cross)"],
    "S-Cross": ["s[\\s-]?cross"],
    "Ignis": ["ignis[e]?"],
    "Jimny": ["jimn[yi]"],

    // SUBARU
    "Outback": ["outback[a]?"],
    "Forester": ["forest[ea]?r[a]?", modelCode("s[fghjk]")],
    "Impreza": ["imprez[au]", "wrx", "sti"],
    "XV": ["xv", "crosstrek"],
    "Legacy": ["legac[yi]", "spec\\s?b"],

    // MITSUBISHI
    "Outlander": ["outlander[a]?"],
    "ASX": ["asx"],
    "Lancer": ["lancer[a]?", "evo", "evolution"],
    "Colt": ["colt[a]?", modelCode("cz3|czt")],
    "Pajero": ["pajer[oa]", "pinin"],
    "L200": ["l[\\s-]?200"],
    "Eclipse Cross": ["eclipse(?:[\\s-]?cross)?"],

    // NISSAN
    "Qashqai": ["qashqai[e]?", "kaskaj"],
    "X-Trail": ["x[\\s-]?trail[a]?", "xtrail"],
    "Juke": ["juke", "nismo"],
    "Micra": ["micr[au]", modelCode("k1[1-4]")],
    "Navara": ["navar[au]", modelCode("d22|d40"), "np300"],
    "Pathfinder": ["pathfinder[a]?", modelCode("r51")],
    "Leaf": ["leaf[a]?"],

    // JEEP (Cherokee bez Grand Cherokee)
    "Cherokee": ["(?<!grand\\s?)cherokee", modelCode("xj|kj|kk|kl")],
    "Grand Cherokee": ["grand\\s?cherokee", modelCode("wk2?|wj|zj|wh")],
    "Wrangler": ["wrangler[a]?", modelCode("yj|tj|jk|jl")],

    // LAND ROVER (Range Rover bez Evoque/Sport/Velar; Discovery bez Sport)
    "Discovery": ["discovery(?!\\s?sport)", "disco(?![\\p{L}\\p{N}])"],
    "Discovery Sport": ["discovery\\s?sport"],
    "Range Rover": ["range\\s?rover(?!\\s?(?:evoque|sport|velar))", "vogue", "autobiography", modelCode("l322|l405|p38")],

    // LEXUS (označení s číslem, aby zkratky nesedly na běžná slova)
    "IS": [modelNum("is\\s?\\d{3}")],
    "ES": [modelNum("es\\s?\\d{3}")],
    "GS": [modelNum("gs\\s?\\d{3}")],
    "LS": [modelNum("ls\\s?\\d{3}")],
    "NX": [modelNum("nx\\s?\\d{3}")],
    "RX": [modelNum("rx\\s?\\d{3}")],
    "UX": [modelNum("ux\\s?\\d{3}")],
    "CT": [modelNum("ct\\s?\\d{3}")],
    "LC": [modelNum("lc\\s?\\d{3}")],

    // PORSCHE (987 a 981 sdílí Boxster i Cayman – nepřiřazuji)
    "911": ["911", "carrera", "targa", "gt3", "gt2", modelCode("99[1-7]|964|993")],
    "Boxster": ["boxster", modelCode("986"), "718\\s?boxster"],
    "Cayman": ["cayman", "718\\s?cayman"],
    "Cayenne": ["cayenne", modelCode("955|957|958")],

    // MINI (Cooper R50/R53/R56 a F55/F56; Clubman R55/F54; Cabrio R52/R57; Countryman R60/F60; Paceman R61)
    "Cooper": ["cooper(?!\\s?(?:countryman|clubman|cabrio))", "jcw", "john\\s?cooper", modelCode("r5[036]|f5[56]")],
    "Countryman": ["countryman", modelCode("r60|f60")],
    "Clubman": ["clubman", modelCode("r55|f54")],
    "Paceman": ["paceman", modelCode("r61")],
    "Cabrio": ["cabrio", modelCode("r52|r57")],

    // CHRYSLER
    "Voyager": ["(?<!grand\\s?)voyager"],
    "Grand Voyager": ["grand\\s?voyager"],

    // TESLA
    "Model 3": ["model\\s?3", "m3"],
    "Model Y": ["model\\s?y", "juniper"],
    "Model S": ["model\\s?s", modelCode("p85|p90d|p100d|75d|85d|90d|100d")],
    "Model X": ["model\\s?x"],

    // BYD (Atto 3 bez EVO; Dolphin bez Surf a G; Seal bez U, 5, 6 a bez Sealion)
    "Atto 3": ["atto[\\s.-]?3(?!\\s?evo)", "yuan[\\s.-]?plus"],
    "Dolphin": ["dolphin(?![\\p{L}])(?!\\s?(?:surf|g)\\b)"],
    "Seal": ["seal(?![\\p{L}])(?!\\s?(?:u|5|6)\\b)"],
    "Seal U": ["seal\\s?u\\b"],
    "ZS": ["zs(?![\\p{L}\\p{N}]|\\s?ev(?![\\p{L}\\p{N}]))"],
    "ZS EV": ["zs\\s?ev(?![\\p{L}\\p{N}])"],

    // XPENG
    "P7": ["p7(?!\\+)"],

    // LYNK & CO (zápis "Lynk&Co 03", "lynk co 3" ...)
    ...Object.fromEntries(
        ["01", "02", "03", "05", "06", "08", "09"].map((n) => [
            `Lynk & Co ${n}`,
            [`lynk[\\s&.-]*co[\\s.-]*0?${Number(n)}${MODEL_CODE_END}`],
        ])
    ),

    // JAECOO / OMODA (označení J7, O5 ...)
    "Jaecoo 5": ["jaecoo[\\s.-]?5", "j5(?!\\p{N})"],
    "Jaecoo 6": ["jaecoo[\\s.-]?6", "j6(?!\\p{N})"],
    "Jaecoo 7": ["jaecoo[\\s.-]?7", "j7(?!\\p{N})"],
    "Jaecoo 8": ["jaecoo[\\s.-]?8", "j8(?!\\p{N})"],
    "Omoda 4": ["omoda[\\s.-]?4", "o4(?!\\p{N})"],
    "Omoda 5": ["omoda[\\s.-]?5", "o5(?!\\p{N})"],
    "Omoda 7": ["omoda[\\s.-]?7", "o7(?!\\p{N})"],
    "Omoda 9": ["omoda[\\s.-]?9", "o9(?!\\p{N})"],
    "Omoda C5": ["omoda[\\s.-]?c5"],

    // LADA (kódy karoserií)
    "Niva": ["niva", "2121", "21214"],
    "Samara": ["samara", modelNum("210[89]"), modelNum("211[345]")],
    "Kalina": ["kalina", modelNum("111[789]")],
    "Priora": ["priora", modelNum("217[012]")],
    "Granta": ["granta", modelNum("219[012]")],
    "Vesta": ["vesta", modelNum("218[0-2]")],

    // DACIA
    "Duster": ["duster[a]?"],
    "Sandero": ["sandero[a]?", "sandera", "stepway"],
    "Logan": ["logan[a]?", "mcv"],
    "Jogger": ["jogger[a]?"],
    "Dokker": ["dokker[a]?"],
    "Lodgy": ["lodgy"],
    "Spring": ["spring"],
    "100": ["erko", modelNum("100")],
    "110": [modelNum("110r?"), "erko"],
    "120": [modelNum("120l?"), "garde"],
    "190": [modelNum("190[de]?(?:\\s?e)?"), modelCode("w201")],
    "Beetle": ["beetle", "brouk"],
    "LT": [modelCode("lt\\s?(?:28|35|46)")],
    "Q4": ["q4(?![\\p{L}\\p{N}])", "q4\\s?e-?tron"],
    "Řada 2": [bmwSeries(2), modelCode("2[1-4]\\d\\s?(?:d|i|xd|ci|tds)"), modelCode("f2[23]|f4[56]|g42|m2")],
    "Řada 4": [bmwSeries(4), modelCode("4[1-4]\\d\\s?(?:d|i|xd|ci)"), modelCode("f3[236]|g2[23]|m4")],
    "Řada 6": [bmwSeries(6), modelCode("6[3-5]\\d\\s?(?:ci|i|d|xd)"), modelCode("e6[34]|f06|f1[23]|g32")],
    "Řada 8": [bmwSeries(8), modelCode("8[345]\\d\\s?(?:d|i|ci)"), modelCode("m?850i|m8|e31|g1[456]")],
    "X2": ["x2(?![\\p{L}\\p{N}])", modelCode("f39")],
    "X4": ["x4", "x4m", modelCode("f26|g02")],
    "X7": ["x7", modelCode("g07")],
    "Z4": ["z4", modelCode("e85|e89|g29")],
    "i3": ["i3(?![\\p{L}\\p{N}])", modelCode("i01")],
    "i4": ["i4(?![\\p{L}\\p{N}])", modelCode("g26")],
    "iX": ["ix(?![\\p{L}\\p{N}])", modelCode("i20")],
    "iX3": ["ix3", modelCode("g08")],
    "Třída G": ["trida\\s?g(?![\\p{L}])", "g-?class", modelNum("g\\s?\\d{3}d?"), modelCode("w46[13]|g\\s?(?:55|63)")],
    "GLK": ["glk(?![\\p{L}\\p{N}])", modelCode("x204")],
    "GLB": ["glb(?![\\p{L}\\p{N}])", modelCode("x247")],
    "CLK": ["clk(?![\\p{L}\\p{N}])", modelCode("w20[89]|c209")],
    "Třída R": ["trida\\s?r(?![\\p{L}])", "r-?class", modelNum("r\\s?\\d{3}"), modelCode("w251|v251")],
    "SL": ["sl-?class", modelNum("sl\\s?\\d{3}"), modelCode("r129|r230|r231")],
    "CL": ["cl-?class", modelNum("cl\\s?\\d{3}"), modelCode("c215|c216")],
    "Ka": ["ka(?![\\p{L}\\p{N}]|\\+)"],
    "H-1": ["h[\\s-]?1(?![\\p{L}\\p{N}])", "starex"],
    "Honda e": ["honda\\s?e(?![\\p{L}\\p{N}])"],
    "Musso": ["musso(?!\\s?grand)(?![\\p{L}\\p{N}])"],
    "Soul": ["(?<!e[\\s-]?)soul(?![\\p{L}\\p{N}])"],
};
