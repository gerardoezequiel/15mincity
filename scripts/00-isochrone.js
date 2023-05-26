import { createLegend } from "./ui-legend.js";

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
  minutes = [5, 10, 15] // you can add here more isochrones
) {
  const viridisScale = d3.interpolateViridis;

  const sortedMinutes = Array.from(minutes).sort((a, b) => b - a); // Convert minutes to an array and sort in descending order

  const isoPromises = sortedMinutes.map((min, index) => {
    const color = viridisScale((index + 1) / (sortedMinutes.length + 1));
    return getIsochrone(center, min, color, profile);
  });

  const isochrones = await Promise.all(isoPromises);

  isochrones.forEach((iso, index) => {
    const currentMinutes = sortedMinutes[index];
    const layerId = `isochrone-${currentMinutes}`;

    if (map.getLayer(layerId)) {
      map.getSource(layerId).setData(iso);
      map.setLayerZoomRange(layerId, 4, 22);
      map.setPaintProperty(layerId, "fill-opacity", 0.1);
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
            "fill-color": viridisScale(
              (index + 1) / (sortedMinutes.length + 1)
            ),
            "fill-opacity": 0.1,
            "fill-outline-color": "rgba(255, 255, 2, 0.8)",
          },
        },
        //"water"
      );

      map.addLayer({
        id: `${layerId}-label`,
        type: "symbol",
        source: layerId,
        paint: {
          "text-color": "black",
        },
      });
     // "airport-label";
    }

    map.setLayerZoomRange(layerId, 4, 22);

    /*// Set initial visibility based on whether currentMinutes is less than or equal to 15
    map.setLayoutProperty(
      layerId,
      "visibility",
      currentMinutes <= 15 ? "visible" : "none"
    );*/
    const area = turf.area(iso.geometry); // Measure the area using Turf.js

    console.log(`Isochrone ${currentMinutes} minutes: ${area} square meters`);
  });

  return isochrones;
}
