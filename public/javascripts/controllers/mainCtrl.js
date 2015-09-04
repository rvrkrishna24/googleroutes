var app = angular.module('googleRouteApp', ['ngMap'])

    .controller('mapCtrl', ['$scope', '$http', 'routeServices', '$filter', 'cfg', '$anchorScroll', '$location',
        function ($scope, $http, routeServices, $filter, cfg, $anchorScroll, $location) {
            var markers = [],
                started;

            $scope.start = function () {
                var routeIndex = 0;
                $scope.isItDisabled = true;
                $scope.locationArr = []; //to show the place list on right

                var fetchCoordinates = function () {
                    if (routeIndex > 1 && markers.length)	//keep previous marker as flag
                        markers[routeIndex - 1].setIcon(cfg.flag);

                    var plot = routeServices.getDriverDetails(1, routeIndex);
                    plot.then(
                        function (marker) {
                            markers.push(marker.inst);
                            $scope.latlng = marker.latlng; //show marker on map
                            $scope.locationArr.push({name: marker.place}); //show location list
                            $location.hash(marker.place.split(',')[0]);
                            $anchorScroll();
                            routeIndex += 1;
                            started = setTimeout(fetchCoordinates, cfg.routeDelay);
                        },
                        function (error) {
                            var lastMarker = markers[routeIndex - 1],
                                infoWin = routeServices.getInfoWindow('<div><b>::Destination::</b></div><div>' + lastMarker.title + '</div>');

                            lastMarker.setIcon(cfg.end); //keep last marker as red
                            infoWin.open(routeServices.getMap(), lastMarker);
                            console.log('End of Route:' + error);
                        }
                    );
                }
                fetchCoordinates();
            }

            $scope.reset = function () {
                for (var i = 0; i < markers.length; i++) {
                    markers[i].setMap(null);
                }
                $scope.locationArr = [];
                markers = [];
                $scope.isItDisabled = false;
                clearTimeout(started);
                //$location.path('/');
            }

            $scope.$on('mapInitialized', function (evt, evtMap) {
                routeServices.setMap(evtMap);
            });
        }]);