const places = {
  Barking: [0.0816, 51.5391],
  Barnes: [-0.2429, 51.4778],
  Bromley: [0.0166, 51.4059],
  Croydon: [-0.0936, 51.3714],
  Ealing: [-0.3083, 51.513],
  Enfield: [-0.08, 51.6523],
  Greenwich: [0.0, 51.4767],
  Hackney: [-0.0554, 51.545],
  Hammersmith: [-0.2234, 51.4927],
  Harrow: [-0.3363, 51.5806],
  Havering: [0.1837, 51.5812],
  Hillingdon: [-0.476, 51.5425],
  Hounslow: [-0.3419, 51.4715],
  Islington: [-0.1002, 51.5465],
  Kensington: [-0.1872, 51.502],
  "Kingston upon Thames": [-0.3078, 51.4123],
  Lambeth: [-0.1172, 51.5013],
  Lewisham: [-0.018, 51.4452],
  Merton: [-0.1881, 51.4109],
  Newham: [0.0469, 51.5255],
  Redbridge: [0.0693, 51.559],
  "Richmond upon Thames": [-0.3007, 51.4479],
  Southwark: [-0.08, 51.5035],
  Sutton: [-0.191, 51.3618],
  "Tower Hamlets": [-0.02, 51.5099],
  "Waltham Forest": [-0.0059, 51.5908],
  Wandsworth: [-0.191, 51.4563],
  Westminster: [-0.147, 51.4973],
};

export function createRightSidebar(
  map,
  marker,
  updateIsochronesHandler,
  currentProfile
) {
  const sidebar = document.getElementById("sidebar");

  const contentContainer = document.createElement("div");
  contentContainer.classList.add(
    "p-4",
    "space-y-2",
    "h-full",
    "overflow-y-auto"
  );
  sidebar.appendChild(contentContainer);

  for (const placeName in places) {
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
        places[placeName],
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
