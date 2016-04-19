'use strict';

var photoMapApp = angular.module('photomap-app', []);

photoMapApp.controller('photomap-controller', ['$scope', '$http', function($scope, $http) {

    $http.get('/js/albums.json').success(function(data) {
        $scope.albums = data;
        $scope.world.bubbles($scope.albums, $scope.bubbleConfig);

        // Redirect to the configured link for that bubble
        $scope.world.svg.selectAll('.datamaps-bubble').on('click', function(){
            var data = JSON.parse(this.getAttribute("data-info"));  // Using basic javascript to prevent adding a
                                                                    // heavier weight library for convenience.
            window.location.href = data.linkUrl;
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
        popupTemplate: function(geography, data) {
            return '<div class="hoverinfo" style="max-width: 25%"><img src="' + data.imageUrl + '" alt="' + data.name + '" /></div>';
        },
        fillOpacity: 0.75,
        animate: true,
        highlightOnHover: true,
        highlightFillColor: '#D7E8ED',
        highlightBorderColor: '#D7E8ED',
        highlightBorderWidth: 2,
        highlightBorderOpacity: 0.5,
        highlightFillOpacity: 0.5
    };

    window.addEventListener('resize', function() {
        $scope.world.resize();
    });
}]);