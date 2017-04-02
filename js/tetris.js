window.addEventListener('load', function () {

	Array.prototype.each = function(fn) {
		var result = [];
		for (var i = 0; i < this.length; i ++) {
			result[i] = fn(this[i], i);
		}
		return result;
	};

	var ctx;
	var blocks = [
					[
						[1,1],
						[0,1],
						[0,1]
					],
					[
						[1,1],
						[1,0],
						[1,0]
					],
					[
						[1,1],
						[1,1]
					],
					[
						[1,0],
						[1,1],
						[1,0]
					],
					[
						[1,0],
						[1,1],
						[0,1]
					],
					[
						[0,1],
						[1,1],
						[1,0]
					],
					[
						[1],
						[1],
						[1],
						[1]
					]
					];

	var block = blocks[Math.floor(Math.random() * blocks.length)];
	var posx = 4, posy = 0;
	// var map, mapWidth = 10, mapHeight = 20;
	var mapWidth = 10, mapHeight = 20;

	var map = new Array(mapHeight).each(function() {
					return new Array(mapWidth).each(function() { return 0; });
			});

	var elmTarget = document.getElementById('target');
	var ctx = elmTarget.getContext('2d');

	map = [];
	for (var y = 0; y < mapHeight; y++) {
		map[y] = [];
		for (var x = 0; x < mapWidth; x++) {
			map[y][x] = 0;
		}
	}

	ctx.fillStyle = 'rgb(255, 0, 0)';

	setInterval(paint, 200);

	document.getElementById('paint').onclick = paint();

	document.getElementById('clean').onclick = function(){
		ctx.clearRect(0, 0, 200, 400);
	}

	document.onkeydown = function (e){
		key(e.keyCode);
	};


	function paint(){
		ctx.clearRect(0, 0, 200, 400);
		paintMatrix(map, 0, 0, 'rgb(128, 128, 128)');
		paintMatrix(block, posx, posy, 'rgb(255, 0, 0)');

		if (check(map, block, posx, posy + 1)) {
			posy = posy + 1;
		}
		else {
			mergeMatrix(map, block, posx, posy);
			clearRows(map);
			posx = 4; posy = 0;
			block = blocks[Math.floor(Math.random() * blocks.length)];
		}
	}

	function paintMatrix(matrix, offsetx, offsety, color) {
		ctx.fillStyle = color;
		for (var y = 0; y < matrix.length; y ++) {
			for (var x = 0; x < matrix[y].length; x ++) {
				if (matrix[y][x]) {
					ctx.fillRect((x + offsetx) * 20, (y + offsety) * 20, 20, 20);
				}
			}
		}
    }

	function check(map, block, offsetx, offsety) {
		if (offsetx < 0 || offsety < 0 ||
			mapHeight < offsety + block.length ||
			mapWidth  < offsetx + block[0].length) {
				return false;
		}
		for (var y = 0; y < block.length; y ++) {
			for (var x = 0; x < block[y].length; x ++) {
				if (block[y][x] && map[y + offsety][x + offsetx]) { 
					return false;
				}
			}
		}
		return true;
	}

	function mergeMatrix(map, block, offsetx, offsety) {
		for (var y = 0; y < mapHeight; y ++) {
			for (var x = 0; x < mapWidth; x ++) {
				if (block[y - offsety] && block[y - offsety][x - offsetx]) {
					map[y][x]++;
				}
			}
		}
	}

	function key(keyCode) {
		switch (keyCode) {
			 case 38:
				if (!check(map, rotate(block), posx, posy)) {
					return;
				}
				block = rotate(block);
				break;
			case 39:
				if (!check(map, block, posx + 1, posy)) {
					return;
				}
				posx = posx + 1;
				break;
			case 37:
				if (!check(map, block, posx - 1, posy)) {
					return;
				}
				posx = posx - 1;
				break;
			case 40:
				var y = posy;
				while (check(map, block, posx, y)) { y++; }
				posy = y - 1;
				break;
				default:
				return;
		}
		ctx.clearRect(0, 0, 200, 400);
		paintMatrix(block, posx, posy, 'rgb(255, 0, 0)');
		paintMatrix(map, 0, 0, 'rgb(128, 128, 128)');
	}
	function rotate(block) {
		var rotated = [];
		for (var x = 0; x < block[0].length; x ++) {
			rotated[x] = [];
			for (var y = 0; y < block.length; y ++) {
				rotated[x][block.length - y - 1] = block[y][x];
			}
		}
		return rotated;
	}
	function clearRows(map) {
		for (var y = 0; y < mapHeight; y ++) {
			var full = true;
			for (var x = 0; x < mapWidth; x ++) {
				if (!map[y][x]) {
					full = false;
				}
			}
			if (full) {
				map.splice(y, 1);
				var newRow = [];
				for (var i = 0; i < mapWidth; i ++) {
					newRow[i] = 0;
				}
				map.unshift(newRow);
			}
		}
	}
}, false);