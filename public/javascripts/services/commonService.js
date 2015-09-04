var app = angular.module('googleRouteApp')

    .constant('cfg', {
        flag: '../../images/flag.png',
        cab: '../../images/cabs.png',
        start: '../../images/start.png',
        end: '../images/end.png',
        //cab: 'https://maps.gstatic.com/mapfiles/ms2/micons/cabs.png',
        routeDelay: 2000
    })

    .factory('utils', function ($q, $filter, cfg) {
        return {
            getMarker: function (obj) {
                return new google.maps.Marker(obj)
            },
            getLatLng: function (lat, lng) {
                return new google.maps.LatLng(lat, lng);
            },
            getLocation: function (coords) {
                var geocoder = new google.maps.Geocoder(),
                    deferred = $q.defer();

                geocoder.geocode({'latLng': coords}, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        (results[1]) ? deferred.resolve(results[1].formatted_address) : deferred.reject('No results found');
                    } else {
                        deferred.reject('Geocoder failed due to: ' + status);
                    }
                });
                return deferred.promise;
            },
            getDate: function (value) {
                return $filter('date')(value, 'medium')
            },
            getMarkerIcon: function (inx) {
                return (inx == 0) ? cfg['start'] : cfg['cab'];
            }
        }
    })

    .factory('routeServices', function ($http, $q, utils, cfg) {
        var map,
            obj = {
                getDriverDetails: function (id, index) {
                    var deferred = $q.defer();
                    $http.get('/user/' + id + '/' + index)
                        .success(function (data) {
                            if (data && data.route) {
                                var latlng = utils.getLatLng(data.route.lat, data.route.lng),
                                    location = utils.getLocation(latlng);

                                location.then(
                                    function (place) {
                                        var trimPlace = place.split(',').slice(0, 3),
                                            markerObj = {
                                                position: latlng,
                                                map: obj.getMap(),
                                                title: 'Details: \n' + 'Cab: ' + data.name + ' \n' +
                                                'Time: ' + utils.getDate(data.route.ts) + ' \n' +
                                                'Place: ' + trimPlace.join(','),
                                                icon: utils.getMarkerIcon(index)
                                            };
                                        deferred.resolve({
                                            inst: utils.getMarker(markerObj),
                                            place: trimPlace.join(','),
                                            latlng: [data.route.lat, data.route.lng]
                                        });
                                    },
                                    function (err) {
                                        console.log('Error: ' + err)
                                    }
                                ) //end location promise
                            } else {
                                deferred.reject('End of coordinates...');
                            }

                        }).error(function (msg, code) {
                            deferred.reject(msg);
                        });
                    return deferred.promise;
                },
                getMap: function () {
                    return map
                },
                setMap: function (mapInst) {
                    map = mapInst;
                },
                getInfoWindow: function (body) {
                    return new google.maps.InfoWindow({
                        content: body,
                        maxWidth: 300
                    });
                }
            };
        return obj;
    });