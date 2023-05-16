const apiKey = "5ae2e3f221c38a28845f05b6ed0662748f2fdf24cede18cf28fcee8a";

export function addOpenTripLayer(map, isochrones) {
  const id = "open-trip-layer";
  if (map.getLayer(id)) {
    return; // Do not add the layer if it already exists
  }

  if (!map.getSource(sourceId)) {
    map.addSource(sourceId, {
      type: "vector",
      attribution:
        '<a href="https://opentripmap.io" target="_blank">© OpenTripMap</a>',
      bounds: [-180, -85.0511, 180, 85.0511],
      minzoom: 10,
      maxzoom: 20,
      scheme: "xyz",
      tiles: [
        `https://api.opentripmap.com/0.1/en/tiles/pois/{z}/{x}/{y}.pbf?kinds=interesting_places,tourist_facilities,sport&rate=3&apikey=${apiKey}`,
      ],
    });
  }

  isochrones.forEach((isochrone, index) => {
    const currentLayerId = `poi-${index}`;

    if (map.getLayer(currentLayerId)) {
      map.setFilter(currentLayerId, ["all", ["within", isochrone]]);
    } else {
      map.addLayer({
        id: currentLayerId,
        type: "circle",
        source: sourceId,
        "source-layer": "pois",
        minzoom: 10,
        maxzoom: 20,
        paint: {
          "circle-color": "rgba(55,144,144, 0.5)",
          "circle-radius": 3,
          "circle-stroke-color": "rgba(102,193,201, 0.6)",
          "circle-stroke-width": 0.01,
        },
        filter: ["all", ["within", isochrone]],
      });
    }
  });
};

//Query for the pop-up information
export const addOtmPopUp = ({ map }) => {
  const apiGet = async (method, query) => {
    const url =
      query !== undefined
        ? `https://api.opentripmap.com/0.1/en/places/${method}?apikey=${apiKey}&${query}`
        : `https://api.opentripmap.com/0.1/en/places/${method}?apikey=${apiKey}`;

    const response = await fetch(url);
    return await response.json();
  };

  function onShowPOI(data, lngLat) {
    let poi = document.createElement('div');
    poi.innerHTML = `<h2>${data.name}<h2>`;
    poi.innerHTML += `<p><i>${getCategoryName(data.kinds)}</i></p>`;
    if (data.preview) {
      poi.innerHTML += `<img src='${data.preview.source}'>`;
    }
    poi.innerHTML += data.wikipedia_extracts
      ? data.wikipedia_extracts.html
      : data.info
      ? data.info.descr
      : 'No description';

    /* poi.innerHTML += `<p><a target='_blank' href='${data.otm}'>Show more at OpenTripMap</a></p>`; */

    new mapboxgl.Popup().setLngLat(lngLat).setDOMContent(poi).addTo(map);

    const popup = document.getElementsByClassName('mapboxgl-popup');
    if (popup.length) {
      popup[0].remove();
    }
  }
  map.on('mouseenter', 'Interesting places', (e) => {
    map.getCanvas().style.cursor = 'pointer';
    const coordinates = e.features[0].geometry.coordinates.slice();
    const id = e.features[0].properties.id;
    const name = e.features[0].properties.name;

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    apiGet(`xid/${id}`).then((data) => onShowPOI(data, e.lngLat));
  });

  //Show popup by mousemove

  let popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });

  map.on('mouseenter', 'Interesting places', (e) => {
    map.getCanvas().style.cursor = 'pointer';

    let coordinates = e.features[0].geometry.coordinates.slice();
    let id = e.features[0].properties.id;
    let name = e.features[0].properties.name;

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    popup.setLngLat(coordinates).setHTML(`<strong>${name}</strong>`).addTo(map);
  });

  map.on('mouseleave', 'Interesting places', () => {
    map.getCanvas().style.cursor = '';
    popup.remove();
  });
};
