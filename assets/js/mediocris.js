;(function() {

	'use strict';

	var imageCanvas = function(src) {

		var self = this,
			mediocris,
			context,
			mImage = new Image(),
			dominant = [],
			height,
			width;
		
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

			height = Math.ceil(mediocris.height / 20),
			width = Math.ceil(mediocris.width / 20);

			context.drawImage(mImage, 0, 0);

			self.getImageData();

		}

		self.getImageData = function() {

			var accuracy = Math.round((mediocris.width / 10) / 4) * 4;

			self.imageData = context.getImageData(0, 0, mediocris.width, mediocris.height);
			self.imageValues = {};
			self.blocks = {};

			for(var i = 1; i < 401; i ++) {

				self.blocks[i] = [];

			}

			for(var i = 0, c = 0; i < self.imageData['data'].length; i += accuracy, c+=(accuracy / 4)) {

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

				self.blocks[self.deriveBlock(pixel['x'], pixel['y'])].push(pixel);

			}

			for (var i = 1; i < 401; i++) {

				self.blockCompare(self.blocks[i], (i - 1));
				
			}

			self.blockCompare(dominant, 'final');

		}

		self.deriveBlock = function(x, y) {

			var xCell = Math.ceil(x / width),
				yCell = Math.ceil(y / height);

			return ((yCell * 20) - 20) + xCell;

		}

		self.blockCompare = function(block, index) {

			var	blockDom,
				highest = 0;

			for(var i = 0; i < block.length; i++) {

				var pixel = block[i];
					pixel['count'] = 0;

				for (var c = 0; c < block.length; c++) {

					var compare = block[c];

					if(pixel === compare) continue;
					if(i < c) continue;


					if(self.eDetlta(pixel['lab'], compare['lab']) <= 14) {

						pixel['count'] +=1;

					}

				}

				if(pixel['count'] > highest) {

					highest = pixel['count'];
					blockDom = pixel;

				}

			}

			if(index == 'final') {

				document.body.style.background = 'rgb('+blockDom['rgb'][0]+', '+blockDom['rgb'][1]+', '+blockDom['rgb'][2]+')';
				mediocris.parentNode.removeChild(mediocris);

			} else {

				if(!blockDom) return;

				// var block = document.createElement('div');
				// 	block.style.background = 'rgb('+blockDom['rgb'][0]+', '+blockDom['rgb'][1]+', '+blockDom['rgb'][2]+')';
				// 	block.style.width = '5%';
				// 	block.style.float = 'left';
				// 	block.style.height = '5%';

				// var container = document.getElementById('blocks');
				// 	container.style.height = document.getElementById('medi').height;
				// 	container.style.width = document.getElementById('medi').width;

				// container.appendChild(block);

				dominant[index] = blockDom;
				
			}

		}

		self.toXYZ = function(r, g, b) {

			r = self.XYZpivot(r / 255);
			g = self.XYZpivot(g / 255);
			b = self.XYZpivot(b /255);

			var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805),
				y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722),
				z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

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

	var mediImg = document.getElementById('medi'),
		mediocris = new imageCanvas(mediImg.getAttribute('src'));
		mediocris.createCanvas();

})();