/**
 * Created by liuxiaoer@cnic.cn on 14-2-26.
 *
 */
var brushBar;
function dateslider(option) {
    var self = this;

    //[底色，选中色]
    var defaultColor = [
        ['#826D76', '#50315A'],
        ['#899E8D', '#76804E'],
        ['#899E8D', '#826D76'],
        ['#F2DFD0', '#DFBE88'],
        ['#F0DEDA', '#BBACC9'],
        ['#6E9988', '#6A745B']
    ];

    var containerClass = option.class;
    var backgroundColor = option.backgroundColor || '#F0DEDA';
    var selectedColor = option.selectedColor || '#B7624E';
    var margin = option.margin || {top: 20, right: 20, bottom: 100, left: 40};

    self.brush = function () {
        if (option.brush)option.brush();
    };

    self.brushend = function () {
        if (option.brushend)option.brushend();
    };

    var width = document.body.clientWidth - margin.left - margin.right;
    var height = 130 - margin.top - margin.bottom;
    var parseDate = d3.time.format("%Y-%m-%d").parse;

    var x = d3.time.scale().range([0, width]);

    var xAxis = d3.svg.axis().scale(x).orient('bottom');

    brushBar = d3.svg.brush().x(x).on('brush', self.brush).on('brushend', self.brushend);

    var svg = d3.select('.' + containerClass).append('svg').attr('width', width + margin.left + margin.right + 30).attr('height', 70);

    var focus = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var data = option.range;//['2013', '2014', '2015'];

    x.domain(d3.extent(data.map(function (d) {
        return parseDate(d);
    })));

    focus.append('g').attr('class', 'x axis').attr('transform', 'translate(0,15)').call(xAxis);

    focus.append('g').attr('class', 'x brush').call(brushBar).selectAll('rect').attr('y', -6).attr('height', 20);

    focus.select('.background').style('visibility', 'visible').style('fill', backgroundColor);

    focus.select('.extent').attr('fill', selectedColor);
    
    window.onresize = function(){
    	console.log("todo: resize dateslider");
    };

}