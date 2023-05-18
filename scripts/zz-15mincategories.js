export const poiCategories = {
  Mobility: {
    bus_stop: { osmTag: "highway=bus_stop", maki: "bus" },
    tram_stop: { osmTag: "railway=tram_stop", maki: "rail-light" },
    underground: { osmTag: "railway=subway_entrance", maki: "rail-metro" },
    train_station: { osmTag: "railway=station", maki: "rail" },
    bike_rental: { osmTag: "amenity=bicycle_rental", maki: "bicycle" },
  },
  Commerce: {
    shop: { osmTag: "shop=convenience", maki: "shop" },
    supermarket: { osmTag: "shop=supermarket", maki: "grocery" },
    drugstore: { osmTag: "shop=chemist", maki: "pharmacy" },
    deli: { osmTag: "shop=deli", maki: "restaurant" },
    bakery: { osmTag: "shop=bakery", maki: "bakery" },
    post_office: { osmTag: "amenity=post_office", maki: "post" },
  },
  Healthcare: {
    hospital: { osmTag: "amenity=hospital", maki: "hospital" },
    doctors_office: { osmTag: "amenity=doctors", maki: "doctor" },
    pharmacy: { osmTag: "amenity=pharmacy", maki: "pharmacy" },
  },
  Education: {
    university: { osmTag: "amenity=university", maki: "college" },
    school: { osmTag: "amenity=school", maki: "school" },
    kindergarten: { osmTag: "amenity=kindergarten", maki: "school" },
    library: { osmTag: "amenity=library", maki: "library" },
  },
  Entertainment: {
    sports_facility: {
      osmTag: "leisure=sports_centre",
      maki: "fitness-centre",
    },
    cinema: { osmTag: "amenity=cinema", maki: "cinema" },
    theater: { osmTag: "amenity=theatre", maki: "theatre" },
    park: { osmTag: "leisure=park", maki: "park" },
    playground: { osmTag: "leisure=playground", maki: "playground" },
    recreational_area: {
      osmTag: "leisure=recreation_ground",
      maki: "picnic-site",
    },
  },
};

export const buildingTypeCategories = {
  Living: ["residential", "apartments", "house", "dormitory", "terrace"],
  Working: ["office", "industrial", "warehouse", "farm", "farm_auxiliary"],
  Commerce: ["supermarket", "bakery", "deli", "kiosk", "market"],
  Entertainment: ["cinema", "theatre", "park", "playground", "sports_centre"],
  Healthcare: ["hospital", "clinic", "doctors", "dentist", "pharmacy"],
  Education: ["university", "school", "library", "college", "kindergarten"],
  Mobility: ["bus_station", "subway_entrance", "tram_stop", "bike_parking"],
};

export const categoryColors = {
  Living: "rgb(230, 97, 1)", // Orange
  Working: "rgb(43, 61, 159)", // Deep Blue
  Commerce: "rgb(129, 199, 132)", // Soft Green
  Entertainment: "rgb(255, 214, 0)", // Yellow
  Healthcare: "rgb(211, 47, 47)", // Red
  Education: "rgb(149, 117, 205)", // Purple
  Mobility: "rgb(30, 136, 229)", // Blue
  Unknown: "rgb(189, 189, 189)", // Gray
};

export const wardCoordinates = {
  Lavender: [-0.1506, 51.4615],
  Balham: [-0.1522, 51.4452],
  "Clapham Common & Abbeville": [-0.147, 51.4546],
  "South Balham": [-0.1526, 51.4409],
  "St Katharine's & Wapping": [-0.0599, 51.5067],
  Northcote: [-0.168, 51.4558],
  Thamesfield: [-0.2143, 51.461],
  Southfields: [-0.199, 51.4425],
  "Streatham Hill West & Thornton": [-0.124, 51.4366],
  Trinity: [-0.1212, 51.4333],
  "Wimbledon Town & Dundonald": [-0.2064, 51.4215],
  Hillside: [-0.2915, 51.5539],
  Belsize: [-0.1675, 51.5465],
  "Goose Green": [-0.0731, 51.4581],
  "Royal Victoria": [0.0174, 51.5072],
  Limehouse: [-0.0395, 51.5125],
  "Stratford Olympic Park": [-0.0145, 51.5432],
  "Greenwich Peninsula": [0.0056, 51.4975],
  "Wandsworth Town": [-0.1878, 51.4615],
  "Surrey Docks": [-0.0307, 51.4951],
  "East Putney": [-0.2093, 51.4594],
};