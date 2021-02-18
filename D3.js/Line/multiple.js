// set the dimensions and margins of the graph
const margin = { top: 30, right: 0, bottom: 30, left: 50 };
const width = 210 - margin.left - margin.right;
const height = 210 - margin.top - margin.bottom;

// Read the data
d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv").then(function(data) {

    // group the data: I want to draw one line per group
    let sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
                    .key(function(d) { return d.name; })
                    .entries(data);
    
    // What is the list of groups?
    allKeys = sumstat.map(function(d) { return d.key; });

    // Add on svg element for each group.
    // The will be one beside each other and will go on the next row when no more room available
    let svg = d3.select("#my_dataviz")
                .selectAll("uniqueChart")
                .data(sumstat)
                .enter()
                .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    
    // Add X axis --> it is a data format
    let x = d3.scaleLinear()
                .domain(d3.extent(data, function(d) { return d.year; }))    // d3.extent: [최소, 최대]
                .range([0, width]);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(3));
    
    // Add Y axis
    let y = d3.scaleLinear()
                .domain([0, d3.max(data, function(d) { return +d.n; })])
                .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y).ticks(5));

    // color palette
    let color = d3.scaleOrdinal()   // domain에 있는 값과 range의 값을 짝짓는다.
                    .domain(allKeys)
                    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

    // Draw the line
    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", function(d) {return color(d.key); })
        .attr("d", function(d) {
            return d3.line()
                        .x(function(d) { return x(d.year); })
                        .y(function(d) { return y(+d.n); })
                        (d.values)
        })
    
    // Add titles
    svg.append("text")
        .attr("text-anchor", "start")
        .attr("y", -5)
        .attr("x", 0)
        .text(function(d) { return d.key; })
        .style("fill", function(d) { return color(d.key); })
})