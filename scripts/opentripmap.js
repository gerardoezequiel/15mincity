const apiKey = "5ae2e3f221c38a28845f05b6ed0662748f2fdf24cede18cf28fcee8a";

export const addOpenTripLayer = (map, isochrones) => {
  const sourceId = "opentripmap.pois";

  if (!map.getSource(sourceId)) {
    map.addSource(sourceId, {
      type: "vector",
      attribution:
        '<a href="https://opentripmap.io" target="_blank">© OpenTripMap</a>',
      bounds: [-180, -85.0511, 180, 85.0511],
      minzoom: 10,
      maxzoom: 20,
      scheme: "xyz",
      tiles: [
        `https://api.opentripmap.com/0.1/en/tiles/pois/{z}/{x}/{y}.pbf?kinds=interesting_places,tourist_facilities,sport&rate=3&apikey=${apiKey}`,
      ],
    });
  }

  isochrones.forEach((isochrone, index) => {
    const currentLayerId = `poi-${index}`;

    if (map.getLayer(currentLayerId)) {
      map.setFilter(currentLayerId, ["all", ["within", isochrone]]);
    } else {
      map.addLayer({
        id: currentLayerId,
        type: "circle",
        source: sourceId,
        "source-layer": "pois",
        minzoom: 10,
        maxzoom: 20,
        paint: {
          "circle-color": "rgba(55,144,144, 0.5)",
          "circle-radius": 3,
          "circle-stroke-color": "rgba(102,193,201, 0.6)",
          "circle-stroke-width": 0.01,
        },
        filter: ["all", ["within", isochrone]],
      });
    }
  });
};







