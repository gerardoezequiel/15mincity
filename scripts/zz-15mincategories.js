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

export const townCenters = {
  Barking: [0.0816, 51.5391],
  Barnes: [-0.2429, 51.4778],
  Bromley: [0.0166, 51.4059],
  Croydon: [-0.0936, 51.3714],
  Ealing: [-0.3083, 51.513],
  Enfield: [-0.08, 51.6523],
  Greenwich: [0.0, 51.4767],
  Hackney: [-0.0554, 51.545],
  Hammersmith: [-0.2234, 51.4927],
  Harrow: [-0.3363, 51.5806],
  Havering: [0.1837, 51.5812],
  Hillingdon: [-0.476, 51.5425],
  Hounslow: [-0.3419, 51.4715],
  Islington: [-0.1002, 51.5465],
  Kensington: [-0.1872, 51.502],
  "Kingston upon Thames": [-0.3078, 51.4123],
  Lambeth: [-0.1172, 51.5013],
  Lewisham: [-0.018, 51.4452],
  Merton: [-0.1881, 51.4109],
  Newham: [0.0469, 51.5255],
  Redbridge: [0.0693, 51.559],
  "Richmond upon Thames": [-0.3007, 51.4479],
  Southwark: [-0.08, 51.5035],
  Sutton: [-0.191, 51.3618],
  "Tower Hamlets": [-0.02, 51.5099],
  "Waltham Forest": [-0.0059, 51.5908],
  Wandsworth: [-0.191, 51.4563],
  Westminster: [-0.147, 51.4973],
};
