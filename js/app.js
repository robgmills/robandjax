'use strict';

// Utility method to move bubble to front of view (replicating updating the z-index of basic HTML)
d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
        this.parentNode.appendChild(this);
    });
};

var photoMapApp = angular.module('photomap-app', []);

photoMapApp.controller('photomap-controller', ['$scope', '$http', function($scope, $http) {

    // Color scheme generated at https://coolors.co/app/d7e8ed-8bbeed-5091ba-527d9e-c1c1c1
    $scope.fills = {
        JAX: '#8BBEED',
        ROB: '#5091BA',
        BOTH: '#527D9E',
        NOT_TOGETHER: '#D7E8ED',
        DETAIL: '#123456',
        defaultFill: '#FFFFFF'
    };

    $scope.zoomIn = function(data) {
        var circle = d3.select(this);
        circle
            //.transition() // transitioning seems to cause flickering of the bubble as it grows
            //.duration(400)
            .attr('r', function(datum) {
                return '25%'; // grow the circle by 25%
            })
            .style('fill', function(datum) {
                return 'url(#album' + datum.id + ')';
            })
            .style('fill-opacity', 1);
        circle.moveToFront();
    };

    $scope.zoomOut = function(data) {
        var circle = d3.select(this);
        circle
            //.transition() // transitioning seems to cause flickering of the bubble as it grows
            //.duration(400)
            .attr('r', function(datum) {
                return datum.radius;
            })
            .style('fill', function(datum) {
                return $scope.fills[datum.fillKey];
            })
            .style('fill-opacity', .75);
    };

    $scope.onClick = function(data) {
        $window.location.href = data.linkUrl;
    }

    $scope.createPatterns = function(svg, patternData) {
        var defs = svg.append("defs");

        // Adds all the album cover images to the svg patterns to make
        // them available as fills for the bubbles
        for( var i=0; i<patternData.length; i++ ) {
            var album = patternData[i];
            defs.append('pattern')
                .attr('id', 'album' + album.id)
                .attr('height', '100%')
                .attr('width', '100%')
                .attr('patternContentUnits', 'objectBoundingBox')
                .attr('viewBox', '0 0 1 1')
                .attr('preserveAspectRatio', 'xMidYMid slice')
                .append('pattern:image')
                .attr('xmlns:xlink','http://www.w3.org/1999/xlink')
                .attr('xlink:href', album.imageUrl)
                .attr('preserveAspectRatio', 'xMidYMid slice')
                .attr('height', 1)
                .attr('width', 1);
        }
    }

    $http.get('/js/albums.json').success(function(data) {
        var svg = $scope.world.svg;

        $scope.albums = data;
        $scope.world.bubbles($scope.albums, $scope.bubbleConfig);
        $scope.createPatterns(svg, $scope.albums);

        var circles = svg.selectAll("circle");
        circles
            .on('mouseover.zoom', $scope.zoomIn)
            .on('mouseout.zoom', $scope.zoomOut)
            .on('click', $scope.onClick);

    });

    $scope.geographyConfig = {
        borderWidth: '1px',
        borderColor: '#C1C1C1',
        popupOnHover: false,
        highlightOnHover: false,
        hideAntarctica: true,
    };

    $scope.mapConfig = {
        scope: 'world',
        element: document.getElementById('world'),
        projection: 'mercator',
        responsive: true,
        fills: $scope.fills,
        geographyConfig: $scope.geographyConfig,
    };

    //basic map config with custom fills, mercator projection
    $scope.world = new Datamap($scope.mapConfig);

    $scope.bubbleConfig = {
        borderWidth: 1,
        borderOpacity: 0.5,
        borderColor: '#FFFFFF',
        fillOpacity: 0.75,
        popupOnHover: true,
        animate: true,
        highlightOnHover: false,
    };

    window.addEventListener('resize', function() {
        $scope.world.resize();
        $scope.world.bubbles($scope.albums, $scope.bubbleConfig);
    });
}]);