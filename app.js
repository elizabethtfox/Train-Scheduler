$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDbUAR5sox8bXApwC_pq1ZAgenApnLQmXU",
        authDomain: "elizabethtfox-gtcbc.firebaseapp.com",
        databaseURL: "https://elizabethtfox-gtcbc.firebaseio.com/",
        projectId: "elizabethtfox-gtcbc",
        storageBucket: "elizabethtfox-gtcbc.appspot.com",
        messagingSenderId: "254882547516"
    };

    firebase.initializeApp(config);

    // Create a variable to reference the database
    var database = firebase.database();

    // Initialize Golbal Variables
    var snapVal;
    var trainName;
    var destination;
    var firstTrain;
    var Frequency;
    var nextArrival;
    var minutesAway;

    //Add Train
    $("#add-new-train").on("click", function(){
        // Don't refresh the page!
        event.preventDefault();

        // Get input data
        name = $("#train-name-input").val().trim();
        destination = $("#destination-input").val().trim();
        firstTrain = $("#first-train-time-input").val().trim();
        frequency = $("#frequency-input").val().trim();

        // Console log input data
        console.log(name);
        console.log(destination);
        console.log(firstTrain);
        console.log(frequency);

        // Store data in Firebase
        database.ref('/CurrentTrains').push({
            name: name,
            destination: destination,
            firstTrainTime: firstTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });

        //Clear input fields
        clearInputs();
    });

    function clearInputs() {
        $('#train-name-input').val("");
        $('#destination-input').val("");
        $('#first-train-time-input').val("");
        $('#frequency-input').val("");
    }

    // Calculate Time
    function figureNextArrival(){
        var currentTime = moment();
        var firstTimeConverted = moment(snapVal.firstTrain);
        var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");

        // Console log times
        console.log("Current Time: " + moment(currentTime).format("HH:mm"));
        console.log("First Train Time: " + snapVal.firstTrain);
        console.log("First Time Converted: " + firstTimeConverted.format("HH:mm"));
        console.log("Time Difference: " + timeDiff);

        // Calculate Next Arrival
        if (moment(currentTime).isBefore(firstTimeConverted)){
            nextArrival = moment(snapVal.firstTrainTime, "HH:mm");
            minutesAway = (timeDiff * -1) +1;
            console.log("Minutes till train: " + minutesAway);
        } else {
            var tRemainder = timeDiff % snapVal.frequency;
            console.log("Remaining Time: " + tRemainder);
            // Minutes until train
            minutesAway = snapVal.frequency - tRemainder;
            console.log("Minutes till train: " + minutesAway);
            // Next train time
            nextArrival = moment().add(minutesAway, "minutes");
            console.log("Arrival Time: " + moment(nextArrival).format("hh:mm A"));
        }
    }

    // Load data to table
    database.ref('/CurrentTrains').orderByChild("dateAdded").on("child_added", function(snapshot){
        // sv variable is for snapshot data
        snapVal = snapshot.val();
        console.log(snapVal);

        // Call figureNextArrival function
        figureNextArrival();

        // Load data to rows
        var tTr = $("<tr>");

        var tTd = $("<td>");

        // Name
        tTd.append(snapVal.name);
        tTr.append(tTd);

        // Destination
        tTd = $("<td>");
        tTd.append(snapVal.destination);
        tTr.append(tTd);

        // Frequency
        tTd = $("<td>");
        tTd.append(snapVal.frequency);
        tTr.append(tTd);

        // Next Arrival
        tTd = $("<td>");
        tTd.append(moment(nextArrival).format("hh:mm A"));
        tTr.append(tTd);

        // Minutes Away
        tTd = $("<td>");
        tTd.append(minutesAway);
        tTr.append(tTd);

        // Add new rows to table
        $("#train-table-body").append(tTr);
    });



});