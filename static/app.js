function appendTable(name) {
    // extentions of the urls from app.py
    var url_meta = "/info/" + name;

    // print it on console 
    console.log(url_meta)
    console.log(url_samples)

    // append the metadata to the table 
    Plotly.d3.json(url_meta, function (error, response) {
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