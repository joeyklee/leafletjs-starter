let map;
// Where all the magic happens
window.addEventListener("DOMContentLoaded", async () => {
  const options = {
    mapId: "app", // corresponds to the <div id="app"></div>
    center: {
      lat: 51.505,
      lng: -0.09,
    },
    zoom: 13,
  };

  // setup your map
  app = new Map(options);

  // add data on top
  const marker = createMarker();
  const circle = createCircle();
  const line = createLine();
  const polygon = createPolygon();
  const grid = createStyledGeoJSON();

  app.addLayer(marker);
  app.addLayer(circle);
  app.addLayer(line);
  app.addLayer(polygon);
  app.addLayer(grid);
});

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

/**
 * style a geojson based on a property
 */
function createStyledGeoJSON() {
  const squareGrid = createGrid();

  return L.geoJSON(squareGrid, {
    style: function (geojsonfeature) {
      return {
        fillColor: `rgb(${geojsonfeature.properties.random}, 100, 100)`,
        fillOpacity: 1,
        stroke: true,
        color:"yellow"
      };
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`I have ${feature.properties.random} ideas for a new project`)
    }
  });
}

/**
 * create a grid using turf.js
 */
function createGrid(){
  const bbox = [
    -0.10394096374511719,
    51.499980636437265,
    -0.09364128112792969,
    51.50788772102843,
  ];
  const cellSize = 100;
  const options = { units: "meters" };

  const squareGrid = turf.squareGrid(bbox, cellSize, options);
  squareGrid.features = squareGrid.features.map((feature) => {
    feature.properties.random = Math.floor(Math.random() * 256);
    return feature;
  });

  return squareGrid;
}