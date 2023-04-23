export async function addOSMPOIs(map, isochrones) {
  const overpassApiUrl = "https://overpass-api.de/api/interpreter";
  const isochronePolygons = isochrones.map((iso) =>
    turf.polygon(iso.geometry.coordinates)
  );

  const query = `
    [out:json][timeout:60];
    (
      ${isochronePolygons
        .map((polygon) => {
          const bbox = turf.bbox(polygon);
          return `
          nwr[amenity](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
          nwr[shop](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
          nwr[tourism](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
        `;
        })
        .join("")}
    );
    out body;
    >;
    out skel qt;
  `;

  const response = await fetch(
    `${overpassApiUrl}?data=${encodeURIComponent(query)}`
  );
  const data = await response.json();
  const geojson = osmtogeojson(data);

  map.addSource("osm-poi", {
    type: "geojson",
    data: geojson,
  });

  const poiColors = {
    amenity: "#f00", // Red
    shop: "#0f0", // Green
    tourism: "#00f", // Blue
    // Add more categories and colors as needed
  };

  // Add a circle layer for icons
  map.addLayer({
    id: "osm-poi-icons",
    type: "circle",
    source: "osm-poi",
    paint: {
      "circle-radius": 5,
      "circle-color": [
        "coalesce",
        ["get", "category", ["literal", poiColors]],
        "#000",
      ],
      "circle-opacity": 0.8,
    },
  });

  // Add a text layer for labels
  map.addLayer({
    id: "osm-poi-labels",
    type: "symbol",
    source: "osm-poi",
    layout: {
      "text-field": ["get", "name"],
      "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
      "text-offset": [0, 1.5], // Adjust the offset to position the label correctly
      "text-anchor": "top",
      "text-size": 12,
    },
    paint: {
      "text-color": "#000",
      "text-halo-color": "rgba(255, 255, 255, 0.8)",
      "text-halo-width": 1,
    },
  });
}
