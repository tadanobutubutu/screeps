// Screeps game bot entry point
var roles = require('roles');
var utils = require('utils');
var roomManager = require('roomManager');

module.exports.loop = function() {
    // Game loop logic
};

// Generate HTML table with proper scope attributes for accessibility
function generateDependencyTable(dependencies) {
    var html = '<table>\n';
    html += '<thead>\n';
    html += '<tr>\n';
    html += '<th scope="col">Module</th>\n';
    html += '<th scope="col">Dependencies</th>\n';
    html += '</tr>\n';
    html += '</thead>\n';
    html += '<tbody>\n';
    
    for (var i = 0; i < dependencies.length; i++) {
        var dep = dependencies[i];
        html += '<tr>\n';
        html += '<th scope="row">' + escapeHtml(dep.name) + '</th>\n';
        html += '<td>' + escapeHtml(dep.uses.join(', ')) + '</td>\n';
        html += '</tr>\n';
    }
    
    html += '</tbody>\n';
    html += '</table>';
    return html;
}

function generateModuleTable(modules) {
    var html = '<table>\n';
    html += '<thead>\n';
    html += '<tr>\n';
    html += '<th scope="col">Name</th>\n';
    html += '<th scope="col">Lines</th>\n';
    html += '<th scope="col">Complexity</th>\n';
    html += '</tr>\n';
    html += '</thead>\n';
    html += '<tbody>\n';
    
    for (var i = 0; i < modules.length; i++) {
        var mod = modules[i];
        html += '<tr>\n';
        html += '<th scope="row"><div>' + escapeHtml(mod.name) + '</div></th>\n';
        html += '<td>' + mod.lines + '</td>\n';
        html += '<td>' + mod.complexity + '</td>\n';
        html += '</tr>\n';
    }
    
    html += '</tbody>\n';
    html += '</table>';
    return html;
}

function escapeHtml(text) {
    if (!text) return '';
    var div = document ? document.createElement('div') : { textContent: text };
    if (document) {
        div.textContent = text;
        return div.innerHTML;
    }
    return text.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/"/g, '&quot;');
}

module.exports.generateDependencyTable = generateDependencyTable;
module.exports.generateModuleTable = generateModuleTable;
module.exports.escapeHtml = escapeHtml;