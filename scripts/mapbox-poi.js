const poiCategories = {
  apartment: "Living",
  campsite: "Living",
  charging_station: "Living",
  dog_park: "Living",
  garden: "Living",
  harbor: "Living",
  park: "Living",
  picnic_site: "Living",
  residential_area: "Living",
  viewpoint: "Living",
  bank: "Working",
  communications_tower: "Working",
  embassy: "Working",
  fire_station: "Working",
  office: "Working",
  police: "Working",
  post: "Working",
  prison: "Working",
  town_hall: "Working",
  alcohol_shop: "Commerce",
  bakery: "Commerce",
  bicycle: "Commerce",
  car_rental: "Commerce",
  car_repair: "Commerce",
  clothing_store: "Commerce",
  confectionery: "Commerce",
  convenience: "Commerce",
  farmers_market: "Commerce",
  fuel: "Commerce",
  furniture: "Commerce",
  grocery: "Commerce",
  hardware: "Commerce",
  jewelry_store: "Commerce",
  mobile_phone: "Commerce",
  shoe: "Commerce",
  shop: "Commerce",
  watch: "Commerce",
  dentist: "Healthcare",
  doctor: "Healthcare",
  hospital: "Healthcare",
  pharmacy: "Healthcare",
  veterinary: "Healthcare",
  college: "Education",
  library: "Education",
  school: "Education",
  american_football: "Entertainment",
  amusement_park: "Entertainment",
  aquarium: "Entertainment",
  art_gallery: "Entertainment",
  attraction: "Entertainment",
  bar: "Entertainment",
  basketball: "Entertainment",
  beach: "Entertainment",
  beer: "Entertainment",
  bowling_alley: "Entertainment",
  bridge: "Entertainment",
  cafe: "Entertainment",
  casino: "Entertainment",
  castle: "Entertainment",
  cinema: "Entertainment",
  fitness_centre: "Entertainment",
  globe: "Entertainment",
  golf: "Entertainment",
  horse_riding: "Entertainment",
  ice_cream: "Entertainment",
  information: "Entertainment",
  marker: "Entertainment",
  monument: "Entertainment",
  museum: "Entertainment",
  music: "Entertainment",
  optician: "Entertainment",
  parking: "Entertainment",
  parking_garage: "Entertainment",
  pitch: "Entertainment",
  playground: "Entertainment",
  religious_buddhist: "Entertainment",
  religious_christian: "Entertainment",
  religious_jewish: "Entertainment",
  religious_muslim: "Entertainment",
  restaurant: "Entertainment",
  restaurant_noodle: "Entertainment",
  restaurant_pizza: "Entertainment",
  restaurant_seafood: "Entertainment",
  skateboard: "Entertainment",
  slipway: "Entertainment",
  stadium: "Entertainment",
  suitcase: "Entertainment",
  swimming: "Entertainment",
  table_tennis: "Entertainment",
  tennis: "Entertainment",
  theatre: "Entertainment",
  toilet: "Entertainment",
  volleyball: "Entertainment",
  watermill: "Entertainment",
  windmill: "Entertainment",
  zoo: "Entertainment",
};

const poiColors = {
  Living: "rgba(230, 97, 1, 0.8)",
  Working: "rgba(43, 61, 159, 0.8)",
  Commerce: "rgba(129, 199, 132, 0.8)",
  Entertainment: "rgba(255, 214, 0, 0.8)",
  Healthcare: "rgba(211, 47, 47, 0.8)",
  Education: "rgba(149, 117, 205, 0.8)",
  Unknown: "rgba(189, 189, 189, 0.8)",
};

export function addMapboxPOI(map, isochrones = []) {
  map.addSource("mapbox-poi", {
    type: "vector",
    url: "mapbox://mapbox.mapbox-streets-v8",
  });

  isochrones.forEach((isochrone, index) => {
    const currentLayerId = `POI-${index}`;

    if (!map.getLayer(currentLayerId)) {
      // Add POI layer
      map.addLayer({
        id: currentLayerId,
        type: "symbol",
        source: "mapbox-poi",
        "source-layer": "poi_label",
        minzoom: 13,
        layout: {
          "icon-image": [
            "match",
            ["get", "maki"],
            "apartment",
            "apartment-15",
            "",
          ],
          "icon-size": 1,
          "text-field": [
            "match",
            ["get", "maki"],
            "apartment",
            ["get", "name"],
            "",
          ],
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-offset": [0, 0.6],
          "text-anchor": "top",
          "text-size": 12,
          "text-halo-color": ["get", "category"],
          "text-halo-width": 1,
        },
        paint: {
          "text-halo-color": "rgba(0, 0, 0, 0.85)",
          "text-halo-width": 1,
        },
        filter: ["all", ["within", isochrone]],
      });
    } else {
      map.setFilter(currentLayerId, ["all", ["within", isochrone]]);
    }
  });

  // Log feature properties on click
  map.on("click", (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: isochrones.map((_, index) => `POI-${index}`),
    });

    if (features.length > 0) {
      console.log(features[0].properties);
    }
  });
}