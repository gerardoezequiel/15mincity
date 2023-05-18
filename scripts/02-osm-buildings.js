import {
  buildingTypeCategories,
  categoryColors,
} from "./zz-15mincategories.js";

export async function addOSMBuildings(map, isochrones) {
  const sourceId = `buildings`;
  const layerId = `buildings`;

  // Remove the layer if it already exists
  if (map.getLayer(layerId)) {
    map.removeLayer(layerId);
  }

  // Remove the source if it already exists
  if (map.getSource(sourceId)) {
    map.removeSource(sourceId);
  }

  const overpassApiUrl = "https://overpass-api.de/api/interpreter";
  const isochronePolygons = isochrones.map((iso) =>
    turf.polygon(iso.geometry.coordinates)
  );

  const bbox = turf.bbox(
    turf.multiPolygon(isochronePolygons.map((p) => p.geometry.coordinates))
  );

  const query = `
    [out:json][timeout:60];
    (
      way[building](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
    );
    out body;
    >;
    out skel qt;
  `;

  const response = await fetch(
    `${overpassApiUrl}?data=${encodeURIComponent(query)}`
  );
  const data = await response.json();
  const buildingsGeojson = osmtogeojson(data);

  buildingsGeojson.features = buildingsGeojson.features.filter((feature) => {
    return isochronePolygons.some((polygon) =>
      turf.booleanIntersects(feature, polygon)
    );
  });

  buildingsGeojson.features.forEach((feature) => {
    const buildingType = feature.properties.building;
    let buildingCategory = "Unknown";
    for (const category in buildingTypeCategories) {
      if (buildingTypeCategories[category].includes(buildingType)) {
        buildingCategory = category;
        break;
      }
    }
    feature.properties.category = buildingCategory;
    feature.properties.color = categoryColors[buildingCategory];
  });

  // Check if the source and layer already exist before adding them
  if (!map.getSource(sourceId)) {
    map.addSource(sourceId, {
      type: "geojson",
      data: buildingsGeojson,
    });
  }

  if (!map.getLayer(layerId)) {
    map.addLayer({
      id: layerId,
      type: "fill-extrusion",
      source: sourceId,
      paint: {
        "fill-extrusion-color": ["get", "color"],
        "fill-extrusion-height": ["*", ["get", "height"], 1.5],
        "fill-extrusion-base": ["get", "min_height"],
        "fill-extrusion-opacity": 0.2,
      },
    });
  }
}
