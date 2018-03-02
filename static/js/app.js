// append the table

function appendTable(name) {

    // define API url
    var url_info = "/info/" + name;

    // read API url
    Plotly.d3.json(url_info, function (error, response) {

        // select HTML body to append the table elements 
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

    // define API url for country info
    var url_years = "/country/" + name;

    // read API url
    Plotly.d3.json(url_years, function (error, yearsData) {
        var valuesAsylum = yearsData.asylum_years;
        var valuesOrigin = yearsData.refugee_years;
        var valuesDeath = yearsData.battle_years;

        // define labels
        var labels = [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002,
            2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016];

        // define traces for plot
        var trace1 = {
            x: labels,
            y: valuesAsylum,
            name: 'Number of Asylum Requests',
            marker: { color: 'rgb(244, 98, 66)' },
            type: 'bar'
        };

        var trace2 = {
            x: labels,
            y: valuesOrigin,
            name: 'Number of Refugee (Origin)',
            marker: { color: 'rgb(155, 66, 244)' },
            type: 'bar'
        };

        var trace3 = {
            x: labels,
            y: valuesDeath,
            name: 'Number of Battle Deaths',
            marker: { color: 'rgb(9, 68, 11)' },
            type: 'bar'
        };

        // define data out of traces
        var data = [trace1, trace2, trace3];

        // define the layout
        var layout = {
            title: 'Numbers of Asylum, Refugee and Battle Deaths Since 1990',
            xaxis: {
                title: "Years",
                tickfont: {
                    size: 14,
                    color: 'rgb(107, 107, 107)'
                }
            },
            yaxis: {
                title: 'In thousands',
                titlefont: {
                    size: 16,
                    color: 'rgb(107, 107, 107)'
                },
                tickfont: {
                    size: 14,
                    color: 'rgb(107, 107, 107)'
                }
            },
            legend: {
                x: 1.0,
                y: 1.0,
                bgcolor: 'rgba(255, 255, 255, 0)',
                bordercolor: 'rgba(255, 255, 255, 0)'
            },
            barmode: 'group',
            bargap: 0.15,
            bargroupgap: 0.1
        };

        // plot it to the HTML class
        Plotly.newPlot('plotBar', data, layout);
    });

    // read API data for info again for line chart 
    // Frappie Chart https://frappe.github.io/charts/

    Plotly.d3.json(url_years, function (error, yearsData) {
        var valuesAsylum = yearsData.asylum_years;
        var valuesOrigin = yearsData.refugee_years;
        var valuesDeath = yearsData.battle_years;

        // define data 
        let data = {
            labels: [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002,
                2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],

            datasets: [
                {
                    title: "Number of Asylum",
                    values: valuesAsylum
                },
                {
                    title: "Number of Refugee",
                    values: valuesOrigin
                },
                {
                    title: "Number of Battle Deaths",
                    values: valuesDeath
                }
            ]
        };

        // let the frappe chart begin 
        let chart = new Chart({
            parent: "#plotChart",
            title: "Asylum, Refugee, and Battle Deaths Chart Since 1990",
            data: data,
            type: 'line',
            height: 300,

            colors: ['red', 'green', 'blue'],

            format_tooltip_x: d => (d + '').toUpperCase(),
            format_tooltip_y: d => d

        });
    });

    // Read API for pie chart 
    Plotly.d3.json(url_years, function (error, yearsData) {

        // variables for pie chart
        var sumAsylum = yearsData.asylum_years.reduce(function (a, b) { return a + b; }, 0);
        var sumOrigin = yearsData.refugee_years.reduce(function (a, b) { return a + b; }, 0);
        var sumDeath = yearsData.battle_years.reduce(function (a, b) { return a + b; }, 0);

        // define the data 
        var data = [{
            values: [sumAsylum, sumOrigin, sumDeath],
            labels: [`Total Asylum Since 1990 is: ${sumAsylum}`, `Total Refugee Origin Since 1990 is ${sumOrigin}`,
            `Total Battle Death Since 1990 is ${sumDeath}`],
            type: 'pie'
        }];

        // define the layout 
        var layout = {
            height: 500,
            width: 1000,
            title: "Total Numbers of Asylum, Refugee and Battle Deaths Since 1990"
        };

        Plotly.newPlot('plotPie', data, layout);
    });

}

// define API url for country names 
var url = "/names";

// create a function to renter the table based on the info in url /names
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
// run it
init();