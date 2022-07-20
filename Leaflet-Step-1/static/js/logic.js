// Tile Layer for Map
var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/outdoors-v11",
  accessToken: API_KEY
});

// City of Los Angeles as the Centerpoint and Panned Out to See Entire Country
var map = L.map("map", {
  center: [
    34.0522, -118.2437
  ],
  zoom: 2
});

// Adds "Outdoors" Tile Layer to Map
outdoors.addTo(map);

// // Retrieves Earthquake geoJSON Data (Weekly)
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {


  // Retrieves Coordinates & Magnitude from JSON file
  // Passes the Earthquake's Magnitude into Two Separate Functions to Calculate Color and Radius
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  function getColor(depth) {
    switch (true) {
    case depth > 90:
      return "#FF6663";
    case depth > 70:
      return "#FEB144"; 
    case depth > 50:
      return "#FDFD97";
    case depth > 30:
      return "#9EE09E";
    case depth > 10:
      return "#9EC1CF";
    default:
      return "#CC99C9";
    }
  }

  // Ensures Radius Based Upon Magnitude & Magnifies Radius
  // Fixes Incorrectly Plotted 0 Magnitude Earthquakes 
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 2.5;
  }

  // Adds Map's GeoJSON Layer
  L.geoJson(data, {
    // Converts Earthquake Features as circleMarker
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    // Stylizes circleMarkers
    style: styleInfo,
    // Creates Marker Popup to Display Earthquake's Magnitude and Location
    onEachFeature: function(feature, layer) {
      layer.bindPopup(
        "Magnitude: "
          + feature.properties.mag
          + "<br>Depth: "
          + feature.geometry.coordinates[2]
          + "<br>Location: "
          + feature.properties.place
      );
    }
  }).addTo(map);

  // Creates Legend
  var legend = L.control({
    position: "bottomright"
  });

  // Adds Legend's Details
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    // Adds Legend's Description
    var grades = [0, 10, 30, 50, 70, 90];
    var colors = [
      "#CC99C9",
      "#9EC1CF",
      "#9EE09E",
      "#FDFD97",
      "#FEB144",
      "#FF6663"
    ];

    // Loops through Legend's Perameters to Create Colored Labels.
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
      + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Adds Map's Legend
  legend.addTo(map);
});