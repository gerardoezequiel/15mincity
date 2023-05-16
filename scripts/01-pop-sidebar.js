export function createPopulationSidebar() {
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

  // Add your content for the population sidebar here
  // ...

  // Example:
  const title = document.createElement("h2");
  title.textContent = "Population";
  contentContainer.appendChild(title);
}
