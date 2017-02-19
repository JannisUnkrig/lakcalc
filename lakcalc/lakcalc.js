
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
	$scope.defType        = [ "castle" ];
	$scope.offType        = [ "castle" ];
	$scope.defWehranlagen = [ "1" ];
	$scope.defBibliothek  = [ "1" ];
	$scope.offBibliothek  = [ "1" ];
	$scope.offKaserne     = [ "1" ];

	// Initial values for the 0th snapshot.
	var uhrzeit = new Date();
	uhrzeit.setHours(12, 0);
	$scope.snapshot0 = {
		uhrzeit: uhrzeit,
		def:     [
			{
				speertraeger:             0,
				schwertkaempfer:          0,
				berserker:                0,
				bogenschuetze:            0,
				armbrustschuetze:         0,
				nordischerBogenschuetze:  0,
				panzerreiter:             0,
				lanzenreiter:             0,
				axtreiter:                0,
			}
		],
		off:     [
			{
				speertraeger:             0,
				schwertkaempfer:          0,
				berserker:                0,
				bogenschuetze:            0,
				armbrustschuetze:         0,
				nordischerBogenschuetze:  0,
				panzerreiter:             0,
				lanzenreiter:             0,
				axtreiter:                0,
			}
		]
	};

	$scope.snapshot = [];

	var lbl = {
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
			battleAt:         "Battle at",
			nightmode:        "Nightmode",
			defensiveValues:  "Defensive values",
			offensiveValues:  "Offensive values",
			infantry:         "Infantry",
			artillery:        "Artillery",
			cavalry:          "Cavalry",
			defenderWins:     "Defender wins",
			attackerWins:     "Attacker wins",
			footer:           "Want to report bugs, contribute, or just pat someone's back? Visit us on <a href=\"https://github.com/JannisUnkrig/lakcalc\" target=\"_top\">Github</a>.",
		},
		de: {
			title:            "Lords and Knights-Kampfrechner",
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
			battleAt:         "Kampf um",
			nightmode:        "Nachtmodus",
			defensiveValues:  "Defensivwerte",
			offensiveValues:  "Offensivwerte",
			infantry:         "Infanterie",
			artillery:        "Artillerie",
			cavalry:          "Kavallerie",
			defenderWins:     "Verteidiger gewinnt",
			attackerWins:     "Angreifer gewinnt",
			footer:           "Du willst Bugs melden, zum Code beitragen oder einfach nur jemanden loben? Besuch uns auf <a href=\"https://github.com/JannisUnkrig/lakcalc\" target=\"_top\">Github</a>.",
		},
	};
	$scope.i18n = lbl.en;

	// Fighting functions:

	var kampf = function(fremdeDagegen, eigeneDagegen, eigeneTruppen) {
		var x = 1 - 0.5 * fremdeDagegen / eigeneDagegen;
		if (x < 0.5) x = 0.5;
		return Math.round(eigeneTruppen * x);
	}

	var endkampf = function(fremdeDagegen, eigeneDagegen, eigeneTruppen) {
		return fremdeDagegen > eigeneDagegen ? 0 : Math.round(eigeneTruppen * (1 - fremdeDagegen / eigeneDagegen));
	}
	
	$scope.DEF_BONUS = {
		"castle":   [ 10, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 1000 ],
		"fortress": [ 3000, 3172, 3345, 3517, 3690, 3862, 4034, 4207, 4379, 4552, 4724, 4897, 5069, 5241, 5414, 5586, 5759, 5931, 6103, 6276, 6448, 6621, 6793, 6966, 7138, 7310, 7483, 7655, 7828, 8000 ],
		"city":     [ 99 ],
	};

	$scope.DEF_FAKTOR = {
		"castle":   [ 1.05, 1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4, 1.45, 1.5, 1.55, 1.6, 1.65, 1.7, 1.75, 1.8, 1.85, 1.9, 1.95, 2 ],
		"fortress": [ 1.75, 1.77, 1.79, 1.81, 1.83, 1.84, 1.86, 1.88, 1.90, 1.92, 1.94, 1.96, 2.02, 2, 2.01, 2.03, 2.05, 2.07, 2.09, 2.11, 2.13, 2.15, 2.17, 2.18, 2.20, 2.22, 2.24, 2.26, 2.28, 2.30 ],
		"city":     [ 99 ],
	};

	$scope.BUFF_OFF_KASERNE = [ 1.01, 1.02, 1.02, 1.03, 1.04, 1.04, 1.05, 1.06, 1.06, 1.07, 1.08, 1.08, 1.09, 1.10, 1.10, 1.11, 1.12, 1.12, 1.13, 1.14, 1.14, 1.15, 1.16, 1.16, 1.17, 1.18, 1.18, 1.19, 1.19, 1.20 ];

	$scope.kaempfe = function() {

		$scope.snapshot = [];

		$scope.defenderWins = false;
		$scope.attackerWins = false;

		// Get 0th defender's fortifications:
		var wehranlagen = Number($scope.defWehranlagen[0]);

		// Compute defenders' bonuses:
		var defBonus = $scope.DEF_BONUS[$scope.defType[0]][wehranlagen - 1];

		// Compute defenders' factors.
		var defFaktor = [];
		for (var j = 0; j < $scope.snapshot0.def.length; j++) {
		
			// Get defender's fortifications:
			var wehranlagen = Number($scope.defWehranlagen[j]);

			// Compute defender's factor.
			defFaktor.push($scope.DEF_FAKTOR[$scope.defType[j]][wehranlagen - 1]);
		}

		// Attackers' buffs:
		var buffOffInfanterie = [];
		var buffOffArtillerie = [];
		var buffOffKavallerie = [];
		for (var j = 0; j < $scope.snapshot0.off.length; j++) {
		
			// Get attacker's libraries:
			var offBibliothek = Number($scope.offBibliothek[j]);
			var offType       = $scope.offType[j];
			
			switch (offType) {
			
			case "castle":

				// Compute attacker's buffs for "castle" type.
				buffOffInfanterie[j] = 1;
				if (offBibliothek >= 3) buffOffInfanterie[j] *= 1.05;
				if (offBibliothek >= 7) buffOffInfanterie[j] *= 1.05;
	
				buffOffArtillerie[j] = 1;
				if (offBibliothek >= 3) buffOffArtillerie[j] *= 1.05;
				if (offBibliothek >= 8) buffOffArtillerie[j] *= 1.05;
	
				buffOffKavallerie[j] = 1;
				if (offBibliothek >= 3) buffOffKavallerie[j] *= 1.05;
				if (offBibliothek >= 9) buffOffKavallerie[j] *= 1.05;
				break;
			
			case "fortress":

				// Compute attacker's buffs for "fortress" type.
				buffOffInfanterie[j] = 1.05 * 1.05;
	
				buffOffArtillerie[j] = 1.05 * 1.05;
	
				buffOffKavallerie[j] = 1.05 * 1.05;
				break;
				
			case "city":

				// Compute attacker's buffs for "city" type.
				alert("City NYI.");
				throw new Error("City NYI");
			}
		}
		
		// Defenders' buffs.
		var buffDefInfanterie = [];
		var buffDefArtillerie = [];
		var buffDefKavallerie = [];
		for (var j = 0; j < $scope.snapshot0.def.length; j++) {

			// Get defender's libraries.
			var defBibliothek = Number($scope.defBibliothek[j]);
			var defType       = $scope.defType[j];
			
			switch (defType) {
			
			case "castle":

				// Compute defender's buffs for "castle" type.
				buffDefInfanterie[j] = defFaktor[j];
				if (defBibliothek >= 3)  buffDefInfanterie[j] *= 1.05;
				if (defBibliothek >= 4)  buffDefInfanterie[j] *= 1.05;
				if (defBibliothek >= 10) buffDefInfanterie[j] *= 1.05;
	
				buffDefArtillerie[j] = defFaktor[j];
				if (defBibliothek >= 3)  buffDefArtillerie[j] *= 1.05;
				if (defBibliothek >= 6)  buffDefArtillerie[j] *= 1.05;
				if (defBibliothek >= 10) buffDefArtillerie[j] *= 1.05;
	
				buffDefKavallerie[j] = defFaktor[j];
				if (defBibliothek >= 3)  buffDefKavallerie[j] *= 1.05;
				if (defBibliothek >= 6)  buffDefKavallerie[j] *= 1.05;
				if (defBibliothek >= 10) buffDefKavallerie[j] *= 1.05;
				break;
				
			case "fortress":

				// Compute defender's buffs for "fortress" type.
				buffDefInfanterie[j] = defFaktor[j] * 1.05 * 1.05 * 1.05;
				if (defBibliothek >= 4) buffDefInfanterie[j] *= 1.05; // Kettenhemd
	
				buffDefArtillerie[j] = defFaktor[j] * 1.05 * 1.05 * 1.05;
				if (defBibliothek >= 6) buffDefArtillerie[j] *= 1.05; // Pavese
	
				buffDefKavallerie[j] = defFaktor[j] * 1.05 * 1.05 * 1.05;
				if (defBibliothek >= 8) buffDefKavallerie[j] *= 1.05; // Plattenpanzerung
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
				buffOffInfanterie[j] *= $scope.BUFF_OFF_KASERNE[$scope.offKaserne[j] - 1];
				buffOffArtillerie[j] *= $scope.BUFF_OFF_KASERNE[$scope.offKaserne[j] - 1];
				buffOffKavallerie[j] *= $scope.BUFF_OFF_KASERNE[$scope.offKaserne[j] - 1];
			}
		}	
		
		for (var i = 0;; i++) {
		
			var sm1 = i == 0 ? $scope.snapshot0 : $scope.snapshot[i - 1];
			var s = {};

			s.uhrzeit = new Date(sm1.uhrzeit);
			s.uhrzeit.setMinutes(s.uhrzeit.getMinutes() + 10);
			
			// Compute attackers's combat powers.
			s.offGegenInfanterie = 0;
			s.offGegenArtillerie = 0;
			s.offGegenKavallerie = 0;
			for (var j = 0; j < sm1.off.length; j++) {
				s.offGegenInfanterie += Math.round(buffOffInfanterie[j] * O[0][0]) * sm1.off[j].speertraeger + Math.round(buffOffInfanterie[j] * O[1][0]) * sm1.off[j].schwertkaempfer + Math.round(buffOffInfanterie[j] * O[2][0]) * sm1.off[j].berserker + Math.round(buffOffArtillerie[j] * O[3][0]) * sm1.off[j].bogenschuetze + Math.round(buffOffArtillerie[j] * O[4][0]) * sm1.off[j].armbrustschuetze + Math.round(buffOffArtillerie[j] * O[5][0]) * sm1.off[j].nordischerBogenschuetze + Math.round(buffOffKavallerie[j] * O[6][0]) * sm1.off[j].panzerreiter + Math.round(buffOffKavallerie[j] * O[7][0]) * sm1.off[j].lanzenreiter + Math.round(buffOffKavallerie[j] * O[8][0]) * sm1.off[j].axtreiter;
				s.offGegenArtillerie += Math.round(buffOffInfanterie[j] * O[0][1]) * sm1.off[j].speertraeger + Math.round(buffOffInfanterie[j] * O[1][1]) * sm1.off[j].schwertkaempfer + Math.round(buffOffInfanterie[j] * O[2][1]) * sm1.off[j].berserker + Math.round(buffOffArtillerie[j] * O[3][1]) * sm1.off[j].bogenschuetze + Math.round(buffOffArtillerie[j] * O[4][1]) * sm1.off[j].armbrustschuetze + Math.round(buffOffArtillerie[j] * O[5][1]) * sm1.off[j].nordischerBogenschuetze + Math.round(buffOffKavallerie[j] * O[6][1]) * sm1.off[j].panzerreiter + Math.round(buffOffKavallerie[j] * O[7][1]) * sm1.off[j].lanzenreiter + Math.round(buffOffKavallerie[j] * O[8][1]) * sm1.off[j].axtreiter;
				s.offGegenKavallerie += Math.round(buffOffInfanterie[j] * O[0][2]) * sm1.off[j].speertraeger + Math.round(buffOffInfanterie[j] * O[1][2]) * sm1.off[j].schwertkaempfer + Math.round(buffOffInfanterie[j] * O[2][2]) * sm1.off[j].berserker + Math.round(buffOffArtillerie[j] * O[3][2]) * sm1.off[j].bogenschuetze + Math.round(buffOffArtillerie[j] * O[4][2]) * sm1.off[j].armbrustschuetze + Math.round(buffOffArtillerie[j] * O[5][2]) * sm1.off[j].nordischerBogenschuetze + Math.round(buffOffKavallerie[j] * O[6][2]) * sm1.off[j].panzerreiter + Math.round(buffOffKavallerie[j] * O[7][2]) * sm1.off[j].lanzenreiter + Math.round(buffOffKavallerie[j] * O[8][2]) * sm1.off[j].axtreiter;
			}
			
			// Compute defenders's combat powers.
			s.defGegenInfanterie = defBonus;
			s.defGegenArtillerie = defBonus;
			s.defGegenKavallerie = defBonus;
			for (var j = 0; j < sm1.def.length; j++) {
				s.defGegenInfanterie += Math.round(buffDefInfanterie[j] * D[0][0]) * sm1.def[j].speertraeger + Math.round(buffDefInfanterie[j] * D[1][0]) * sm1.def[j].schwertkaempfer + Math.round(buffDefInfanterie[j] * D[2][0]) * sm1.def[j].berserker + Math.round(buffDefArtillerie[j] * D[3][0]) * sm1.def[j].bogenschuetze + Math.round(buffDefArtillerie[j] * D[4][0]) * sm1.def[j].armbrustschuetze + Math.round(buffDefArtillerie[j] * D[5][0]) * sm1.def[j].nordischerBogenschuetze + Math.round(buffDefKavallerie[j] * D[6][0]) * sm1.def[j].panzerreiter + Math.round(buffDefKavallerie[j] * D[7][0]) * sm1.def[j].lanzenreiter + Math.round(buffDefKavallerie[j] * D[8][0]) * sm1.def[j].axtreiter;
				s.defGegenArtillerie += Math.round(buffDefInfanterie[j] * D[0][1]) * sm1.def[j].speertraeger + Math.round(buffDefInfanterie[j] * D[1][1]) * sm1.def[j].schwertkaempfer + Math.round(buffDefInfanterie[j] * D[2][1]) * sm1.def[j].berserker + Math.round(buffDefArtillerie[j] * D[3][1]) * sm1.def[j].bogenschuetze + Math.round(buffDefArtillerie[j] * D[4][1]) * sm1.def[j].armbrustschuetze + Math.round(buffDefArtillerie[j] * D[5][1]) * sm1.def[j].nordischerBogenschuetze + Math.round(buffDefKavallerie[j] * D[6][1]) * sm1.def[j].panzerreiter + Math.round(buffDefKavallerie[j] * D[7][1]) * sm1.def[j].lanzenreiter + Math.round(buffDefKavallerie[j] * D[8][1]) * sm1.def[j].axtreiter;
				s.defGegenKavallerie += Math.round(buffDefInfanterie[j] * D[0][2]) * sm1.def[j].speertraeger + Math.round(buffDefInfanterie[j] * D[1][2]) * sm1.def[j].schwertkaempfer + Math.round(buffDefInfanterie[j] * D[2][2]) * sm1.def[j].berserker + Math.round(buffDefArtillerie[j] * D[3][2]) * sm1.def[j].bogenschuetze + Math.round(buffDefArtillerie[j] * D[4][2]) * sm1.def[j].armbrustschuetze + Math.round(buffDefArtillerie[j] * D[5][2]) * sm1.def[j].nordischerBogenschuetze + Math.round(buffDefKavallerie[j] * D[6][2]) * sm1.def[j].panzerreiter + Math.round(buffDefKavallerie[j] * D[7][2]) * sm1.def[j].lanzenreiter + Math.round(buffDefKavallerie[j] * D[8][2]) * sm1.def[j].axtreiter;
			}

			// Honor nighttime bonus.
			if (s.uhrzeit.getHours() < 7 || s.uhrzeit.getHours() >= 23) {
				s.nachtmodus = true;
				s.defGegenInfanterie *= 2;
				s.defGegenArtillerie *= 2;
			    s.defGegenKavallerie *= 2;
			} else {
				s.nachtmodus = false;
			}

			var numOffUnits = 0;
			for (var j = 0; j < sm1.off.length; j++) {
				numOffUnits += (
					sm1.off[j].speertraeger
					+ sm1.off[j].schwertkaempfer
					+ sm1.off[j].berserker
					+ sm1.off[j].bogenschuetze
					+ sm1.off[j].armbrustschuetze
					+ sm1.off[j].nordischerBogenschuetze
					+ sm1.off[j].panzerreiter
					+ sm1.off[j].lanzenreiter
					+ sm1.off[j].axtreiter
				);
			}

			var numDefUnits = 0;
			for (var j = 0; j < sm1.def.length; j++) {
				numDefUnits += (
					sm1.def[j].speertraeger
					+ sm1.def[j].schwertkaempfer
					+ sm1.def[j].berserker
					+ sm1.def[j].bogenschuetze
					+ sm1.def[j].armbrustschuetze
					+ sm1.def[j].nordischerBogenschuetze
					+ sm1.def[j].panzerreiter
					+ sm1.def[j].lanzenreiter
					+ sm1.def[j].axtreiter
				);
			}

			s.terminalFight = numOffUnits <= 100 || numDefUnits <= 100;
			var f = s.terminalFight ? endkampf : kampf;
			
			// Combat - compute attackers' casualties.
			s.off = [];
			for (var j = 0; j < sm1.off.length; j++) {
				s.off.push({
					speertraeger:            f(s.defGegenInfanterie, s.offGegenInfanterie, sm1.off[j].speertraeger),
					schwertkaempfer:         f(s.defGegenInfanterie, s.offGegenInfanterie, sm1.off[j].schwertkaempfer),
					berserker:               f(s.defGegenInfanterie, s.offGegenInfanterie, sm1.off[j].berserker),
					bogenschuetze:           f(s.defGegenArtillerie, s.offGegenArtillerie, sm1.off[j].bogenschuetze),
					armbrustschuetze:        f(s.defGegenArtillerie, s.offGegenArtillerie, sm1.off[j].armbrustschuetze),
					nordischerBogenschuetze: f(s.defGegenArtillerie, s.offGegenArtillerie, sm1.off[j].nordischerBogenschuetze),
					panzerreiter:            f(s.defGegenKavallerie, s.offGegenKavallerie, sm1.off[j].panzerreiter),
					lanzenreiter:            f(s.defGegenKavallerie, s.offGegenKavallerie, sm1.off[j].lanzenreiter),
					axtreiter:               f(s.defGegenKavallerie, s.offGegenKavallerie, sm1.off[j].axtreiter)
				});
			}
			
			// Combat - compute defenders' casualties.
			s.def = [];
			for (var j = 0; j < sm1.def.length; j++) {
				s.def.push({
					speertraeger:            f(s.offGegenInfanterie, s.defGegenInfanterie, sm1.def[j].speertraeger),
					schwertkaempfer:         f(s.offGegenInfanterie, s.defGegenInfanterie, sm1.def[j].schwertkaempfer),
					berserker:               f(s.offGegenInfanterie, s.defGegenInfanterie, sm1.def[j].berserker),
					bogenschuetze:           f(s.offGegenArtillerie, s.defGegenArtillerie, sm1.def[j].bogenschuetze),
					armbrustschuetze:        f(s.offGegenArtillerie, s.defGegenArtillerie, sm1.def[j].armbrustschuetze),
					nordischerBogenschuetze: f(s.offGegenArtillerie, s.defGegenArtillerie, sm1.def[j].nordischerBogenschuetze),
					panzerreiter:            f(s.offGegenKavallerie, s.defGegenKavallerie, sm1.def[j].panzerreiter),
					lanzenreiter:            f(s.offGegenKavallerie, s.defGegenKavallerie, sm1.def[j].lanzenreiter),
					axtreiter:               f(s.offGegenKavallerie, s.defGegenKavallerie, sm1.def[j].axtreiter)
				});
			}

			$scope.snapshot[i] = s;

			if (i > 50) break; // Terminate iteration to prevent endless looping.

			// Check who won after terminal battle.
			if (s.terminalFight) {

				if (
					s.offGegenInfanterie + s.offGegenArtillerie + s.offGegenKavallerie
					<= s.defGegenInfanterie + s.defGegenArtillerie + s.defGegenKavallerie
				) {
					$scope.defenderWins = true;
				} else {
					$scope.attackerWins = true;
				}

				break;
			}
		}
	};

	$scope.langEn = function() { $scope.i18n = lbl.en; }
	$scope.langDe = function() { $scope.i18n = lbl.de; }

	$scope.defPlus = function() {
	
		$scope.defType.push("castle");
		$scope.snapshot0.def.push({
			speertraeger:            0,
			schwertkaempfer:         0,
			berserker:               0,
			bogenschuetze:           0,
			armbrustschuetze:        0,
			nordischerBogenschuetze: 0,
			panzerreiter:            0,
			lanzenreiter:            0,
			axtreiter:               0,
		});
		$scope.defWehranlagen.push("1");
		$scope.defBibliothek.push("1");
	}
	
	$scope.defMinus = function() {
		$scope.defType.pop();
		$scope.snapshot0.def.pop();
		$scope.defWehranlagen.pop();
		$scope.defBibliothek.pop();
	}
	
	$scope.offPlus = function() {
		$scope.offType.push("castle");
		$scope.snapshot0.off.push({
			speertraeger:            0,
			schwertkaempfer:         0,
			berserker:               0,
			bogenschuetze:           0,
			armbrustschuetze:        0,
			nordischerBogenschuetze: 0,
			panzerreiter:            0,
			lanzenreiter:            0,
			axtreiter:               0,
		});
		$scope.offBibliothek.push("1");
		$scope.offKaserne.push("1");
	}
	
	$scope.offMinus = function() {
		$scope.offType.pop();
		$scope.snapshot0.off.pop();
		$scope.offBibliothek.pop();
		$scope.offKaserne.pop();
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
