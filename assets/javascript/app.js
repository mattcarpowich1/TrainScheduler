$(function() {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDNXIov2ThyvlQwnBYaZefZEQoGYjwv7uE",
    authDomain: "trainscheduler-a1e9e.firebaseapp.com",
    databaseURL: "https://trainscheduler-a1e9e.firebaseio.com",
    projectId: "trainscheduler-a1e9e",
    storageBucket: "trainscheduler-a1e9e.appspot.com",
    messagingSenderId: "121610900696"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  $("form").on("submit", function(event) {
    // prevent default form behavior
    event.preventDefault();

    // collect values from inputs and save as variables
    var trainName = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrainTime = $("#first-train-time").val().trim();
    var frequency = $("#frequency").val().trim();

    // update database
    database.ref().push({
      trainName: trainName,
      destination: destination,
      firstTrainTime: firstTrainTime,
      frequency: frequency
    });

    // clear inputs
    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train-time").val("");
    $("#frequency").val("");

  });

  database.ref().on("child_added", function(snapshot) {

    // collect values from database and store in variables
    var trainName = snapshot.val().trainName;
    var destination = snapshot.val().destination; 
    var firstTrainTime = snapshot.val().firstTrainTime;
    var frequency = parseInt(snapshot.val().frequency);

    // convert first train time into a moment object and store in variable
    var initialDeparture = moment();
    initialDeparture.hour(firstTrainTime.substring(0, 2));
    initialDeparture.minute(firstTrainTime.substring(3, 5));

    console.log("Initial Departure: " + initialDeparture.format("HH:mm"));

    // save the current time
    var now = moment();

    // find the difference in minutes between now and the initial departure
    var diff = parseInt(now.diff(initialDeparture, 'minutes'));

    console.log("Difference: " + diff);
    
    // calculate the remainder between the difference and the frequency
    // in order to determine the next train's arrival time
    var minutesAway = frequency - (diff % frequency);

    console.log("Minutes away: " + minutesAway);

    var nextArrival = now.add(minutesAway, 'minutes');
    nextArrival = nextArrival.format("hh:mm A");

    //add stuff to the table
    var $tableRow = $("<tr>");

    var $trainNameTD = $("<td>").text(trainName);
    var $destinationTD = $("<td>").text(destination);
    var $frequencyTD = $("<td>").text(frequency);
    var $nextArrivalTD = $("<td>").text(nextArrival);
    var $minutesAwayTD = $("<td>").text(minutesAway);

    $tableRow.append($trainNameTD)
      .append($destinationTD)
      .append($frequencyTD)
      .append($nextArrivalTD)
      .append($minutesAwayTD);

    $("tbody").append($tableRow);

  });



});