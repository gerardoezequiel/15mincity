export function addPopulationLayer(map, isochrones) {
  const layerId = "population-layer";
  const sourceId = "population-source";

  if (!map.getSource(sourceId)) {
    map.addSource(sourceId, {
      type: "vector",
      url: "mapbox://geraezemc.a8zj9e36",
    });
  }

  isochrones.forEach((isochrone, index) => {
    const currentLayerId = `${layerId}-${index}`;

    if (map.getLayer(currentLayerId)) {
      map.setFilter(currentLayerId, ["all", ["within", isochrone]]);
    } else {
      // Add circle layer
      map.addLayer({
        id: currentLayerId,
        type: "circle",
        source: sourceId,
        "source-layer": "population_london-dk50qi",
        paint: {
          "circle-color": [
            "interpolate",
            ["linear"],
            ["get", "DN"],
            0,
            "rgba(0,0,255,0.5)",
            565,
            "rgba(255,0,0,0.5)",
          ],
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0,
            0,
            10,
            ["*", ["sqrt", ["get", "DN"]], 0.8],
          ],
          "circle-stroke-color": "rgba(233, 30, 99, 1)",
          "circle-stroke-width": 0,
        },
        filter: ["all", ["within", isochrone]],
      });

      
    }
  });
}
