var config = {
	apiKey: "AIzaSyB8qhteO9OTdyOmNFFuWl3kSWC0qgmxvDk",
	authDomain: "traintime-b5b38.firebaseapp.com",
	databaseURL: "https://traintime-b5b38.firebaseio.com",
	projectId: "traintime-b5b38",
	storageBucket: "traintime-b5b38.appspot.com",
	messagingSenderId: "199830296364"
};

firebase.initializeApp(config);


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

// Clock function to display current time
function displayTime() {
	now = moment().format(timeFormat);
	$("#clock").html(now);
}

setInterval(displayTime, 1000);


$("#submitInfo").on("click", function (event) {
	// Prevent form from submitting
	event.preventDefault();

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
	// console.log(database.ref());

});

database.ref().on("child_added", function (snapshot) {
	console.log("I had a child!");
	tdName = snapshot.val().name;
	tdDest = snapshot.val().dest;
	tdFirstTrain = snapshot.val().firstTrain;
	tdFreq = snapshot.val().freq;
	firstTimeConv = moment(tdFirstTrain, "hh:mm")//.subtract(1, "years");
	timeDiff = moment().diff(moment(firstTimeConv), "minutes");
	tRemainder = timeDiff % tdFreq;
	tdMinutes = tdFreq - tRemainder;
	tdNextArrival = moment().add(tdMinutes, "minutes").format("h:mm:ss A");
	key = snapshot.val().dateAdded;
	// database.ref().push( {
	// 	_key: snapshot.key
	// });
	// tdNextArrival = moment().add(tdFreq, "minutes").format("h:mm A");
	// console.log(moment());

	// tdMinutes = moment().diff(moment(tdNextArrival), "minutes");

	// if (tdMinutes <=0) {
	// 	tdTotal = 0;
	// }


	$("#trainTable").append("<tr id=" + "'"  + key + "'" + "><td>" + tdName + "</td><td>" + tdDest + "</td><td>" + tdFirstTrain + "</td><td>" + tdFreq + "</td><td>" + tdNextArrival + "</td><td>" + tdMinutes + "</td>" + "<td><input type='submit' value='Remove Train' class='remove-train btn btn-danger btn-sm'></td></tr>");
	
});



// setInterval(updateInfo, 1000);

$("body").on("click", ".remove-train", function(){
	$(this).closest ('tr').remove();
	getKey = $(this).parent().parent().attr('id');
	database.ref().child(getKey).remove();
});