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

  isochronePolygons.sort((a, b) => turf.area(a) - turf.area(b)); // Sort by area

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

  const viridisScale = d3.interpolateViridis;
  const sortedMinutes = Array.from([5, 10, 15]).sort((a, b) => a - b); // Sort by minutes

  buildingsGeojson.features = buildingsGeojson.features.filter((feature) => {
    return isochronePolygons.some((polygon) =>
      turf.booleanIntersects(feature, polygon)
    );
  });

  buildingsGeojson.features.forEach((feature) => {
    let isochroneIndex = null;

    // Determine which isochrone the building is within
    for (let i = 0; i < isochronePolygons.length; i++) {
      if (turf.booleanIntersects(feature, isochronePolygons[i])) {
        // If the building is within this isochrone, use its color
        isochroneIndex = i;
        break;
      }
    }

    if (isochroneIndex !== null) {
      // If the building is within an isochrone, color it with the viridisScale
      const color = viridisScale(
        1 - (isochroneIndex + 1) / (sortedMinutes.length + 1)
      );
      feature.properties.color = color;
    } else {
      // If the building is not within any isochrone, color it with a default color
      feature.properties.color = "gray";
    }
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
        "fill-extrusion-height": ["*", ["get", "height"], 1.7],
        "fill-extrusion-base": ["get", "min_height"],
        "fill-extrusion-opacity": 0.3,
      },
    });
  }
}
