export function createLegend(map, minutesArray) {
  let legend = document.getElementById("legend");

  if (!legend) {
    legend = document.createElement("div");
    legend.id = "legend";
    legend.className = "mapboxgl-ctrl mapboxgl-ctrl-group";

    // Add the legend control to the map
    class LegendControl {
      onAdd() {
        return legend;
      }

      onRemove() {
        legend.parentNode.removeChild(legend);
      }

      getDefaultPosition() {
        return "bottom-right";
      }
    }

    const legendControl = new LegendControl();
    map.addControl(legendControl, "bottom-right");
  } else {
    // If the legend already exists, clear its contents
    legend.innerHTML = "";
  }

  const viridisScale = d3.interpolateViridis;

  // Sort the array in ascending order to ensure lower minute value at the top
  minutesArray
    .sort((a, b) => a - b)
    .forEach((minutes, index) => {
      const viridisValue = 1 - index / (minutesArray.length - 1);
      const layerId = `isochrone-${minutes}`;

      const row = document.createElement("div");
      row.className = "legend-row";

      const colorBox = document.createElement("div");
      colorBox.className = "legend-colorbox";
      colorBox.style.backgroundColor = viridisScale(viridisValue);

      const labelText = document.createElement("span");
      labelText.className = `legend-label ${minutes <= 15 ? "active" : ""}`;
      labelText.textContent = `${minutes} min `;

      row.append(colorBox, labelText);

      row.onclick = () => {
        const visibility = map.getLayoutProperty(layerId, "visibility");
        map.setLayoutProperty(
          layerId,
          "visibility",
          visibility === "visible" ? "none" : "visible"
        );
        labelText.classList.toggle("active");
      };

      legend.appendChild(row);
    });
}
