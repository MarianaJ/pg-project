
$(document).on("pageshow", "#map-page", function () {
    var input = document.getElementById('searchonmap');
    input.value = 'Kraków,';
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
        navigator.geolocation.getCurrentPosition(success, fail, { maximumAge: 500000, enableHighAccuracy: true, timeout: 8000 });
    } else {
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
            // 5 minutes, timeout after 8 seconds
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
        addMarker(latlng);//start marker your pos
    
        var mlat = markers[0].getPosition().lat(),
            mlong = markers[0].getPosition().lng();

        google.maps.event.trigger(map, 'resize');
        map.setZoom(map.getZoom());

        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        var infowindow = new google.maps.InfoWindow();

        // Adds a marker to the map and push to the array (markers).
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
                window.alert("Nie znaleziono takiego miejsca!");// error when autocomplete's returned place contains no geometry
                return;
            }

            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);
            }
            addMarker(place.geometry.location);

            console.log(place.geometry.location.lat(), place.geometry.location.lng());
            pointA = new google.maps.LatLng(mlat, mlong);
            pointB = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());

            //call of function to display a route
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
                        window.alert('Nie udało się wyznaczyć trasy, błąd: ' + status);// onerror
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


/*HERE IS  A NOTES SCRIPTS*/


$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

var app = {

    findAll: function() {

        this.store.findAll(function(todos) {
            var l = todos.length;
            var td;

            // Create new arrays so we can order them with outstanding first
            outstanding = [];
            completed = [];
            allTodos = [];

            // Loop through todos, build up lis and push to arrays
            for (var i=0; i<l; i++) {
                td = todos[i];

                // If not completed
                if (td.status == 0) {
                    outstanding.push('<li data-row-id="' + td.id + '" class="outstanding"><a href="#view" data-transition="fade" class="view" data-view-id="' + td.id +'"><h2>' + td.title+ '</h2><p>' + td.description + '</p></a><a href="#" data-icon="check" data-iconpos="notext" class="mark-completed" data-theme="a" data-mark-id="' + td.id +'">Mark as completed</a></li>');
                }
                // If is completed
                else {
                    completed.push('<li data-row-id="' + td.id + '" class="completed"><a href="#view" data-transition="fade" class="view" data-view-id="' + td.id +'"><h2>' + td.title+ '</h2><p>' + td.description + '</p></a><a href="#" data-icon="delete" data-iconpos="notext" class="mark-outstanding" data-theme="a" data-mark-id="' + td.id +'">Mark as outstanding</a></li>');
                }
            }

            // Join both arrays
            allTodos = outstanding.concat(completed);

            // Remove any previously appended
            $('.todo-listview li').remove();

            // Append built up arrays to ULs here.
            $('.todo-listview').append(allTodos);            

            // Refresh JQM listview
            $('.todo-listview').listview('refresh');
        });
    },

    findById: function(id) {
        
        this.store.findById(id, function(result) {

            console.log(result);
            console.log(result.title);
            console.log(result.description);

            // Add the results data to the required form fields here
            $('#title').val(result.title);
            $('#title').attr('data-id', id);
            $('#description').val(result.description);
            $('#id').val(id);
        });
    },
	
	
  markCompleted: function(id) {

        this.store.markCompleted(id, function(result) {
            // DB updates successful
            if(result) {
                // Find original row and grab details
                var originalRow =  $('#notes *[data-row-id="'+id+'"]'),
                    title = originalRow.find("h2").text(),
                    desc = originalRow.find("p").text();
                // Remove from pending row
                originalRow.remove();
                var newRow = '<li data-row-id="' + id + '" class="completed"><a href="#view" data-transition="fade" class="view" data-view-id="' + id +'"><h2>' + title + '</h2><p>' + desc + '</p></a><a href="#" data-icon="delete"  data-iconpos="notext" class="mark-outstanding"   data-theme="a"data-mark-id="' + id +'">Mark as outstanding</a></li>';

                // Add to completed
                $('.todo-listview').append(newRow);

                // Refresh dom
                $('.todo-listview').listview('refresh');

            } else {
                alert("Error - on update");
            }
        });
    },

    markOutstanding: function(id) {

        this.store.markOutstanding(id, function(result) {

            if(result) {
                var originalRow =  $('*[data-row-id="'+id+'"]'),
                    title = originalRow.find("h2").text(),
                    desc = originalRow.find("p").text();

                originalRow.remove();
                var newRow = '<li data-row-id="' + id + '" class="outstanding"><a href="#view" data-transition="fade" class="view" data-view-id="' + id +'"><h2>' + title + '</h2><p>' + desc + '</p></a><a href="#" data-icon="check" data-iconpos="notext" class="mark-completed" data-theme="a" data-mark-id="' + id +'"  data-theme="a">Mark as completed</a></li>';

                $('.todo-listview').prepend(newRow);
                $('.todo-listview').listview('refresh');

            } 
        });
    },

    insert: function(json) {
        this.store.insert(json, function(result) {
            // On successful db insert
            if(result) {
                console.log("add ok");
                $.mobile.changePage( $("#notes"), {
                    transition: "fade",
                    reverse: true,
                    changeHash: true,
                });

            } else {
                alert("Błąd dodawania");
            }
        });
    },

    update: function(json) {
        this.store.update(json, function(result) {
            if(result) {
               console.log("update ok");
            } else {
                alert("Błąd w odświeżani");
            }
        });
    },

    delete: function(json) {
        this.store.delete(json, function(result) {

            // On successful db delete
            if(result) {
                console.log("delete ok");

                $.mobile.changePage( $("#notes"), {
                    transition: "fade",
                    reverse: true,
                    changeHash: true
                });

            } else {
                alert("Błąd w usuwaniu");
            }
        });
    },
		
     initialize: function() {

        // Create a new store
        this.store = new WebSqlDB();

        // Bind all events here when the app initializes
        $(document).on('pagebeforeshow', '#notes', function(event) {
            app.findAll();
        });

        $(document).on('click', '.view', function(event) {
            app.findById($(this).data('view-id'))
        });

        $(document).on('click', '.add', function(event) {
            var data = JSON.stringify($('#insert').serializeObject()); 
            app.insert(data);
        });

        $(document).on('change', '.target', function(event) {
            var data = JSON.stringify($('#edit').serializeObject()); 
            app.update(data);
        });

        $(document).on('click', '.delete', function(event) {
            var data = JSON.stringify($('#edit').serializeObject()); 
            app.delete(data);
        });

        $(document).on('click', '.mark-completed', function(event) {
            app.markCompleted($(this).data('mark-id'));
        });

        $(document).on('click', '.mark-outstanding', function(event) {
            app.markOutstanding($(this).data('mark-id'));
        });
    }

};

app.initialize();