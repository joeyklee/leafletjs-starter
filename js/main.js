let app;
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

  /* ------------ Simple layers --------------- */
  // Simple Layers: Add layers to your map - these are "simple layers"
  const marker = createMarker();
  const circle = createCircle();
  const line = createLine();
  const polygon = createPolygon();
  // add those layers to the map
  app.addLayer(marker);
  app.addLayer(circle);
  app.addLayer(line);
  app.addLayer(polygon);
  

  /* ------------ More complex layers --------------- */
  
  /** 
  * A choropleth map from geojson with a legend
  */
  // Step 1: define legend options
  const legendOptions = {
    field: "random",
    legendRange: [
      "rgb(0,100,100)",
      "rgb(50,100,100)",
      "rgb(100,100,100)",
      "rgb(200,100,100)",
      "rgb(255,100,100)",
    ],
  };
  // Step 2: get or create your geojson data - usually you would request data 
  const gridData = createGrid();
  // Step 3: create your leaflet geojson layer
  const grid = createStyledGeoJSON(gridData, legendOptions);
  // Step 4: add your layer to the map
  app.addLayer(grid);
  // Step 5: add your legend
  app.addLegend( app.scaleData(gridData , legendOptions), {title:"random color", type: "color"});

  /** 
  * A proportional symbol map from geojson with a legend
  */
  // Step 1: define legend options
  const legendOptionsSize = {
    field: "random",
    legendRange: [4, 6, 8, 10, 12],
  };
  // Step 2: get or create your geojson data - usually you would request data 
  const randomPointData = createRandomPoints();
  // Step 3: create your leaflet geojson layer
  const randomPoints = createStyledGeoJSONPoints(randomPointData, legendOptionsSize);
  // Step 4: add your layer to the map
  app.addLayer(randomPoints);
  // Step 5: add your legend
  app.addLegend(app.scaleData(randomPointData, legendOptionsSize), {title:"point size", type: "size"});
  
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
 * create a grid using turf.js
 */
function createGrid() {
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

/**
 * style a geojson based on a property
 */
function createStyledGeoJSON(polygonData, legendOptions) {
  const scale = app.scaleData(polygonData, legendOptions);

  return L.geoJSON(polygonData, {
    style: function (geojsonfeature) {
      return {
        fillColor: scale(geojsonfeature.properties[legendOptions.field]),
        fillOpacity: 1,
        stroke: true,
        color: "yellow",
      };
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        `I have ${feature.properties[legendOptions.field]} ideas for a new project`
      );
    },
  });
}

/**
 * create a grid using turf.js
 */
function createRandomPoints() {
  const bbox = [
    -0.1105499267578125,
    51.489774195241196,
    -0.09441375732421875,
    51.49778991760289,
  ];
  const randomPoints = turf.randomPoint(50, { bbox: bbox });

  randomPoints.features = randomPoints.features.map((feature) => {
    feature.properties.random = Math.floor(Math.random() * 256);
    return feature;
  });

  return randomPoints;
}

function createStyledGeoJSONPoints(pointData, legendOptions) {
  const scale = app.scaleData(pointData, legendOptions);
  
  return L.geoJSON(pointData, {
    pointToLayer: function (geoJsonPoint, latlng) {
      return L.circle(latlng, scale(geoJsonPoint.properties[legendOptions.field]));
    },
    style: function (geojsonfeature) {
      return {
        fillColor: `red`,
        fillOpacity: 1,
        color:'red'
      };
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        `I have ${feature.properties[legendOptions.field]} ideas for a new project`
      );
    },
  });
}
