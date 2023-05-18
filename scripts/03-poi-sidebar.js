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

  const title = document.createElement("h1");
  title.textContent = "Points of Interest";
  title.classList.add("text-2xl"); // Increase the size of the title
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

  // Add the text for different categories
  const mobilityCategory = document.createElement("p");
  mobilityCategory.innerHTML =
    '<strong style="color: rgb(30, 136, 229)">Mobility:</strong><br>- Bus Stop<br>- Tram Stop<br>- Underground<br>- Tram<br>- Bike Rental';
  contentContainer.appendChild(mobilityCategory);

  const commerceCategory = document.createElement("p");
  commerceCategory.innerHTML =
    '<strong style="color: rgb(129, 199, 132)">Commerce:</strong><br>- Shop<br>- Supermarket<br>- Drugstore<br>- Deli<br>- Bakery<br>- Post Office';
  contentContainer.appendChild(commerceCategory);

  const healthcareCategory = document.createElement("p");
  healthcareCategory.innerHTML =
    '<strong style="color: rgb(211, 47, 47)">Healthcare:</strong><br>- Hospital<br>- Doctor\'s Office<br>- Pharmacy';
  contentContainer.appendChild(healthcareCategory);

  const educationCategory = document.createElement("p");
  educationCategory.innerHTML =
    '<strong style="color: rgb(149, 117, 205)">Education:</strong><br>- University<br>- School<br>- Kindergarten<br>- Library';
  contentContainer.appendChild(educationCategory);

  const entertainmentCategory = document.createElement("p");
  entertainmentCategory.innerHTML =
    '<strong style="color: rgb(255, 214, 0)">Entertainment:</strong><br>- Sports Facility<br>- Cinema<br>- Theater<br>- Park<br>- Playground<br>- Recreational Area';
  contentContainer.appendChild(entertainmentCategory);
}
