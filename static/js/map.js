var URL = "/data"
var mapboxKey = "pk.eyJ1IjoibW1jbGF1Z2hsaW44NyIsImEiOiJjamRoank1NjQwd2R1MzNybGppOG9kZTdsIn0.2JTZIjgBlzTvfKjs7Rw_Dg"
var mapboxURL = "https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?"

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
            fillColor: "green",
            fillOpacity: 0.5,
            stroke: null
        });
        var refugee_marker = L.circle(coords, {
            radius: refugees/5,
            color: "yellow",
            fillColor: "yellow",
            fillOpacity: 0.5,
            stroke: null
        });
        var death_marker = L.circle(coords, {
            radius: battle_deaths*20,
            color: "red",
            fillColor: "red",
            fillOpacity: 0.5,
            stroke: null
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
        "Battle Related Deaths": deathLayer,
        "Refugees from Country": refugeeLayer,
        "Asylum Seekers to Country": asylumLayer,
    };

    var myMap = L.map("map", {
        center: [20, -10],
        zoom: 1.5,
        properties: {language: "en"},
        layers: [mapLayer, refugeeLayer, asylumLayer, deathLayer]
    });
    
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false,
        hideSingleBase: true
    }).addTo(myMap);

    var legend = L.control({position: 'bottomleft'});
    
    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend')
    
        // loop through our density intervals and generate a label with a colored square for each interval
        div.innerHTML = "<div style='background-color:#fff;padding:5px;border:2px solid #8e9196;border-radius:5px;'>\
                            <p style='text-align:center; margin:0px'><strong>Legend</strong></p>\
                            <hr style='margin-top:2px;margin-bottom:2px'>\
                            <svg height='8' width='8'><circle cx='4' cy='4' r='4' stroke='null' fill='red' /></svg> Battle Deaths (20x)<br>\
                            <svg height='8' width='8'><circle cx='4' cy='4' r='4' stroke='null' fill='green' /></svg> Asylum Seekers<br>\
                            <svg height='8' width='8'><circle cx='4' cy='4' r='4' stroke='null' fill='yellow' /></svg> Refugees From Country</div>"
                // '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                // grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        
    
        return div;
    };
    
    legend.addTo(myMap);
};

// import data and create map
d3.json(URL, function (data) {
    createMap(data)
});