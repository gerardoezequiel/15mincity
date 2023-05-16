import { updateIsochrones } from "./00-isochrone.js";
import { addOpenTripLayer, addOtmPopUp } from "./xx-opentripmap.js";
import { createDraggableMarker, addAllControls } from "./ui-controls.js";
import { createBuildingsSidebar } from "./02-buildings-sidebar.js";
import { createPopulationSidebar } from "./01-pop-sidebar.js";
import { createPoiSidebar } from "./03-poi-sidebar.js";
import { createRightSidebar } from "./ui-rightsidebar.js";
import { addEventListeners } from "./ui-interactions.js";
import { addPopulationLayer } from "./01-population.js";
import { addMapboxBuildings3D } from "./02-mapbox-buildings.js";
import { addMapboxPOIs } from "./03-mapbox-poi.js";
import { createLegend } from "./ui-legend.js";
import { addOSMBuildings } from "./02-osm-buildings.js";
import { addOSMPOIs } from "./03-osm-pois.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZWZhY3VuZG9hcmdhbmEiLCJhIjoiY2p3em8wNzkzMHV0eDN6cG9xMDkyY3MweCJ9.BFwFTr19FLGdPHqxA8qkiQ";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/geraezemc/clhme3gc101qe01pgf68n2vo8",
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
  createPopulationSidebar();
  createBuildingsSidebar();
  createPoiSidebar();
  //addOpenTripLayer(map, isochrones); // Add the OpenTripMap layer
  //addPopulationLayer(map, isochrones); // Add the population layer
  //addMapboxBuildings3D(map, isochrones); // Add the OSM data
  //addOSMBuildings(map, isochrones);
  //addMapboxPOIs(map, isochrones); // Add the Mapbox POI layer
  addOSMPOIs(map, isochrones);
  createLegend(map, [5, 10, 15]); // you can add here more isochrones to the legend
}

map.on("load", async () => {
  console.log("Map loaded"); // Log when the map is loaded
  await initializeMap();
  console.log("Map initialized"); // Log when the map is initialized
});
