
const scaleSequential = d3.scaleSequential;
const interpolateViridis = d3.interpolateViridis;

export function addMapboxBuildings3D(map, isochrones) {
  // Remove the layer if it already exists

  const sortedMinutes = [5, 10, 15].sort((a, b) => a - b); // Sort by minutes
  const viridisScale = scaleSequential(interpolateViridis).domain([
    0,
    isochrones.length - 1,
  ]);

  // Add mapbox-buildings source
  map.addSource("mapbox-buildings", {
    type: "vector",
    url: "mapbox://mapbox.mapbox-streets-v8",
  });

  map.on("load", function () {
    // Insert the layer beneath any symbol layer.
    var layers = map.getStyle().layers;

    var labelLayerId;
    for (var i = 0; i < layers.length; i++) {
      if (layers[i].type === "symbol" && layers[i].layout["text-field"]) {
        labelLayerId = layers[i].id;
        break;
      }
    }

    map.addLayer(
      {
        id: "3d-buildings",
        source: "composite",
        "source-layer": "building",
        filter: ["==", "extrude", "true"],
        type: "fill-extrusion",
        minzoom: 15,
        paint: {
          "fill-extrusion-color": "#aaa",
          "fill-extrusion-height": [
            "interpolate",
            ["linear"],
            ["get", "height"],
            0,
            0,
            1,
            1,
          ],
          "fill-extrusion-base": [
            "interpolate",
            ["linear"],
            ["get", "min_height"],
            0,
            0,
            1,
            1,
          ],
          "fill-extrusion-opacity": 0.6,
        },
      },
      labelLayerId
    );
  });

  map.on("load", () => {
    // Fetch all features within the isochrones
    const buildings = map.queryRenderedFeatures({ layers: ["3d-buildings"] });

    // Filter the buildings within the isochrones
    const filteredBuildings = buildings.filter((building) => {
      for (let i = 0; i < isochrones.length; i++) {
        if (turf.booleanPointInPolygon(building, isochrones[i])) {
          return true;
        }
      }
      return false;
    });

    // Convert the filtered buildings to a GeoJSON feature collection
    const geojson = turf.featureCollection(filteredBuildings);

    // Determine which isochrone each building is within
    geojson.features.forEach((feature) => {
      let isochroneIndex = null;

      // Determine which isochrone the building is within
      for (let i = 0; i < isochrones.length; i++) {
        if (turf.booleanPointInPolygon(feature, isochrones[i])) {
          // If the building is within this isochrone, use its color
          isochroneIndex = i;
          break;
        }
      }

      if (isochroneIndex !== null) {
        // If the building is within an isochrone, color it with the viridisScale
        const color = viridisScale(isochroneIndex / (isochrones.length - 1));
        feature.properties.color = color;
      } else {
        // If the building is not within any isochrone, color it with a default color
        feature.properties.color = "gray";
      }

      map.setFeatureState(
        { source: "mapbox-buildings", id: feature.id },
        { isochroneIndex: isochroneIndex }
      );
    });

    // Save the filtered buildings as a GeoJSON file
    const geojsonStr = JSON.stringify(geojson);
    const blob = new Blob([geojsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "filtered_buildings.geojson";
    link.click();
  });

  map.on("click", (e) => {
    // Query the building layer to get features at the click point
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["3d-buildings"],
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
