var lightmap = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY,
  }
);

// Create a baseMaps object to hold the lightmap layer
var baseMaps = {
  "Light Map": lightmap,
};

// Create the map object with options
var map = L.map("mapid", {
  center: [39.8283, -98.5795],
  zoom: 4,
  layers: [lightmap],
});

lightmap.addTo(map);

d3.json(
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {
    // style for circles
    function styleInfo(feature) {
      return {
        radius: getRadius(feature.properties.mag),
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      };
    }

    // create radius for circles
    function getRadius(magnitude) {
      return magnitude * 4;
    }
    // create different colors for depth
    function getColor(depth) {
      switch (true) {
        case depth > 5:
          return "#810f7c";
        case depth > 4:
          return "#810f7c ";
        case depth > 3:
          return "#8856a7";
        case depth > 2:
          return "#8c96c6";
        case depth > 1:
          return "#b3cde3";
        default:
          return "#edf8fb";
      }
    }

    L.geoJson(data, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
      },
      style: styleInfo,
      onEachLayer: function (feature, layer) {
        layer.bindPopup(
          "Magnitude: " +
            feature.properties.mag +
            "<br> Depth: " +
            feature.geometry.coordinates[2]
        );
      },
    }).addTo(map);

    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function (map) {
      var div = L.DomUtil.create("div", "info legend"),
        mags = [0, 1, 2, 3, 4, 5];

      // loop through intervals and generate a colored square for each
      for (var i = 0; i < mags.length; i++) {
        div.innerHTML +=
          '<i style="background:' +
          getColor(mags[i] + 1) +
          '"></i> ' +
          mags[i] +
          (mags[i + 1] ? "&ndash;" + mags[i + 1] + "<br>" : "+");
      }

      return div;
    };

    legend.addTo(map);
  });

