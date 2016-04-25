'use strict';

var photoMapApp = angular.module('photomap-app', []);

photoMapApp.controller('photomap-controller', ['$scope', '$http', function($scope, $http) {

    $http.get('/js/albums.json').success(function(data) {

        $scope.albums = data;
        $scope.world.bubbles($scope.albums, $scope.bubbleConfig);

        var svg = $scope.world.svg
        // Redirect to the configured link for that bubble
        svg.selectAll('.datamaps-bubble').on('click', function(){
            var data = JSON.parse(this.getAttribute("data-info"));
            window.location.href = data.linkUrl;
        });

        var defs = svg.append("defs")
        for( var i=0; i<$scope.albums.length; i++ ) {
            var album = $scope.albums[i];
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


        var circles = d3.selectAll("circle");

        circles
            .on('mouseover', function(data) {
                var circle = d3.select(this);
                circle
                    //.transition() // transitionining seems to cause flickering of the bubble as it grows
                    //.duration(400)
                    .attr('r', function(datum) {
                        return '25%'; // grow the circle by 25%
                    })
                    .style('fill', function(datum) {
                        return 'url(#album' + datum.id + ')';
                    });
            })
            .on('mouseout', function(data) {
                var circle = d3.select(this);
                circle
                    //.transition() // transitionining seems to cause flickering of the bubble as it grows
                    //.duration(400)
                    .attr('r', function(datum) {
                        return datum.radius;
                    })
                    .style('fill', '#527D9E');
            });

    });

    // Color scheme generated at https://coolors.co/app/d7e8ed-8bbeed-5091ba-527d9e-c1c1c1
    $scope.fills = {
        JAX: '#8BBEED',
        ROB: '#5091BA',
        BOTH: '#527D9E',
        NOT_TOGETHER: '#D7E8ED',
        DETAIL: '#123456',
        defaultFill: '#FFFFFF'
    };

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
        popupOnHover: false,
        animate: true,
        highlightOnHover: false,
    };

    window.addEventListener('resize', function() {
        $scope.world.resize();
    });
}]);