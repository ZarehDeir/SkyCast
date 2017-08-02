//Author: Zareh Deirmendjian
//Version: 3.0
//Copyright: 2017

$(document).ready(function () {

    //setting the cookie
    $.cookie.json = true;

    //if the cookie contains data we will set our variable queue and update our Historical Searches DropDown
    loadHistoryFromCookie();

    //historical Search DropDown Click
    $('#historicalSearches').click(function (e) {
        document.getElementById("historyDropdown").classList.toggle("show");
    });

    // Close the dropdown menu if the user clicks outside of it
    window.onclick = function (event) {
        if (!event.target.matches('.dropbtn')) {

            var dropdowns = document.getElementsByClassName("dropdown-content");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }

    //erases searchBox when clicked
    $('#city-search').click(function (e) {
        $('#city-search').val("");
    });


    //resizing the main page based on window size
    document.getElementById("HomeWindow").style.height = window.innerHeight + "px";

    //evenet listener for searchbox
    $('#getlocation').click(function (e) {
        GetLocation();
    });


    //setting google maps apis
    var searchBox = new google.maps.places.SearchBox(document.querySelector("#city-search"));
    searchBox.addListener('places_changed', function () {
        var locale = searchBox.getPlaces()[0];
        if (locale == undefined) {
            alert("Unknown location");
        } else {
            document.querySelector("#latitude").value = locale.geometry.location.lat();
            document.querySelector("#longitude").value = locale.geometry.location.lng();
            GetLocation();
        }
    });

    //click listeners for the navbar

    $('#Today').click(function (e) {
        view("Today");
    });

    $('#Hourly').click(function (e) {
        view("Hourly");
    });

    $('#Week').click(function (e) {
        view("Week");
    });

    $('#Historical').click(function (e) {
        view("Historical");
    });

});
//view function builds display based on user selection
function view(type) {
        $('#currentdata').hide();
        $('#forecastInfo').hide();
        $('.back.card').hide();
        $('#chart-container').hide();

        switch (type) {
            case 'Today':
                $('#currentdata').show();
                break;
            case 'Week':
                $('#forecastInfo').show();
                break;
            case 'Hourly':
                $('#forecastInfo').show();
                $('.back.card').show();
                break;
            case 'Historical':

                histData = [];

                //returns milliseconds timestamp
                var currentUnix = Date.now();

                //turn to seconds
                currentUnix = Math.round(currentUnix / 1000);




                //24 hours in seconds (60 sec * 60 minutes * 24 hours = 86400 seconds)
                var dayinSecs = 86400;
                //var timeToPull = (time - (8 * dayinSecs));

                //creates ajax call for each day in last week
                $.each(histDays, function (i, obj) {
                    var t = currentUnix - (obj * dayinSecs)
                    controller.buildHistorical(i, t);
                });

                //needed to add this because asynchronous ajax flow was causing errors
                $(document).ajaxStop(function () {
                    populateHistorical();
                });

                break;
        }
}