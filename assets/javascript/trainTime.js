var config = {
	apiKey: "AIzaSyB8qhteO9OTdyOmNFFuWl3kSWC0qgmxvDk",
	authDomain: "traintime-b5b38.firebaseapp.com",
	databaseURL: "https://traintime-b5b38.firebaseio.com",
	projectId: "traintime-b5b38",
	storageBucket: "traintime-b5b38.appspot.com",
	messagingSenderId: "199830296364"
};

firebase.initializeApp(config);

// Declaring global variables first
var database = firebase.database();

var name = '';
var dest = '';
var firstTrain = '';
var freq = 0;
var timeFormat = ("h:mm:ss A");
var now;
var tdName;
var tdDest;
var tdFirstTrain;
var tdFreq;
var tdNextArrival;
var tdMinutes;
var firstTimeConv;
var timeDiff;
var tRemainder;
var getKey;
var key;
var dateAdded;
var minsID;
var arrivalID;
var minsIdArray = [];
var arrivalIdArray = [];


// Clock function to display current time
function displayTime() {
	now = moment().format(timeFormat);
	$("#clock").html(now);
}

setInterval(displayTime, 1000);


$("#submitInfo").on("click", function (event) {
	// Prevent form from reloading the page on Submit
	// event.preventDefault();

	// Get the input values
	name = $("#trainName").val().trim();
	dest = $("#dest").val().trim();
	firstTrain = $("#firstTime").val();
	freq = parseInt($("#freq").val().trim());


	// Save the new data in Firebase
	database.ref().push({
		name: name,
		dest: dest,
		firstTrain: firstTrain,
		freq: freq,
		dateAdded: firebase.database.ServerValue.TIMESTAMP
	});


});
// console.log(database.ref());

// Each time a child, or train, is added to the database, add it to the DOM
database.ref().on("child_added", function (snapshot) {
	//console.log("I had a child!");
	tdName = snapshot.val().name;
	tdDest = snapshot.val().dest;
	tdFirstTrain = snapshot.val().firstTrain;
	tdFreq = snapshot.val().freq;
	firstTimeConv = moment(tdFirstTrain, "hh:mm")
	timeDiff = moment().diff(moment(firstTimeConv), "minutes");
	tRemainder = timeDiff % tdFreq;
	tdMinutes = tdFreq - tRemainder;
	tdNextArrival = moment().add(tdMinutes, "minutes").format("h:mm A");
	key = snapshot.Ce.key;
	//console.log(snapshot.Ce.key);// This is how I figured out how to get the key
	minsID = 'mins' + key;
	arrivalID = 'arrival' + key;

	$("#trainTable").append("<tr id=" + "'" + key + "'" + "><td>" + tdName + "</td><td>" + tdDest + "</td><td>" + tdFirstTrain + "</td><td>" + tdFreq + "</td><td class='updateableArrival' id=" + "'" + arrivalID + "'" + ">" + tdNextArrival + "</td><td class='updateableMins' id=" + "'" + minsID + "'" + ">" + tdMinutes + "</td>" + "<td><input type='submit' value='Remove Train' class='remove-train btn btn-danger btn-sm'></td></tr>");
	// console.log(minsID + " " + arrivalID);
	// console.log(snapshot.val());
	// console.log($("#" + minsID + "").html());
	minsIdArray.push($("#" + minsID + "").attr('id'));
	arrivalIdArray.push($("#" + arrivalID + "").attr('id'));
});
// }

// DONE: Get the Next Arrival and Minutes Away fields to update automatically
function updateMinutes() {
	database.ref().once("value", function (snapshot) {
		snapshot.forEach(function (childSnapshot) {
			var updtFirstTrain = childSnapshot.val().firstTrain;
			var updtFreq = childSnapshot.val().freq;
			var updtfirstTimeConv = moment(updtFirstTrain, "hh:mm")
			var updttimeDiff = moment().diff(moment(updtfirstTimeConv), "minutes");
			var updttRemainder = updttimeDiff % updtFreq;
			var updtMinutes = updtFreq - updttRemainder;
			var updtNextArrival = moment().add(updtMinutes, "minutes").format("h:mm A");
			// console.log(childSnapshot.val().firstTrain);
			var updtKey = childSnapshot.Ce.key;
			var updtMinsID = 'mins' + updtKey;
			var updtArrivalID = 'arrival' + updtKey;

			// console.log(parseInt($("#" + updtMinsID + "").html()));
			$("#" + updtMinsID + "").html(updtMinutes);
			$("#" + updtArrivalID + "").html(updtNextArrival);
		});

	});

}
setInterval(updateMinutes, 1000);


// Remove the row of train information when the Remove Train button is clicked
$("body").on("click", ".remove-train", function () {
	$(this).closest('tr').remove();
	getKey = $(this).parent().parent().attr('id');
	database.ref().child(getKey).remove();
});

