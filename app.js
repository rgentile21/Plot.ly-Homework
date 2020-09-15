function buildMetadata(sample) {
//D3 to gather data from sample
var url = '/metadata/${sample}';
d3.json(url).then(function(sample) {

// D3 to select the panel with id equal to`#sample-metadata`
var sample_metadata = d3.select("#sample-metadata");

// Use `.html("") to clear any existing metadata-reviewed with Learning Assistant
sample_metadata.html("");

// Use `Object.entries` to add each key and value pair to the panel-Added per review with Learning Assistant
Object.entries(sample).forEach(function ([key, value]) {
  var row = sample_metadata.append("panel-body");
  row.text(`${key}: ${value} \n`);
});
});
}

function buildCharts(sample) {

// JSON (with d3) to compile data
var url = `/samples/${sample}`;
d3.json(url).then(function(data) {

// Bubble Chart
var x_values = data.otu_ids;
var y_values = data.sample_values;
var m_size = data.sample_values;
var m_colors = data.otu_ids; 
var t_values = data.otu_labels;

var trace1 = {
  x: x_values,
  y: y_values,
  text: t_values,
  mode: 'markers',
  marker: {
    color: m_colors,
    size: m_size
  } 
};

var data = [trace1];

var layout = {
  xaxis: { title: "OTU ID"},
};

Plotly.newPlot('bubble', data, layout);

//Pie Chart
d3.json(url).then(function(data) {  
var pie_values = data.sample_values.slice(0,10);
  var pie_labels = data.otu_ids.slice(0,10);
  var pie_hover = data.otu_labels.slice(0,10);

  var data = [{
    values: pie_values,
    labels: pie_labels,
    hovertext: pie_hover,
    type: 'pie'
  }];

  Plotly.newPlot('pie', data);

});
});   
}

function init() {
// Dropdown element reference
var selector = d3.select("#selDataset");

// Utilize sample names
d3.json("/names").then((sampleNames) => {
sampleNames.forEach((sample) => {
  selector
    .append("option")
    .text(sample)
    .property("value", sample);
});

// Build initial plots
const firstSample = sampleNames[0];
buildCharts(firstSample);
buildMetadata(firstSample);
});
}

function optionChanged(newSample) {
// Gather data
buildCharts(newSample);
buildMetadata(newSample);
}

// Initialize the dashboard
init();
