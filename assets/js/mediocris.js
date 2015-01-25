;(function() {

	'use strict';

	var imageCanvas = function(src) {

		var self = this,
			mediocris,
			context,
			mImage = new Image();
		
		mImage.src = src;

		self.createCanvas = function() {

			var canvas = document.createElement('canvas');
				canvas.id = 'mediocris';
				canvas.style.display = 'none';

			document.body.appendChild(canvas);

			mediocris = document.getElementById('mediocris');
			context = canvas.getContext('2d');
		

			mImage.onload = self.imageDraw;

		}

		self.imageDraw = function() {

			mediocris.height = mImage.height;
			mediocris.width = mImage.width;

			context.drawImage(mImage, 0, 0);

			self.getImageData();

		}

		self.getImageData = function() {

			self.imageData = context.getImageData(0, 0, mediocris.width, mediocris.height);
			self.imageValues = {};
			self.blocks = {};

			for(var i = 0; i < Math.sqrt((mediocris.width * mediocris.height), 16) + 100; i ++) {

				self.blocks[i] = [];

			}

			for(var i = 0, c = 0; i < self.imageData['data'].length; i += 4, c++) {

				var	y = Math.floor(c / mediocris.width),
					x = (c - (mediocris.width * y)) + 1;

				var pixel = self.imageValues[x+' '+(y + 1)] = {

					rgb: [self.imageData['data'][i], self.imageData['data'][i+1], self.imageData['data'][i+2]],
					hex : '#' + self.imageData['data'][i].toString(16) + self.imageData['data'][i+1].toString(16) + self.imageData['data'][i+2].toString(16),
					xyz : self.toXYZ(self.imageData['data'][i], self.imageData['data'][i+1], self.imageData['data'][i+2]),
					lab : self.toLAB(self.toXYZ(self.imageData['data'][i], self.imageData['data'][i+1], self.imageData['data'][i+2])),
					x : x,
					y: (y + 1)

				}

				self.blocks[self.deriveBlock(pixel['x'], pixel['y'] - 1)].push(pixel);

			}

			self.blockCompare(self.blocks[80]);

		}

		self.deriveBlock = function(x, y) {

			var xCell = Math.ceil(x /16);
			var yCell = Math.floor(y /16);

			return ((Math.ceil(mediocris.width / 16) * yCell) + xCell);

		}

		self.blockCompare = function(block) {

			var lowest = 100000,
				dominant;

			for(var i = 0; i < block.length; i++) {

				var pixel = block[i];

				for (var c = 0; c < block.length; c++) {

					var compare = block[c];

					if(pixel === compare) continue;
					if(pixel['x'] > compare['x']) continue;

					if(self.eDetlta(pixel['lab'], compare['lab']) < lowest) {

						lowest = self.eDetlta(pixel['lab'], compare['lab']);
						dominant = pixel;

					}

				}

			}

			document.body.style.background = dominant['hex'];

		}

		self.toXYZ = function(r, g, b) {

			r = self.XYZpivot(r / 255);
			g = self.XYZpivot(g / 255);
			b = self.XYZpivot(b /255);

			var x = r * 0.4124 + g * 0.3576 + b * 0.1805,
				y = r * 0.2126 + g * 0.7152 + b * 0.0722,
				z = r * 0.0193 + g * 0.1192 + b * 0.9505;

			return [x, y, z];

		}

		self.XYZpivot = function(n) {

			return (n > 0.04045 ? Math.pow(((n + 0.055) / 1.055), 2.4) : n / 12.92) * 100;

		}

		self.toLAB = function(xyz) {

			var x = xyz[0] / 95.047,
				y = xyz[1] / 100.000,
				z = xyz[2] / 108.883;

			x = self.LABpivot(x);
			y = self.LABpivot(y);
			z = self.LABpivot(z);

			var cieL = (116 * y) - 16,
				cieA = 500 * (x - y),
				cieB = 200 * (y - z);

			return [cieL, cieA, cieB];

		}

		self.LABpivot = function(n) {

			return (n > 0.008856 ? Math.pow(n, (1/3)) : 7.787 * n + (16/116));

		}

		self.eDetlta = function(a, b) {

			return Math.sqrt(Math.pow((a[0] - b[0]), 2) + Math.pow((a[1] - b[1]), 2) + Math.pow((a[2] - b[2]), 2));

		}

	}

	var mediocris = new imageCanvas('assets/images/sample-image1.jpg');
		mediocris.createCanvas();

})();