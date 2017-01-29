
angular.module('myApp', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']).controller('myCtrl', function($scope) {
		
	// Statische Koeffizienten.
	
    var o = [
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
    
    
    var d = [
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

	// Initialwerte für Boni.
    $scope.defWehranlagen = [ "1" ];
	$scope.defBibliothek  = [ "1" ];
	$scope.offBibliothek  = [ "1" ];

	// Initialwerte für 0. Snapshot.
	var s0 = {};

	s0.uhrzeit = new Date();
	s0.uhrzeit.setHours(12);
	s0.uhrzeit.setMinutes(0);

    s0.defSpeertraeger            = [ 0 ];
    s0.defSchwertkaempfer         = [ 0 ];
    s0.defBerserker               = [ 0 ];
    s0.defBogenschuetze           = [ 0 ];
    s0.defArmbrustschuetze        = [ 0 ];
    s0.defNordischerBogenschuetze = [ 0 ];
    s0.defPanzerreiter            = [ 0 ];
    s0.defLanzenreiter            = [ 0 ];
    s0.defAxtreiter               = [ 0 ];
    
    s0.offSpeertraeger            = [ 0 ];
    s0.offSchwertkaempfer         = [ 0 ];
    s0.offBerserker               = [ 0 ];
    s0.offBogenschuetze           = [ 0 ];
    s0.offArmbrustschuetze        = [ 0 ];
    s0.offNordischerBogenschuetze = [ 0 ];
    s0.offPanzerreiter            = [ 0 ];
    s0.offLanzenreiter            = [ 0 ];
    s0.offAxtreiter               = [ 0 ];

	$scope.snapshot0 = s0;
	
	$scope.snapshot = [];
	
	// Funktionen.

	var kampf = function(fremdeDagegen, eigeneDagegen, eigeneTruppen) {
        var x = 1 - 0.5 * fremdeDagegen / eigeneDagegen;
        if (x < 0.5) x = 0.5;
        return Math.round(eigeneTruppen * x);
	}

	var endkampf = function(fremdeDagegen, eigeneDagegen, eigeneTruppen) {
		return fremdeDagegen > eigeneDagegen ? 0 : Math.round(eigeneTruppen * (1 - fremdeDagegen / eigeneDagegen));
	}
	
    $scope.kaempfe = function() {

		// Wehranlagen Verteidiger:
		var defBonus  = [ 10,   50,  100,  150, 200,  250, 300,  350, 400,  450, 500,  550, 600,  650, 700,  750, 800,  850, 900,  1000][Number($scope.defWehranlagen[0]) - 1];
		var defFaktor = [];
		for (var j = 0; j < $scope.snapshot0.defSpeertraeger.length; j++) {
			defFaktor[j] = [ 1.05, 1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4, 1.45, 1.5, 1.55, 1.6, 1.65, 1.7, 1.75, 1.8, 1.85, 1.9, 1.95, 2   ][Number($scope.defWehranlagen[j]) - 1];
		}

		// Bibliothek Angreifer:
		var buffOffInfanterie = [];
		var buffOffArtillerie = [];
		var buffOffKavallerie = [];
		for (var j = 0; j < $scope.snapshot0.offSpeertraeger.length; j++) {
		
			var offBibliothek = Number($scope.offBibliothek[j]);
			
			buffOffInfanterie[j] = 1;
			if (offBibliothek >= 3) buffOffInfanterie[j] *= 1.05;
			if (offBibliothek >= 7) buffOffInfanterie[j] *= 1.05;

			buffOffArtillerie[j] = 1;
			if (offBibliothek >= 3) buffOffArtillerie[j] *= 1.05;
			if (offBibliothek >= 8) buffOffArtillerie[j] *= 1.05;

			buffOffKavallerie[j] = 1;
	        if (offBibliothek >= 3) buffOffKavallerie[j] *= 1.05;
			if (offBibliothek >= 9) buffOffKavallerie[j] *= 1.05;
		}
		
		// Bibliothek Verteidiger:
		var buffDefInfanterie = [];
		var buffDefArtillerie = [];
		var buffDefKavallerie = [];
		for (var j = 0; j < $scope.snapshot0.defSpeertraeger.length; j++) {

			var defBibliothek = Number($scope.defBibliothek[j]);
			
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
		}
        
        for (var i = 0;; i++) {
        
        	// Kampfstärken berechnen.
        	var sm1 = i == 0 ? $scope.snapshot0 : $scope.snapshot[i - 1];
        	var s = {};

			s.uhrzeit = new Date(sm1.uhrzeit);
			s.uhrzeit.setMinutes(s.uhrzeit.getMinutes() + 10);
			
			// Compute combat powers.
	        s.offGegenInfanterie = 0;
	        s.offGegenArtillerie = 0;
	        s.offGegenKavallerie = 0;
			for (var j = 0; j < $scope.snapshot0.offSpeertraeger.length; j++) {
		        s.offGegenInfanterie += Math.round(buffOffInfanterie[j] * o[0][0]) * sm1.offSpeertraeger[j] + Math.round(buffOffInfanterie[j] * o[1][0]) * sm1.offSchwertkaempfer[j] + Math.round(buffOffInfanterie[j] * o[2][0]) * sm1.offBerserker[j] + Math.round(buffOffArtillerie[j] * o[3][0]) * sm1.offBogenschuetze[j] + Math.round(buffOffArtillerie[j] * o[4][0]) * sm1.offArmbrustschuetze[j] + Math.round(buffOffArtillerie[j] * o[5][0]) * sm1.offNordischerBogenschuetze[j] + Math.round(buffOffKavallerie[j] * o[6][0]) * sm1.offPanzerreiter[j] + Math.round(buffOffKavallerie[j] * o[7][0]) * sm1.offLanzenreiter[j] + Math.round(buffOffKavallerie[j] * o[8][0]) * sm1.offAxtreiter[j];
		        s.offGegenArtillerie += Math.round(buffOffInfanterie[j] * o[0][1]) * sm1.offSpeertraeger[j] + Math.round(buffOffInfanterie[j] * o[1][1]) * sm1.offSchwertkaempfer[j] + Math.round(buffOffInfanterie[j] * o[2][1]) * sm1.offBerserker[j] + Math.round(buffOffArtillerie[j] * o[3][1]) * sm1.offBogenschuetze[j] + Math.round(buffOffArtillerie[j] * o[4][1]) * sm1.offArmbrustschuetze[j] + Math.round(buffOffArtillerie[j] * o[5][1]) * sm1.offNordischerBogenschuetze[j] + Math.round(buffOffKavallerie[j] * o[6][1]) * sm1.offPanzerreiter[j] + Math.round(buffOffKavallerie[j] * o[7][1]) * sm1.offLanzenreiter[j] + Math.round(buffOffKavallerie[j] * o[8][1]) * sm1.offAxtreiter[j];
		        s.offGegenKavallerie += Math.round(buffOffInfanterie[j] * o[0][2]) * sm1.offSpeertraeger[j] + Math.round(buffOffInfanterie[j] * o[1][2]) * sm1.offSchwertkaempfer[j] + Math.round(buffOffInfanterie[j] * o[2][2]) * sm1.offBerserker[j] + Math.round(buffOffArtillerie[j] * o[3][2]) * sm1.offBogenschuetze[j] + Math.round(buffOffArtillerie[j] * o[4][2]) * sm1.offArmbrustschuetze[j] + Math.round(buffOffArtillerie[j] * o[5][2]) * sm1.offNordischerBogenschuetze[j] + Math.round(buffOffKavallerie[j] * o[6][2]) * sm1.offPanzerreiter[j] + Math.round(buffOffKavallerie[j] * o[7][2]) * sm1.offLanzenreiter[j] + Math.round(buffOffKavallerie[j] * o[8][2]) * sm1.offAxtreiter[j];
	        }
	        
	        s.defGegenInfanterie = defBonus;
	        s.defGegenArtillerie = defBonus;
	        s.defGegenKavallerie = defBonus;
			for (var j = 0; j < $scope.snapshot0.defSpeertraeger.length; j++) {
		        s.defGegenInfanterie += Math.round(buffDefInfanterie[j] * d[0][0]) * sm1.defSpeertraeger[j] + Math.round(buffDefInfanterie[j] * d[1][0]) * sm1.defSchwertkaempfer[j] + Math.round(buffDefInfanterie[j] * d[2][0]) * sm1.defBerserker[j] + Math.round(buffDefArtillerie[j] * d[3][0]) * sm1.defBogenschuetze[j] + Math.round(buffDefArtillerie[j] * d[4][0]) * sm1.defArmbrustschuetze[j] + Math.round(buffDefArtillerie[j] * d[5][0]) * sm1.defNordischerBogenschuetze[j] + Math.round(buffDefKavallerie[j] * d[6][0]) * sm1.defPanzerreiter[j] + Math.round(buffDefKavallerie[j] * d[7][0]) * sm1.defLanzenreiter[j] + Math.round(buffDefKavallerie[j] * d[8][0]) * sm1.defAxtreiter[j];
		        s.defGegenArtillerie += Math.round(buffDefInfanterie[j] * d[0][1]) * sm1.defSpeertraeger[j] + Math.round(buffDefInfanterie[j] * d[1][1]) * sm1.defSchwertkaempfer[j] + Math.round(buffDefInfanterie[j] * d[2][1]) * sm1.defBerserker[j] + Math.round(buffDefArtillerie[j] * d[3][1]) * sm1.defBogenschuetze[j] + Math.round(buffDefArtillerie[j] * d[4][1]) * sm1.defArmbrustschuetze[j] + Math.round(buffDefArtillerie[j] * d[5][1]) * sm1.defNordischerBogenschuetze[j] + Math.round(buffDefKavallerie[j] * d[6][1]) * sm1.defPanzerreiter[j] + Math.round(buffDefKavallerie[j] * d[7][1]) * sm1.defLanzenreiter[j] + Math.round(buffDefKavallerie[j] * d[8][1]) * sm1.defAxtreiter[j];
		        s.defGegenKavallerie += Math.round(buffDefInfanterie[j] * d[0][2]) * sm1.defSpeertraeger[j] + Math.round(buffDefInfanterie[j] * d[1][2]) * sm1.defSchwertkaempfer[j] + Math.round(buffDefInfanterie[j] * d[2][2]) * sm1.defBerserker[j] + Math.round(buffDefArtillerie[j] * d[3][2]) * sm1.defBogenschuetze[j] + Math.round(buffDefArtillerie[j] * d[4][2]) * sm1.defArmbrustschuetze[j] + Math.round(buffDefArtillerie[j] * d[5][2]) * sm1.defNordischerBogenschuetze[j] + Math.round(buffDefKavallerie[j] * d[6][2]) * sm1.defPanzerreiter[j] + Math.round(buffDefKavallerie[j] * d[7][2]) * sm1.defLanzenreiter[j] + Math.round(buffDefKavallerie[j] * d[8][2]) * sm1.defAxtreiter[j];
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
			for (var j = 0; j < $scope.snapshot0.offSpeertraeger.length; j++) {
				numOffUnits += (
					sm1.offSpeertraeger[j]
					+ sm1.offSchwertkaempfer[j]
					+ sm1.offBerserker[j]
					+ sm1.offBogenschuetze[j]
					+ sm1.offArmbrustschuetze[j]
					+ sm1.offNordischerBogenschuetze[j]
					+ sm1.offPanzerreiter[j]
					+ sm1.offLanzenreiter[j]
					+ sm1.offAxtreiter[j]
				);
			}

			var numDefUnits = 0;
			for (var j = 0; j < $scope.snapshot0.defSpeertraeger.length; j++) {
				numDefUnits += (
					sm1.defSpeertraeger[j]
					+ sm1.defSchwertkaempfer[j]
					+ sm1.defBerserker[j]
					+ sm1.defBogenschuetze[j]
					+ sm1.defArmbrustschuetze[j]
					+ sm1.defNordischerBogenschuetze[j]
					+ sm1.defPanzerreiter[j]
					+ sm1.defLanzenreiter[j]
					+ sm1.defAxtreiter[j]
				);
			}

			var f = numOffUnits <= 100 || numDefUnits <= 100 ? endkampf : kampf;
			
			// Combat - compute number of survivors.
			s.offSpeertraeger            = [];
			s.offSchwertkaempfer         = [];
			s.offBerserker               = [];
			s.offBogenschuetze           = [];
			s.offArmbrustschuetze        = [];
			s.offNordischerBogenschuetze = [];
			s.offPanzerreiter            = [];
			s.offLanzenreiter            = [];
			s.offAxtreiter               = [];
			for (var j = 0; j < $scope.snapshot0.offSpeertraeger.length; j++) {
				s.offSpeertraeger[j]            = f(s.defGegenInfanterie, s.offGegenInfanterie, sm1.offSpeertraeger[j]);
				s.offSchwertkaempfer[j]         = f(s.defGegenInfanterie, s.offGegenInfanterie, sm1.offSchwertkaempfer[j]);
				s.offBerserker[j]               = f(s.defGegenInfanterie, s.offGegenInfanterie, sm1.offBerserker[j]);
				s.offBogenschuetze[j]           = f(s.defGegenArtillerie, s.offGegenArtillerie, sm1.offBogenschuetze[j]);
				s.offArmbrustschuetze[j]        = f(s.defGegenArtillerie, s.offGegenArtillerie, sm1.offArmbrustschuetze[j]);
				s.offNordischerBogenschuetze[j] = f(s.defGegenArtillerie, s.offGegenArtillerie, sm1.offNordischerBogenschuetze[j]);
				s.offPanzerreiter[j]            = f(s.defGegenKavallerie, s.offGegenKavallerie, sm1.offPanzerreiter[j]);
				s.offLanzenreiter[j]            = f(s.defGegenKavallerie, s.offGegenKavallerie, sm1.offLanzenreiter[j]);
				s.offAxtreiter[j]               = f(s.defGegenKavallerie, s.offGegenKavallerie, sm1.offAxtreiter[j]);
			}
			
			s.defSpeertraeger            = [];
			s.defSchwertkaempfer         = [];
			s.defBerserker               = [];
			s.defBogenschuetze           = [];
			s.defArmbrustschuetze        = [];
			s.defNordischerBogenschuetze = [];
			s.defPanzerreiter            = [];
			s.defLanzenreiter            = [];
			s.defAxtreiter               = [];
			for (var j = 0; j < $scope.snapshot0.defSpeertraeger.length; j++) {
				s.defSpeertraeger[j]            = f(s.offGegenInfanterie, s.defGegenInfanterie, sm1.defSpeertraeger[j]);
				s.defSchwertkaempfer[j]         = f(s.offGegenInfanterie, s.defGegenInfanterie, sm1.defSchwertkaempfer[j]);
				s.defBerserker[j]               = f(s.offGegenInfanterie, s.defGegenInfanterie, sm1.defBerserker[j]);
				s.defBogenschuetze[j]           = f(s.offGegenArtillerie, s.defGegenArtillerie, sm1.defBogenschuetze[j]);
				s.defArmbrustschuetze[j]        = f(s.offGegenArtillerie, s.defGegenArtillerie, sm1.defArmbrustschuetze[j]);
				s.defNordischerBogenschuetze[j] = f(s.offGegenArtillerie, s.defGegenArtillerie, sm1.defNordischerBogenschuetze[j]);
				s.defPanzerreiter[j]            = f(s.offGegenKavallerie, s.defGegenKavallerie, sm1.defPanzerreiter[j]);
				s.defLanzenreiter[j]            = f(s.offGegenKavallerie, s.defGegenKavallerie, sm1.defLanzenreiter[j]);
				s.defAxtreiter[j]               = f(s.offGegenKavallerie, s.defGegenKavallerie, sm1.defAxtreiter[j]);
			}
			
        	$scope.snapshot[i] = s;
        	
        	if (f == endkampf || i > 50) break;
		}
    };
    
    $scope.defPlus = function() {
    
    	var s0 = $scope.snapshot0;
    
	    s0.defSpeertraeger.push(0);
	    s0.defSchwertkaempfer.push(0);
	    s0.defBerserker.push(0);
	    s0.defBogenschuetze.push(0);
	    s0.defArmbrustschuetze.push(0);
	    s0.defNordischerBogenschuetze.push(0);
	    s0.defPanzerreiter.push(0);
	    s0.defLanzenreiter.push(0);
	    s0.defAxtreiter.push(0);
	    $scope.defWehranlagen.push("1");
	    $scope.defBibliothek.push("1");
    }
    
    $scope.defMinus = function() {
	    s0.defSpeertraeger.pop();
	    s0.defSchwertkaempfer.pop();
	    s0.defBerserker.pop();
	    s0.defBogenschuetze.pop();
	    s0.defArmbrustschuetze.pop();
	    s0.defNordischerBogenschuetze.pop();
	    s0.defPanzerreiter.pop();
	    s0.defLanzenreiter.pop();
	    s0.defAxtreiter.pop();
	    $scope.defWehranlagen.pop();
	    $scope.defBibliothek.pop();
    }
    
    $scope.offPlus = function() {
	    s0.offSpeertraeger.push(0);
	    s0.offSchwertkaempfer.push(0);
	    s0.offBerserker.push(0);
	    s0.offBogenschuetze.push(0);
	    s0.offArmbrustschuetze.push(0);
	    s0.offNordischerBogenschuetze.push(0);
	    s0.offPanzerreiter.push(0);
	    s0.offLanzenreiter.push(0);
	    s0.offAxtreiter.push(0);
	    $scope.offBibliothek.push("1");
    }
    
    $scope.offMinus = function() {
	    s0.offSpeertraeger.pop();
	    s0.offSchwertkaempfer.pop();
	    s0.offBerserker.pop();
	    s0.offBogenschuetze.pop();
	    s0.offArmbrustschuetze.pop();
	    s0.offNordischerBogenschuetze.pop();
	    s0.offPanzerreiter.pop();
	    s0.offLanzenreiter.pop();
	    s0.offAxtreiter.pop();
	    $scope.offBibliothek.pop();
    }
    
    $scope.indexes = function(a) {
    	var result = [];
    	for (var i = 0; i < a.length; i++) result.push(i);
    	return result;
	}
});
