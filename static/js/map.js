var URL = "/data"
var mapboxKey = "pk.eyJ1IjoibW1jbGF1Z2hsaW44NyIsImEiOiJjamRoank1NjQwd2R1MzNybGppOG9kZTdsIn0.2JTZIjgBlzTvfKjs7Rw_Dg"
var mapboxURL = "https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?"

function createMap(data) {  
    var asylum_markers = []
    var refugee_markers = []
    var death_markers = []

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
        });
        var refugee_marker = L.circle(coords, {
            radius: refugees/5,
            color: "yellow",
            fillColor: "yellow"
        });
        var death_marker = L.circle(coords, {
            radius: battle_deaths*20,
            color: "red",
            fillColor: "red"
        });
        var markerArray = [asylum_marker,refugee_marker,death_marker]
        for(j=0; j<markerArray.length; j++){
            markerArray[j].bindPopup(`<strong>${countryName}</strong><hr>
            Asylum Seekers: ${asylum_seekers}<br>
            Refugees: ${refugees}<br>
            Battle Related Deaths: ${battle_deaths}`); 
        };
        asylum_markers.push(asylum_marker);
        refugee_markers.push(refugee_marker);
        death_markers.push(death_marker);
    };
    var asylumLayer = L.layerGroup(asylum_markers);
    var refugeeLayer = L.layerGroup(refugee_markers);
    var deathLayer = L.layerGroup(death_markers);

    var mapLayer = L.tileLayer(
        mapboxURL + "access_token=" + mapboxKey
    );

    var baseMaps = {"Map":mapLayer}

    var overlayMaps = {
        "Asylum Seekers to Country": asylumLayer,
        "Refugees from Country": refugeeLayer,
        "Battle Related Deaths": deathLayer
    };

    var myMap = L.map("map", {
        center: [20, -10],
        zoom: 1.5,
        layers: [mapLayer, deathLayer, refugeeLayer, asylumLayer]
    });
    
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false,
        hideSingleBase: true
    }).addTo(myMap);
};

// import data and create map
d3.json(URL, function (data) {
    createMap(data)
});