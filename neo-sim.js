var fonts = [];
var font_idx = getCookie("font_idx", 0);
var menu_idx = 0;
var file_idx = 0;
var file = document.getElementById('file_1');
var menu = document.getElementById("menu_choose_font");

setupFont("NeoSmall", "Small", 6);
setupFont("NeoMedium", "Medium", 5);
setupFont("NeoLarge", "Large", 4);
setFontByIndex(font_idx);

showSplashDelay("#splash_screen", 2000, function(){ showFileByIndex(file_idx, true)});


function setupFont(font, name, lines) {
	var tmp = {};
	tmp.font = font;
	tmp.name = name;
	tmp.lines = lines;
	fonts.push(tmp);
}

function showFileByIndex(fidx /* unused for now */, with_transition) {
	if(with_transition) {
		showSplashDelay("#splash_file_1", 1500, function(){ showFileByIndex(fidx, false)});
	} else {
		file.style.display = 'block';
		menu.style.display = 'none';
		setupFileBindings();
		file.focus();
	}
}

function setupFileBindings() {
	Mousetrap.reset();
	Mousetrap.bindGlobal('command+alt+ctrl+f', function(e) {
		console.log('Change Font');
		showFontMenu();
		return false;
	});
}

function bounded(idx, min, max) {
	var min = 0;
	var max = fonts.length-1;
	if (idx < min) idx = min;
	if (idx > max) idx = max;
	return idx;
}

function setFontByIndex(idx) {
	font_idx = bounded(idx);
	setCookie("font_idx", font_idx);
	
	var font = fonts[font_idx];
	file.style.fontFamily = font.font;
	file.className = font.name;
	file.rows = font.lines;
}

function showFontMenu() {
	file.style.display = 'none';
	menu.style.display = 'block';
	drawFontMenu();
	
	Mousetrap.reset();
	Mousetrap.bindGlobal('esc', function(e) {
		showFileByIndex(file_idx, false);
		return false;
	});
	Mousetrap.bindGlobal('down', function(e) {
		if (++menu_idx >= fonts.length) menu_idx = fonts.length-1;
		drawFontMenu();
		return false;
	});
	Mousetrap.bindGlobal('up', function(e) {
		if (--menu_idx < 0) menu_idx = 0;
		drawFontMenu();
		return false;
	});
	Mousetrap.bindGlobal('enter', function(e) {
		setFontByIndex(menu_idx);
		showFileByIndex(file_idx, false);
		return false;
	});
}

// Show the contents of a selector in the menu textarea
// Call callback after delay, which presumably is the next "show" call
function showSplashDelay(sel, delay, callback) {
	var s = document.querySelector(sel);
	if (s) {
		file.style.display = 'none';
		menu.style.display = 'block';		
		menu.value = s.innerHTML;
		setTimeout(callback, delay);
	} else {
	  callback();
	}
}

function drawFontMenu() {
	var idx = 0;
	menu.value = "";
	menu.value += "  Select a font, then press enter.\n";
	for (var i = 0; i < fonts.length; i++) {
		menu.value += ' ' + ((i == menu_idx) ? '|' : ' ') + '-' + ((i == font_idx) ? '+' : ' ');
		menu.value += fonts[i].name + " (" + fonts[i].lines + " lines)\n";
	}
}

function setCookie(cname, cvalue) {
	setCookieExpires(cname, cvalue, 20*365); // 20 years
}

function setCookieExpires(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname, dvalue) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return dvalue;
}