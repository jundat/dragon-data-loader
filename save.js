var fs = require("fs");

fs.writeFile("test.txt", "This is a hello inside a file!", function(err){
	if (err) console.log(err);
});


fs.open("test.txt", 'a', 0666, function(err, file) {

	fs.write(file, "\nI'm an appended Hello World!\n", null, undefined, function (err, written) {
		console.log('bytes written: ' + written);
	});
});


fs.open("test.txt", 'a', 0666, function(err, file) {

	fs.write(file, "\nI'm an appended Hello World!\n", null, undefined, function (err, written) {
		console.log('bytes written: ' + written);
	});
});