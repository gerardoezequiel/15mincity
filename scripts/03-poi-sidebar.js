import { createPoiChart } from "./03-poi-chart.js";

export function createPoiSidebar() {
  const poiSidebar = document.getElementById("poi-sidebar");

  const poiSidebarToggleButton = document.getElementById("pois-sidebar-toggle");
  poiSidebarToggleButton.addEventListener("click", function () {
    poiSidebar.classList.toggle("collapsed");
  });

  const contentContainer = document.createElement("div");
  contentContainer.classList.add("p-4");
  poiSidebar.appendChild(contentContainer);

  // Add your content for the POI sidebar here

  const title = document.createElement("h2");
  title.textContent = "Points of Interest";
  contentContainer.appendChild(title);

  // Create the chart and append it to the content container
  const chartContainer = document.createElement("div");
  chartContainer.id = "chart-container";
  chartContainer.style.width = "300px"; // set width
  chartContainer.style.height = "300px"; // set height
  contentContainer.appendChild(chartContainer);

  const chart = createPoiChart();
  chart.container("chart-container");
  chart.draw();
}
