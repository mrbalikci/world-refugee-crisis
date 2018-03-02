//create map and layers
var URL = "/data"
var mapboxKey = "pk.eyJ1IjoibW1jbGF1Z2hsaW44NyIsImEiOiJjamRoank1NjQwd2R1MzNybGppOG9kZTdsIn0.2JTZIjgBlzTvfKjs7Rw_Dg"
var streetURL =  "https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?"
var darkURL =  "https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?"
var satelliteURL = "https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?"

var streetLayer = L.tileLayer(
    streetURL + "access_token=" + mapboxKey
);

var darkLayer = L.tileLayer(
    darkURL + "access_token=" + mapboxKey
);

var satelliteLayer = L.tileLayer(
    satelliteURL + "access_token=" + mapboxKey
);

var timelineLayer = new L.LayerGroup();

var myMap = L.map("map", {
    center: [20, -10],
    zoom: 1.5,
    layers: [streetLayer]
});

//gather date from api, create markers, and display on map
d3.json(URL, function (data) {
    var featureArray = [];
    var asylum_markers = [];
    var refugee_markers = [];
    var death_markers = [];
    var yearsEpoch = [631152000000,662688000000,694224000000,725846400000,757382400000,788918400000,820454400000,852076800000,
        883612800000,915148800000,946684800000,978307200000,1009843200000,1041379200000,1072915200000,1104537600000,1136073600000,
        1167609600000,1199145600000,1230768000000,1262304000000,1293840000000,1325376000000,1356998400000,1388534400000,1420070400000,
        1451606400000];
    for (i = 0; i < data.length; i++) {

        //iterate through each year of data and create geoJSON features
        for (j=0; j < yearsEpoch.length; j++){
            var refugeeFeature = {};
            refugeeFeature.geometry = {
                type: "Point",
                coordinates: [data[i].country_lon, data[i].country_lat, 0]
            };
            refugeeFeature.type = "Feature";
            refugeeFeature.properties = {
                dataType: "refugees",
                countryName: data[i].country_name,
                value: data[i].refugee_years[j],
                time: yearsEpoch[j],
                color: "yellow"
            };

            var asylumFeature = {};
            asylumFeature.geometry = {
                type: "Point",
                coordinates: [data[i].country_lon, data[i].country_lat, 0]
            };
            asylumFeature.type = "Feature";
            asylumFeature.properties = {
                dataType: "asylum",
                countryName: data[i].country_name,
                value: data[i].asylum_years[j],
                time: yearsEpoch[j],
                color: "green"
            };
            
            var deathFeature = {};
            deathFeature.geometry = {
                type: "Point",
                coordinates: [data[i].country_lon, data[i].country_lat, 0]
            };
            deathFeature.type = "Feature";
            deathFeature.properties = {
                dataType: "deaths",
                countryName: data[i].country_name,
                value: data[i].battle_years[j] * 100,
                time: yearsEpoch[j],
                color: "red"
            };

            featureArray.push(refugeeFeature);
            featureArray.push(asylumFeature);
            featureArray.push(deathFeature);
        }

        //create markers for 2016 static layers
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
            markerArray[j].bindPopup(`<strong>${countryName}</strong><hr style='margin-top:2px;margin-bottom:2px'>
            Asylum Seekers: ${asylum_seekers}<br>
            Refugees: ${refugees}<br>
            Battle Related Deaths: ${battle_deaths}`); 
        };
        asylum_markers.push(asylum_marker);
        refugee_markers.push(refugee_marker);
        death_markers.push(death_marker);
    };

    //add feature list to single geoJSON object
    var features = {
        type: "FeatureCollection",
        features: featureArray
    }

    //create timeline interval
    var getInterval = function (feature) {
        return {
            start: feature.properties.time,
            end: feature.properties.time + 31556926000
        }
    }

    //create timeline slider control
    var timelineControl = L.timelineSliderControl({
        formatOutput: function (date) {
             var timestamp = new Date(date);
             return timestamp.getUTCFullYear().toString();
        },
        steps: 200
    });

    //dictionary for popups indicating types
    var typeObject = {
        deaths: "Battle Related Deaths",
        asylum: "Asylum Seekers",
        refugees: "Refugees"
    }

    //add markers to timeline
    var timeline = L.timeline(features, {
        getInterval: getInterval,
        pointToLayer: function (layerData, latlng) {
            return L.circleMarker(latlng, {
                radius: layerData.properties.value / 100000,
                color: layerData.properties.color,
                fillColor: layerData.properties.color,
                fillOpacity: 0.5,
                stroke: null
            }).bindPopup(`<strong>${layerData.properties.countryName}</strong><hr style='margin-top:2px;margin-bottom:2px'>
            ${typeObject[layerData.properties.dataType]}: ${layerData.properties.value}`);
        }
    });

    //add layers to map
    timelineControl.addTo(myMap);
    timelineControl.addTimelines(timeline);
    timeline.addTo(timelineLayer);
    timelineLayer.addTo(myMap);

    var asylum_seekersLayer = L.layerGroup(asylum_markers);
    var refugeesLayer = L.layerGroup(refugee_markers);
    var battle_deathsLayer = L.layerGroup(death_markers);

    //create formatted legend
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend')
        div.innerHTML = "<div style='background-color:#fff;padding:5px;border:2px solid #8e9196;border-radius:5px;color:black'>\
                            <p style='text-align:center; margin:0px'><strong>Legend</strong></p>\
                            <hr style='margin-top:2px;margin-bottom:2px'>\
                            <svg height='8' width='8'><circle cx='4' cy='4' r='4' stroke='null' fill='red' /></svg> Battle Deaths (100x)<br>\
                            <svg height='8' width='8'><circle cx='4' cy='4' r='4' stroke='null' fill='green' /></svg> Asylum Seekers<br>\
                            <svg height='8' width='8'><circle cx='4' cy='4' r='4' stroke='null' fill='yellow' /></svg> Refugees From Country</div>"
        return div;
    };

    legend.addTo(myMap);

    //add layer control
    var baseMaps = {
        "Light":streetLayer,
        "Dark":darkLayer,
        "Satellite":satelliteLayer
    }
    
    var overlayMaps = {
        "Timeline": timelineLayer,
        "2016 Battle Related Deaths": battle_deathsLayer,
        "2016 Refugees from Country": refugeesLayer,
        "2016 Asylum Seekers to Country": asylum_seekersLayer,
    };

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: true,
        hideSingleBase: true
    }).addTo(myMap);
});