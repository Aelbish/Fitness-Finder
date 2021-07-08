mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/dark-v10", // style URL
  center: user.geometry.coordinates, // starting position [lng, lat]
  zoom: 12, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
  .setLngLat(user.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h6><strong>${user.username}</strong></h6><p>${user.location}</p>`
    )
  )
  .addTo(map);
