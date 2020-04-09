class Map {
  constructor(options) {
    this.map = null;
    this.layers = null;
    this.config = { ...options };

    // initialize the map
    this.initMap();
  }

  /**
   * Handles map initialization
   */
  initMap() {
    const mapOptions = {
      center: this.config.mapCenter || { lat: 0, lng: 0 },
      zoom: this.config.mapZoom || 10,
    };

    const mapId = this.config.mapId || "app";
    this.map = L.map(mapId, mapOptions);
    this.addTiles();

    // add a leaflet layer group to hold our layers
    this.layers = L.layerGroup([]).addTo(this.map);
  }

  /**
   * handles adding tile layers to map
   */
  addTiles(){
    if (this.config.mapboxApiAccessToken) {
      const mapboxTiles = this.addMapboxTiles(this.config.mapboxApiAccessToken);
      mapboxTiles.addTo(this.map);
    } else {
      const osmTiles = this.addOSMTiles();
      osmTiles.addTo(this.map);
    }
  }

  /**
   * returns tileLayer: mapbox tiles
   * @param {*} mapboxAccessToken 
   */
  addMapboxTiles(mapboxAccessToken) {
    return L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken: mapboxAccessToken || "your.mapbox.access.token",
      }
    );
  }

  /**
   * returns tileLayer: mapbox tiles
   */
  addOSMTiles() {
    return L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });
  }

  addPoint(coordArray, properties, pointStyle = 'marker'){
    const point = turf.point(coordArray, properties);

    const marker = L.geoJSON(point, {
      pointToLayer: function(geoJsonPoint, latlng) {
        if(pointStyle === 'marker') return L.marker(latlng);
        return L.circle(latlng, properties.radius);
      }
    });
    marker.addTo(this.layers);
  }

}
