function appendTable(name) {
    // extentions of the urls from app.py
    var url_info = "/info/" + name;

    // print it on console 
    console.log(url_info)

    // append the metadata to the table 
    Plotly.d3.json(url_info, function (error, response) {
        console.log(response);

        Plotly.d3.select("tbody")
            .html("")
            .selectAll("tr")
            .data(response)
            .enter()
            .append("tr")
            .html(function (d) {
                return `<td>${d.t0}</td><td>${d.t1}</td>`
            })
    })

    var url_years = "/country/" + name;
    
    Plotly.d3.json(url_years, function (error, yearsData) {

        // define the veriables and data and layout for plotly
        var years = [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 
                    2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016]
        var valuesAsylum = yearsData.asylum_years;
        var valuesOrigin = yearsData.refugee_years;
        var valuesDeath = yearsData.battle_years;

        console.log(years)


        var trace1 = {
            x: years,
            y: valuesAsylum,
            type: 'scatter'
        };

        var trace2 = {
            x: years,
            y: yearsData,
            type: 'scatter'
        };

        var trace3 = {
            x: years,
            y: valuesDeath,
            type: 'scatter'
        };

        var data = [trace1, trace2, trace3];

        var layout = {
            title: 'Sample Value Chart',
            height: 500,
            width: 700
        };

        Plotly.newPlot('plotChart', data, layout);
    });
}

var url = "/names";
function init() {
    Plotly.d3.json(url, function (error, names) {


        var select = Plotly.d3.select('#selDataset')
            .on("change", function () {
                var name = Plotly.d3.select(this).node().value;

                appendTable(name);
            });
        select.selectAll('option')
            .data(names)
            .enter()
            .append('option')

            .text(d => d)
            .attr("value", function (d) { return d; })
    });
}

// run the function 
init();