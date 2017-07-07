var fonts = [];
var font_idx = 0;
var menu_idx = 0;

setupFont("NeoSmall", "Small", 6);
setupFont("NeoMedium", "Medium", 5);
setupFont("NeoLarge", "Large", 4);

function setupFont(font, name, lines) {
	var tmp = {};
	tmp.font = font;
	tmp.name = name;
	tmp.lines = lines;
	fonts.push(tmp);
}

var file = document.getElementById('file_1');
var menu = document.getElementById("menu_choose_font");

showFile();

function showFile() {
	file.style.display = 'block';
	menu.style.display = 'none';
	setupFileBindings();
	file.focus();
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
		showFile();
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
		showFile();
		return false;
	});
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