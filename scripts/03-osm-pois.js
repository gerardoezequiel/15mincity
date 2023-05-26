import { poiCategories, categoryColors } from "./zz-15mincategories.js";

const overpassApiUrl = "https://overpass-api.de/api/interpreter";

export async function addOSMPOIs(map, isochrones, signal) {
  // Sort isochrones in ascending order of area
  isochrones.sort((a, b) => turf.area(a) - turf.area(b));

  const totals = {};
  const poiCountsPerIsochrone = {};

  const createFormattedObject = (isochroneKey, categoryKey) => {
    const totalPOIsInIsochrone = totals[isochroneKey]?.total || 0;
    const totalPOIsInCategory =
      poiCountsPerIsochrone[isochroneKey]?.[categoryKey] || 0;
    const percentage = totalPOIsInIsochrone
      ? (totalPOIsInCategory / totalPOIsInIsochrone) * 100
      : 0;
    return { Category: categoryKey, [isochroneKey]: percentage };
  };

  const categories = Object.keys(poiCategories);
  const finalResults = {};

  for (let index = 0; index < isochrones.length; index++) {
    const isochrone = isochrones[index];
    const isochronePolygon = turf.polygon(isochrone.geometry.coordinates);
    const isochroneKey = `${(index + 1) * 5}min`;

    let batchedQueries = [];

    for (const [categoryKey, categoryValue] of Object.entries(poiCategories)) {
      const categoryColor = categoryColors[categoryKey];

      for (const [subcategoryKey, { osmTag, maki }] of Object.entries(
        categoryValue
      )) {
        const sourceId = `${isochroneKey}-${categoryKey}-${subcategoryKey}-poi`;
        const bbox = turf.bbox(isochronePolygon);

        const query = `[out:json][timeout:60]; node[${osmTag}](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]}); out body; >; out skel qt;`;

        batchedQueries.push(
          fetch(`${overpassApiUrl}?data=${encodeURIComponent(query)}`, {
            signal,
          })
            .then((response) => response.json())
            .then((data) => {
              let geojson = osmtogeojson(data);
              geojson.features = geojson.features.filter((feature) => {
                const point = turf.point(feature.geometry.coordinates);
                return turf.booleanPointInPolygon(point, isochronePolygon);
              });

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
            })
        );
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
          // circle layer
          {
            id: `${sourceId}-circles`,
            type: "circle",
            source: sourceId,
            minzoom: 13, 
            maxzoom: 21, 
            paint: {
              "circle-radius": [
                "interpolate",
                ["linear"],
                ["zoom"],
                5,
                1,
                18,
                12,
              ],
              "circle-color": categoryColor,
              "circle-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                0,
                14,
                0.7,
              ],
              "circle-stroke-color": "#fff",
              "circle-stroke-width": 1,
            },
          },
          // symbol layer
          {
            id: `${sourceId}-labels`,
            type: "symbol",
            source: sourceId,
            minzoom: 15, // start showing labels at zoom level 12
            maxzoom: 21, // continue showing labels up to zoom level 21
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
              "text-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                12,
                0,
                15,
                1,
              ],
            },
          },
          
        );
      }
    );

    for (let sourceId in sources) {
      map.addSource(sourceId, sources[sourceId]);
    }

    for (let layer of layers) {
      map.addLayer(layer);
    }

    const isoResults = categories.map((category) =>
      createFormattedObject(isochroneKey, category)
    );
    finalResults[isochroneKey] = isoResults;
  }
  console.log(finalResults);
  return finalResults;
}
