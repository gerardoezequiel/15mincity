import { updateIsochrones } from "./isochrone.js";
import { addPopulationLayer } from "./population.js";
import { addOpenTripLayer } from "./opentripmap.js";

let currentProfile = "walking"; // Store the current profile

export function addEventListeners(
  marker,
  map,
  geocoder,
  directions,
  geolocateControl
) {

  const updateIsochronesHandler = async (lngLat, profile = currentProfile) => {
    // Update the marker position
    marker.setLngLat(lngLat);

    const isochrones = await updateIsochrones(
      map,
      [lngLat.lng, lngLat.lat],
      profile
    );

    // Remove the old population layers and POI layers
    isochrones.forEach((_, index) => {
      const populationLayerId = `population-layer-${index}`;
      const poiLayerId = `poi-${index}`;

      if (map.getLayer(populationLayerId)) {
        map.removeLayer(populationLayerId);
      }

      if (map.getLayer(poiLayerId)) {
        map.removeLayer(poiLayerId);
      }
    });

    // Add new population layers and POI layers
    addPopulationLayer(map, isochrones);
    addOpenTripLayer(map, isochrones);
  };
  
  // Update isochrones when marker is dragged
  marker.on("dragend", () => {
    const lngLat = marker.getLngLat();
    updateIsochronesHandler(lngLat);
  });

  // Update isochrones when the map is clicked
  map.on("click", (e) => {
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
