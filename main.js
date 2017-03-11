//help mode, indicte to player to select a diff_level with a tooltip

//create persistent "last clicked" overlay color for currently selected difficulty level

//make the "start game" button glow

//leaderboards, obvi

//sound effects would be awesome

//error checking for false inputs to break the streak are needed

//allow user to pick length of game
	//if undefined, send error message to user
	//set speed back to undefined after round has finished

//adaptive messaging based on performance

//add different gameplay modes
	//free play
	//operator mode (higher levels)

var settings = {
	score: 0,
	last_scored_index: undefined,
	streak: 0,
	highest_streak: 0,
	streak_el: document.getElementById("streak"),
	frequency: 100,
	gameSpace: document.getElementById("gameSpace"),
	round_history: document.getElementById("roundHistory"),
	data: [],
	fired_count: 0,
	round_length: 20,
	current_round: 1,
	speed: undefined,
	round_over: undefined,
	curr_diff: undefined
};

var round_data = {};

var diff_settings = {
	0: 1500,
	1: 1200,
	2: 1000,
	3: 900,
	4: 800,
	5: 700,
	6: 600,
	7: 500,
	8: 400,
	9: 350
}

var img = new Image(50, 50);
img.src = "http://cdn.jsears.co/explosion.gif";
img.style.position = "relative";
img.style.top = "-20px";
img.style.left = "-20px";

var randomiz_r = function(max, min) {
	var max = Math.floor(max);
	var min = Math.ceil(min);
  	return Math.floor(Math.random() * (max - min + 1)) + min;
};

var streak_calc = function(index) {
	if (settings.last_scored_index === "undefined") {
				settings.last_scored_index = index;
	} else {
		if (index - 1 === settings.last_scored_index) {
			if (settings.streak >= 2) {
				settings.streak += 1;
			} else {
				settings.streak = 2;
			}
			settings.streak_el.innerHTML = "+" + settings.streak;
			settings.score += settings.streak;
		} else {
			settings.streak_el.innerHTML = "";
			if (settings.streak > settings.highest_streak) {
				settings.highest_streak = settings.streak;
			}
			settings.streak = 0;
			settings.score += 1;
		}
	}
	settings.last_scored_index = index;
};

var score = function(input) {
	var el, next_el;
	for (var i = 0; i < settings.data.length; i++) {
		if (input == settings.data[i].value && settings.data[i].canScore === true) {
			streak_calc(i);
			settings.data[i].canScore = false;
			el = document.getElementById(settings.data[i].id);
			el.innerHTML = "";
			el.appendChild(img);
			setTimeout(function(){
				el.innerHTML = "";
				el.className = "game_piece off_screen";
			}, 555);
			document.getElementById("points").innerHTML = settings.score;
			break;
		}
	}
};

var animate = function() {
	var piece = settings.data[settings.fired_count];
	if (typeof piece !== "undefined") {
		piece.canScore = true;
		var el = document.getElementById(piece.id);
		el.className = "game_piece on_screen";
		el.style.transform = "translateY(460px)";
		settings.fired_count++;	
	} else {
		return false;
	}
	setTimeout(function() {
		el.className = "game_piece off_screen";
		piece.canScore = false;
	}, 4000); //needs to be closely coordinated with CSS animation time... or does it really?
};

var initPieces = function () {
	for (var i = 0; i < settings.frequency; i++) {
		var obj = {};
		obj.id = "_" + i.toString();
		obj.value = (randomiz_r(9, 0)).toString();
		obj.xVal = (randomiz_r(675, 12)).toString() + "px";
		obj.canScore = false;
		settings.data.push(obj);
	}
	for (var j = 0; j < settings.data.length; j++) {
		var new_div = document.createElement("div");
		new_div.id = settings.data[j].id;
		new_div.className = "game_piece off_screen";
		new_div.style.left = settings.data[j].xVal;
		var t = document.createTextNode(settings.data[j].value);
		new_div.appendChild(t);
		settings.gameSpace.appendChild(new_div);
	}	
};

var flashScore = function(round_score) {
	var new_div = document.createElement("div");
	new_div.className = "flashMessage";
	var t = document.createTextNode("Great job, you scored " + round_score 
		+ " points! Your longest streak was " + round_data[settings.current_round]["highest_streak"] + ".");
	new_div.appendChild(t);
	settings.gameSpace.appendChild(new_div);
};

var getHistory = function(currentRound) {
	var historyValue = "", historyOffset = 0;
	if (currentRound >= 6) {
		historyOffset = currentRound - 4;
	} else {
		historyOffset = 1;
	}
	for (var i = historyOffset; i <= currentRound; i++) {
		historyValue += round_data[i].html;
	}
	settings.round_history.innerHTML = historyValue;
};

var timeIsUp = function() {
	document.getElementById("timer").innerHTML = "Time!";
	settings.gameSpace.innerHTML = "";
	settings.streak_el.innerHTML = "";
	var roundNav_el = document.getElementById("roundNav");
	roundNav_el.className = "show";
	var start_el = document.getElementById("start");
	start_el.className = "hide";
	settings.round_over = true;
	settings.data = [];
	settings.fired_count = 0;
	round_data[settings.current_round] = {};
	round_data[settings.current_round]["score"] = settings.score;
	round_data[settings.current_round]["html"] = "Round " + settings.current_round + " | " 
		+ settings.score + " (lvl " + settings.curr_diff + ")<br>";
	if (settings.highest_streak === 0) {
		settings.highest_streak = settings.streak;
	}
	round_data[settings.current_round]["highest_streak"] = settings.highest_streak;
	flashScore(settings.score);
	settings.streak = 0;
	settings.highest_streak = 0;
	getHistory(settings.current_round);
	settings.score = 0;
	settings.current_round += 1;
	setTimeout(function() {
	    startButton.style.visibility = "visible";
	    document.getElementById("timer").innerHTML = "---";
	}, 1634);
};

var timeFormat = function(time_left) {
	var num_chop = "";
	if (time_left >= 60) {
	    num_chop = (time_left - 60).toString();
	    if (num_chop.length === 1) {
	      num_chop = "0" + num_chop;
	    }
	    return "1:" + num_chop;
	} else {
	    return time_left;
	}
};

var beginRound = function() {
	settings.gameSpace.innerHTML = "";
	var roundNav_el = document.getElementById("roundNav");
	roundNav_el.className = "hide";
	var roundDisplay_el = document.getElementById("roundDisplay");
	roundDisplay_el.className = "hide";
	settings.round_over = false;
  	initPieces();
	startButton.style.visibility = "hidden";
	var display = "";
	var time_left = settings.round_length;
	var interval = setInterval(function() {
		if (settings.fired_count === settings.data.length - 1) {
			window.clearInterval(interval);
		}
		if (settings.round_over === true) {
			window.clearInterval(interval);
		}
		animate();
	}, settings.speed);
	var timer = setInterval(function() {
	    if (time_left === 0) {
	      clearInterval(timer);
	      timeIsUp();
	    } else {
	      var display = timeFormat(time_left);
	      time_left--;
	      document.getElementById("timer").innerHTML = display;
	    }
	}, 1000);
};

var animateKey = function(key) {
	var classname = document.getElementsByClassName("b");
	for (var i = 0; i < classname.length; i++) {
		if (key == classname[i].innerHTML) {
			var j = i;
			classname[i].style.transition = "color 0.4s linear";
	  		classname[i].style.background = "rgb(145, 230, 255)";
	  		setTimeout(function(){
	  			classname[j].style.background = "rgba(226, 226, 226, 1)";
	  		}, 400);
		}	  
	}
};

var roundLogic = function(x) {
	var level = x.path[0].innerHTML;
	var level_int = parseInt(level);
	var message = "Difficulty level " + level + " was successfully loaded! Press \"Start Game\" to continue.";
	var display = document.getElementById("roundDisplay");
	display.className = "show";
	var start = document.getElementById("start");
	start.className = "show";
	display.innerHTML = "";
	display.innerHTML = message;
	setTimeout(function(){
		display.className = "hide";
	}, 5000);
	settings.speed = diff_settings[level_int];
	settings.curr_diff = level_int;
};

var initRoundNav = function() {
	var classname = document.getElementsByClassName("r");
	for (var i = 0; i < classname.length; i++) {
		var val = classname[i].innerHTML;
		classname[i].addEventListener("click", function(val) {
			roundLogic(val);
		}, false);
	}
};

initRoundNav();

var startButton = document.getElementById("start");
startButton.addEventListener("click", beginRound, false);

document.onkeydown = function(e) {
    e = e || window.event;
    var key = e.key;
    score(key);
    animateKey(key);
};

var assert = function(assertion, expected_result, desc) {
	if (assertion === expected_result) {
		return [0, "Passed: " + desc, expected_result, assertion];
	} else {
		return [1, "Failed: " + desc, expected_result, assertion];
	}
};

var test_battery = function() {
	var arr = [];
	var passing = false;

	//enter tests here:
	
	for (var n = 0; n < arr.length; n++) {
		if (arr[n][0] === 0) {
			passing = true;
		} else {
			passing = false;
			for (var i = 0; i < arr.length; i++) {
				if (arr[i][0] === 0) {
					console.log("%c" + "Test '" + i + "' " + arr[i][1] 
						+ "\nExpected: (" + arr[i][2] + ")" 
						+ "\nReturned: (" + arr[i][3] + ")", "color: green;");
				} else {
					console.log("%c" + "Test '" + i + "' " + arr[i][1] 
						+ "\nExpected: (" + arr[i][2] + ")" 
						+ "\nReturned: (" + arr[i][3] + ")", "color: red;");
				}
			}
		}
	}
	if (passing) {
		 console.log("%c" + "All Tests Passed!", "color: green;");	
	}
};

//test_battery();