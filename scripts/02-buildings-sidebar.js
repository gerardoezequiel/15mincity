export function createBuildingsSidebar() {
  const buildingsSidebar = document.getElementById("buildings-sidebar");

  const buildingsSidebarToggleButton = document.getElementById(
    "buildings-sidebar-toggle"
  );
  buildingsSidebarToggleButton.addEventListener("click", function () {
    buildingsSidebar.classList.toggle("collapsed");
  });

  const contentContainer = document.createElement("div");
  contentContainer.classList.add("p-4");
  buildingsSidebar.appendChild(contentContainer);

  // Add your content for the buildings sidebar here
  // ...

  // Example:
  const title = document.createElement("h2");
  title.textContent = "Buildings";
  contentContainer.appendChild(title);
}
