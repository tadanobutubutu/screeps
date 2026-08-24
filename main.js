var React = require('react');
var createReactClass = require('create-react-class');
var $ = require('jquery');
var formatNumber = require('./formatNumber');

var Graph = createReactClass({
    displayName: 'Graph',
    getDefaultProps: function() {
        return {
            data: [],
            height: 200,
            width: 500,
            format: function(a) { return a },
            color: '#fff'
        };
    },
    round: function(n) {
        return Math.round(n * 100) / 100;
    },
    buildPath: function(points) {
        var path = [];
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            path.push((i > 0 ? 'L' : 'M') + this.round(p.x) + ',' + this.round(p.y));
        }
        return path.join(' ');
    },
    getMIDIPoints: function(minV, maxV, midi) {
        if (!midi || !midi.length) {
            return [];
        }
        var h = this.props.height;
        var w = this.props.width;
        var points = [];
        var last = { x: 0, y: h };
        var first = true;
        for (var i = 0; i < midi.length; i++) {
            var m = midi[i];
            var offset = m.offset || 0;
            var x = offset / 1000 * w;
            var v = m.value;
            var invRange = 1.0 / (maxV - minV);
            var y = (1.0 - (v - minV) * invRange) * h;
            if (first) {
                points.push(last);
                first = false;
            }
            points.push({ x: x, y: y });
        }
        points.push({ x: w, y: h });
        return points;
    },
    getPoints: function() {
        var props = this.props;
        var h = props.height;
        var w = props.width;
        var data = props.data;
        if (!data) {
            return [];
        }
        var globalMin = data.globalMin || 0;
        var globalMax = data.globalMax || 0;
        if (props.type === 'income' || props.type === 'cpu') {
            var midi = data.memory;
            return this.getMIDIPoints(globalMin, globalMax, midi);
        }
        var points = [];
        var last = { x: 0, y: h };
        for (var i = 0; i < data.history.length; i++) {
            var entry = data.history[i];
            var x = entry.time / 1000 * w;
            var invRange = 1.0 / (globalMax - globalMin);
            var y = (1.0 - (entry.value - globalMin) * invRange) * h;
            if (i === 0) {
                points.push(last);
            }
            points.push({ x: x, y: y });
        }
        points.push({ x: w, y: h });
        return points;
    },
    render: function() {
        var props = this.props;
        var style = {
            width: props.width,
            height: props.height
        };
        var points = this.getPoints();
        if (!points.length) {
            return React.createElement('div', { style: style });
        }
        var path = this.buildPath(points);
        var legendStyle = { color: props.color };
        return React.createElement('div', { style: style, className: 'clearfix' },
            React.createElement('div', { className: 'legend pull-right', style: legendStyle },
                React.createElement('span', { className: 'glyphicon glyphicon-minus' }),
                ' ' + props.format(props.current)
            ),
            React.createElement('svg', { width: props.width, height: props.height },
                React.createElement('polyline', {
                    fill: 'none',
                    stroke: props.color,
                    strokeWidth: '1',
                    points: points.map(function(p) { return p.x + ',' + p.y; }).join(' ')
                })
            )
        );
    }
});

module.exports = Graph;