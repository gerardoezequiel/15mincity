import { createPoiChart } from "./03-poi-chart.js";
import { poiCategories, categoryColors } from "./zz-15mincategories.js";
import { addOSMPOIs } from "./03-osm-pois.js";

export async function createPoiSidebar() {
  const poiSidebar = document.getElementById("poi-sidebar");

  const poiSidebarToggleButton = document.getElementById("pois-sidebar-toggle");
  poiSidebarToggleButton.addEventListener("click", function () {
    poiSidebar.classList.toggle("collapsed");
  });

  const contentContainer = document.createElement("div");
  contentContainer.classList.add("p-4");
  poiSidebar.appendChild(contentContainer);

  const title = document.createElement("h1");
  title.textContent = "Points of Interest";
  title.classList.add("text-2xl");
  contentContainer.appendChild(title);

  const chartContainer = document.createElement("div");
  chartContainer.id = "chart-container";
  chartContainer.style.width = "300px";
  chartContainer.style.height = "300px";
  contentContainer.appendChild(chartContainer);

  const chart = await createPoiChart();
  chart.container(chartContainer);
  chart.draw();

  // Create legend
  const legendContainer = document.createElement("div");
  legendContainer.classList.add("mt-4");
  contentContainer.appendChild(legendContainer);

  const legendTitle = document.createElement("h2");
  legendTitle.textContent = "Legend";
  legendTitle.classList.add("text-lg", "font-bold", "mb-2", "cursor-pointer");
  legendTitle.addEventListener("click", toggleLegendVisibility);
  legendContainer.appendChild(legendTitle);

  const legendContent = document.createElement("div");
  legendContent.classList.add("pl-4");
  legendContainer.appendChild(legendContent);

  // Add categories to the legend
  for (const [categoryKey, categoryValue] of Object.entries(poiCategories)) {
    const categoryColor = categoryColors[categoryKey];

    const categoryToggle = document.createElement("button");
    categoryToggle.classList.add(
      "flex",
      "items-center",
      "mb-2",
      "focus:outline-none"
    );
    categoryToggle.addEventListener("click", toggleCategoryVisibility);
    legendContent.appendChild(categoryToggle);

    const categoryCircle = document.createElement("div");
    categoryCircle.classList.add("w-4", "h-4", "mr-2", "rounded-full");
    categoryCircle.style.backgroundColor = categoryColor;
    categoryToggle.appendChild(categoryCircle);

    const categoryLabel = document.createElement("span");
    categoryLabel.classList.add("text-sm", "font-medium");
    categoryLabel.textContent = categoryKey;
    categoryToggle.appendChild(categoryLabel);

    const categoryIcon = document.createElement("i");
    categoryIcon.classList.add("fas", "fa-chevron-down", "ml-auto");
    categoryToggle.appendChild(categoryIcon);

    const subcategoriesList = document.createElement("ul");
    subcategoriesList.classList.add("ml-4");
    subcategoriesList.style.display = "none";
    legendContent.appendChild(subcategoriesList);

    // Add subcategories to the list
    for (const [subcategoryKey, { osmTag, maki }] of Object.entries(
      categoryValue
    )) {
      const subcategoryButton = document.createElement("button");
      subcategoryButton.classList.add(
        "flex",
        "items-center",
        "mb-1",
        "pl-2",
        "focus:outline-none"
      );
      subcategoryButton.addEventListener("click", toggleSubcategoryVisibility);
      subcategoriesList.appendChild(subcategoryButton);

      const subcategoryLabel = document.createElement("span");
      subcategoryLabel.classList.add("text-xs");
      subcategoryLabel.textContent = subcategoryKey;
      subcategoryButton.appendChild(subcategoryLabel);

      // Set data attributes to store the category and subcategory information
      subcategoryButton.dataset.category = categoryKey;
      subcategoryButton.dataset.subcategory = subcategoryKey;
    }
  }

  function toggleLegendVisibility() {
    legendContent.classList.toggle("hidden");
  }

  function toggleCategoryVisibility(event) {
    const categoryToggle = event.currentTarget;
    const categoryIcon = categoryToggle.querySelector("i");
    const subcategoriesList = categoryToggle.nextElementSibling;
    const isOpen = subcategoriesList.style.display === "block";

    // Toggle subcategories visibility
    subcategoriesList.style.display = isOpen ? "none" : "block";

    // Toggle category button style
    categoryToggle.classList.toggle("active");

    // Toggle category icon
    categoryIcon.classList.toggle("fa-chevron-down");
    categoryIcon.classList.toggle("fa-chevron-up");
  }

  function toggleSubcategoryVisibility(event) {
    const subcategoryButton = event.currentTarget;
    const categoryKey = subcategoryButton.dataset.category;
    const subcategoryKey = subcategoryButton.dataset.subcategory;
    const isSubcategoryActive = subcategoryButton.classList.contains("active");

    // Toggle subcategory button style
    subcategoryButton.classList.toggle("active");

    // Handle the visibility of subcategories on the map
    handleSubcategoryVisibility(
      categoryKey,
      subcategoryKey,
      isSubcategoryActive
    );
  }

  function handleSubcategoryVisibility(
    categoryKey,
    subcategoryKey,
    isSubcategoryActive
  ) {
    // Logic to show/hide the corresponding layers on the map
    // You can use the categoryKey and subcategoryKey to identify the layers

    // Example: Show/hide the layer based on category and subcategory
    const layerId = `${categoryKey}-${subcategoryKey}`;
    const layer = map.getLayer(layerId);
    if (layer) {
      if (isSubcategoryActive) {
        map.setLayoutProperty(layerId, "visibility", "none");
      } else {
        map.setLayoutProperty(layerId, "visibility", "visible");
      }
    }
  }

  // Map initialization
  const map = initializeMap(); // Replace this with your map initialization code

  // Add OSM POIs to the map
  const isochrones = []; // Replace this with your isochrones data
  const signal = null; // Replace this with your signal object if needed
  await addOSMPOIs(map, isochrones, signal);
}
