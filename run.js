

var http = require("http");
var fs = require("fs");
var cheerio = require("cheerio");

var MIN = 1;
var MAX = 100;
var ID = MIN;
var ARRAY = [];



download (ID, loaded);

function completed () {
	console.log("completed");
	//console.log(ARRAY);
}

function loaded (data) {
	//console.log("--------------------------------- start");
	
	var obj = parseData (data);
	//ARRAY.push(obj);

	writeToFile(ID, obj);
	
	//console.log("---------------------------- end");
	
	if (ID < MAX) {
		console.log(ID);
		ID++;
		setTimeout(function () {
			download(ID, loaded);
		}, 0.1);
	} else {
		completed();
	}
}

function writeToFile (id, obj) {
	var str = parseObjToCSV(id, obj);

	fs.open("result.csv", 'a', 0666, function(err, file) {
		fs.write(file, str, null, undefined, function (err, written) {
			//console.log('bytes written: ' + written);
		});
	});
}

function parseObjToCSV (id, obj) {
	var str = "";

	str += id + ","
	+ obj.name + ","
	+ obj.attribute + ","
	+ obj.subAttribute + ","
	+ obj.type + ","
	+ obj.rarity + ","
	+ obj.expToMaxLevel  + ","
	+ obj.series  + ","
	+ obj.cost  + ","
	+ obj.minHp  + ","
	+ obj.maxHp  + ","
	+ obj.minAtk  + ","
	+ obj.maxAtk  + ","
	+ obj.minRcv  + ","
	+ obj.maxRcv  + ","
	+ obj.minWeight  + ","
	+ obj.maxWeight  + ","
	+ obj.minFodder  + ","
	+ obj.maxFodder  + ","
	+ obj.sameElem  + ","
	+ obj.maxLv  + ","
	+ obj.expCurve  + ","
	+ obj.activeSkill  + ","
	+ obj.leaderSkill  + ","
	+ obj.evolutionFrom  + ","
	+ obj.evolutionMaterial  + ","
	+ obj.evolutionTarget  + ","
	+ obj.ultimateEvo  + ","
	+ obj.minSell  + ","
	+ obj.maxSell + "\n";

	return str;
}

function myParseInt (str) {
	var strs = str.split(' ');

	for (var i = 0; i < strs.length; i++) {
		var out = parseInt( strs[i] );

		if (isNaN(out) == false) {
			return out;
		}
	};
}

function download (id, callback) {
	var url = "http://www.puzzledragonx.com/en/monster.asp?n=" + id;

	http.get(url, function (res) {
		var data = "";
		res.on('data', function (chunk) {
			data += chunk;
		});

		res.on('end', function () {
			callback(data);
		});
	}).on('error', function () {
		callback(null);
	});
}

function parseData (data) {
	var $ = cheerio.load(data);

	var obj = {};
	obj.subAttribute = "";
	obj.activeSkill = "";
	obj.leaderSkill = "";
	obj.evolutionMaterial = "";
	obj.ultimateEvo = "None";

	obj.series = $(".titlebar1 > h2 > span").first().text();
	obj.series = obj.series.substr(0, obj.series.indexOf(" Series") );
	//console.log("series: "+ obj.series );

	$('table .titlebar1 > h2').each(function(i, e){
		var table = $(e).parents('table#tablestat');
		if ($(e).text() === 'Profile') {
			table.children().each(function(i, e) {
				switch (i) {
					case 2:
						obj.name = $(e).children('.value-end').text();
						//console.log("name: "+ obj.name );
					break;

					case 3:
						obj.jpname = $(e).children('.value-end').text();
						//console.log("jpname: "+ obj.jpname );
					break;

					case 4:
						obj.type = $(e).children('.value-end').text();
						//console.log("type: "+ obj.type );
					break;

					case 5:
						obj.attribute = $(e).children('.value-end').text();
						//console.log("attribute: "+ obj.attribute );
					break;

					case 6:
						obj.rarity = parseInt( $(e).children('.value-end').text() );
						//console.log("rarity: "+ obj.rarity );
					break;

					case 7:
						obj.cost = $(e).children('.value-end').text();
						//console.log("cost: "+ obj.cost );
					break;
				}
			});
		} else if ($(e).text() === 'Stats') {
			table.children().each(function(i, e) {
				switch (i) {
					case 2:
						obj.minLv = $( $(e).children('.value-end').get(0) ).text();
						obj.maxLv = $( $(e).children('.value-end').get(1) ).text();
						//console.log("minLv: "+ obj.minLv );
						//console.log("maxLv: "+ obj.maxLv );
					break;

					case 3:
						obj.minHp = $( $(e).children('.value-end').get(0) ).text();
						obj.maxHp = $( $(e).children('.value-end').get(1) ).text();
						//console.log("minHp: "+ obj.minHp );
						//console.log("maxHp: "+ obj.maxHp );
					break;
					
					case 4:
						obj.minAtk = $( $(e).children('.value-end').get(0) ).text();
						obj.maxAtk = $( $(e).children('.value-end').get(1) ).text();
						//console.log("minAtk: "+ obj.minAtk );
						//console.log("maxAtk: "+ obj.maxAtk );
					break;
					
					case 5:
						obj.minRcv = $( $(e).children('.value-end').get(0) ).text();
						obj.maxRcv = $( $(e).children('.value-end').get(1) ).text();
						//console.log("minRcv: "+ obj.minRcv );
						//console.log("maxRcv: "+ obj.maxRcv );
					break;
					
					case 6:
						obj.minWeight = $( $(e).children('.value-end').get(0) ).text();
						obj.maxWeight = $( $(e).children('.value-end').get(1) ).text();
						//console.log("minWeight: "+ obj.minWeight );
						//console.log("maxWeight: "+ obj.maxWeight );
					break;
					
				}
			});
		} else if ($(e).text() === 'Experience') {
			table.children().each(function(i, e) {
				switch (i) {
					case 1: //~ Exp Curve/1000000
						obj.expCurve = 0.000001 * myParseInt ( $(e).children('.title.nowrap').text().trim() );
						//console.log("expCurve: "+ obj.expCurve );
					break;

					case 2:
						obj.expToMaxLevel = parseInt( $(e).children('.title.nowrap').text().trim() );
						//console.log("expToMaxLevel: "+ obj.expToMaxLevel );
					break;
				}
			});
		}
	});


	//min-max folder
	// Sell Price Base:	70 Coins
	// Sell Price Lv Max:	350 Coins
	// Fodder Base:	100 Experience
	// Fodder Lv Max:	500 Experience
	// Same Element:	750 Experience

	$(".title.nowrap").each( function (i, e) {
		if ( $(e).text().indexOf("Sell Price Base" ) != -1 ) {
			var table = $(e).parents("table#tablestat");
			table.children().each(function(i, e) {
				switch (i) {
					case 0:
						obj.minSell = myParseInt( $(e).children('.value-end').text().trim() );
						//console.log("minSell: "+ obj.minSell );
					break;

					case 1:
						obj.maxSell = myParseInt( $(e).children('.value-end').text().trim() );
						//console.log("maxSell: "+ obj.maxSell );
					break;

					case 2:
						obj.minFodder = myParseInt( $(e).children('.value-end').text().trim() );
						//console.log("minFodder: "+ obj.minFodder );
					break;

					case 3:
						obj.maxFodder = myParseInt( $(e).children('.value-end').text().trim() );
						//console.log("maxFodder: "+ obj.maxFodder );
					break;

					case 4:
						obj.sameElem = myParseInt( $(e).children('.value-end').text().trim() );
						//console.log("sameElem: "+ obj.sameElem );
					break;
				}
			});
		};
	});


	//evolution from
	var evo = $(".evolveframe");
	var idfrom;
	var idtarget;

	evo.each(function (i, e) {
		if ( $(e).text() == ID) {
			idfrom = i - 1;
			idfrom = (idfrom < 0) ? 0 : idfrom;

			idtarget = i + 1;
			idtarget = (idtarget > evo.length) ? evo.length : idtarget;

			obj.evolutionFrom = myParseInt ( $(evo.get(idfrom)).text().trim() );
			if (obj.evolutionFrom == ID) {
				obj.evolutionFrom = 0;
			};
			obj.evolutionTarget = myParseInt ( $(evo.get(idtarget)).text().trim() );

			//console.log ("from: "+ obj.evolutionFrom );
			//console.log ("target: "+ obj.evolutionTarget );
		}
	});

	
	//avatar
	obj.avatar = "http://www.puzzledragonx.com/en/" + $(".avatar > img").first().attr('src');
	//console.log("avatar: "+ obj.avatar);

	return obj;
}


















