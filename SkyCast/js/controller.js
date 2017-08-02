//Author: Zareh Deirmendjian
//Version: 3.0
//Copyright: 2017


//loads the history from the cookie
function loadHistoryFromCookie() {
    //reset history dropdown
    $('#historyDropdown').html("");
    //load history dropdown
    if ($.cookie('SkyCast') != undefined) {
        queue = $.cookie('SkyCast');

        for (var i = (queue.length - 1) ; i >= 0; i--) {
            if (i.valueOf() < (queue.length - 1)) {
                $('#historyDropdown').append('<a class="historyItem">' + JSON.parse(queue[i]).location + '</a>');
            }
            else {
                $('#historyDropdown').html('<a class="historyItem">' + JSON.parse(queue[i]).location + '</a>');
            }

        }
    }

    //wire the handler
    $(".historyItem").unbind('click');
    $(".historyItem").on('click', historyItemClick);
}

//when an historical entry is clicked, the searchbox is populated
function historyItemClick(e) {
    //var $this = $(this);
    var $this = e.target;
    var cityName = $this.text;
    $('#city-search').val(cityName);

    var loc = jQuery.grep(queue, function (a) {
        return JSON.parse(a).location == cityName;
    });

    var lat = JSON.parse(loc).lat;
    var long = JSON.parse(loc).long;

    $('#latitude').val(lat);
    $('#longitude').val(long);
}

//skycons function attaches id's for reference later'

function skycons() {
    var i,
        icons = new Skycons({
            "color": "#FFFFFF",
            "resizeClear": true // nasty android hack
        }),
        list = [ // listing of all possible icons
            "clear-day",
            "clear-night",
            "partly-cloudy-day",
            "partly-cloudy-night",
            "cloudy",
            "rain",
            "sleet",
            "snow",
            "wind",
            "fog"
        ];

    // loop thru icon list array
    for (i = list.length; i--;) {
        var weatherType = list[i], // select each icon from list array
            // icons will have the name in the array above attached to the
            // canvas element as a class so let's hook into them.
            elements = document.getElementsByClassName(weatherType);

        // loop thru the elements now and set them up
        for (e = elements.length; e--;) {
            icons.set(elements[e], weatherType);
        }
    }

    // animate the icons
    icons.play();
}


//runs when event listener on arrow is fired
function GetLocation() {
    var lat = $('#latitude').val();
    var long = $('#longitude').val();

    var cityName = $('#city-search').val();

    //check if cookie already contains the location
    var loc = jQuery.grep(queue, function (a) {
        return JSON.parse(a).location == cityName;
    });

    if (loc.length == 0) {
        //update history and history
        var histItem = {
            "location": cityName,
            "lat": lat,
            "long": long
        }

        queue.push(JSON.stringify(histItem));

        if (queue.length > 5) {
            queue.shift();
        }

        $.cookie('SkyCast', queue, { expires: 7 });
    }

    loadHistoryFromCookie();

    controller.init(lat, long);
    $('#weatherHeader').text($('#city-search').val());

    //adjust height
    $("#HomeWindow").css("height", (screen.height * .4));

}

//Controller class that builds the data to respective models
var controller = {
    init: function (latitude, longitude) {
        var apiKey = '285f4c26b59fc0345636b5f4ef0e4f27',
            url = 'https://api.darksky.net/forecast/',
            lati = latitude,
            longi = longitude,
            api_call = url + apiKey + "/" + lati + "," + longi + "?extend=hourly&callback=?";

        //Simple Ajax Call to retrieve API data relative to present
        $.ajax({
            type: "POST",
            url: api_call,
            contentType: "application/json; charset=utf-8",
            dataType: "jsonp",
            success: function (forecast) {


                controller.buildModel(forecast);
                controller.currentlyData();



            },
            error: function (xhr, textStatus, errorThrown) {
                $("#error").html(xhr.responseText);
            }


        });
    },

    //adds the data from the api call relating to the present to the model and dynamically creates HTML elements
    buildModel: function (forecast) {
        currently = forecast.currently;
        daily = forecast.daily;
        alerts = forecast.alerts;

        if (alerts != undefined) {
            $("#ticker01").html('<li><span>' + alerts[0].title + '</span></li>');
        }

        else {
            $("#ticker01").html('<li><span>No Current Alerts</span></li>');
        }

        $(function () {
            $("ul#ticker01").liScroll();
        });

        for (var i = 0; i < weekTimes.length; i++) {
            weekTimes[i].length = 0;
        }

        sunday.length = 0;
        monday.length = 0;
        tuesday.length = 0;
        wednesday.length = 0;
        thursday.length = 0;
        friday.length = 0;
        saturday.length = 0;
        // Loop thru hourly forecasts
        for (var j = 0, k = forecast.hourly.data.length; j < k; j++) {
            var hourly_date = new Date(forecast.hourly.data[j].time * 1000),
                hourly_day = days[hourly_date.getDay()],
                hourly_time = hourly_date.getHours(),
                hourly_temp = forecast.hourly.data[j].temperature,
                hourly_precip = forecast.hourly.data[j].precipProbability;

            switch (hourly_day) {
                case 'Sunday':
                    sunday.push(hourly_temp);
                    sundayTimes.push(hourly_time);
                    sundayPrec.push(hourly_precip);
                    break;
                case 'Monday':
                    monday.push(hourly_temp);
                    mondayTimes.push(hourly_time);
                    mondayPrec.push(hourly_precip);
                    break;
                case 'Tuesday':
                    tuesday.push(hourly_temp);
                    tuesdayTimes.push(hourly_time);
                    tuesdayPrec.push(hourly_precip);
                    break;
                case 'Wednesday':
                    wednesday.push(hourly_temp);
                    wednesdayTimes.push(hourly_time);
                    wednesdayPrec.push(hourly_precip);
                    break;
                case 'Thursday':
                    thursday.push(hourly_temp);
                    thursdayTimes.push(hourly_time);
                    thursdayPrec.push(hourly_precip);
                    break;
                case 'Friday':
                    friday.push(hourly_temp);
                    fridayTimes.push(hourly_time);
                    fridayPrec.push(hourly_precip);
                    break;
                case 'Saturday':
                    saturday.push(hourly_temp);
                    saturdayTimes.push(hourly_time);
                    saturdayPrec.push(hourly_precip);
                    break;
                default: console.log(hourly_date.toLocaleTimeString());
                    break;
            }
        }

        //clear
        $("#forecastInfo").html("");
        $("#hourlyInfo").html("");
        // Loop thru daily forecasts and append
        for (var i = 0, l = forecast.daily.data.length; i < l - 1; i++) {

            var date = new Date(forecast.daily.data[i].time * 1000),
                day = days[date.getDay()],
                skicons = forecast.daily.data[i].icon,
                time = forecast.daily.data[i].time,
                humidity = forecast.daily.data[i].humidity,
                summary = forecast.daily.data[i].summary,
                temp = Math.round(forecast.hourly.data[i].temperature),
                tempMax = Math.round(forecast.daily.data[i].temperatureMax);

            //// Append Markup for each Forecast of the 7 day week
            $("#forecastInfo").append(
                '<div class="col-md-1" style="width:13%">' +
                '<div id="shading" class="shade-' + skicons + '">' +
                '<div class="card-container">' +
                "<div class='graphic'><canvas class=" + skicons + "></canvas></div>" +
                "<div><b>Day</b>: " + date.toLocaleDateString() + "</div>" +
                "<div><b>Temperature</b>: " + temp + "</div>" +
                "<div><b>Max Temp.</b>: " + tempMax + "</div>" +
                "<div><b>Humidity</b>: " + humidity + "</div>" +
                '<p class="summary">' + summary + '</p>' +
                '<button id="showHourly" class="btnHourly" style="color:black">Show Hourly</button>' +
                '<div id="hourlyInfo" class="back card" style="display:none">' +
                '<div class="hourly' + ' ' + day + '"><b>24hr Forecast</b><ul class="col-md-12 list-reset">' +
                '<li><div id="temp-form" class="col-md-4"><b>Time</b></div><div id="temp-form" class="col-md-4"><b>Temp.</b></div><div id="temp-form" class="col-md-4"><b>Precip.</b></div></li>' +
                '</div></div></div></div>'
            );


            // Daily forecast report for each day of the week
            switch (day) {
                case 'Sunday':
                    controller.hourlyReport(weekTimes[0], weekTemps[0], weekPrec[0], days[0]);
                    break;
                case 'Monday':
                    controller.hourlyReport(weekTimes[1], weekTemps[1], weekPrec[1], days[1]);
                    break;
                case 'Tuesday':
                    controller.hourlyReport(weekTimes[2], weekTemps[2], weekPrec[2], days[2]);
                    break;
                case 'Wednesday':
                    controller.hourlyReport(weekTimes[3], weekTemps[3], weekPrec[3], days[3]);
                    break;
                case 'Thursday':
                    controller.hourlyReport(weekTimes[4], weekTemps[4], weekPrec[4], days[4]);
                    break;
                case 'Friday':
                    controller.hourlyReport(weekTimes[5], weekTemps[5], weekPrec[5], days[5]);
                    break;
                case 'Saturday':
                    controller.hourlyReport(weekTimes[6], weekTemps[6], weekPrec[6], days[6]);
                    break;
            }


        }


        //on card hourly button click, show/hide hourly results
        $('.btnHourly').click(function (e) {
            var $this = $(this);
            var card = $this.closest('div').find('.card');
            card.toggle();
        });

        //plays icons
        skycons();

    },

    //dynamically adds hourly Report to html
    hourlyReport: function (dayTimes, day, dayPrec, selector) {
        if (dayTimes[0] > 0) {
            for (var i = 0, l = (24 - dayTimes[0]); i < l; i++) {
                //$(".Sunday" ).append(<li>sundayTimes[i])                                
                var standardTime = controller.timeMilitarytoStandard(dayTimes[i]);
                $("." + selector + " " + "ul").append('<li><div id="temp-form" class="col-md-4">' + standardTime + '</div><div id="temp-form" class="col-md-4">' + Math.round(day[i]) + '</div><div id="temp-form" class="col-md-4">' + (Math.round(dayPrec[i] * 100) + "%") + '</div></li>');
            }
        }
        else {
            for (var i = 0, l = day.length; i < l; i++) {
                //$(".Sunday" ).append(<li>sundayTimes[i])                                
                var standardTime = controller.timeMilitarytoStandard(dayTimes[i]);
                $("." + selector + " " + "ul").append('<li><div id="temp-form" class="col-md-4">' + standardTime + '</div><div id="temp-form" class="col-md-4">' + Math.round(day[i]) + '</div><div id="temp-form" class="col-md-4">' + (Math.round(dayPrec[i] * 100) + "%") + '</div></li>');
            }
        }
    },

    //translates military to standard
    timeMilitarytoStandard: function (time) {
        //var standardTime;
        if (time.valueOf() < 1) {
            time = 12 + " AM";
            return time;
        }
        if (time > 12) {
            time = (time - 12) + " PM";
            return time;
        }

        return time + " AM";
    },

    //builds HistoricalData and creates the chart
    buildHistorical: function (histDay, time) {

        //gather data for last week


        var lat = $('#latitude').val();
        var long = $('#longitude').val();

        var apiKey = '285f4c26b59fc0345636b5f4ef0e4f27',
            url = 'https://api.darksky.net/forecast/',

            api_call = url + apiKey + "/" + lat + "," + long + "," + time;

        $.ajax({
            type: "POST",
            url: api_call,
            contentType: "application/json; charset=utf-8",
            dataType: "jsonp",
            //data: "{id: '" + someId + "'}",
            success: function (histForecast) {
                //$("#success").html("json.length=" + json.length);
                //itemAddCallback(json);
                //$('#test2').html(forecast.currently.summary);

                daySelector = histForecast.daily.data;

                histData.push({
                    Day: histDay,
                    Value: JSON.stringify(histForecast.daily.data[0])
                });
            },
            error: function (xhr, textStatus, errorThrown) {
                $("#error").html(xhr.responseText);
            }


        });
    },

    //add current data to mdel and dynamically create html elements
    currentlyData: function () {
        //setting the time
        var date = new Date(currently.time * 1000);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        time = hours + ':' + minutes.substr(-2);

        //temp facts
        var summary = currently.summary;
        var appTemp = currently.apparentTemperature;
        var airTemp = currently.temperature;
        var humidity = currently.humidity;
        var cloudCover = currently.cloudCover;
        var windSpeed = currently.windSpeed;
        var precip = currently.precipProbability;
        var precipType = currently.precipType;

        ////Setting the html elements
        $('#currSumm').html('<p><b>Summary: </b>' + summary + '</p>');
        $('#currTime').html('<p><b>Time: </b>' + time + '</p>');
        $('#currAirTemp').html('<p><b>Temperature: </b> ' + airTemp + ' F</p>');
        $('#currAppTemp').html('<p><b>Feels Like: </b>' + appTemp + ' F</p>');
        $('#currHumidity').html('<p><b>Humidity: </b>' + humidity + '</p>');
        $('#currCloudCover').html('<p><b>Cloud Coverage: </b>' + cloudCover + '</p>');
        $('#currWindSp').html('<p><b>Wind Speed: </b>' + windSpeed + " mph</p>");

        view("Today");

        $('#nav').show();
        $('#wrapper').show();
    }

}

//assigns variables and populates the chart with historical data 
function populateHistorical() {


    //had to implement a switch statement here because ajax requests kept building the histData[] in random order
    for (var j = 0; j < 8; j++) {
        switch (histData[j].Day) {
            case '0':
                var yesterDay = JSON.parse(histData[j].Value);
                var yesterDate = new Date(yesterDay.time * 1000);
                break;
            case '1':
                var secondDay = JSON.parse(histData[j].Value);
                var secondDate = new Date(secondDay.time * 1000);
                break;
            case '2':
                var thirdDay = JSON.parse(histData[j].Value);
                var thirdDate = new Date(thirdDay.time * 1000);
                break;
            case '3':
                var fourthDay = JSON.parse(histData[j].Value);
                var fourthDate = new Date(fourthDay.time * 1000);
                break;
            case '4':
                var fifthDay = JSON.parse(histData[j].Value);
                var fifthDate = new Date(fifthDay.time * 1000);
                break;
            case '5':
                var sixthDay = JSON.parse(histData[j].Value);
                var sixthDate = new Date(sixthDay.time * 1000);
                break;
            case '6':
                var seventhDay = JSON.parse(histData[j].Value);
                var seventhDate = new Date(seventhDay.time * 1000);
                break;
            case '7':
                var eighthDay = JSON.parse(histData[j].Value);
                var eighthDate = new Date(eighthDay.time * 1000);
                break;
        }
    }

    //actually creates the chart
    $("#chart-container").insertFusionCharts({
        type: "line",
        width: "1000",
        height: "600",
        dataFormat: "json",
        dataSource: {
            "chart": {
                "caption": "Historical Highs",
                "subCaption": "Last Week",
                "xAxisName": "Date",
                "yAxisName": "Temperature",
                //Making the chart export enabled in various formats
                "exportEnabled": "1",
                "theme": "fint"
            },

            "data": [{
                "label": (eighthDate.getMonth() + 1).toString() + "/" + eighthDate.getDate().toString(),
                "value": eighthDay.temperatureMax
            }, {
                "label": (seventhDate.getMonth() + 1).toString() + "/" + seventhDate.getDate().toString(),
                "value": seventhDay.temperatureMax
            }, {
                "label": (sixthDate.getMonth() + 1).toString() + "/" + sixthDate.getDate().toString(),
                "value": sixthDay.temperatureMax
            }, {
                "label": (fifthDate.getMonth() + 1).toString() + "/" + fifthDate.getDate().toString(),
                "value": fifthDay.temperatureMax
            }, {
                "label": (fourthDate.getMonth() + 1).toString() + "/" + fourthDate.getDate().toString(),
                "value": fourthDay.temperatureMax
            }, {
                "label": (thirdDate.getMonth() + 1).toString() + "/" + thirdDate.getDate().toString(),
                "value": thirdDay.temperatureMax
            }, {
                "label": (secondDate.getMonth() + 1).toString() + "/" + secondDate.getDate().toString(),
                "value": secondDay.temperatureMax
            }, {
                "label": (yesterDate.getMonth() + 1).toString() + "/" + yesterDate.getDate().toString(),
                "value": yesterDay.temperatureMax
            }]
        }
    });
    $('#chart-container').show();
}

