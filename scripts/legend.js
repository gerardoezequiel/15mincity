export function createLegend(map) {
  const legend = document.createElement("div");
  legend.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
  legend.style.padding = "10px";
  legend.style.backgroundColor = "white";
  legend.style.borderRadius = "5px";

  const isochroneValues = [
    { minutes: 5, viridisValue: 0.9, index: 4 },
    { minutes: 10, viridisValue: 0.7, index: 3 },
    { minutes: 15, viridisValue: 0.5, index: 2 },
    //{ minutes: 30, viridisValue: 0.3, index: 1 },
    //{ minutes: 60, viridisValue: 0.1, index: 0 },
  ];

  const viridisScale = d3.interpolateViridis;

  isochroneValues.forEach(({ minutes, viridisValue, index }) => {
    const layerId = `isochrone-${index}`;

    const row = document.createElement("div");
    row.style.cursor = "pointer";

    const colorBox = document.createElement("div");
    colorBox.style.backgroundColor = viridisScale(viridisValue);
    colorBox.style.width = "20px";
    colorBox.style.height = "20px";
    colorBox.style.display = "inline-block";
    colorBox.style.marginRight = "5px";
    row.appendChild(colorBox);

    const labelText = document.createElement("span");
    labelText.textContent = `${minutes} min`;
    row.appendChild(labelText);

    row.onclick = () => {
      const visibility = map.getLayoutProperty(layerId, "visibility");
      map.setLayoutProperty(
        layerId,
        "visibility",
        visibility === "visible" ? "none" : "visible"
      );
      labelText.style.fontWeight =
        labelText.style.fontWeight === "bold" ? "normal" : "bold";
    };

    legend.appendChild(row);
  });

  // Add the legend control to the map
  const legendControl = new mapboxgl.Marker(legend, {
    anchor: "top-left",
  }).setLngLat(map.getCenter());

  map.on("load", () => {
    legendControl.addTo(map);
  });
}
