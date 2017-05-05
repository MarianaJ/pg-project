
$(document).on("pageshow", "#map-page", function () {
    var defaultLatLng = new google.maps.LatLng(50.0685685, 19.955005);
    if (navigator.geolocation) {
        function success(pos) {
            // location found - show map with these coordinates

            drawMap(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));


        }

        function fail(error) {
            drawMap(defaultLatLng);  // failed - show default map
        }

        // find the user's current position; cache the location for 5 minutes, timeout after 6 seconds
        navigator.geolocation.getCurrentPosition(success, fail, { maximumAge: 500000, enableHighAccuracy: true, timeout: 6000 });

    } else {
        // drawMap(defaultLatLng);  // no geolocation support - show default map
        if (navigator.geolocation) {
            function success(pos) {
                // location found - show map with these coordinates
                drawMap(new google.maps.LatLng(pos.coords.latitude,
                    pos.coords.longitude
                ));
            }

            function fail(error) {
                drawMap(defaultLatLng);  // failed - show default map
            }

            // find the user's current position; cache the location for 
            // 5 minutes, timeout after 6 seconds
            navigator.geolocation.getCurrentPosition(success,
                fail,
                {
                    maximumAge: 500000,
                    enableHighAccuracy: true,
                    timeout: 6000
                });
        } else {
            drawMap(defaultLatLng);  // no geolocation support
        }

    }


    function drawMap(latlng) {
        var markers = [];
        var myOptions = {
            zoom: 15,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };


        var map = new google.maps.Map(document.getElementById("map-area"), myOptions);

        var input = document.getElementById('searchonmap');
        input instanceof window.HTMLTextAreaElement;
        // add a start marker

        addMarker(latlng);

        console.log(markers[0].getPosition().lat(), markers[0].getPosition().lng());
        var mlat = markers[0].getPosition().lat(),
            mlong = markers[0].getPosition().lng();

        google.maps.event.trigger(map, 'resize');
        map.setZoom(map.getZoom());


        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        var infowindow = new google.maps.InfoWindow();


        // Adds a marker to the map and push to the array.
        function addMarker(location) {
            var marker = new google.maps.Marker({
                position: location,
                map: map

            });
            markers.push(marker);
        }
        // Sets the map on all markers in the array.
        function setMapOnAll(map) {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
            }
        }
        // Removes the markers from the map, but keeps them in the array.
        function clearMarkers() {
            setMapOnAll(null);
        }
        // Shows any markers currently in the array.
        function showMarkers() {
            setMapOnAll(map);
        }

        // Deletes all markers in the array by removing references to them.
        function deleteMarkers() {
            console.log(markers);
            clearMarkers();
            markers = [];
            delete markers[2];
            console.log(markers);
        }
        directionsService = new google.maps.DirectionsService,
            directionsDisplay = new google.maps.DirectionsRenderer({
                map: map
            });
        autocomplete.addListener('place_changed', function () {
            if (markers.length == 2) {
                deleteMarkers();
            }

            infowindow.close();
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                window.alert("Autocomplete's returned place contains no geometry");
                return;
            }

            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);
            }

            // markerb.setPosition(place.geometry.location);
            addMarker(place.geometry.location);

            console.log(place.geometry.location.lat(), place.geometry.location.lng());
            // markerb.setVisible(true);

            pointA = new google.maps.LatLng(mlat, mlong);
            pointB = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());


            calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB);


            function calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {

                directionsService.route({
                    origin: pointA,
                    destination: pointB,
                    avoidTolls: false,
                    avoidHighways: false,
                    travelMode: google.maps.TravelMode.DRIVING
                }, function (response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(response);
                    } else {
                        window.alert('Directions request failed due to ' + status);
                    }
                });
            }

            var address = '';
            if (place.address_components) {
                address = [
                    (place.address_components[0] && place.address_components[0].short_name || ''),
                    (place.address_components[1] && place.address_components[1].short_name || ''),
                    (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
            }

            infowindow.setContent('<div class="info"><strong>' + place.name + '</strong><br>' + address);

            infowindow.open(map, markers[1]);

        });
    }

});


