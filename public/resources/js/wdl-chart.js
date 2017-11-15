var d3Draw = (function() {

    var svg = d3.select("svg");

    var margin = { top: 20, right: 60, bottom: 30, left: 40 },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    var g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    var x = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1)
        .align(0.1);

    var y = d3.scaleLinear()
        .range([height, 0]);

    var z = d3.scaleOrdinal()
        .range(["#d9534f", "#f0ad4e", "#5cb85c"]);

    function draw(data) {

        g.selectAll('*').remove();

        var keys = ['losses', 'draws', 'wins'];

        x.domain(data.standing.map(d => d.position));
        y.domain([0, data.matchday]);
        z.domain(keys);

        var xAxis = d3.axisBottom(x);
        var yAxis = d3.axisLeft(y).ticks(5);

        g.append("g")
            .attr("class", "axis x")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis)
            .append('text')
                .attr('x', width + 45)
                .attr('y', 10)
                .attr('dy', '.71em')
                .style('text-anchor', 'end')
                .text('Position');

        g.append("g")
                .attr("class", "axis y")
                .call(yAxis)
            .append("text")
                .attr("x", -40)
                .attr("y", -10)
                .attr("dy", "0.32em")
                .attr("fill", "#000")
                .attr("font-weight", "bold")
                .attr("text-anchor", "start")
                .text("Rounds");

        var bars = g.append("g")
            .selectAll("g")
            .data(d3.stack().keys(keys)(data.standing))
            .enter().append("g")
                .attr("fill", d => z(d.key))
            .selectAll("rect")
            .data(d => d)
            .enter().append("rect")
                .attr("x", d => x(d.data.position))
                .attr("y", d => y(d[1]))
                .attr("height", d => y(d[0]) - y(d[1]))
                .attr("width", x.bandwidth())
                .style('opacity', 0);
                
        bars.transition()
            .duration(1000)
            .style('opacity', 1);

        var tooltip = d3.select("body").append("div")   
            .attr("class", "tooltip")               
            .style("opacity", 0);

        bars
            .on("mouseover", d => {
                tooltip.style("opacity", .9);
                
                tooltip.html(`
                        <div class="tooltip-inner">
                            #${d.data.position} ${d.data.teamName}
                            <br/>
                            Points: ${d.data.points}
                            <br/>
                            W: ${d.data.wins} - D: ${d.data.draws} - L: ${d.data.losses}
                        </div>
                    `)
                    .style("left", (d3.event.pageX) + "px")     
                    .style("top", (d3.event.pageY) + "px");
            })                  
            .on("mouseout", d => tooltip.style("opacity", 0));

        var legend = g.append("g")
                .attr("font-family", "sans-serif")
                .attr("font-size", 10)
                .attr("text-anchor", "end")
            .selectAll("g")
            .data(keys.slice().reverse())
            .enter().append("g")
                .attr("transform", (d, i) => `translate(0, ${i * 20})`);

        legend.append("rect")
            .attr("x", width + 40)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", z);

        legend.append("text")
            .attr("x", width + 36)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(d => d);
    }

    return {
        drawChart: draw
    };

})();
