let mymap;
window.addEventListener("DOMContentLoaded", async () => {
  const options = {
    mapboxApiAccessToken:
      "pk.eyJ1Ijoiam9leWtsZWUiLCJhIjoiMlRDV2lCSSJ9.ZmGAJU54Pa-z8KvwoVXVBw",
    mapCenter: {
      lat: 40.693338,
      lng: -73.987366,
    },
    mapZoom: 14,
  };
  mymap = new Map(options);

  mymap.addPoint([-73.987366, 40.693338], {radius: 200}, 'circle');
});
