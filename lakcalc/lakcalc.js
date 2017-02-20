
angular.module('myApp', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']).controller('myCtrl', function($scope) {
		
	// Static Coefficients.
	
	var O = [
		[ 7, 5, 12 ],
		[ 39, 24, 57 ],
		[ 72, 18, 134 ],

		[ 60, 20, 10 ],
		[ 21, 15, 9 ],
		[ 109, 55, 7 ],

		[ 15, 24, 21 ],
		[ 33, 99, 57 ],
		[ 25, 163, 81 ]
	];
	
	var D = [
		[ 30, 19, 56 ],
		[ 24, 12, 36 ],
		[ 14, 10, 21 ],
			
		[ 30, 14, 10 ],
		[ 87, 57, 31 ],
		[ 27, 12, 9 ],
			
		[ 26, 57, 35 ],
		[ 12, 24, 15 ],
		[ 11, 17, 13 ]
	];

	// Initial bonus values.
	$scope.defType           = [ "castle" ];
	$scope.offType           = [ "castle" ];
	$scope.defFortifications = [ "1" ];
	$scope.defLibrary        = [ "1" ];
	$scope.offLibrary        = [ "1" ];
	$scope.offBarracks       = [ "1" ];

	// Initial values for the 0th snapshot.
	var time = new Date();
	time.setHours(12, 0);
	$scope.snapshot0 = {
		time: time,
		def:  [
			{
				spearmen:         0,
				swordsmen:        0,
				berserkers:       0,
				archers:          0,
				crossbowmen:      0,
				nordicArchers:    0,
				armouredHorsemen: 0,
				lancerHorsemen:   0,
				axeRider:         0,
			}
		],
		off:  [
			{
				spearmen:         0,
				swordsmen:        0,
				berserkers:       0,
				archers:          0,
				crossbowmen:      0,
				nordicArchers:    0,
				armouredHorsemen: 0,
				lancerHorsemen:   0,
				axeRider:         0,
			}
		]
	};

	$scope.snapshot = [];

	$scope.lbl = {
		en: {
			title:            "Lords and Knights Battle Calculator",
			arrivalTime:      "Arrival time",
			defender:         "Defender",
			supporter:        "Supporter",
			attacker:         "Attacker",
			type:             "Type",
			castle:           "Castle",
			fortress:         "Fortress",
			city:             "City",
			spearmen:         "Spearmen",
			swordsmen:        "Swordsmen",
			berserkers:       "Berserkers",
			archers:          "Archers",
			crossbowmen:      "Crossbowmen",
			nordicArchers:    "Nordic Archers",
			armouredHorsemen: "Armoured Horsemen",
			lancerHorsemen:   "Lancer Horsemen",
			axeRider:         "Axe Rider",
			fortifications:   "Fortifications",
			library:          "Library",
			barracks:         "Barracks",
			fight:            "Fight",
			battleAt:         "Battle at *",
			nightmode:        "Nightmode",
			defensiveValues:  "Defensive values",
			offensiveValues:  "Offensive values",
			infantry:         "Infantry",
			artillery:        "Artillery",
			cavalry:          "Cavalry",
			defenderWins:     "Defender wins after * round(s)",
			attackerWins:     "Attacker wins after * round(s)",
			eventualUnits:    "Eventual units",
			allRounds:        "All rounds",
			fullDetails:      "Full details",
			footer:           "Want to report bugs, contribute, or just pat someone's back? Visit us on <a href=\"https://github.com/JannisUnkrig/lakcalc\" target=\"_top\">Github</a>.",
		},
		de: {
			title:            "Lords and Knights-<br />Kampfrechner",
			arrivalTime:      "Ankunftszeit",
			defender:         "Verteidiger",
			supporter:        "Unterstützer",
			attacker:         "Angreifer",
			type:             "Typ",
			castle:           "Burg",
			fortress:         "Festung",
			city:             "Stadt",
			spearmen:         "Speerträger",
			swordsmen:        "Schwertkämpfer",
			berserkers:       "Berserker",
			archers:          "Bogenschützen",
			crossbowmen:      "Armbrustschützen",
			nordicArchers:    "Nordische Bogenschützen",
			armouredHorsemen: "Panzerreiter",
			lancerHorsemen:   "Lanzenreiter",
			axeRider:         "Axtreiter",
			fortifications:   "Wehranlagen",
			library:          "Bibliothek",
			barracks:         "Kaserne",
			fight:            "Kämpfe",
			battleAt:         "Kampf um *",
			nightmode:        "Nachtmodus",
			defensiveValues:  "Defensivwerte",
			offensiveValues:  "Offensivwerte",
			infantry:         "Infanterie",
			artillery:        "Artillerie",
			cavalry:          "Kavallerie",
			defenderWins:     "Verteidiger gewinnt nach * Runde(n)",
			attackerWins:     "Angreifer gewinnt nach * Runde(n)",
			eventualUnits:    "Verbleibende Einheiten",
			allRounds:        "Alle Runden",
			fullDetails:      "Detailliert",
			footer:           "Du willst Bugs melden, zum Code beitragen oder einfach nur jemandem auf die Schulter klopfen? Besuch uns auf <a href=\"https://github.com/JannisUnkrig/lakcalc\" target=\"_top\">Github</a>.",
		},
	};
	$scope.i18n = $scope.lbl.en;

	// Fighting functions:

	var fightNormalBattle = function(opponentsValue, ownValue, ownUnits) {
		var x = 1 - 0.5 * opponentsValue / ownValue;
		if (x < 0.5) x = 0.5;
		return Math.round(ownUnits * x);
	}

	var fightTerminalBattle = function(opponentsValue, ownValue, ownUnits) {
		return opponentsValue > ownValue ? 0 : Math.round(ownUnits * (1 - opponentsValue / ownValue));
	}
	
	$scope.DEF_BONUS = {
		"castle":   [ 10, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 1000 ],
		"fortress": [ 3000, 3172, 3345, 3517, 3690, 3862, 4034, 4207, 4379, 4552, 4724, 4897, 5069, 5241, 5414, 5586, 5759, 5931, 6103, 6276, 6448, 6621, 6793, 6966, 7138, 7310, 7483, 7655, 7828, 8000 ],
		"city":     [ 99 ],
	};

	$scope.DEF_FACTOR = {
		"castle":   [ 1.05, 1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4, 1.45, 1.5, 1.55, 1.6, 1.65, 1.7, 1.75, 1.8, 1.85, 1.9, 1.95, 2 ],
		"fortress": [ 1.75, 1.77, 1.79, 1.81, 1.83, 1.84, 1.86, 1.88, 1.90, 1.92, 1.94, 1.96, 2.02, 2, 2.01, 2.03, 2.05, 2.07, 2.09, 2.11, 2.13, 2.15, 2.17, 2.18, 2.20, 2.22, 2.24, 2.26, 2.28, 2.30 ],
		"city":     [ 99 ],
	};

	$scope.BUFF_OFF_BARRACKS = [ 1.01, 1.02, 1.02, 1.03, 1.04, 1.04, 1.05, 1.06, 1.06, 1.07, 1.08, 1.08, 1.09, 1.10, 1.10, 1.11, 1.12, 1.12, 1.13, 1.14, 1.14, 1.15, 1.16, 1.16, 1.17, 1.18, 1.18, 1.19, 1.19, 1.20 ];

	$scope.kaempfe = function() {

		$scope.snapshot = [];

		$scope.defenderWins = false;
		$scope.attackerWins = false;

		// Get 0th defender's fortifications:
		var fortifications = Number($scope.defFortifications[0]);

		// Compute defenders' bonuses:
		var defBonus = $scope.DEF_BONUS[$scope.defType[0]][fortifications - 1];

		// Compute defenders' factors.
		var defFactor = [];
		for (var j = 0; j < $scope.snapshot0.def.length; j++) {
		
			// Get defender's fortifications:
			var fortifications = Number($scope.defFortifications[j]);

			// Compute defender's factor.
			defFactor.push($scope.DEF_FACTOR[$scope.defType[j]][fortifications - 1]);
		}

		// Attackers' buffs:
		var buffOffInfantry = [];
		var buffOffArtillery = [];
		var buffOffCavalry = [];
		for (var j = 0; j < $scope.snapshot0.off.length; j++) {
		
			// Get attacker's libraries:
			var offLibrary = Number($scope.offLibrary[j]);
			var offType       = $scope.offType[j];
			
			switch (offType) {
			
			case "castle":

				// Compute attacker's buffs for "castle" type.
				buffOffInfantry[j] = 1;
				if (offLibrary >= 3) buffOffInfantry[j] *= 1.05;
				if (offLibrary >= 7) buffOffInfantry[j] *= 1.05;
	
				buffOffArtillery[j] = 1;
				if (offLibrary >= 3) buffOffArtillery[j] *= 1.05;
				if (offLibrary >= 8) buffOffArtillery[j] *= 1.05;
	
				buffOffCavalry[j] = 1;
				if (offLibrary >= 3) buffOffCavalry[j] *= 1.05;
				if (offLibrary >= 9) buffOffCavalry[j] *= 1.05;
				break;
			
			case "fortress":

				// Compute attacker's buffs for "fortress" type.
				buffOffInfantry[j] = 1.05 * 1.05;
	
				buffOffArtillery[j] = 1.05 * 1.05;
	
				buffOffCavalry[j] = 1.05 * 1.05;
				break;
				
			case "city":

				// Compute attacker's buffs for "city" type.
				alert("City NYI.");
				throw new Error("City NYI");
			}
		}
		
		// Defenders' buffs.
		var buffDefInfantry  = [];
		var buffDefArtillery = [];
		var buffDefCavalry   = [];
		for (var j = 0; j < $scope.snapshot0.def.length; j++) {

			// Get defender's libraries.
			var defLibrary = Number($scope.defLibrary[j]);
			var defType    = $scope.defType[j];
			
			switch (defType) {
			
			case "castle":

				// Compute defender's buffs for "castle" type.
				buffDefInfantry[j] = defFactor[j];
				if (defLibrary >= 3)  buffDefInfantry[j] *= 1.05;
				if (defLibrary >= 4)  buffDefInfantry[j] *= 1.05;
				if (defLibrary >= 10) buffDefInfantry[j] *= 1.05;
	
				buffDefArtillery[j] = defFactor[j];
				if (defLibrary >= 3)  buffDefArtillery[j] *= 1.05;
				if (defLibrary >= 6)  buffDefArtillery[j] *= 1.05;
				if (defLibrary >= 10) buffDefArtillery[j] *= 1.05;
	
				buffDefCavalry[j] = defFactor[j];
				if (defLibrary >= 3)  buffDefCavalry[j] *= 1.05;
				if (defLibrary >= 6)  buffDefCavalry[j] *= 1.05;
				if (defLibrary >= 10) buffDefCavalry[j] *= 1.05;
				break;
				
			case "fortress":

				// Compute defender's buffs for "fortress" type.
				buffDefInfantry[j] = defFactor[j] * 1.05 * 1.05 * 1.05;
				if (defLibrary >= 4) buffDefInfantry[j] *= 1.05; // Kettenhemd
	
				buffDefArtillery[j] = defFactor[j] * 1.05 * 1.05 * 1.05;
				if (defLibrary >= 6) buffDefArtillery[j] *= 1.05; // Pavese
	
				buffDefCavalry[j] = defFactor[j] * 1.05 * 1.05 * 1.05;
				if (defLibrary >= 8) buffDefCavalry[j] *= 1.05; // Plattenpanzerung
				break;
				
			case "city":

				// Compute defender's buffs for "city" type.
				alert("City NYI.");
				throw new Error("City NYI");
			}
		}

		// Modify offenders' buffs for barracks.
		for (var j = 0; j < $scope.snapshot0.off.length; j++) {
		
			if ($scope.offType[j] == "fortress") {
				buffOffInfantry[j]  *= $scope.BUFF_OFF_BARRACKS[$scope.offBarracks[j] - 1];
				buffOffArtillery[j] *= $scope.BUFF_OFF_BARRACKS[$scope.offBarracks[j] - 1];
				buffOffCavalry[j]   *= $scope.BUFF_OFF_BARRACKS[$scope.offBarracks[j] - 1];
			}
		}	
		
		for (var i = 0;; i++) {
		
			var sm1 = i == 0 ? $scope.snapshot0 : $scope.snapshot[i - 1];
			var s = {};

			s.time = new Date(sm1.time);
			s.time.setMinutes(s.time.getMinutes() + 10);
			
			// Compute attackers's battle powers.
			s.offAgainstInfantry  = 0;
			s.offAgainstArtillery = 0;
			s.offAgainstCavalry   = 0;
			for (var j = 0; j < sm1.off.length; j++) {
				s.offAgainstInfantry  += Math.round(buffOffInfantry[j] * O[0][0]) * sm1.off[j].spearmen + Math.round(buffOffInfantry[j] * O[1][0]) * sm1.off[j].swordsmen + Math.round(buffOffInfantry[j] * O[2][0]) * sm1.off[j].berserkers + Math.round(buffOffArtillery[j] * O[3][0]) * sm1.off[j].archers + Math.round(buffOffArtillery[j] * O[4][0]) * sm1.off[j].crossbowmen + Math.round(buffOffArtillery[j] * O[5][0]) * sm1.off[j].nordicArchers + Math.round(buffOffCavalry[j] * O[6][0]) * sm1.off[j].armouredHorsemen + Math.round(buffOffCavalry[j] * O[7][0]) * sm1.off[j].lancerHorsemen + Math.round(buffOffCavalry[j] * O[8][0]) * sm1.off[j].axeRider;
				s.offAgainstArtillery += Math.round(buffOffInfantry[j] * O[0][1]) * sm1.off[j].spearmen + Math.round(buffOffInfantry[j] * O[1][1]) * sm1.off[j].swordsmen + Math.round(buffOffInfantry[j] * O[2][1]) * sm1.off[j].berserkers + Math.round(buffOffArtillery[j] * O[3][1]) * sm1.off[j].archers + Math.round(buffOffArtillery[j] * O[4][1]) * sm1.off[j].crossbowmen + Math.round(buffOffArtillery[j] * O[5][1]) * sm1.off[j].nordicArchers + Math.round(buffOffCavalry[j] * O[6][1]) * sm1.off[j].armouredHorsemen + Math.round(buffOffCavalry[j] * O[7][1]) * sm1.off[j].lancerHorsemen + Math.round(buffOffCavalry[j] * O[8][1]) * sm1.off[j].axeRider;
				s.offAgainstCavalry   += Math.round(buffOffInfantry[j] * O[0][2]) * sm1.off[j].spearmen + Math.round(buffOffInfantry[j] * O[1][2]) * sm1.off[j].swordsmen + Math.round(buffOffInfantry[j] * O[2][2]) * sm1.off[j].berserkers + Math.round(buffOffArtillery[j] * O[3][2]) * sm1.off[j].archers + Math.round(buffOffArtillery[j] * O[4][2]) * sm1.off[j].crossbowmen + Math.round(buffOffArtillery[j] * O[5][2]) * sm1.off[j].nordicArchers + Math.round(buffOffCavalry[j] * O[6][2]) * sm1.off[j].armouredHorsemen + Math.round(buffOffCavalry[j] * O[7][2]) * sm1.off[j].lancerHorsemen + Math.round(buffOffCavalry[j] * O[8][2]) * sm1.off[j].axeRider;
			}
			
			// Compute defenders's battle powers.
			s.defAgainstInfantry  = defBonus;
			s.defAgainstArtillery = defBonus;
			s.defAgainstCavalry   = defBonus;
			for (var j = 0; j < sm1.def.length; j++) {
				s.defAgainstInfantry  += Math.round(buffDefInfantry[j] * D[0][0]) * sm1.def[j].spearmen + Math.round(buffDefInfantry[j] * D[1][0]) * sm1.def[j].swordsmen + Math.round(buffDefInfantry[j] * D[2][0]) * sm1.def[j].berserkers + Math.round(buffDefArtillery[j] * D[3][0]) * sm1.def[j].archers + Math.round(buffDefArtillery[j] * D[4][0]) * sm1.def[j].crossbowmen + Math.round(buffDefArtillery[j] * D[5][0]) * sm1.def[j].nordicArchers + Math.round(buffDefCavalry[j] * D[6][0]) * sm1.def[j].armouredHorsemen + Math.round(buffDefCavalry[j] * D[7][0]) * sm1.def[j].lancerHorsemen + Math.round(buffDefCavalry[j] * D[8][0]) * sm1.def[j].axeRider;
				s.defAgainstArtillery += Math.round(buffDefInfantry[j] * D[0][1]) * sm1.def[j].spearmen + Math.round(buffDefInfantry[j] * D[1][1]) * sm1.def[j].swordsmen + Math.round(buffDefInfantry[j] * D[2][1]) * sm1.def[j].berserkers + Math.round(buffDefArtillery[j] * D[3][1]) * sm1.def[j].archers + Math.round(buffDefArtillery[j] * D[4][1]) * sm1.def[j].crossbowmen + Math.round(buffDefArtillery[j] * D[5][1]) * sm1.def[j].nordicArchers + Math.round(buffDefCavalry[j] * D[6][1]) * sm1.def[j].armouredHorsemen + Math.round(buffDefCavalry[j] * D[7][1]) * sm1.def[j].lancerHorsemen + Math.round(buffDefCavalry[j] * D[8][1]) * sm1.def[j].axeRider;
				s.defAgainstCavalry   += Math.round(buffDefInfantry[j] * D[0][2]) * sm1.def[j].spearmen + Math.round(buffDefInfantry[j] * D[1][2]) * sm1.def[j].swordsmen + Math.round(buffDefInfantry[j] * D[2][2]) * sm1.def[j].berserkers + Math.round(buffDefArtillery[j] * D[3][2]) * sm1.def[j].archers + Math.round(buffDefArtillery[j] * D[4][2]) * sm1.def[j].crossbowmen + Math.round(buffDefArtillery[j] * D[5][2]) * sm1.def[j].nordicArchers + Math.round(buffDefCavalry[j] * D[6][2]) * sm1.def[j].armouredHorsemen + Math.round(buffDefCavalry[j] * D[7][2]) * sm1.def[j].lancerHorsemen + Math.round(buffDefCavalry[j] * D[8][2]) * sm1.def[j].axeRider;
			}

			// Honor nighttime bonus.
			if (s.time.getHours() < 7 || s.time.getHours() >= 23) {
				s.nightmode = true;
				s.defAgainstInfantry  *= 2;
				s.defAgainstArtillery *= 2;
			    s.defAgainstCavalry   *= 2;
			} else {
				s.nightmode = false;
			}

			var numOffUnits = 0;
			for (var j = 0; j < sm1.off.length; j++) {
				numOffUnits += (
					sm1.off[j].spearmen
					+ sm1.off[j].swordsmen
					+ sm1.off[j].berserkers
					+ sm1.off[j].archers
					+ sm1.off[j].crossbowmen
					+ sm1.off[j].nordicArchers
					+ sm1.off[j].armouredHorsemen
					+ sm1.off[j].lancerHorsemen
					+ sm1.off[j].axeRider
				);
			}

			var numDefUnits = 0;
			for (var j = 0; j < sm1.def.length; j++) {
				numDefUnits += (
					sm1.def[j].spearmen
					+ sm1.def[j].swordsmen
					+ sm1.def[j].berserkers
					+ sm1.def[j].archers
					+ sm1.def[j].crossbowmen
					+ sm1.def[j].nordicArchers
					+ sm1.def[j].armouredHorsemen
					+ sm1.def[j].lancerHorsemen
					+ sm1.def[j].axeRider
				);
			}

			var isTerminalBattle = numOffUnits <= 100 || numDefUnits <= 100;

			var f = isTerminalBattle ? fightTerminalBattle : fightNormalBattle;
			
			// Combat - compute attackers' casualties.
			s.off = [];
			for (var j = 0; j < sm1.off.length; j++) {
				s.off.push({
					spearmen:         f(s.defAgainstInfantry,  s.offAgainstInfantry,  sm1.off[j].spearmen),
					swordsmen:        f(s.defAgainstInfantry,  s.offAgainstInfantry,  sm1.off[j].swordsmen),
					berserkers:       f(s.defAgainstInfantry,  s.offAgainstInfantry,  sm1.off[j].berserkers),
					archers:          f(s.defAgainstArtillery, s.offAgainstArtillery, sm1.off[j].archers),
					crossbowmen:      f(s.defAgainstArtillery, s.offAgainstArtillery, sm1.off[j].crossbowmen),
					nordicArchers:    f(s.defAgainstArtillery, s.offAgainstArtillery, sm1.off[j].nordicArchers),
					armouredHorsemen: f(s.defAgainstCavalry,   s.offAgainstCavalry,   sm1.off[j].armouredHorsemen),
					lancerHorsemen:   f(s.defAgainstCavalry,   s.offAgainstCavalry,   sm1.off[j].lancerHorsemen),
					axeRider:         f(s.defAgainstCavalry,   s.offAgainstCavalry,   sm1.off[j].axeRider)
				});
			}
			
			// Combat - compute defenders' casualties.
			s.def = [];
			for (var j = 0; j < sm1.def.length; j++) {
				s.def.push({
					spearmen:         f(s.offAgainstInfantry,  s.defAgainstInfantry,  sm1.def[j].spearmen),
					swordsmen:        f(s.offAgainstInfantry,  s.defAgainstInfantry,  sm1.def[j].swordsmen),
					berserkers:       f(s.offAgainstInfantry,  s.defAgainstInfantry,  sm1.def[j].berserkers),
					archers:          f(s.offAgainstArtillery, s.defAgainstArtillery, sm1.def[j].archers),
					crossbowmen:      f(s.offAgainstArtillery, s.defAgainstArtillery, sm1.def[j].crossbowmen),
					nordicArchers:    f(s.offAgainstArtillery, s.defAgainstArtillery, sm1.def[j].nordicArchers),
					armouredHorsemen: f(s.offAgainstCavalry,   s.defAgainstCavalry,   sm1.def[j].armouredHorsemen),
					lancerHorsemen:   f(s.offAgainstCavalry,   s.defAgainstCavalry,   sm1.def[j].lancerHorsemen),
					axeRider:         f(s.offAgainstCavalry,   s.defAgainstCavalry,   sm1.def[j].axeRider)
				});
			}

			$scope.snapshot[i] = s;

			if (i > 50) break; // Terminate iteration to prevent endless looping.

			// Check who won after terminal battle.
			if (isTerminalBattle) {

				$scope.defenderWins = (
					s.offAgainstInfantry + s.offAgainstArtillery + s.offAgainstCavalry
					<= s.defAgainstInfantry + s.defAgainstArtillery + s.defAgainstCavalry
				);

				break;
			}
		}
	};

	$scope.defPlus = function() {
	
		$scope.defType.push("castle");
		$scope.snapshot0.def.push({
			spearmen:         0,
			swordsmen:        0,
			berserkers:       0,
			archers:          0,
			crossbowmen:      0,
			nordicArchers:    0,
			armouredHorsemen: 0,
			lancerHorsemen:   0,
			axeRider:         0,
		});
		$scope.defFortifications.push("1");
		$scope.defLibrary.push("1");
	}
	
	$scope.defMinus = function() {
		$scope.defType.pop();
		$scope.snapshot0.def.pop();
		$scope.defFortifications.pop();
		$scope.defLibrary.pop();
	}
	
	$scope.offPlus = function() {
		$scope.offType.push("castle");
		$scope.snapshot0.off.push({
			spearmen:         0,
			swordsmen:        0,
			berserkers:       0,
			archers:          0,
			crossbowmen:      0,
			nordicArchers:    0,
			armouredHorsemen: 0,
			lancerHorsemen:   0,
			axeRider:         0,
		});
		$scope.offLibrary.push("1");
		$scope.offBarracks.push("1");
	}
	
	$scope.offMinus = function() {
		$scope.offType.pop();
		$scope.snapshot0.off.pop();
		$scope.offLibrary.pop();
		$scope.offBarracks.pop();
	}

	$scope.indexes = function(a) {
		var result = [];
		for (var i = 0; i < a.length; i++) result.push(i);
		return result;
	}

	$scope.naturals = function(from, to) {
		var result = [];
		for (var i = from; i <= to; i++) result.push(i);
		return result;
	}
});
