import { poiCategories, categoryColors } from "./zz-15mincategories.js";

export async function addOSMPOIs(map, isochrones, signal) {
  const overpassApiUrl = "https://overpass-api.de/api/interpreter";
  let index;

  // Sort isochrones in ascending order of area
  isochrones.sort((a, b) => turf.area(a) - turf.area(b));

  const Isochrone_5min = [];
  const Isochrone_10min = [];
  const Isochrone_15min = [];

  // Create variables to store the totals and poi counts
  const totals = {};
  const poiCountsPerIsochrone = {};

  // Helper function to create a formatted object
  const createFormattedObject = (isochroneKey, categoryKey) => {
    const totalPOIsInIsochrone = totals[isochroneKey]?.total || 0;
    const totalPOIsInCategory =
      poiCountsPerIsochrone[isochroneKey]?.[categoryKey] || 0;
    const percentage = totalPOIsInIsochrone
      ? (totalPOIsInCategory / totalPOIsInIsochrone) * 100
      : 0;
    return { name: categoryKey, [isochroneKey]: percentage };
  };

  // Define the categories array
  const categories = [
    "Mobility",
    "Commerce",
    "Healthcare",
    "Education",
    "Entertainment",
  ];

  // Iterate over each isochrone
  for (index = 0; index < isochrones.length; index++) {
    const isochrone = isochrones[index];
    const isochronePolygon = turf.polygon(isochrone.geometry.coordinates);

    const batchedQueries = [];

    for (const [categoryKey, categoryValue] of Object.entries(poiCategories)) {
      const categoryColor = categoryColors[categoryKey];

      for (const [subcategoryKey, { osmTag, maki }] of Object.entries(
        categoryValue
      )) {
        const sourceId = `${index}-${categoryKey}-${subcategoryKey}-poi`;
        const bbox = turf.bbox(isochronePolygon);
        const query = `[out:json][timeout:60];
          node[${osmTag}](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
          out body;
          >;
          out skel qt;`;

        const request = fetch(
          `${overpassApiUrl}?data=${encodeURIComponent(query)}`,
          { signal }
        )
          .then((response) => response.json())
          .then((data) => osmtogeojson(data))
          .then((geojson) => {
            geojson.features = geojson.features.filter((feature) => {
              const point = turf.point(feature.geometry.coordinates);
              return turf.booleanPointInPolygon(point, isochronePolygon);
            });

            let isochroneKey = "";

            if (index === 0) {
              isochroneKey = "5min";
            } else if (index === 1) {
              isochroneKey = "10min";
            } else if (index === 2) {
              isochroneKey = "15min";
            }

            totals[isochroneKey] = totals[isochroneKey] || {};
            totals[isochroneKey]["total"] =
              (totals[isochroneKey]["total"] || 0) + geojson.features.length;
            totals[isochroneKey][categoryKey] =
              (totals[isochroneKey][categoryKey] || 0) +
              geojson.features.length;
            poiCountsPerIsochrone[isochroneKey] =
              poiCountsPerIsochrone[isochroneKey] || {};
            poiCountsPerIsochrone[isochroneKey][categoryKey] =
              (poiCountsPerIsochrone[isochroneKey][categoryKey] || 0) +
              geojson.features.length;
            return {
              sourceId,
              categoryKey,
              subcategoryKey,
              maki,
              geojson,
              categoryColor,
            };
          });

        batchedQueries.push(request);
      }
    }

    const results = await Promise.all(batchedQueries);

    const sources = {};
    const layers = [];

    results.forEach(
      ({
        sourceId,
        categoryKey,
        subcategoryKey,
        maki,
        geojson,
        categoryColor,
      }) => {
        if (map.getSource(sourceId)) {
          return;
        }
        sources[sourceId] = {
          type: "geojson",
          data: geojson,
        };
        layers.push(
          {
            id: `${sourceId}-icons`,
            type: "circle",
            source: sourceId,
            paint: {
              "circle-radius": 4,
              "circle-color": categoryColor,
              "circle-opacity": 0.7,
            },
          },
          {
            id: `${sourceId}-labels`,
            type: "symbol",
            source: sourceId,
            layout: {
              "text-field": ["get", "name"],
              "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
              "text-offset": [0, 1.5],
              "text-anchor": "top",
              "text-size": 12,
              "icon-image": maki,
            },
            paint: {
              "text-color": "#000",
              "text-halo-color": "rgba(255, 255, 255, 0.8)",
              "text-halo-width": 1,
            },
          }
        );
      }
    );

    Object.keys(sources).forEach((sourceId) => {
      map.addSource(sourceId, sources[sourceId]);
    });

    layers.forEach((layer) => {
      map.addLayer(layer);
    });

    await new Promise((resolve) => {
      map.once("render", resolve);
    });

    const formattedIsochrone_5min = categories.map((category) =>
      createFormattedObject("5min", category)
    );
    const formattedIsochrone_10min = categories.map((category) =>
      createFormattedObject("10min", category)
    );
    const formattedIsochrone_15min = categories.map((category) =>
      createFormattedObject("15min", category)
    );
    Isochrone_5min.push(...formattedIsochrone_5min);
    Isochrone_10min.push(...formattedIsochrone_10min);
    Isochrone_15min.push(...formattedIsochrone_15min);
  } //End of for loop


console.log("Isochrone_15min:", Isochrone_15min);
console.log("Isochrone_10min:", Isochrone_10min);
console.log("Isochrone_5min:", Isochrone_5min);
console.log("Final index value:", index);

  return { Isochrone_5min, Isochrone_10min, Isochrone_15min };
}
