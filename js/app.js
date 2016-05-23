'use strict';

// Utility method to move bubble to front of view (replicating updating the z-index of basic HTML)
d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
        this.parentNode.appendChild(this);
    });
};

var photoMapApp = angular.module('photomap-app', ['ui.bootstrap']);

photoMapApp.controller('photomap-controller', ['$scope', '$http', '$window', function($scope, $http, $window) {

    // Color scheme generated at https://coolors.co/app/d7e8ed-8bbeed-5091ba-527d9e-c1c1c1
    $scope.fills = {
        BOTH: '#527D9E',
        defaultFill: '#FFFFFF'
    };

    // Stores the currently zoomed in bubble for reference
    $scope.openBubble = undefined;
    // Stores the album data from the server
    $scope.albums = [];

    $scope.zoomIn = function(circle) {
        if( circle ) {
            circle
                .attr('r', $scope.bubbleConfig.zoomRadius)
                .style('fill', function (datum) {
                    return 'url(#album' + datum.id + ')';
                })
                .style('fill-opacity', 1);
            circle.moveToFront();
            $scope.openBubble = circle;
        }
    };

    $scope.zoomOut = function(circle) {
        if( circle ) {
            circle
                .attr('r', function (datum) {
                    return datum.radius;
                })
                .style('fill', function (datum) {
                    return $scope.fills[datum.fillKey];
                })
                .style('fill-opacity', .75);
            $scope.openBubble = undefined;
        }
    };

    $scope.createPatterns = function(svg, patterns) {
        var defs = svg.append("defs");

        // Adds all the album cover images to the svg patterns to make
        // them available as fills for the bubbles
        for( var i=0; i<patterns.length; i++ ) {
            var album = patterns[i];
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


        for( var i in data ) {
            var album = data[i];
            album.active ? $scope.albums.push(album) : undefined;
        }

        $scope.world.bubbles($scope.albums, $scope.bubbleConfig);
        $scope.createPatterns(svg, $scope.albums);

        var circles = svg.selectAll("circle");
        circles
            .on('touchstart', function(data) {
                var circle = d3.select(this),
                    radius = circle.attr('r');

                $scope.zoomOut($scope.openBubble);

                if( radius !== $scope.bubbleConfig.zoomRadius ) {
                    $scope.zoomIn(circle);
                }

                else {
                    $window.location.href = data.linkUrl;
                }

                d3.event.preventDefault();
                d3.event.stopPropagation();
            })
            .on('mouseover.zoom', function(data) {
                var circle = d3.select(this);
                $scope.zoomIn(circle);
            })
            .on('mouseout.zoom', function(data) {
                var circle = d3.select(this);
                $scope.zoomOut(circle);
            })
            .on('click', function(data) {
                $window.location.href = data.linkUrl;
            });

    });

    $scope.geographyConfig = {
        borderWidth: '1px',
        borderColor: '#C1C1C1',
        popupOnHover: false,
        highlightOnHover: false,
        hideAntarctica: true
    };

    $scope.mapConfig = {
        scope: 'world',
        element: document.getElementById('photomap'),
        projection: 'mercator',
        responsive: true,
        fills: $scope.fills,
        geographyConfig: $scope.geographyConfig,
        done: function(datamap) {
            d3.select(window).on('resize', function() {
                datamap.resize();
            });

            datamap.svg.on('touchstart', function() {
                $scope.zoomOut($scope.openBubble);
            })
        }
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
        zoomRadius: '25%'
    };
}]);

photoMapApp.controller('nav-controller', function ($scope, $uibModal, $document) {
    $scope.isCollapsed = true;

    $document.ready(function () {
        $scope.openGuide();
    });

    $scope.openGuide = function () {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'guide-content.html',
            controller: 'guide-controller'
        });

        var setGuideCookie = function() {
            // TODO: set cookie to prevent opening of the guide
        }

        modalInstance.result.then(setGuideCookie, setGuideCookie);
    };

    $scope.toggleMenu = function() {
        $scope.isCollapsed = !$scope.isCollapsed;
    }
});

photoMapApp.controller('guide-controller', function ($scope, $uibModalInstance) {
    $scope.close = function () {
        $uibModalInstance.close();
    };
});