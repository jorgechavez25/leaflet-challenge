//  https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson

// Creating the map object
let myMap = L.map("map", {
    center: [40.878, -97.395],
    zoom: 7
  });

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Use this link to get the GeoJSON data.
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
let geoJson;

// Getting our GeoJSON data
d3.json(geoData).then(function(data) {

console.log(data);

    //Create a conditional for each color. Colors selected with the help of my tutor. 
    function selectColor(depth) {
        if  (depth > 90) return '#F06A6A';
        else if  (depth > 70) return '#F0A76A';    
        else if (depth > 50) return '#F3B94C';
        else if (depth > 30) return '#F3DB4C';
        else if (depth > 10) return '#E1F34C';
        else return '#B6F34C';      
      }
      
      // Styling each feature
      function style(feature) {
          return {
              fillColor: selectColor(feature.geometry.coordinates[2]),
              stroke: true,
              radius: (feature.properties.mag) * 3,
              color: "black",
              weight: 1,
              opacity: 1,
              fillOpacity: 1
          };
      }
      
     //Create a circle marker for each set of coordinates. Code developed with the help of a tutor
     
      let marker = L.geoJson(data, {
          pointToLayer: function (feature, latlng) {
              return L.circleMarker(latlng, style(feature));
          },
        
     // Create a popup for each circle marker
     onEachFeature: function(feature, layer) {
        layer.bindPopup("<strong>" + feature.properties.place + "</strong><br /><br />Magnitude: " +
          feature.properties.mag + "<br /><br />Depth: " + feature.geometry.coordinates[2]);
      }
      });
      marker.addTo(myMap);

    //Create the legend. the CitiBikes in class assignment. 
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let limits = [-10, 10, 30 , 50 , 70 , 90];
    let colors = ['#B6F34C', '#E1F34C', '#F3DB4C', '#F3B94C', '#F0A76A','#F06A6A'];
 

    //Format the legend. 
    limits.forEach(function(limit, index) {
        div.innerHTML += "<i style='background: " + colors[index] + "'></i> "
        + limits[index] + (limits[index + 1] ? "&ndash;" + limits[index + 1] + "<br>" : "+");
    });

    return div;
  };
   // Adding the legend to the map
   legend.addTo(myMap);
  });