export function addPopulationLayer(map, isochrones) {
  const layers = [
    {
      id: "totalPopulation",
      url: "mapbox://geraezemc.a8zj9e36",
      layer: "population_london-dk50qi",
      property: "DN",
      color: "#f28cb1",
      range: [0, 565],
      label: "Total population",
    },
    {
      id: "childrenUnder5",
      url: "mapbox://geraezemc.7wavbrvk",
      layer: "under5-5i4532",
      property: "<5",
      color: "#ffcc00",
      range: [0, 62],
      label: "Children under 5",
    },
    {
      id: "youth15to24",
      url: "mapbox://geraezemc.5p9cynnf",
      layer: "15-24-ddiwjd",
      property: "15-24",
      color: "#0099ff",
      range: [0, 135],
      label: "Youth 15 to 24",
    },

    {
      id: "elderlyPopulation",
      url: "mapbox://geraezemc.2wolfa7a",
      layer: "elderly_60plus-1lxlnx",
      property: ">60",
      color: "#ff0000",
      range: [0, 221],
      label: "Elderly",
    },
  ];

  layers.forEach(
    ({ id, url, layer, property, color, range, heatmapOpacity }) => {
      const sourceId = `${id}-source`;
      const layerId = `${id}-layer`;
      const heatmapId = `${id}-heatmap`;

      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: "vector",
          url: url,
        });
      }

      isochrones.forEach((isochrone, index) => {
        const currentLayerId = `${layerId}-${index}`;
        const currentHeatmapId = `${heatmapId}-${index}`;

        if (map.getLayer(currentLayerId)) {
          map.setFilter(currentLayerId, ["all", ["within", isochrone]]);
        } else {
          map.addLayer({
            id: currentLayerId,
            type: "circle",
            source: sourceId,
            "source-layer": layer,
            paint: {
              "circle-color": [
                "interpolate",
                ["linear"],
                ["get", property],
                range[0],
                color,
                range[1],
                color,
              ],
              "circle-radius": [
                "interpolate",
                ["linear"],
                ["zoom"],
                0,
                0,
                10,
                ["*", ["sqrt", ["get", property]], 0.8],
              ],
              "circle-stroke-color": "rgba(233, 30, 99, 1)",
              "circle-stroke-width": 0,
            },
            filter: ["all", ["within", isochrone]],
          });

          map.addLayer({
            id: currentHeatmapId,
            type: "heatmap",
            source: sourceId,
            "source-layer": layer,
            maxzoom: 15,
            paint: {
              // Increase the heatmap weight based on frequency and property magnitude
              "heatmap-weight": [
                "interpolate",
                ["linear"],
                ["get", property],
                0,
                0,
                range[1],
                1,
              ],
              // Increase the heatmap color weight weight by zoom level
              // heatmap-intensity is a multiplier on top of heatmap-weight
              "heatmap-intensity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                0,
                1,
                15,
                3,
              ],
              // Color ramp for heatmap. Domain is 0 (low) to 1 (high).
              // Begin color ramp at 0-stop with a 0-transparancy color
              // to create a blur-like effect.
              "heatmap-color": [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0,
                "rgba(0,0,0,0)",
                0.2,
                color,
                1,
                color,
              ],
              // Adjust the heatmap radius by zoom level
              "heatmap-radius": [
                "interpolate",
                ["linear"],
                ["zoom"],
                0,
                2,
                15,
                30,
              ],
              // Transition from heatmap to circle layer by zoom level
              "heatmap-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                7,
                heatmapOpacity,
                9,
                0,
              ],
            },
            filter: ["all", ["within", isochrone]],
          });

          map.on("click", currentLayerId, (e) => {
            const features = map.querySourceFeatures(sourceId, {
              sourceLayer: "population_london-dk50qi",
            });
            const isochronePolygon = turf.polygon(
              isochrone.geometry.coordinates
            );

            let totalPopulation = 0;
            features.forEach((feature) => {
              const featurePoint = turf.point([
                feature.geometry.coordinates[0],
                feature.geometry.coordinates[1],
              ]);
              if (turf.booleanPointInPolygon(featurePoint, isochronePolygon)) {
                totalPopulation += feature.properties[property];
              }
            });

            let percentage =
              (e.features[0].properties[property] / totalPopulation) * 100;
            let popupContent = `Population: ${
              e.features[0].properties[property]
            } <br/>
                            Total Population in Isochrone: ${totalPopulation} <br/>
                            Percentage: ${percentage.toFixed(2)}%`;

            new mapboxgl.Popup()
              .setLngLat(e.lngLat)
              .setHTML(popupContent)
              .addTo(map);
          });
        }
      });
    }
  );
}
