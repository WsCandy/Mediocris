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

			for(var i = 0, c = 0; i < self.imageData['data'].length; i +=4, c++) {

				var	y = Math.floor(c / mediocris.width),
					x = (c - (mediocris.width * y)) + 1;

				self.imageValues[x+' '+(y + 1)] = {

					rgb: [self.imageData['data'][i], self.imageData['data'][i+1], self.imageData['data'][i+2]],
					alpha : self.imageData['data'][i+3],
					hex : '#' + self.imageData['data'][i].toString(16) + self.imageData['data'][i+1].toString(16) + self.imageData['data'][i+2].toString(16),
					xyz : self.toXYZ(self.imageData['data'][i], self.imageData['data'][i+1], self.imageData['data'][i+2])

				}

			}

			console.log(self.imageValues['1 1']);

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

	}

	var mediocris = new imageCanvas('assets/images/sample-image1.jpg');
		mediocris.createCanvas();

})();