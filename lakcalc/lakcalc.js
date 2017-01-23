
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
    $scope.defWehranlagen = "1";
	$scope.defBibliothek  = "1";
	$scope.offBibliothek  = "1";

	// Initialwerte für 0. Snapshot.
	var s0 = {};

	s0.uhrzeit = new Date();
	s0.uhrzeit.setHours(12);
	s0.uhrzeit.setMinutes(0);

    s0.defSpeertraeger            = 1000;
    s0.defSchwertkaempfer         = 0;
    s0.defBerserker               = 0;
    s0.defBogenschuetze           = 0;
    s0.defArmbrustschuetze        = 0;
    s0.defNordischerBogenschuetze = 0;
    s0.defPanzerreiter            = 0;
    s0.defLanzenreiter            = 0;
    s0.defAxtreiter               = 0;
    
    s0.offSpeertraeger            = 42900;
    s0.offSchwertkaempfer         = 0;
    s0.offBerserker               = 0;
    s0.offBogenschuetze           = 0;
    s0.offArmbrustschuetze        = 0;
    s0.offNordischerBogenschuetze = 0;
    s0.offPanzerreiter            = 0;
    s0.offLanzenreiter            = 0;
    s0.offAxtreiter               = 0;

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
		var defWehranlagen = Number($scope.defWehranlagen);
		var defBonus  = [ 10,   50,  100,  150, 200,  250, 300,  350, 400,  450, 500,  550, 600,  650, 700,  750, 800,  850, 900,  1000][defWehranlagen - 1];
		var defFaktor = [ 1.05, 1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4, 1.45, 1.5, 1.55, 1.6, 1.65, 1.7, 1.75, 1.8, 1.85, 1.9, 1.95, 2   ][defWehranlagen - 1];

		// Bibliothek Angreifer:
		var offBibliothek = Number($scope.offBibliothek);
		var buffOffInfanterie = 1;
		var buffOffArtillerie = 1;
		var buffOffKavallerie = 1;
		
		if (offBibliothek >= 3) buffOffInfanterie = buffOffInfanterie * 1.05;
		if (offBibliothek >= 7) buffOffInfanterie = buffOffInfanterie * 1.05;
		if (offBibliothek >= 3) buffOffArtillerie = buffOffArtillerie * 1.05;
		if (offBibliothek >= 8) buffOffArtillerie = buffOffArtillerie * 1.05;
        if (offBibliothek >= 3) buffOffKavallerie = buffOffKavallerie * 1.05;
		if (offBibliothek >= 9) buffOffKavallerie = buffOffKavallerie * 1.05;
		
		// Bibliothek Verteidiger:
		var defBibliothek = Number($scope.defBibliothek);

		var buffDefInfanterie = defFaktor;
		var buffDefArtillerie = defFaktor;
		var buffDefKavallerie = defFaktor;
		
		if (defBibliothek >= 3)  buffDefInfanterie = buffDefInfanterie * 1.05;
		if (defBibliothek >= 4)  buffDefInfanterie = buffDefInfanterie * 1.05;
		if (defBibliothek >= 10) buffDefInfanterie = buffDefInfanterie * 1.05;
		
		if (defBibliothek >= 3)  buffDefArtillerie = buffDefArtillerie * 1.05;
		if (defBibliothek >= 6)  buffDefArtillerie = buffDefArtillerie * 1.05;
		if (defBibliothek >= 10) buffDefArtillerie = buffDefArtillerie * 1.05;
		
		if (defBibliothek >= 3)  buffDefKavallerie = buffDefKavallerie * 1.05;
		if (defBibliothek >= 6)  buffDefKavallerie = buffDefKavallerie * 1.05;
		if (defBibliothek >= 10) buffDefKavallerie = buffDefKavallerie * 1.05;
        
        for (var i = 0;; i++) {
        
        	// Kampfstärken berechnen.
        	var sm1 = i == 0 ? $scope.snapshot0 : $scope.snapshot[i - 1];
        	var s = {};

			s.uhrzeit = new Date(sm1.uhrzeit);
			s.uhrzeit.setMinutes(s.uhrzeit.getMinutes() + 10);
			
	        s.offGegenInfanterie =            Math.round(buffOffInfanterie * o[0][0]) * sm1.offSpeertraeger + Math.round(buffOffInfanterie * o[1][0]) * sm1.offSchwertkaempfer + Math.round(buffOffInfanterie * o[2][0]) * sm1.offBerserker + Math.round(buffOffArtillerie * o[3][0]) * sm1.offBogenschuetze + Math.round(buffOffArtillerie * o[4][0]) * sm1.offArmbrustschuetze + Math.round(buffOffArtillerie * o[5][0]) * sm1.offNordischerBogenschuetze + Math.round(buffOffKavallerie * o[6][0]) * sm1.offPanzerreiter + Math.round(buffOffKavallerie * o[7][0]) * sm1.offLanzenreiter + Math.round(buffOffKavallerie * o[8][0]) * sm1.offAxtreiter;
	        s.offGegenArtillerie =            Math.round(buffOffInfanterie * o[0][1]) * sm1.offSpeertraeger + Math.round(buffOffInfanterie * o[1][1]) * sm1.offSchwertkaempfer + Math.round(buffOffInfanterie * o[2][1]) * sm1.offBerserker + Math.round(buffOffArtillerie * o[3][1]) * sm1.offBogenschuetze + Math.round(buffOffArtillerie * o[4][1]) * sm1.offArmbrustschuetze + Math.round(buffOffArtillerie * o[5][1]) * sm1.offNordischerBogenschuetze + Math.round(buffOffKavallerie * o[6][1]) * sm1.offPanzerreiter + Math.round(buffOffKavallerie * o[7][1]) * sm1.offLanzenreiter + Math.round(buffOffKavallerie * o[8][1]) * sm1.offAxtreiter;
	        s.offGegenKavallerie =            Math.round(buffOffInfanterie * o[0][2]) * sm1.offSpeertraeger + Math.round(buffOffInfanterie * o[1][2]) * sm1.offSchwertkaempfer + Math.round(buffOffInfanterie * o[2][2]) * sm1.offBerserker + Math.round(buffOffArtillerie * o[3][2]) * sm1.offBogenschuetze + Math.round(buffOffArtillerie * o[4][2]) * sm1.offArmbrustschuetze + Math.round(buffOffArtillerie * o[5][2]) * sm1.offNordischerBogenschuetze + Math.round(buffOffKavallerie * o[6][2]) * sm1.offPanzerreiter + Math.round(buffOffKavallerie * o[7][2]) * sm1.offLanzenreiter + Math.round(buffOffKavallerie * o[8][2]) * sm1.offAxtreiter;
	        
	        s.defGegenInfanterie = defBonus + Math.round(buffDefInfanterie * d[0][0]) * sm1.defSpeertraeger + Math.round(buffDefInfanterie * d[1][0]) * sm1.defSchwertkaempfer + Math.round(buffDefInfanterie * d[2][0]) * sm1.defBerserker + Math.round(buffDefArtillerie * d[3][0]) * sm1.defBogenschuetze + Math.round(buffDefArtillerie * d[4][0]) * sm1.defArmbrustschuetze + Math.round(buffDefArtillerie * d[5][0]) * sm1.defNordischerBogenschuetze + Math.round(buffDefKavallerie * d[6][0]) * sm1.defPanzerreiter + Math.round(buffDefKavallerie * d[7][0]) * sm1.defLanzenreiter + Math.round(buffDefKavallerie * d[8][0]) * sm1.defAxtreiter;
	        s.defGegenArtillerie = defBonus + Math.round(buffDefInfanterie * d[0][1]) * sm1.defSpeertraeger + Math.round(buffDefInfanterie * d[1][1]) * sm1.defSchwertkaempfer + Math.round(buffDefInfanterie * d[2][1]) * sm1.defBerserker + Math.round(buffDefArtillerie * d[3][1]) * sm1.defBogenschuetze + Math.round(buffDefArtillerie * d[4][1]) * sm1.defArmbrustschuetze + Math.round(buffDefArtillerie * d[5][1]) * sm1.defNordischerBogenschuetze + Math.round(buffDefKavallerie * d[6][1]) * sm1.defPanzerreiter + Math.round(buffDefKavallerie * d[7][1]) * sm1.defLanzenreiter + Math.round(buffDefKavallerie * d[8][1]) * sm1.defAxtreiter;
	        s.defGegenKavallerie = defBonus + Math.round(buffDefInfanterie * d[0][2]) * sm1.defSpeertraeger + Math.round(buffDefInfanterie * d[1][2]) * sm1.defSchwertkaempfer + Math.round(buffDefInfanterie * d[2][2]) * sm1.defBerserker + Math.round(buffDefArtillerie * d[3][2]) * sm1.defBogenschuetze + Math.round(buffDefArtillerie * d[4][2]) * sm1.defArmbrustschuetze + Math.round(buffDefArtillerie * d[5][2]) * sm1.defNordischerBogenschuetze + Math.round(buffDefKavallerie * d[6][2]) * sm1.defPanzerreiter + Math.round(buffDefKavallerie * d[7][2]) * sm1.defLanzenreiter + Math.round(buffDefKavallerie * d[8][2]) * sm1.defAxtreiter;

//			if (m < 7 * 60 || m >= 23 * 60) {
			if (s.uhrzeit.getHours() < 7 || s.uhrzeit.getHours() >= 23) {
				s.nachtmodus = true;
		        s.defGegenInfanterie *= 2;
		        s.defGegenArtillerie *= 2;
		        s.defGegenKavallerie *= 2;
			} else {
				s.nachtmodus = false;
			}
			
	//        var x = 1 - 0.5 * $scope.defGegenInfanterie / $scope.offGegenInfanterie;
	//        if (x < 0.5) x = 0.5;
	//        $scope.offSpeertraeger = Math.round($scope.offSpeertraeger * x);

			var f;
			if (
				sm1.offSpeertraeger + sm1.offSchwertkaempfer + sm1.offBerserker + sm1.offBogenschuetze + sm1.offArmbrustschuetze + sm1.offNordischerBogenschuetze + sm1.offPanzerreiter + sm1.offLanzenreiter + sm1.offAxtreiter <= 100
				||
				sm1.defSpeertraeger + sm1.defSchwertkaempfer + sm1.defBerserker + sm1.defBogenschuetze + sm1.defArmbrustschuetze + sm1.defNordischerBogenschuetze + sm1.defPanzerreiter + sm1.defLanzenreiter + sm1.defAxtreiter <= 100
			) {
				f = endkampf;
			} else {
				f = kampf;
			}
			
			// Überlebende berechnen.
			s.offSpeertraeger            = f(s.defGegenInfanterie, s.offGegenInfanterie, sm1.offSpeertraeger);
			s.offSchwertkaempfer         = f(s.defGegenInfanterie, s.offGegenInfanterie, sm1.offSchwertkaempfer);
			s.offBerserker               = f(s.defGegenInfanterie, s.offGegenInfanterie, sm1.offBerserker);
			s.offBogenschuetze           = f(s.defGegenArtillerie, s.offGegenArtillerie, sm1.offBogenschuetze);
			s.offArmbrustschuetze        = f(s.defGegenArtillerie, s.offGegenArtillerie, sm1.offArmbrustschuetze);
			s.offNordischerBogenschuetze = f(s.defGegenArtillerie, s.offGegenArtillerie, sm1.offNordischerBogenschuetze);
			s.offPanzerreiter            = f(s.defGegenKavallerie, s.offGegenKavallerie, sm1.offPanzerreiter);
			s.offLanzenreiter            = f(s.defGegenKavallerie, s.offGegenKavallerie, sm1.offLanzenreiter);
			s.offAxtreiter               = f(s.defGegenKavallerie, s.offGegenKavallerie, sm1.offAxtreiter);
			
			s.defSpeertraeger            = f(s.offGegenInfanterie, s.defGegenInfanterie, sm1.defSpeertraeger);
			s.defSchwertkaempfer         = f(s.offGegenInfanterie, s.defGegenInfanterie, sm1.defSchwertkaempfer);
			s.defBerserker               = f(s.offGegenInfanterie, s.defGegenInfanterie, sm1.defBerserker);
			s.defBogenschuetze           = f(s.offGegenArtillerie, s.defGegenArtillerie, sm1.defBogenschuetze);
			s.defArmbrustschuetze        = f(s.offGegenArtillerie, s.defGegenArtillerie, sm1.defArmbrustschuetze);
			s.defNordischerBogenschuetze = f(s.offGegenArtillerie, s.defGegenArtillerie, sm1.defNordischerBogenschuetze);
			s.defPanzerreiter            = f(s.offGegenKavallerie, s.defGegenKavallerie, sm1.defPanzerreiter);
			s.defLanzenreiter            = f(s.offGegenKavallerie, s.defGegenKavallerie, sm1.defLanzenreiter);
			s.defAxtreiter               = f(s.offGegenKavallerie, s.defGegenKavallerie, sm1.defAxtreiter);
			
        	$scope.snapshot[i] = s;
        	
        	if (f == endkampf) break;
		}
    };
});
