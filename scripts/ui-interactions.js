import { updateIsochrones } from "./00-isochrone.js";
import { addPopulationLayer } from "./01-population.js";
import { addOpenTripLayer } from "./xx-opentripmap.js";
import { addOSMBuildings } from "./02-osm-buildings.js";
import { addMapboxBuildings3D } from "./02-mapbox-buildings.js";
import { addMapboxPOIs } from "./03-mapbox-poi.js";
import { addOSMPOIs } from "./03-osm-pois.js";
import { poiCategories } from "./zz-15mincategories.js";
import { createPoiChart } from "./03-poi-chart.js";

let currentProfile = "walking"; // Store the current profile
let abortControllerOSM = new AbortController(); // Create a separate AbortController instance for OSM requests

export async function addEventListeners(
  marker,
  map,
  geocoder,
  directions,
  geolocateControl,
  existingChart
) {
  const updateIsochronesHandler = async (lngLat, profile = currentProfile) => {
    // Cancel previous OSM requests if any
    abortControllerOSM.abort();
    abortControllerOSM = new AbortController();

    // Update the marker position
    marker.setLngLat(lngLat);

    const removeOSMPOILayers = () => {
      const sources = map.getStyle().sources;
      const layers = map.getStyle().layers;

      for (const layer of layers) {
        if (layer.id.includes("-poi")) {
          map.removeLayer(layer.id);
        }
      }

      for (const sourceId in sources) {
        if (sourceId.includes("-poi")) {
          map.removeSource(sourceId);
        }
      }
    };

    // Remove the old OSM POI layers and sources
    removeOSMPOILayers();

    const isochrones = await updateIsochrones(
      map,
      [lngLat.lng, lngLat.lat],
      profile
    );

    // Remove the other layers if needed
    //addPopulationLayer(map, isochrones);
    // addOpenTripLayer(map, isochrones);
    addOSMBuildings(map, isochrones);
    // addMapboxPOIs(map, isochrones);
    addOSMPOIs(map, isochrones, abortControllerOSM.signal);

    // Update the data of the existing chart
    const { dataSet5min, dataSet10min, dataSet15min } = poiCategories;
    existingChart.data(dataSet5min.mapAs({ x: 'Category', value: 'percentage' }));
    existingChart.data(dataSet10min.mapAs({ x: 'Category', value: 'percentage' }));
    existingChart.data(dataSet15min.mapAs({ x: 'Category', value: 'percentage' }));

    existingChart.draw(); // Redraw the chart with updated data
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

  // Create the POI chart and append it to the content container
  const chartContainer = document.getElementById("chart-container");
  const chart = await createPoiChart();
  if (chart !== undefined) {
    existingChart = chart; // Assign the created chart to existingChart
    chart.container(chartContainer);
    chart.draw();
  } else {
    console.error("Chart is undefined");
  }

  return { updateIsochronesHandler, currentProfile, existingChart };
}
