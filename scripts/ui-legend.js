import { poiCategories, categoryColors } from "./zz-15mincategories.js";
export function createLegend(map, minutesArray) {
  let legend = document.getElementById("legend");

  if (!legend) {
    legend = document.createElement("div");
    legend.id = "legend";
    legend.className = "mapboxgl-ctrl mapboxgl-ctrl-group";

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
    legend.innerHTML = "";
  }

  const viridisScale = d3.interpolateViridis;

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

    const categoryCircle = document.createElement("div");
    categoryCircle.classList.add("w-4", "h-4", "mr-2", "rounded-full");
    categoryCircle.style.backgroundColor = categoryColor;
    categoryToggle.appendChild(categoryCircle); // Append the circle before the label

    const categoryLabel = document.createElement("span");
    categoryLabel.classList.add("text-sm", "font-medium");
    categoryLabel.textContent = categoryKey;
    categoryToggle.appendChild(categoryLabel); // Append the label after the circle

    legend.appendChild(categoryToggle);

    const categoryIcon = document.createElement("i");
    categoryIcon.classList.add("fas", "fa-chevron-down", "ml-auto");
    categoryToggle.appendChild(categoryIcon);

    const subcategoriesList = document.createElement("ul");
    subcategoriesList.classList.add("ml-4");
    subcategoriesList.style.display = "none";
    legend.appendChild(subcategoriesList);

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

      subcategoryButton.dataset.category = categoryKey;
      subcategoryButton.dataset.subcategory = subcategoryKey;
    }
  }

  function toggleCategoryVisibility(event) {
    const categoryToggle = event.currentTarget;
    const categoryIcon = categoryToggle.querySelector("i");
    const subcategoriesList = categoryToggle.nextElementSibling;
    const isOpen = subcategoriesList.style.display === "block";

    subcategoriesList.style.display = isOpen ? "none" : "block";

    categoryToggle.classList.toggle("active");

    categoryIcon.classList.toggle("fa-chevron-down");
    categoryIcon.classList.toggle("fa-chevron-up");
  }

  function toggleSubcategoryVisibility(event) {
    const subcategoryButton = event.currentTarget;
    const categoryKey = subcategoryButton.dataset.category;
    const subcategoryKey = subcategoryButton.dataset.subcategory;
    const isSubcategoryActive = subcategoryButton.classList.contains("active");

    subcategoryButton.classList.toggle("active");

    handleSubcategoryVisibility(
      categoryKey,
      subcategoryKey,
      isSubcategoryActive
    );
  }
}
