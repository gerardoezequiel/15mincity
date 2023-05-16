// Import categories and colors
import { poiCategories, categoryColors } from "./zz-15mincategories.js";

// Create a flattened structure for easy access
let flattenedPOICategories = {};
Object.keys(poiCategories).forEach((category) => {
  Object.keys(poiCategories[category]).forEach((poi) => {
    flattenedPOICategories[poi] = {
      category: category,
      icon: `${poiCategories[category][poi].maki}`,
    };
  });
});

const poiColors = {
  ...categoryColors,
  Unknown: "rgba(189, 189, 189, 0.8)",
};

function getIconImage() {
  return [
    "match",
    ["get", "maki"],
    ...Object.entries(flattenedPOICategories).flatMap(([poi, { icon }]) => [
      poi,
      icon || "",
    ]),
    "",
  ];
}

function getTextField() {
  return [
    "match",
    ["get", "maki"],
    ...Object.keys(flattenedPOICategories).flatMap((poi) => [
      poi,
      ["get", "name"],
    ]),
    "",
  ];
}

export function addMapboxPOIs(map, isochrones = []) {
  const sourceId = "mapbox-poi";

  if (!map.getSource(sourceId)) {
    map.addSource(sourceId, {
      type: "vector",
      url: "mapbox://mapbox.mapbox-streets-v8",
    });
  }

  isochrones.forEach((isochrone, index) => {
    const currentLayerId = `Mapbox-POI-${index}`;

    if (!map.getLayer(currentLayerId)) {
      map.addLayer({
        id: currentLayerId,
        type: "symbol",
        source: sourceId,
        "source-layer": "poi_label",
        minzoom: 0,
        layout: {
          "icon-image": getIconImage(),
          "icon-size": 1,
          "text-field": getTextField(),
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-offset": [0, 0.6],
          "text-anchor": "top",
          "text-size": 10,
        },
        paint: {
          "text-halo-color": [
            "match",
            ["get", "maki"],
            ...Object.entries(flattenedPOICategories).flatMap(
              ([poi, { category }]) => [
                poi,
                poiColors[category] || poiColors.Unknown,
              ]
            ),
            poiColors.Unknown,
          ],
          "text-halo-width": 1,
          "text-color": "rgba(0, 0, 0, 0.7)",
        },
        filter: ["all", ["within", isochrone]],
      });
    } else {
      map.setFilter(currentLayerId, ["all", ["within", isochrone]]);
    }
  });

  map.on("click", (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: isochrones.map((_, index) => `POI-${index}`),
    });

    if (features.length > 0) {
      console.log(features[0].properties);
    }
  });
}
