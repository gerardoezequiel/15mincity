export async function getIsochrone(coordinates, minutes, color, profile) {
  const url = `https://api.mapbox.com/isochrone/v1/mapbox/${profile}/${coordinates.join(
    ","
  )}?contours_minutes=${minutes}&polygons=true&access_token=${
    mapboxgl.accessToken
  }`;

  const response = await fetch(url);
  const data = await response.json();
  const [feature] = data.features;
  feature.properties = {
    fillColor: color,
    fillOpacity: 0.5,
  };
  return feature;
}

export async function updateIsochrones(
  map,
  center,
  profile,
  enabledIsochroneValues = [5, 10, 15]
)
 {
  const viridisScale = d3.interpolateViridis;

  const isoPromises = [
    // getIsochrone(center, 60, viridisScale(0.1), profile), // light orange
    //getIsochrone(center, 30, viridisScale(0.3), profile), // dark red
    getIsochrone(center, 15, viridisScale(0.5), profile), // green
    getIsochrone(center, 10, viridisScale(0.7), profile), // light green
    getIsochrone(center, 5, viridisScale(0.9), profile), // dark green
  ];

  const isochrones = await Promise.all(isoPromises);

  // Calculate the difference between isochrones to prevent overlap
  for (let i = 0; i < isochrones.length - 1; i++) {
    isochrones[i] = turf.difference(isochrones[i], isochrones[i + 1]);
  }

  isochrones.forEach((iso, index) => {
    const layerId = `isochrone-${index}`;

    if (map.getLayer(layerId)) {
      map.getSource(layerId).setData(iso);
      map.setLayerZoomRange(layerId, 4, 22);
      map.setPaintProperty(layerId, "fill-opacity", 0.5);
    } else {
      map.addLayer(
        {
          id: layerId,
          type: "fill",
          source: {
            type: "geojson",
            data: iso,
          },
          paint: {
            "fill-color": ["get", "fillColor", ["properties"]],
            "fill-opacity": 0.3,
            "fill-outline-color": "rgba(255, 255, 2, 0)"
          },
        },
        "poi-label" //--> check the helper below to see the order of the layers
      );

      map.setLayerZoomRange(layerId, 4, 22);
    }
  });
  // helper --> to check the orders of the layer to choose where to display the isochrones
  /*const layers = map.getStyle().layers;
  layers.forEach((layer) => {
    console.log(layer.id, layer.type, layer.source);
  });*/
  return isochrones;
}
