class Map {
  constructor(options) {
    this.map = null;
    this.config = { ...options };
  }

  initMap() {
    const mapOptions = {
      container: "container",
      mapboxApiAccessToken:
        this.config.mapboxApiAccessToken || "your access token",
      mapStyle: "mapbox://styles/mapbox/light-v9",
      initialViewState: {
        longitude: this.config.mapCenter.lng || -122.45,
        latitude: this.config.mapCenter.lat || 37.8,
        zoom: this.config.mapZoom || 15,
      },
      controller: true,
      layers: [],
    };
    new deck.DeckGL(mapOptions);
  }
}


// new deck.ScatterplotLayer({
//   data: [
//     {position: [-122.45, 37.8], color: [255, 0, 0], radius: 100}
//   ],
//   getColor: d => d.color,
//   getRadius: d => d.radius
// })
