class Map {
  constructor(options) {
    this.map = null;
    this.layers = null;
    this.sidebar = null;

    this.options = {
      mapboxAccessToken: options.mapboxAccessToken || "<your mapbox api token>",
      center: {
        lat: options.center.lat || 51.505,
        lng: options.center.lng || -0.09,
      },
      zoom: options.zoom || 14,
      mapId: options.mapId || "map",
    };

    // call initialize
    this.init();
  }

  /**
   * initialize everything
   */
  init() {
    // handle url search parameters
    this.getURLParams();
    this.initMap();
    this.initMapControls();
    this.initMapEvents();
  }
  /**
   * Create a map
   */
  initMap() {
    // create a map object
    this.map = L.map(this.options.mapId).setView(
      this.options.center,
      this.options.zoom
    );
    // add basemap tiles
    const tiles = this.addOSMTiles();
    // this.addMapboxTiles(<api token>, 'light-v10'); if you have a mapbox access token you can also used those instead
    tiles.addTo(this.map);

    this.layers = L.layerGroup([]).addTo(this.map);
  }

  /**
   * create controls and add them to map
   */
  initMapControls() {
    // add controls
    const scalebar = this.createScaleBar();
    this.sidebar = this.createSidebar();
    this.map.addControl(this.sidebar);
    this.map.addControl(scalebar);
  }

  /**
   * initialize map events
   */
  initMapEvents() {
    // handle url search parameters
    this.map.on("moveend", () => {
      const coords = this.map.getCenter();
      const zoom = this.map.getZoom();

      this.setURLParams(coords.lat, coords.lng, zoom);
    });
  }

  /**
   * Returns leafet scalebarobject
   */
  createScaleBar() {
    return L.control.scale();
  }

  /**
   * check the URL query parameters on load
   */
  getURLParams() {
    const searchParams = new URLSearchParams(window.location.search);

    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const zoom = searchParams.get("zoom");

    this.options.center.lat = searchParams.has("lat")
      ? lat
      : this.options.center.lat;
    this.options.center.lng = searchParams.has("lng")
      ? lng
      : this.options.center.lng;
    this.options.zoom = searchParams.has("zoom") ? zoom : this.options.zoom;

    this.setURLParams(
      this.options.center.lat,
      this.options.center.lng,
      this.options.zoom
    );
  }

  /**
   * set the URL query parameters
   * @param {*} lat
   * @param {*} lng
   * @param {*} zoom
   */
  setURLParams(lat, lng, zoom) {
    const searchParams = new URLSearchParams();
    searchParams.set("lat", lat);
    searchParams.set("lng", lng);
    searchParams.set("zoom", zoom);

    window.history.replaceState(null, null, `?${searchParams.toString()}`);
  }

  /**
   * add osm tiles
   */
  addOSMTiles() {
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
  addMapboxTiles(mapboxAccessToken, styleName = "light-v10") {
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
  createSidebar() {
    const sidebar = L.control.sidebar("sidebar", {
      position: "left",
    });

    setTimeout(function () {
      sidebar.show();
    }, 2000);

    return sidebar;
  }

  /**
   * Adds a marker, line, polygon, or geojson as a layer
   * @param {*} leafletDataObject
   */
  addLayer(leafletDataObject) {
    this.layers.addLayer(leafletDataObject);
  }

  scaleData(geojson, options = null){
    const values = geojson.features.map(
      (feature) => feature.properties[options.field]
    );
    const min = d3.min(values);
    const max = d3.max(values);

    const legendDomain = [min, max];
    const legendRange = options.legendRange
      ? options.legendRange
      : [
          "rgb(0,100,100)",
          "rgb(50,100,100)",
          "rgb(100,100,100)",
          "rgb(200,100,100)",
          "rgb(255,100,100)",
        ];

    var quantize = d3.scaleQuantize().domain(legendDomain).range(legendRange);
    return quantize;

  }

  /**
   *
   * @param {*} geojson
   * @param {*} options: {
   *    field: String - should be the name of property you are making a legend for,
   *    legendTitle: String - should be title of your legend item,
   *    legendRange: Array - should be an array of color values OR size values depending on how you have styled your data
   * }
   */
  addLegend(legendScale, options = null) {
    const legendContainer = d3.select("#legend");
    const svg = legendContainer.append("svg");

    svg
      .append("g")
      .attr("class", "legendQuant")
      .attr("transform", "translate(10,10)");

    let legend;
    if (options.type === "color") {
      legend = d3
        .legendColor()
        .labelFormat(d3.format(".2f"))
        .useClass(false)
        .title(options.title)
        .titleWidth(100)
        .scale(legendScale);
    } else if (options.type === "size") {
      legend = d3
        .legendSize()
        .shape("circle")
        .shapePadding(5)
        .labelFormat(d3.format(".2f"))
        .title(options.title)
        .titleWidth(100)
        .scale(legendScale);
    } else {
      legend = d3
        .legendColor()
        .labelFormat(d3.format(".2f"))
        .useClass(false)
        .title(options.title)
        .titleWidth(100)
        .scale(legendScale);
    }

    svg.select(".legendQuant").call(legend);
  }
}
