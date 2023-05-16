export function createDraggableMarker(center, map) {
  let marker = new mapboxgl.Marker({ draggable: true })
    .setLngLat(center)
    .addTo(map);

  return marker;
}

export function addAllControls(map, center, marker) {
  // Add geocoder control to the map
  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    placeholder: "Search your address",
    proximity: { longitude: -0.1276, latitude: 51.5074 },
  });

   geocoder.on("result", (e) => {
     const newCenter = e.result.geometry.coordinates;
     map.flyTo({
       center: newCenter,
       zoom: 14,
     });
   });

  map.addControl(geocoder, "top-right");

  

   const directions = new MapboxDirections({
     accessToken: mapboxgl.accessToken,
     unit: "metric",
     profile: "mapbox/walking",
     controls: { inputs: true, instructions: false },
     interactive: false,
     coordinates: [marker.getLngLat().toArray(), null],
   });

  map.addControl(directions, "bottom-right");
  
  // Add zoom and rotation controls to the map.
  map.addControl(new mapboxgl.NavigationControl());
  map.addControl(new mapboxgl.FullscreenControl());

  // Add geolocate control to the map
  const geolocateControl = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
  });

  map.addControl(geolocateControl);

  // Add scale bar control to the map
  map.addControl(
    new mapboxgl.ScaleControl({
      maxWidth: 100,
      unit: "metric",
    }),
    "bottom-right"
  );

 
  
  // Removing the driving and driving traffic buttons
  document
    .querySelector('label[for="mapbox-directions-profile-driving-traffic"]')
    .remove();
  document
    .querySelector('label[for="mapbox-directions-profile-driving"]')
    .remove();

  return { geocoder, directions, geolocateControl };
}
