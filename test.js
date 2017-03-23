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