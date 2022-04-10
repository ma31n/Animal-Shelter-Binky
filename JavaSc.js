$(function () {

	history.scrollRestoration = "manual";

	$(window).on("beforeunload", function () {
		$(window).scrollTop(0);
	});

	//--------------------------------------------------------------------POPOVER-----------------------------------------------------
	$('[data-bs-toggle="popover"]').popover({
		content: function () {
			return $(".loginpopover").clone();
		},
		html: true,
	});

	$("[data-bs-toggle='popover']").on("shown.bs.popover", function () {
		var username = sessionStorage.getItem("username");
		var password = sessionStorage.getItem("password");

		if (username == null) {
			username = password = "";
		}

		$(".popover .username").val(username);
		$(".popover .password").val(password);
	});
	//--------------------------------------------------------------------POPOVER-----------------------------------------------------


	//--------------------------------------------------------------------POSTAVLJANJE EVENTOVA-----------------------------------------------------
	$(".naglavnustr").on("click", pocetnaStranica);
	$("body").on("click", ".loginbutton", logiranje);
	$("#dodajforma").on("submit", dodajNovuZivotinju);
	$(".resetobjbotun").on("click", resetirajObjekte);

	$(".pasiprikaz").on("click", pasiPrikaz);
	$(".mackeprikaz").on("click", mackePrikaz);
	$(".papigeprikaz").on("click", papigePrikaz);
	$(".kuniciprikaz").on("click", kuniciPrikaz);
	$(".ostaloprikaz").on("click", ostaloPrikaz);

	$(".navbarlogo").on("click", function () { $(window).scrollTop(0); })

	$(".filteri").on("change", "input", prikazZivotinja);
	var wait;
	$(".imesearch").on("input", function () {
		clearTimeout(wait);
		wait = setTimeout(prikazZivotinja, 500);
	});

	$("#godineRange").on("input", rangeGodine);

	$(".centered").hover(
		function () {
			$(".hover11").toggleClass("active");
		},
		function () {
			$(".hover11").toggleClass("active");
		}
	);
	$(".centered").on("click", function () {
		$(window).scrollTop(
			$(".malakartica").position().top - $(".malakartica").height()
		);
	});
	//--------------------------------------------------------------------POSTAVLJANJE EVENTOVA-----------------------------------------------------



	var vrstazivotinje; //VARIJABLA ZA ZNAT VRSTU ZIVOTINJA KOJU TREBA POKAZAT
	var dodanezivotinje = []; //NIZ KOJI SADRZI SVE DODANE ZIVOTINJE

	dodanezivotinje = JSON.parse(localStorage.getItem("lista")); //UZIMA SPREMLJENE OBJEKTE
	if (dodanezivotinje == null) { //AKO NE POSTOJE, NIZ JE PRAZAN
		dodanezivotinje = [];
	}
	if (dodanezivotinje.length > 0) {
		for (var i = 0; i < dodanezivotinje.length; i++) { //SPREMLJENI OBJEKTI SE STAVLJAJU U NIZ ZIVOTINJE
			zivotinje.push(dodanezivotinje[i]);
		}
		console.log(zivotinje);
	}

	var priklistazivotinja = []; //LISTA KOJA SADRZI TRENUTNO PRIKAZANE ZIVOTINJE

	//-----------------------------------------------------------SIDERBAR JS-----------------------------------------------------
	let sidebar = document.querySelector(".sidebarToggle");
	sidebarToggle.addEventListener("click", toggled);
	toggled();

	function toggled() {
		document.querySelector("body").classList.toggle("active");
		document.getElementById("sidebarToggle").classList.toggle("active");
	}
	//-----------------------------------------------------------SIDERBAR JS-----------------------------------------------------


	$("#datepicker").datepicker({ minDate: 0, maxDate: +6 }); //DATEPICKER, POSTAVLJEN NA SAMO 7 DANA UNAPRIJED


	function pocetnaStranica() { //POVRATAK NA GLAVNU

		window.scrollTo(0, 0);

		if ($(".sidebar").width() < 800) {
			toggled();
		}

		$.when($(".prikzivotinja,.dodavanjeobjekata").fadeOut()).then(function () {
			$.when($(".glavnastranica").fadeIn()).then(function () { scrollFunction(); });
		});
	}

	function pasiPrikaz() {
		//STAVI VRSTU ZIVOTINJE NA PAS I ZOVI FUNKCIJU ZA PRIKAZ
		vrstazivotinje = "pas";
		resetirajFiltere();
		prikazZivotinja();
	}

	function mackePrikaz() {
		//STAVI VRSTU ZIVOTINJE NA MACKA I ZOVI FUNKCIJU ZA PRIKAZ
		vrstazivotinje = "macka";
		resetirajFiltere();
		prikazZivotinja();
	}

	function papigePrikaz() {
		//STAVI VRSTU ZIVOTINJE NA PAPIGA I ZOVI FUNKCIJU ZA PRIKAZ
		vrstazivotinje = "papiga";
		resetirajFiltere();
		prikazZivotinja();
	}

	function kuniciPrikaz() {
		//STAVI VRSTU ZIVOTINJE NA KUNIC I ZOVI FUNKCIJU ZA PRIKAZ
		vrstazivotinje = "kunic";
		resetirajFiltere();
		prikazZivotinja();
	}

	function ostaloPrikaz() {
		//STAVI VRSTU ZIVOTINJE NA OSTALO I ZOVI FUNKCIJU ZA PRIKAZ
		vrstazivotinje = "ostalo";
		resetirajFiltere();
		prikazZivotinja();
	}

	//--------------------------LOGIRANJE----------------------------
	function logiranje() {
		var username = $(".popover .username").val();
		var password = $(".popover .password").val();
		if (username == "admin" && password == "admin") { //PROVJERAVA VRIJEDNOSTI IZ INPUTA, SPREMA U SESSIONSTORAGE
			$('[data-bs-toggle="popover"]').popover("hide");
			$.when(
				$(".glavnastranica,.prikzivotinja,.dodavanjeobjekata").fadeOut()
			).then(function () {
				$(".dodavanjeobjekata").fadeIn();
			});

			sessionStorage.setItem("username", username);
			sessionStorage.setItem("password", password);
		}
	}
	//--------------------------LOGIRANJE----------------------------

	function rangeGodine() {
		var temp = $("#godineRange").val().toString(); //PRIKAZIVANJE GODINA KOD DODAVANJA OBJEKATA
		$(".godinelabel span").html(temp);
	}

	//-----------------------------------------------DODAVANJE ZIVOTINJA--------------------------------------------
	function dodajNovuZivotinju() {
		event.preventDefault(); //ZAUSTAVLJA DEFAULT PONASANJE FORME
		var ziv = $(".zivkategorija").val();
		var imeziv = $(".imeziv").val();
		var vrstaziv = $(".vrstaziv").val();
		var godineziv = $("#godineRange").val().toString();
		var spolziv = $("input[name='Spolovi2']:checked").attr("id");
		var velicinaziv = $(".velicinaselect").val();
		var aktivnostziv = $(".aktivnostselect").val();
		var cijepziv = $("input[name='Cijepljen']:checked").attr("id");
		var kastziv = $("input[name='Kastriran']:checked").attr("id");
		var cipziv = $("input[name='Cipiran']:checked").attr("id");
		var opisziv = $("textarea").val();
		var bojaziv = $(".bojaziv").val();
		//SLIKAZIV DEFINIRANA U imgtobase64.js
		zivotinje.push(
			new NovaZiv(
				ziv,
				vrstaziv,
				imeziv,
				spolziv,
				godineziv,
				velicinaziv,
				bojaziv,
				aktivnostziv,
				cijepziv,
				kastziv,
				cipziv,
				opisziv,
				slikaziv
			)
		);
		dodanezivotinje.push(
			new NovaZiv(
				ziv,
				vrstaziv,
				imeziv,
				spolziv,
				godineziv,
				velicinaziv,
				bojaziv,
				aktivnostziv,
				cijepziv,
				kastziv,
				cipziv,
				opisziv,
				slikaziv
			)
		);
		localStorage.setItem("lista", JSON.stringify(dodanezivotinje)); //SPREMA LISTU DODANIH ZIVOTINJA U LOCALSTORAGE
		window.alert("Animal added!");
		$(".dodavanjeobjekata form").trigger("reset"); //RESETIRA VRIJEDNOSTI U FORMI
		$(".godinelabel span").html(1);
	}

	function resetirajObjekte() { //BRISE SVE DODANE OBJEKTE
		localStorage.clear();
		window.location.reload(true);
	}

	//-------------------------------------------PRIKAZ ZIVOTINJA----------------------------------------------------
	function prikazZivotinja() { 
		window.scrollTo(0, 0);

		if ($(window).width() < 800) { //AKO JE EKRAN MANJI, SVAKI PUT KAD SE PRITISNE NA GUMB, SIDEBAR SE ZATVARA
			toggled();
		}
		$(".glavnastranica,.dodavanjeobjekata").fadeOut(); //DRUGE STRANICE FADEOUT

		$.when($(".prikzivotinja, .footer").fadeOut()).then(function () {
			scrollFunction();
			$(".ispisobjekata").empty(); //IZBRISE POSTOJECE KARTICE
			temp = -1; //ZA ZNAT KOLIKO KARTICA POSTOJI
			priklistazivotinja = []; //TRENUTNE KARTICE
			var input = $(".form-control").val(); //VALUE IZ INPUTA
			input = input.toLowerCase(); //VALUE U LOWERCASE
			var odabranispol = ""; //CHECKBOXED SPOLOVI
			var odabranavel = ""; //CHECKBOXED VELICINE
			var odabrana_akt = ""; //CHECKBOXED AKTIVNOST

			$("input[name='spolovi']:checked").each(function () {
				//PETLJA ZA UZIMAT CHECKBOXED SPOLOVE
				odabranispol += this.value;
			});

			$("input[name='velicina']:checked").each(function () {
				//PETLJA ZA UZIMAT CHECKBOXED VELICINE
				odabranavel += this.value;
			});

			$("input[name='aktivnost']:checked").each(function () {
				//PETLJA ZA UZIMAT CHECKBOXED AKTIVNOST
				odabrana_akt += this.value;
			});

			for (var i = 0; i < zivotinje.length; i++) {
				var imecheck = zivotinje[i].ime.toLowerCase(); //STAVLJA IME U LOWERCASE ZA PROVJERU
				var vrstacheck = zivotinje[i].vrsta.toLowerCase(); //VRSTA ZIVOTINJE U LOWERCASE ZA PROVJERU
				var mingodine = $("#min").val(); //VALUE MIN GODINA
				var maxgodine = $("#max").val(); //VALUE MAX GODINA

				if ( //PROVJERE FILTERA
					zivotinje[i].zivotinja == vrstazivotinje &&
					(imecheck.startsWith(input) || vrstacheck.startsWith(input)) &&
					Number(zivotinje[i].godine) >= mingodine &&
					Number(zivotinje[i].godine) <= maxgodine &&
					odabranispol.includes(zivotinje[i].spol) &&
					odabranavel.includes(zivotinje[i].velicina) &&
					odabrana_akt.includes(zivotinje[i].aktivnost)
				) {
					temp++;
					priklistazivotinja.push(zivotinje[i]);
					//SLAGANJE KARTICE
					$(".ispisobjekata").append(
						"<div class='card'><img src='" +
						zivotinje[i].slika +
						"' class='card-img-top'><div class='card-body'><h2 class='card-title'></h2><p class='card-text'></p></div>"
					);
					$(".card:eq(" + temp + ") .card-title").append(zivotinje[i].ime);
					$(".card:eq(" + temp + ") .card-text")
						.append("<h5>" + zivotinje[i].vrsta + "</h5>")
						.append("<p>Gender: " + zivotinje[i].spol + "</p>")
						.append("<p>Age: " + zivotinje[i].godine + "</p>")
						.append("<p>Size: " + zivotinje[i].velicina + "</p>");
				}
			}
			$(".prikzivotinja, .footer").fadeIn();
			$(".card").on("click", povecajKarticu);
		});

	}
	//-------------------------------------------PRIKAZ ZIVOTINJA----------------------------------------------------

	//-----------------------------------------------PRIKAZ MODALA ZA KARTICE-------------------------------------------------------
	function povecajKarticu() {
		
		var index = $(this).index();
		$("#staticBackdrop").modal("show");
		$(".slika").empty();
		$(".opis p,h6").remove();
		$(".modal-title").text(priklistazivotinja[index].ime);
		$(".slika").append(
			"<img src='" +
			priklistazivotinja[index].slika +
			"' class='card-img-top slikaumodalu'>"
		);
		$(".opis")
			.append("<p>Color: " + priklistazivotinja[index].boja + "</p>")
			.append("<p>Activity: " + priklistazivotinja[index].aktivnost + "</p>")
			.append("<h6>" + priklistazivotinja[index].opis + "</h6>");

		$(".cijep").append("<p>" + priklistazivotinja[index].cijepljen + "</p>");
		$(".kas").append("<p>" + priklistazivotinja[index].kastriran + "</p>");
		$(".cip").append("<p>" + priklistazivotinja[index].cipiran + "</p>");
	}
	//-----------------------------------------------PRIKAZ MODALA ZA KARTICE-------------------------------------------------------

	function resetirajFiltere() { //RESETIRA FILTERE
		$("input:checkbox").prop("checked", true);
		$("#min").val(1);
		$("#max").val(20);
		$(".imesearch").val("");
	}

	//--------------------------------------------------CENTRIRANJE MODALA---------------------------------------------------------
	function alignModal() {
		var modalDialog = $(this).find(".modal-dialog");
		modalDialog.css(
			"margin-top",
			$(window).height() / 2 - $(".modal-dialog").height() / 2
		);
	}
	$(".modal").on("shown.bs.modal", alignModal);

	$(window).on("resize", function () {
		$(".modal:visible").each(alignModal);
	});
	//--------------------------------------------------CENTRIRANJE MODALA---------------------------------------------------------

	window.onscroll = function () { //AKTIVIRA FUNKCIJA NA SCROLL
		scrollFunction();
	};



	//-----------------------------------------MIJENJANJE NAVBARA I LOGO-----------------------------------------------------
	function scrollFunction() {
		if ($(".glavnastranica:visible").length == 0) {
			$(".navigationBar").css("background", "#5C4033");
		} else {
			if (
				document.body.scrollTop > $(window).height() / 3 ||
				document.documentElement.scrollTop > $(window).height() / 3
			) {
				$(".navigationBar").css("background", "#5C4033");
				$(".navbarlogo").fadeIn();
			} else {
				$(".navigationBar").css("background", "none");
				$(".navbarlogo").fadeOut();
			}
		}
	}

	scrollFunction();
	//-----------------------------------------MIJENJANJE NAVBARA I LOGO-----------------------------------------------------










	//-----------------------------------------POCETNA ANIMACIJA-----------------------------------------------------
	const glavna_animacija = gsap.timeline({ defaults: { ease: "power1.out" } });

	glavna_animacija.to(".tttext", { y: "0%", duration: 1, stagger: 0.25 });
	glavna_animacija.to(".slider", { y: "-100%", duration: 1.5, delay: 0.5 });
	glavna_animacija
		.to(".intro", { y: "-100%", duration: 1 }, "-=1")
		.then(function () {
			$("body").css("overflow-y", "visible");
			$(".intro,.slider").css("display", "none");
		});
	glavna_animacija.fromTo(
		".fa-bars",
		{ opacity: 0 },
		{ opacity: 1, duration: 1 }
	);
	glavna_animacija.fromTo(
		".fa-sign-in-alt",
		{ opacity: 0 },
		{ opacity: 1, duration: 1 },
		"-=1"
	);

	//-----------------------------------------POCETNA ANIMACIJA-----------------------------------------------------
});
