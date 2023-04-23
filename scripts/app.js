import { updateIsochrones } from "./isochrone.js";
import { addOpenTripLayer } from "./opentripmap.js";
import { createDraggableMarker, addAllControls } from "./ui-controls.js";
import { createRightSidebar } from "./ui-rightsidebar.js";
import { addEventListeners } from "./ui-interactions.js";
import { addPopulationLayer } from "./population.js";
import { addOSMBuildingsData } from "./buildings.js";
import { addMapboxPOI } from "./mapbox-poi.js";
import { createLegend } from "./legend.js";
import { addOSMPOIs } from "./osmquery.js";


mapboxgl.accessToken =
  "pk.eyJ1IjoiZWZhY3VuZG9hcmdhbmEiLCJhIjoiY2p3em8wNzkzMHV0eDN6cG9xMDkyY3MweCJ9.BFwFTr19FLGdPHqxA8qkiQ";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/geraezemc/clgqzb9q4000g01pg82ok4yfw",
  center: [-0.133583, 51.524776], // UCL coordinates
  zoom: 13,
});

async function initializeMap() {
  let center = map.getCenter();
  const marker = createDraggableMarker(center, map);

  const { geocoder, directions, geolocateControl } = addAllControls(
    map,
    center,
    marker
  );

  addEventListeners(marker, map, geocoder, directions, geolocateControl);

  const isochrones = await updateIsochrones(
    map,
    [center.lng, center.lat],
    "walking"
  );

  const profile = "walking"; // Define the profile variable here
  
  const { updateIsochronesHandler, currentProfile } = addEventListeners(
    marker,
    map,
    geocoder,
    directions,
    geolocateControl
  );
  createRightSidebar(map, marker, updateIsochronesHandler, currentProfile);
  //addOpenTripLayer(map, isochrones); // Add the OpenTripMap layer
  //addPopulationLayer(map, isochrones); // Add the population layer
  addOSMBuildingsData(map); // Add the OSM data
  //addMapboxPOI(map, isochrones); // Add the Mapbox POI layer
  //addOSMPOIs(map, isochrones);
  createLegend(map); // Add the legend
}

map.on("load", async () => {
  console.log("Map loaded"); // Log when the map is loaded
  await initializeMap();
  console.log("Map initialized"); // Log when the map is initialized
});
