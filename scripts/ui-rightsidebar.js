import { wardCoordinates } from "./zz-15mincategories.js";

export function createRightSidebar(
  map,
  marker,
  updateIsochronesHandler,
  currentProfile
) {
  const sidebar = document.getElementById("sidebar");
  const leftSidebarToggleButton = document.getElementById(
    "left-sidebar-toggle"
  ); // Select the left-sidebar-toggle

  // Select the toggle buttons
  const populationSidebarToggleButton = document.getElementById(
    "population-sidebar-toggle"
  );
  const buildingsSidebarToggleButton = document.getElementById(
    "buildings-sidebar-toggle"
  );
  const poisSidebarToggleButton = document.getElementById(
    "pois-sidebar-toggle"
  );

  // Add the button to the sidebar
  const sidebarToggleButton = document.createElement("button");
  sidebarToggleButton.id = "sidebar-toggle";
  sidebarToggleButton.classList.add("sidebar-toggle");
  sidebarToggleButton.textContent = "🌐";
  sidebarToggleButton.addEventListener("click", function () {
    sidebar.classList.toggle("collapsed");
    
    // Toggle the other buttons' transform property when right sidebar is toggled
    if (sidebar.classList.contains("collapsed")) {
      populationSidebarToggleButton.style.transform = "translateX(0)";
      buildingsSidebarToggleButton.style.transform = "translateX(0)";
      poisSidebarToggleButton.style.transform = "translateX(0)";
    } else {
      populationSidebarToggleButton.style.transform = "translateX(-200px)";
      buildingsSidebarToggleButton.style.transform = "translateX(-200px)";
      poisSidebarToggleButton.style.transform = "translateX(-200px)";
    }
  });

  sidebar.appendChild(sidebarToggleButton);

  const contentContainer = document.createElement("div");
  contentContainer.classList.add(
    "p-4",
    "space-y-2",
    "h-full",
    "overflow-y-auto"
  );
  sidebar.appendChild(contentContainer);

  for (const placeName in wardCoordinates) {
    const contentElement = document.createElement("div");
    contentElement.textContent = placeName;
    contentElement.classList.add(
      "p-2",
      "text-sm",
      "bg-gray-200",
      "rounded",
      "cursor-pointer",
      "hover:bg-gray-300"
    );
    contentElement.addEventListener("click", () => {
      handleContentInteraction(
        map,
        wardCoordinates[placeName],
        marker,
        updateIsochronesHandler,
        currentProfile
      );
    });
    contentContainer.appendChild(contentElement);
  }
}

function handleContentInteraction(
  map,
  coordinates,
  marker,
  updateIsochronesHandler,
  profile
) {
  map.flyTo({
    center: coordinates,
    zoom: 15,
    speed: 0.4, // Change the speed to slow down the animation
    curve: 1.1,
    bearing: 30, // Rotate the map by 30 degrees
    pitch: 45, // Change the angle of the camera to 45 degrees
  });

  const lngLat = {
    lng: coordinates[0],
    lat: coordinates[1],
  };
  updateIsochronesHandler(lngLat, profile);
}
