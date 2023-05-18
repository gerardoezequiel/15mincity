import { updateIsochrones } from "./00-isochrone.js";
import { addPopulationLayer } from "./01-population.js";
import { addOpenTripLayer } from "./xx-opentripmap.js";
import { addOSMBuildings } from "./02-osm-buildings.js";
import { addMapboxBuildings3D } from "./02-mapbox-buildings.js";
import { addMapboxPOIs } from "./03-mapbox-poi.js";
import { addOSMPOIs } from "./03-osm-pois.js"; // Import the addOSMPOIs function
import { poiCategories } from "./zz-15mincategories.js";

let currentProfile = "walking"; // Store the current profile

export function addEventListeners(
  marker,
  map,
  geocoder,
  directions,
  geolocateControl
) {
  let abortControllerOSM = new AbortController(); // Create a separate AbortController instance for OSM requests

  const updateIsochronesHandler = async (lngLat, profile = currentProfile) => {
    // Cancel previous OSM requests if any
    abortControllerOSM.abort();

    // Update the marker position
    marker.setLngLat(lngLat);

    const isochrones = await updateIsochrones(
      map,
      [lngLat.lng, lngLat.lat],
      profile
    );

    // Remove the old layers
    isochrones.forEach((_, index) => {
      const populationLayerId = `population-layer-${index}`;
      const poiLayerId = `poi-${index}`;
      const buildingId = `buildings-${index}`;
      const mapboxPoiId = `Mapbox-POI-${index}`;

      if (map.getLayer(populationLayerId)) {
        map.removeLayer(populationLayerId);
      }

      if (map.getLayer(poiLayerId)) {
        map.removeLayer(poiLayerId);
      }

      if (map.getLayer(buildingId)) {
        map.removeLayer(buildingId);
      }

      if (map.getLayer(mapboxPoiId)) {
        map.removeLayer(mapboxPoiId);
      }

      for (const categoryKey of Object.keys(poiCategories)) {
        for (const subcategoryKey of Object.keys(poiCategories[categoryKey])) {
          const osmPoiID = `${index}-${categoryKey}-${subcategoryKey}-poi`;

          const circleLayerId = `${osmPoiID}-icons`;
          if (map.getLayer(circleLayerId)) {
            map.removeLayer(circleLayerId);
          }

          const textLayerId = `${osmPoiID}-labels`;
          if (map.getLayer(textLayerId)) {
            map.removeLayer(textLayerId);
          }

          if (map.getSource(osmPoiID)) {
            map.removeSource(osmPoiID); // Remove the source only if it exists
          }
        }
      }
    });

    // Add new layers
    //addPopulationLayer(map, isochrones);
    // addOpenTripLayer(map, isochrones);
    addOSMBuildings(map, isochrones);
    // addMapboxPOIs(map, isochrones);


    // Create a new AbortController instance for OSM
    abortControllerOSM = new AbortController();

    // Set up the signal from the AbortController
    const signalOSM = abortControllerOSM.signal;

    addOSMPOIs(map, isochrones, signalOSM);
  };

  // Update isochrones when marker is dragged
  marker.on("dragend", () => {
    const lngLat = marker.getLngLat();
    updateIsochronesHandler(lngLat);
  });

  // Update isochrones when the map is clicked
  map.on("dblclick", (e) => {
    const newCenter = e.lngLat;
    marker.setLngLat(newCenter);
    updateIsochronesHandler(newCenter);
  });

  // Update isochrones when profile changes
  directions.on("profile", (event) => {
    const newProfile = event.profile.split("/").pop();
    currentProfile = newProfile;
    const lngLat = marker.getLngLat();
    updateIsochronesHandler(lngLat, newProfile);
  });

  // Update isochrones when geocoder result is received
  geocoder.on("result", (e) => {
    const newCenter = e.result.geometry.coordinates;
    const lngLat = {
      lng: newCenter[0],
      lat: newCenter[1],
    };
    updateIsochronesHandler(lngLat);
  });

  // Update isochrones when geolocate control is triggered
  geolocateControl.on("geolocate", (e) => {
    const newCenter = {
      lng: e.coords.longitude,
      lat: e.coords.latitude,
    };
    updateIsochronesHandler(newCenter);
  });

  return { updateIsochronesHandler, currentProfile };
}
