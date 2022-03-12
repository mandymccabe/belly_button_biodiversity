function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
  
    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}


// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
      let samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
      let filterSamples = samples.filter(sampleObj => sampleObj.id == sample);
      console.log(filterSamples)
    //  5. Create a variable that holds the first sample in the array.
      let sampleResults = filterSamples[0];
        console.log(sampleResults);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      let otuIDs = sampleResults.otu_ids;
      let otuLables = sampleResults.otu_labels;
      let sampleValues = sampleResults.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var xticks = sampleValues.slice(0,10).reverse();
    

    var yticks = otuIDs.slice(0, 10).map(ID => `OTU ${ID}`).reverse();
   
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: xticks,
      y: yticks,
      text: otuLables,
      type: 'bar',
      orientation: 'h',
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)'

      
  }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
 

  // Bubble charts

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIDs,
      y: sampleValues,
      text: otuLables,
      mode: 'markers',
      marker: {size: sampleValues, color: otuIDs, colorscale: 'BuGu'}
    }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title: 'OTU ID'},
      hovermode: 'closest'
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout); 

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    let metadata = data.metadata;
    let filterMetaData = metadata.filter(sampleObj => sampleObj.id == sample);
    console.log(filterSamples)
    // Create a variable that holds the first sample in the array.
    let metaResults = filterMetaData[0];
        console.log(metaResults);

    // 2. Create a variable that holds the first sample in the metadata array.
    let metaFirstSample = metaResults[0];

    // 3. Create a variable that holds the washing frequency.
   let washFreq = metaResults.wfreq
   let washFreqFloat = parseFloat(washFreq).toFixed(2)
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      title: {text: "Scrubs per Week", font: {size:18}},
      type: "indicator",
      mode: "gauge+number",
      value: washFreq,
      gauge: {
          axis: { range: [null, 10], dtick: 2, tick0:0},
          bar: {color: "black"},
          bgcolor: "white",
          borderwidth: 2,
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "green" },
          ]},
      }
     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {  
      title: "Belly Button Washing Frequency",
      titlefont:{"size":25}
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}
