import { poiCategories, categoryColors } from "./zz-15mincategories.js";

export async function addOSMPOIs(map, isochrones, signal) {
  const overpassApiUrl = "https://overpass-api.de/api/interpreter";
  const requests = [];

  // Sort isochrones in ascending order of size (number of coordinates)
  isochrones.sort(
    (a, b) => a.geometry.coordinates.length - b.geometry.coordinates.length
  );

  // Iterate over each isochrone
  for (let index = 0; index < isochrones.length; index++) {
    const isochrone = isochrones[index];
    const isochronePolygon = turf.polygon(isochrone.geometry.coordinates);

    // Create an array to store batched queries for each category
    const batchedQueries = [];

    // Iterate over each category
    for (const [categoryKey, categoryValue] of Object.entries(poiCategories)) {
      const categoryColor = categoryColors[categoryKey];

      // Iterate over each subcategory in the category
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
          { signal } // Pass the abort signal to fetch
        )
          .then((response) => response.json())
          .then((data) => osmtogeojson(data))
          .then((geojson) => {
            // Filter points within the isochrone
            geojson.features = geojson.features.filter((feature) => {
              const point = turf.point(feature.geometry.coordinates);
              return turf.booleanPointInPolygon(point, isochronePolygon);
            });

            return {
              sourceId,
              categoryKey,
              subcategoryKey,
              maki,
              geojson,
              categoryColor, // Pass the categoryColor as a parameter
            };
          });

        batchedQueries.push(request);
      }
    }

    // Execute batched requests for each category in parallel
    const results = await Promise.all(batchedQueries);

    // Create sources and layers for each category
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
          // Skip adding source if it already exists
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
    ); // Add sources and layers to the map
    Object.keys(sources).forEach((sourceId) => {
      map.addSource(sourceId, sources[sourceId]);
    });

    layers.forEach((layer) => {
      map.addLayer(layer);
    });

    // Wait for the layers to be rendered before proceeding to the next isochrone
    await new Promise((resolve) => {
      map.once("render", resolve);
    });
  }
}
