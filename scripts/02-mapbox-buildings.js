/*import {
  buildingTypeCategories,
  categoryColors,
} from "./zz-15mincategories.js";*/

const buildingTypeCategories = {
  apartments: "Living",
  farm: "Working",
  hotel: "Living",
  house: "Living",
  detached: "Living",
  residential: "Living",
  dormitory: "Living",
  terrace: "Living",
  houseboat: "Living",
  bungalow: "Living",
  cabin: "Living",
  commercial: "Working",
  office: "Working",
  industrial: "Working",
  retail: "Commerce",
  supermarket: "Commerce",
  warehouse: "Working",
  kiosk: "Commerce",
  //religious: "Entertainment",
  //cathedral: "Entertainment",
  //temple: "Entertainment",
  //chapel: "Entertainment",
  //church: "Entertainment",
  //mosque: "Entertainment",
  //synagogue: "Entertainment",
  //shrine: "Entertainment",
  civic: "Entertainment",
  government: "Working",
  hospital: "Healthcare",
  school: "Education",
  transportation: "Entertainment",
  stadium: "Entertainment",
  train_station: "Entertainment",
  university: "Education",
  grandstand: "Entertainment",
  public: "Living",
  barn: "Working",
  bridge: "Entertainment",
  bunker: "Working",
  carport: "Working",
  conservatory: "Entertainment",
  construction: "Working",
  garage: "Working",
  garages: "Working",
  farm_auxiliary: "Working",
  garbage_shed: "Working",
  greenhouse: "Working",
  hangar: "Working",
  hut: "Living",
  pavilion: "Entertainment",
  parking: "Living",
  roof: "Living",
  sports_hall: "Entertainment",
  shed: "Working",
  stable: "Working",
  service: "Working",
  ruins: "Entertainment",
  //transformer_tower: "Working",
  //water_tower: "Working",
};

const categoryColors = {
  Living: "rgba(230, 97, 1, 0.4)", // Orange
  Working: "rgba(43, 61, 159, 0.4)", // Deep Blue
  Commerce: "rgba(129, 199, 132, 0.4)", // Soft Green
  Entertainment: "rgba(255, 214, 0, 0.4)", // Yellow
  Healthcare: "rgba(211, 47, 47, 0.4)", // Red
  Education: "rgba(149, 117, 205, 0.4)", // Purple
  Unknown: "rgba(189, 189, 189, 0.4)", // Gray
};

export function addMapboxBuildings3D(map, isochrone) {
  map.addSource("osm-data", {
    type: "vector",
    url: "mapbox://mapbox.mapbox-streets-v8",
  });

  // Add 3D buildings layer
  map.addLayer({
    id: "3D Buildings",
    type: "fill-extrusion",
    source: "osm-data",
    "source-layer": "building",
    minzoom: 10,
    paint: {
      "fill-extrusion-color": [
        "match",
        ["get", "type"],
        ...Object.entries(buildingTypeCategories).flatMap(
          ([type, category]) => [type, categoryColors[category]]
        ),
        categoryColors["Unknown"],
      ],
      "fill-extrusion-height": ["get", "height"],
      "fill-extrusion-base": ["get", "min_height"],
      "fill-extrusion-opacity": 0.9,
    },
  });

  // Fly-to animation
  map.on("click", (e) => {
    map.flyTo({ center: e.lngLat, zoom: 14, speed: 1.5 });

    // Query the building layer to get features at the click point
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["3D Buildings"],
    });

    if (features.length > 0) {
      // Get the first feature's building type and name
      const type = features[0].properties.type || "unknown";
      const name = features[0].properties.name || "unnamed";
      const category = buildingTypeCategories[type] || "Unknown";

      // Create a popup with the building type and essential activity
      const popup = new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(
          `<strong>Building type:</strong> ${type}</br><strong>Essential Activity:</strong> ${category}`
        )
        .addTo(map);
    }
  });

}
