// Initialize Firebase
var config = {
    apiKey: "AIzaSyD8YsE5FwvvR12BZDmWJzd4ZQU8HFQEMjA",
    authDomain: "eq-wed-class.firebaseapp.com",
    databaseURL: "https://eq-wed-class.firebaseio.com",
    projectId: "eq-wed-class",
    storageBucket: "eq-wed-class.appspot.com",
    messagingSenderId: "458319488128"
    };
firebase.initializeApp(config);

var database = firebase.database();
var currentTime = moment();

database.ref().on("child_added", function(childSnap) {
//Vars for values to be stored in firebase
    var name = childSnap.val().name;
    var destination = childSnap.val().destination;
    var firstTrain = childSnap.val().firstTrain;
    var frequency = childSnap.val().frequency;
    var min = childSnap.val().min;
    var next = childSnap.val().next;
//Appending values to the dom and storing in the table 
    $("#trainTable > tbody").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + next + "</td><td>" + min + "</td></tr>");
});

database.ref().on("value", function(snapshot) {
   
});

//Storing the user input 
$("#addTrainBtn").on("click", function() {

    var trainName = $("#addTrainName").val().trim();
    var destination = $("#addDestination").val().trim();
    var firstTrain = $("#firstTrainTime").val().trim();
    var frequency = $("#addFrequency").val().trim();

    //Validation to ensure no fields are blank
    if (trainName == "") {
        alert('Enter a train name.');
        return false;
    }
    if (destination == "") {
        alert('Enter a destination.');
        return false;
    }
    if (firstTrain == "") {
        alert('Enter a first train time.');
        return false;
    }
    if (frequency == "") {
        alert('Enter a frequency');
        return false;
    }

    //Calculations - subtracts the 1st train time -1yr to ensure its prior current time.
    var firstTrainConverted = moment(firstTrain, "hh:mm").subtract("1, years");
    // Difference between current time and the first train
    var difference = currentTime.diff(moment(firstTrainConverted), "minutes");
    var remainder = difference % frequency;
    var minUntilTrain = frequency - remainder;
    var nextTrain = moment().add(minUntilTrain, "minutes").format("hh:mm a");

    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        min: minUntilTrain,
        next: nextTrain
    }

    console.log(newTrain);
    database.ref().push(newTrain);

    $("#addTrainName").val("");
    $("#addDestination").val("");
    $("#firstTrainTime").val("");
    $("#addFrequency").val("");

    return false;
});