mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map-gym",
  style: "mapbox://styles/aelbish/ckqu1yhpo01fn18lcw8busd9n",
  center: user.geometry.coordinates,
  zoom: 12,
});

// Add the control to the map.
map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    placeholder: 'Search "Gym"',
  }).on("result", function (e) {
    new mapboxgl.Marker()
      .setLngLat(e.result.geometry.coordinates) //   .setLngLat(result.geometry.coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<h6><strong>${e.result.text}</strong></h6><p>${e.result.properties.address}</p>`
        )
      )
      .addTo(map);
  })
);

map.addControl(new mapboxgl.FullscreenControl());

map.addControl(new mapboxgl.NavigationControl());
