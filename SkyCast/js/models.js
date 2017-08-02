//Author: Zareh Deirmendjian
//Version: 3.0
//Copyright: 2017

var currently;
var minutely;
var hourly;
var daily;
var alerts;
var time;

//array for holding data for last 8 days for historical information
var histData = [];

//holds string reference for each day of the week
var days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

//arrays holding hourly temperatures for each day
var sunday = [],
    monday = [],
    tuesday = [],
    wednesday = [],
    thursday = [],
    friday = [],
    saturday = [];

var sundayPrec = [],
    mondayPrec = [],
    tuesdayPrec = [],
    wednesdayPrec = [],
    thursdayPrec = [],
    fridayPrec = [],
    saturdayPrec = [];

//arrays holding hourly times corresponding to each hourly temp for each day
var sundayTimes = [],
    mondayTimes = [],
    tuesdayTimes = [],
    wednesdayTimes = [],
    thursdayTimes = [],
    fridayTimes = [],
    saturdayTimes = [];

//array for holding times for reference later
var weekTimes = [];
weekTimes.push(sundayTimes);
weekTimes.push(mondayTimes);
weekTimes.push(tuesdayTimes);
weekTimes.push(wednesdayTimes);
weekTimes.push(thursdayTimes);
weekTimes.push(fridayTimes);
weekTimes.push(saturdayTimes);

var weekTemps = [];
weekTemps.push(sunday);
weekTemps.push(monday);
weekTemps.push(tuesday);
weekTemps.push(wednesday);
weekTemps.push(thursday);
weekTemps.push(friday);
weekTemps.push(saturday);

var weekPrec = [];
weekPrec.push(sundayPrec);
weekPrec.push(mondayPrec);
weekPrec.push(tuesdayPrec);
weekPrec.push(wednesdayPrec);
weekPrec.push(thursdayPrec);
weekPrec.push(fridayPrec);
weekPrec.push(saturdayPrec);


//array for holding searchHistory to later be populated and passed to cookie
var queue = [];

//build historical data for last month


var histDays = {
    "0": 1,
    "1": 2,
    "2": 3,
    "3": 4,
    "4": 5,
    "5": 6,
    "6": 7,
    "7": 8,
}