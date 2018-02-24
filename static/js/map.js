var URL = "/data"
var mapboxKey = "pk.eyJ1IjoibW1jbGF1Z2hsaW44NyIsImEiOiJjamRoank1NjQwd2R1MzNybGppOG9kZTdsIn0.2JTZIjgBlzTvfKjs7Rw_Dg"
var mapboxURL = "https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?"

function createFeatures(data) {
    console.log(URL);
    console.log(data);
    
    for (i = 0; i < data.length; i++) {
        var coords = [data[i].country_lat, data[i].country_lon];
        var countryName = data[i].country_name;
        var asylum_seekers = data[i].asylum_seekers;
        var battle_deaths = data[i].battle_deaths;
        var refugees = data[i].refugees;
        var asylum_marker = L.circle(coords, {
            radius: asylum_seekers/5,
            color: "green",
            fillColor: "green"
        }).addTo(myMap);
        var refugee_marker = L.circle(coords, {
            radius: refugees/5,
            color: "yellow",
            fillColor: "yellow"
        }).addTo(myMap);
        var death_marker = L.circle(coords, {
            radius: battle_deaths*20,
            color: "red",
            fillColor: "red"
        }).addTo(myMap);
        var markerArray = [asylum_marker,refugee_marker,death_marker]
        for(j=0; j<markerArray.length; j++){
            markerArray[j].bindPopup(`<strong>${countryName}</strong><hr>
            Asylum Seekers: ${asylum_seekers}<br>
            Refugees: ${refugees}<br>
            Battle Related Deaths: ${battle_deaths}`);
            
        };
    };
};

// Creating map object
var myMap = L.map("map", {
    center: [20, -20],
    zoom: 2.5
});

// Adding tile layer
L.tileLayer(
    mapboxURL + "access_token=" + mapboxKey
).addTo(myMap);

d3.json(URL, function (data) {
    createFeatures(data)
});

