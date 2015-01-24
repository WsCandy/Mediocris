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

			self.imageData = context.getImageData(0, 0, mediocris.height, mediocris.width);

			for(var i = 0; i < self.imageData['data'].length; i +=4) {

				var r = self.imageData['data'][i],
					g = self.imageData['data'][i+1],
					b = self.imageData['data'][i+2];

			}

		}

	}

	var mediocris = new imageCanvas('assets/images/sample-image1.jpg');
		mediocris.createCanvas();

})();