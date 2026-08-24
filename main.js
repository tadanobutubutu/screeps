var loop_status = {
    'running': 'Running',
    'stopped': 'Stopped',
    'out_of_cpu': 'Out of CPU',
    'error': 'Error'
};

var columnHeader = "<th scope=\"col\"><div>src/constants.js</div></th>";

module.exports = {
    getStatusHtml: function (statuses) {
        var html = '<table>';
        html += '<thead><tr>';
        html += '<th scope=\"col\">Source</th>';
        html += '<th scope=\"col\">Dest</th>';
        html += '<th scope=\"col\">Amount</th>';
        html += '<th scope=\"col\">End Time</th>';
        html += '</tr></thead>';
        html += '<tbody>';
        for (var key in statuses) {
            var status = statuses[key];
            html += '<tr>';
            html += '<th scope=\"row\">' + status.source + '</th>';
            html += '<td>' + status.dest + '</td>';
            html += '<td>' + status.amount + '</td>';
            html += '<td>' + status.endTime + '</td>';
            html += '</tr>';
        }
        html += '</tbody>';
        html += '</table>';
        return html;
    }
};