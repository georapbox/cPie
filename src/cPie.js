/**
* The MIT License (MIT)
* Copyright (c) 2014 George Raptis. All rights reserved.
*
* Permission is hereby granted, free of charge, to any person obtaining a
* copy of this software and associated documentation files (the "Software"),
* to deal in the Software without restriction, including without limitation
* the rights to use, copy, modify, merge, publish, distribute, sublicense,
* and/or sell copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
* DEALINGS IN THE SOFTWARE.
*
*/

/**
 * @app KineticJS Pie Chart Plugin 
 * @desc Generates a HTML5 Canvas Pie Chart
 * @author George Raptis - http://www.georap.gr/
*/
var cPie = (function (w, d, undef) {
	'use strict';

	/* ================================ */
    /*             HELPERS              */
    /* ================================ */
    /**
     * @desc merge objects
    */
    var extend = function() {
        for (var i = 1, l = arguments.length; i < l; i++) {
			for (var key in arguments[i]) {
	            if (arguments[i].hasOwnProperty(key)) {
	                arguments[0][key] = arguments[i][key];
	            }
		    }
		}
		return arguments[0];
	};

	return {
		/**
		 * @desc initialize plugin with default options				 
		*/
		init: function (args) {
			var stage = new Kinetic.Stage({
		 		container: args.container,
		    	width: args.width,
		    	height: args.height
		  	});
			
			/**
			 * $desc Default Options
			*/
			var defaults = {
				container: document.getElementById('container'),							// chart container
				width: 800,																	// chart containe width
				height: 600,																// chart container height
				background: '#ffffff',														// chart container background	
				borderColor: '#cccccc',														// chart container border color (leave empty for no border)
				events: true,																// true if mouse over and out events are desired
				title: 'Website visits (2014)',												// chart main title (leave balnk if not desirable eg: title: '')
				titleColor: '#787878',														// chart main title color
				titleFontFamily: 'Calibri',													// chart main title font family
				titleFontSize: 14,															// chart main title font size		
				pie: {																		// ***** PIE GROUP
					radius: 250,															// pie radius
					offsetX: 40,															// pie x offset
					strokeColor: '#ffffff',													// pie wedges border color
					strokeWidth: 1,															// pie wedges border width
					showPercentages: true,													// if true percentages will be visible inside pie wedges
					percentFontFamily: 'Calibri',											// percentages font family
					percentFontSize: 20,													// percentages font size	
					percentFontColor: '#ffffff'												// percentage font color
				},
				descArea: {																	// ***** DESCRIPTION AREA
					offsetX: 40,															// descArea x offset
					offsetY: 40,															// descArea y offset
					itemWidth: 27,															// descArea rectangle width
					itemHeight: 18,															// descArea rectangle height
					strokeColor: '#ffffff',													// descArea rectangle border color													
					strokeWidth: 1,															// descArea rectangle border width
					fontFamily: 'Calibri',													// descArea font family
					fontSize: 14,															// descArea font size		
					fontColor: '#787878'													// descArea font color
				},
				data: [																		// ***** DATA
					{ text: 'Organic search', percent: 24.3, color: '#DC3811' },
					{ text: 'Email Marketing', percent: 19, color: '#109617' },
					{ text: 'Social Media', percent: 10.4, color: '#3265CB' },
					{ text: 'Referrals', percent: 20.4, color: '#980098' },
					{ text: 'Advertisements', percent: 13.6, color: '#0098C5' },
					{ text: 'Direct navigation', percent: 12.3, color: '#FF9800' }
				]
			}
			args = extend({}, defaults, args);

			var layer = new Kinetic.Layer(),
				pie = new Kinetic.Group(),	
				descArea = new Kinetic.Group(),
				wedge, percentage, rect, text,
				wedgeAngle, 
				wedgeFill,
				wedgeRotation;

			
			/**
			 * @desc Creates background color and border color for container
			*/	
			if (args.background !== '' || args.borderColor !== '') {
				var bg = new Kinetic.Rect({
					x: 0,
					y: 0,
					width: stage.width(),
					height: stage.height(),
					fill: args.background,
					stroke: args.borderColor,
					strokeWidth: 2
				});

				layer.add(bg);		// add bg to layer
			}	
				

			/**
			 * @desc Creates the chart tile
			*/
			if (args.title !== '') {
				var title = new Kinetic.Text({
					x: stage.width(),
					y: stage.height(),
					text: args.title,
					fill: args.titleColor,
					fontFamily:	args.titleFontFamily,
					fontSize: args.titleFontSize
				});

				title.x(stage.width() - title.width() - 10);
				title.y(stage.height() - title.height() - 10);
				layer.add(title);
			}	
				

			/** 
			 * =====================================
			 * @desc BEGIN LOOPING THROUGH ALL DATA 
			 * =====================================
			*/
			for (var i = 0, len = args.data.length; i < len; i++) {
				wedgeAngle = Math.round((args.data[i].percent / 100) * 360);
				wedgeFill = args.data[i].color;

				if (i === 0) {
					wedgeRotation = 0;
				}else if (i > 0) {
					wedgeRotation = wedgeRotation + (args.data[i - 1].percent / 100) * 360;
				}

				/**
				 * @desc Creates the wedges
				*/
				wedge = new Kinetic.Wedge({
		        	x: args.pie.radius + args.pie.offsetX,
		        	y: stage.height() / 2,
		        	radius: args.pie.radius,
		        	angle: wedgeAngle,
		        	fill: wedgeFill,
		        	stroke: args.pie.strokeColor || wedgeFill,
		        	strokeWidth: args.pie.strokeWidth,
		        	rotation: wedgeRotation,
		        	name: 'wedge'
		      	});

		      	pie.add(wedge);

		      	/**
		      	 * @desc Creates the percentages inside wedges
		      	*/
		      	if (args.pie.showPercentages === true) {
			      	percentage = new Kinetic.Text({
			      		x: wedge.attrs.x,
			      		y: wedge.attrs.y,
			      		align: 'center',
			      		shadowOffsetX: 1,
			      		shadowOffsetY: 1,
			      		shadowBlur: 3,
			      		rotation: wedgeRotation + ( wedgeAngle / 2),
			      		text: args.data[i].percent + '%',
				        fontFamily: args.pie.percentFontFamily,
				        fontSize: args.pie.percentFontSize,
				        fill: args.pie.percentFontColor,
				        name: 'text',
				        offset: {x:-args.pie.radius / 2, y:0}
			      	});

					pie.add(percentage);
				}	

		  		/**
				 * @desc Creates the rectangles
				*/
		  		var rectVertPosition = (args.descArea.itemHeight + 5) * i + args.descArea.offsetY;		// vertical position of rectangles and text

		  		rect = new Kinetic.Rect({
		  			width: args.descArea.itemWidth,
		  			height: args.descArea.itemHeight,
		  			x: stage.width() - args.descArea.itemWidth - args.descArea.offsetX,
		  			y: rectVertPosition,
		  			fill: wedgeFill,
		  			stroke: args.descArea.strokeColor,
		  			strokeWidth: args.descArea.strokeWidth,
		  			name: 'rectangle'
		  		});

		  		/**
				 * @desc Creates the text next to the rectangles
				*/
				text = new Kinetic.Text({
			        x: stage.width(),
			        y: rectVertPosition,
			        text: args.data[i].text + ' - ' + args.data[i].percent + '%',
			        fontFamily: args.descArea.fontFamily,
			        fontSize: args.descArea.fontSize,
			        fill: args.descArea.fontColor,
			        name: 'text'
			    });
			    // set text X location
				text.attrs.x = stage.width() - text.width() - args.descArea.itemWidth - args.descArea.offsetX - 5;

				wedge.wedge_id = i;						// set a unique identifier for each wedge
		  		rect.rect_id = i;						// set a unique identifier for each rectangle

		  		descArea.add(rect);						// add rectangles to descArea
		  		descArea.add(text);						// add text to descArea
		  		
			    wedge.setZIndex(1);
			    
			    if (args.pie.showPercentages === true) {
			    	percentage.setZIndex(999);			    
			    }
			}

		  	layer.add(descArea);						// add descArea to layer
		  	layer.add(pie);								// add pie to layer
		  	stage.add(layer);							// add layer to stage

			
		  	/**
		  	 * @desc Apply Events on layer shapes if events is set to 'true'
		  	*/
			if (args.events === true) {
				layer.on('mouseover', function (event) {
					// rectangles
					if (event.targetNode.getName() === 'rectangle') {
						var rect_id = event.targetNode.rect_id,
							wedge = stage.find('.wedge')[rect_id];
						
						event.targetNode.opacity(0.8);

						new Kinetic.Tween({
							node: wedge,
							duration: 0.8,
							opacity: 0.8,
							scaleX: 1.1,
							scaleY: 1.1,					
							easing: Kinetic.Easings.ElasticEaseOut
						}).play();
						
						document.body.style.cursor = 'pointer';
					}
				});

				layer.on('mouseout', function (event) {
					// rectangles
					if (event.targetNode.getName() === 'rectangle') {
						var rect_id = event.targetNode.rect_id,
							wedge = stage.find('.wedge')[rect_id];
						
						event.targetNode.opacity(1.0);	

						new Kinetic.Tween({
							node: wedge,
							duration: 0.8,
							opacity: 1.0,
							scaleX: 1.0,
							scaleY: 1.0,					
							easing: Kinetic.Easings.ElasticEaseOut
						}).play();

						document.body.style.cursor = 'default';
					}
				});
			}	
		}
	};

}(window, document));