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
					hex : '#' + self.imageData['data'][i].toString(16) + self.imageData['data'][i+1].toString(16) + self.imageData['data'][i+2].toString(16)

				}

			}

		}

	}

	var mediocris = new imageCanvas('assets/images/sample-image1.jpg');
		mediocris.createCanvas();

})();