// Where all the magic happens
window.addEventListener("DOMContentLoaded", async () => {
  const options = {
    mapId: "app", // corresponds to the <div id="app"></div>
    // see .setView() below
    center: {
      lat: 51.505,
      lng: -0.09,
    },
    zoom: 13,
  };
  // setup your map
  const map = createMap(options);

  // add data on top
  const marker = createMarker();
  const circle = createCircle();
  const line = createLine();
  const polygon = createPolygon();

  marker.addTo(map);
  circle.addTo(map);
  line.addTo(map);
  polygon.addTo(map);
});

// -------------------- Lots of nice functions below --------------------- //

// ==================== Map setup functions ============================== //
/**
 * Create a map
 */
function createMap(options) {
  // handle url search parameters
  getURLParams(options);

  // create a map object
  const map = L.map(options.mapId).setView(options.center, options.zoom);
  // add basemap tiles
  const tiles = addOSMTiles(); // OR addMapboxTiles(<api token>, 'light-v10'); if you have a mapbox access token you can also used those instead
  tiles.addTo(map);

  // add controls
  const scalebar = createScaleBar();
  const sidebar = createSidebar();
  map.addControl(sidebar);
  map.addControl(scalebar);

  // handle url search parameters
  map.on("moveend", () => {
    const coords = map.getCenter();
    const zoom = map.getZoom();

    setURLParams(coords.lat, coords.lng, zoom);
  });

  return map;
}

/**
 * Returns leafet scalebarobject
 */
function createScaleBar() {
  return L.control.scale();
}

/**
 * check the URL query parameters on load
 */
function getURLParams(options) {
  const searchParams = new URLSearchParams(window.location.search);

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const zoom = searchParams.get("zoom");

  options.center.lat = searchParams.has("lat") ? lat : options.center.lat;
  options.center.lng = searchParams.has("lng") ? lng : options.center.lng;
  options.zoom = searchParams.has("zoom") ? zoom : options.zoom;

  setURLParams(options.center.lat, options.center.lng, options.zoom);
}

/**
 * set the URL query parameters
 * @param {*} lat
 * @param {*} lng
 * @param {*} zoom
 */
function setURLParams(lat, lng, zoom) {
  const searchParams = new URLSearchParams();
  searchParams.set("lat", lat);
  searchParams.set("lng", lng);
  searchParams.set("zoom", zoom);

  window.history.replaceState(null, null, `?${searchParams.toString()}`);
}

/**
 * add osm tiles
 */
function addOSMTiles() {
  // adds a open streetmap tile layer
  return L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  });
}

/**
 * add mapbox tiles if you have an access token
 * @param {*} mapboxAccessToken
 * @param {*} styleName: light-v10, dark-v10, outdoors-v11, satellite-v9
 */
function addMapboxTiles(mapboxAccessToken, styleName = "light-v10") {
  return L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: `mapbox/${styleName}`,
      tileSize: 512,
      zoomOffset: -1,
      accessToken: mapboxAccessToken || "your.mapbox.access.token",
    }
  );
}

/**
 * Add the sidebar
 */
function createSidebar() {
  const sidebar = L.control.sidebar("sidebar", {
    position: "left",
  });

  setTimeout(function () {
    sidebar.show();
  }, 2000);

  return sidebar;
}

// ==================== data layer functions ============================== //

/**
 * add a marker
 */
function createMarker() {
  return L.marker([51.5, -0.09])
    .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
    .openPopup();
}

/**
 * add a circle
 */
function createCircle() {
  return L.circle([51.5, -0.085], 50).bindPopup(
    "A pretty CSS3 popup.<br> Easily customizable."
  );
}

/**
 * add a circle
 */
function createLine() {
  return L.polyline([
    [51.502, -0.085],
    [51.503, -0.086],
    [51.504, -0.087],
  ]).bindPopup("A pretty CSS3 popup.<br> Easily customizable.");
}

/**
 * add a circle
 */
function createPolygon() {
  return L.polygon([
    [51.502358248689035, -0.07604598999023438],
    [51.50088895238906, -0.07819175720214844],
    [51.49883185798456, -0.07591724395751953],
    [51.50040808149318, -0.06965160369873047],
    [51.50246510475389, -0.0739431381225586],
    [51.502358248689035, -0.07604598999023438],
  ]).bindPopup("A pretty CSS3 popup.<br> Easily customizable.");
}
