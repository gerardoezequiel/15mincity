export function createPopulationSidebar(map) {
  const populationSidebar = document.getElementById("population-sidebar");

  const populationSidebarToggleButton = document.getElementById(
    "population-sidebar-toggle"
  );
  populationSidebarToggleButton.addEventListener("click", function () {
    populationSidebar.classList.toggle("collapsed");
  });

  const contentContainer = document.createElement("div");
  contentContainer.classList.add("p-4");
  populationSidebar.appendChild(contentContainer);

  const title = document.createElement("h2");
  title.textContent = "Population";
  contentContainer.appendChild(title);

  const legendContainer = document.createElement("div");
  legendContainer.classList.add("legend-container");
  contentContainer.appendChild(legendContainer);

  const layers = [
    {
      id: "totalPopulation",
      label: "Total population",
      color: "#f28cb1",
    },
    {
      id: "childrenUnder5",
      label: "Children under 5",
      color: "#ffcc00",
    },
    {
      id: "youth15to24",
      label: "Youth 15 to 24",
      color: "#0099ff",
    },
    {
      id: "elderlyPopulation",
      label: "Elderly",
      color: "#ff0000",
    },
  ];

  layers.forEach((layer) => {
    const legendItem = document.createElement("div");
    legendItem.classList.add("legend-item");
    legendItem.style.cursor = "pointer";

    const legendColor = document.createElement("span");
    legendColor.classList.add("legend-color");
    legendColor.style.backgroundColor = layer.color;

    const legendLabel = document.createElement("span");
    legendLabel.classList.add("legend-label");
    legendLabel.textContent = layer.label;

    legendItem.appendChild(legendColor);
    legendItem.appendChild(legendLabel);
    legendContainer.appendChild(legendItem);

    legendItem.addEventListener("click", function () {
      toggleLayerVisibility(layer.id);
      legendItem.classList.toggle("active");
    });
  });

  function toggleLayerVisibility(layerId) {
    const layers = map.getStyle().layers;
    layers.forEach((layer) => {
      if (layer.id === layerId) {
        const visibility = map.getLayoutProperty(layerId, "visibility");
        if (visibility === "visible") {
          map.setLayoutProperty(layerId, "visibility", "none");
        } else {
          map.setLayoutProperty(layerId, "visibility", "visible");
        }
      }
    });
  }
}
