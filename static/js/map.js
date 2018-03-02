// define url for the map data
var url_map = "/data";

// define the layers 
var satellite = L.tileLayer(
    "https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?" +
    "access_token=pk.eyJ1IjoibXJiYWxpa2NpIiwiYSI6ImNqZGhqeWFxdTEwamgycXBneTZnYjFzcm0ifQ."
    + "RXRxgZ1Mb6ND-9EYWu_5hA");

var darkmap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoibXJiYWxpa2NpIiwiYSI6ImNqZGhqeWFxdTEwamgycXBneTZnYjFzcm0ifQ."
    + "RXRxgZ1Mb6ND-9EYWu_5hA");

var streetmap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoibXJiYWxpa2NpIiwiYSI6ImNqZGhqeWFxdTEwamgycXBneTZnYjFzcm0ifQ."
    + "RXRxgZ1Mb6ND-9EYWu_5hA");

// read API url above 
d3.json(url_map, function (data) {

    // define empty lists 
    var theBattles = []
    var theAssylums = []
    var theRefugees = []

    // loop throu the data 
    for (var i = 0; i < data.length; i++) {

        // define appropirate variable and read it thro the data
        var country_lat = data[i].country_lat;
        var country_lon = data[i].country_lon;
        var country_name = data[i].country_name;
        var refugees = data[i].refugees;
        var asylum_seekers = data[i].asylum_seekers;
        var battle_deaths = data[i].battle_deaths;

        // create the circles 
        var theBattle = L.circle(([country_lat, country_lon]), {
            stroke: false,
            fillColor: "rgb(214, 113, 6)", 
            fillOpacity: .75,
            radius: battle_deaths * 20
        });

        var theAssylum = L.circle(([country_lat, country_lon]), {
            stroke: false,
            fillColor: "yellow",
            fillOpacity: .50,
            radius: asylum_seekers / 3
        });

        var theRefugee = L.circle(([country_lat, country_lon]), {
            stroke: false,
            fillColor: "rgb(239, 24, 4)", 
            fillOpacity: .50,
            radius: refugees / 5
        });

        // make the array
        var markerArray = [theBattle, theAssylum, theRefugee]

        // make a loop for the popup info when it's clicked
        for (j = 0; j < markerArray.length; j++) {
            markerArray[j].bindPopup(`<strong>${country_name}</strong><hr>
                Asylum Seekers: ${asylum_seekers}<br>
                Refugees: ${refugees}<br>
                Battle Related Deaths: ${battle_deaths}`);
        };

        // push the info to the empty lists above 
        theBattles.push(theBattle);
        theAssylums.push(theAssylum);
        theRefugees.push(theRefugee);
    }

    // create the layerGroups
    var battle = L.layerGroup(theBattles)
    var asylum = L.layerGroup(theAssylums)
    var refugee = L.layerGroup(theRefugees)

    // define the base map, overlay map
    var baseMaps = {
        "Satellite Map": satellite,
        "Street Map": streetmap,
        "Dark Map": darkmap
    };

    var overlayMaps = {
        "Battle Deaths": battle,
        "Asylum Seekers": asylum,
        "Refugee Origin": refugee
    };

    // the map object 
    var myMap = L.map("map", {
        center: [14.60, -28.67],
        zoom: 1.5,
        layers: [satellite, battle]
    });

    // add all the info to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Legend Work 
    var legend = L.control({ position: 'bottomleft' });

    legend.onAdd = function (myMap) {

        var div = L.DomUtil.create('div', 'info legend')

        // loop through our density intervals and generate a label with a colored square for each interval
        div.innerHTML = "<div style='background-color:#fff;padding:5px;border:2px solid #8e9196;border-radius:5px;'>\
                            <p style='text-align:center; margin:0px'><strong>Legend</strong></p>\
                            <hr style='margin-top:2px;margin-bottom:2px'>\
                            <svg height='8' width='8'><circle cx='4' cy='4' r='4' stroke='null' fill='rgb(214, 113, 6)' /></svg> Battle Deaths (20x)<br>\
                            <svg height='8' width='8'><circle cx='4' cy='4' r='4' stroke='null' fill='yellow' /></svg> Asylum Seekers<br>\
                            <svg height='8' width='8'><circle cx='4' cy='4' r='4' stroke='null' fill='rgb(239, 24, 4)' /></svg> Refugees From Country</div>"
    
        return div;
    };
    legend.addTo(myMap);
})