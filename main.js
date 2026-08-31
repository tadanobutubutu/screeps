// Screeps main script
// TODO: Update the existing function using the new functions for rendering graph/index

// New function for rendering graph
function renderGraph(data) {
    return data.map(function (point) { return point; }).join(',');
}

// New function for rendering index
function renderIndex(index) {
    return 'index:' + index;
}

// Existing function updated to use new functions for rendering graph/index
function processData(data, index) {
    var graph = renderGraph(data);
    var idx = renderIndex(index);
    return graph + '|' + idx;
}

module.exports = {
    renderGraph: renderGraph,
    renderIndex: renderIndex,
    processData: processData
};