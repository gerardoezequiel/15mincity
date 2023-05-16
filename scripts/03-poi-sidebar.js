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
  // ...

  // Example:
  const title = document.createElement("h2");
  title.textContent = "Points of Interest";
  contentContainer.appendChild(title);
}
