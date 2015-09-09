/**
 * 
 */

function slider(option) {
	zr.clear();
	var color = require('zrender/tool/color');
	var colorIdx = 0;
	var width = Math.ceil(zr.getWidth());
	var height = Math.ceil(zr.getHeight());

	var cc = [ 'm', 'M', 'l', 'L', 'v', 'V', 'h', 'H', 'z', 'Z', 'c', 'C', 'q',
			'Q', 't', 'T', 's', 'S', 'a', 'A' ];

	// container
	zr.addShape({
		shape : 'rectangle',
		id : zr.newShapeId('rectangle'),
		style : {
			x : 0,
			y : 0,
			width : width,
			height : height,
			// radius: [20, 50],
			brushType : 'both',
			color : 'rgba(0,0,0,0)',
			strokeColor : '#CCCCCC',
			lineWidth : 2,
			lineJoin : 'round'
		},
		hoverable : false
	});

	var p = 'M ';
	p += option.startLeft ? option.startLeft + 40 : 50;
	p += ' 50 ';
	p += 'L ';
	p += option.startLeft ? option.startLeft + 40 : 50;
	p += ' 50 L ';
	p += option.startLeft ? option.startLeft + 40 : 50;
	p += ' 100 L ';
	p += option.endRight ? (width - option.endRight - 40) : (width - 50);
	p += ' 100 L ';
	p += option.endRight ? (width - option.endRight - 40) : (width - 50);
	p += ' 50 ';
	p += 'L ';
	p += option.endRight ? (width - option.endRight - 40) : (width - 50);
	p += ' 50 M ';
	p += option.startLeft ? option.startLeft + 40 : 50;
	p += ' 50';
	
	var path = {
		shape : 'path',
		id : zr.newShapeId('path'),
		brushTypeOnly : 'stroke',
		style : {
			// M left top L
			//path : 'M 50 50 L 150 50 L 150 100 L 340 100 L 340 50 L 440 50M 50 50',
			path : p,
			brushType : 'stroke',
			color : 'none',
			strokeColor : color.getColor(colorIdx++),
			lineWidth : 2
		},
		hoverable : false
	};

	var pre = {
		shape : 'rectangle',
		id : zr.newShapeId('rectangle'),
		style : {
			x : (option.startLeft ? option.startLeft + 40 : 50) - 5,
			y : 65,
			width : 10,
			height : 20,
			radius : [ 5, 5 ],
			brushType : 'both',
			color : color.getColor(1),
			strokeColor : 'black',
			lineWidth : 2,
			lineJoin : 'round'

		},
		draggable : true,
		clickable : true,
		ondragstart : function(params) {
			pre_down = true;
			console.log('down');
		},
		ondragend : function(params) {
			pre_down = false;
			console.log('up');
		},
		ondrift : function(shape, dx, dy) {
			var overflow = false;
			shape.style.x += dx;
			if(shape.style.x < option.startLeft + 35){
				shape.style.x = option.startLeft + 35;
				overflow = true;
			}
			if(shape.style.x > width - option.endRight - 40){
				shape.style.x = width - option.endRight - 40;
				overflow = true;
			}
			zr.modShape(shape.id, shape);
			
			if(!overflow){
				var cs = path.style.path;
				cs = cs.replace(/  /g, ' ');
				cs = cs.replace(/ /g, ',');
				cs = cs.replace(/,,/g, ',');
	
				for (var n = 0; n < cc.length; n++) {
					cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n]);
				}
				var arr = cs.split('|');
	
				var pres = arr[2].split(',');
				pres[1] = +pres[1] + dx;
				arr[2] = pres.concat(',');
	
				var pree = arr[3].split(',');
				pree[1] = +pree[1] + dx;
				arr[3] = pree.concat(',');
	
				a = '';
				for (var i = 0; i < arr.length; i++) {
					a += arr[i];
				}
	
				path.style.path = a.replace(/,/g, ' ');
				
				
				zr.modShape(path.id, path);
			}
			if(!overflow){
				startdate.style.x += dx;
				zr.modShape(startdate.id, startdate);
			}
			
			var index = Math.round((shape.style.x - 50) / (width - option.startLeft - option.endRight - 80) * option.dates.length);
			if(index == option.dates.length){
				index--;
			}
			startdate.style.text = option.dates[index];
			zr.refresh();
			
			option.preSlide(startdate.style.text);
			overflow = false;
			return true;
		}
	};

	var aft = {
		shape : 'rectangle',
		id : zr.newShapeId('rectangle'),
		// position : [10,10],
		style : {
			x : (option.endRight ? (width - option.endRight - 40) : (width - 50)) - 5,
			y : 65,
			width : 10,
			height : 20,
			radius : [ 5, 5 ],
			brushType : 'both',
			color : color.getColor(1),
			strokeColor : 'black',
			lineWidth : 2,
			lineJoin : 'round'

		},
		draggable : true,
		clickable : true,
		ondrift : function(shape, dx, dy) {
			var overflow = false;
			shape.style.x += dx;
			if(shape.style.x < option.startLeft + 40){
				shape.style.x = option.startLeft + 40;
				overflow = true;
			}
			if(shape.style.x > width - option.endRight - 40){
				shape.style.x = width - option.endRight - 40;
				overflow = true;
			}
			zr.modShape(shape.id, shape);

			if(!overflow){
			var cs = path.style.path;
			cs = cs.replace(/  /g, ' ');
			cs = cs.replace(/ /g, ',');
			cs = cs.replace(/,,/g, ',');

			for (n = 0; n < cc.length; n++) {
				cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n]);
			}
			var arr = cs.split('|');

			var pres = arr[4].split(',');
			pres[1] = +pres[1] + dx;
			arr[4] = pres.concat(',');

			var pree = arr[5].split(',');
			pree[1] = +pree[1] + dx;
			arr[5] = pree.concat(',');

			a = '';
			for (var i = 0; i < arr.length; i++) {
				a += arr[i];
			}
			path.style.path = a.replace(/,/g, ' ');
			zr.modShape(path.id, path);
			

			var index = Math.round((shape.style.x - 50) / (width - option.startLeft - option.endRight - 80) * option.dates.length);
			if(index == option.dates.length){
				index--;
			}
			enddate.style.text = option.dates[index];
			
			enddate.style.x += dx;
			zr.modShape(enddate.id, enddate);
			}
			zr.refresh();
			option.aftSlide(enddate.style.text);
			overflow = false;
			return true;
		}
	};

	var startdate = {
		shape : 'text',
		id : zr.newShapeId('text'),
		style : {
			x : (option.startLeft ? option.startLeft + 40 : 50) - 30,
			y : 35,
			brushType : 'fill',
			color : 'black',
			lineWidth : 3,
			text : option.dates[0]
		},
		hoverable : false
	};

	var enddate = {
		shape : 'text',
		id : zr.newShapeId('text'),
		style : {
			x : (option.endRight ? (width - option.endRight - 40) : width - 50) - 30,
			y : 35,
			brushType : 'fill',
			color : 'black',
			// shadowColor : 'yellow',
			// shadowBlur : 10,
			lineWidth : 3,
			text : option.dates[option.dates.length-1]
		},
		hoverable : false
	};

	// 路径
	zr.addShape(path);

	// 矩形 pre
	zr.addShape(pre);

	// 矩形 aft
	zr.addShape(aft);

	// 文本
	zr.addShape(startdate);

	// 文本
	zr.addShape(enddate);

	// 文本
	zr.addShape({
		shape : 'text',
		id : zr.newShapeId('text'),
		style : {
			x : option.startLeft + 10,
			y : 110,
			brushType : 'fill',
			color : 'black',
			// shadowColor : 'yellow',
			// shadowBlur : 10,
			lineWidth : 3,
			text : option.dates[0]
		},
		hoverable : false
	});

	// 文本
	zr.addShape({
		shape : 'text',
		id : zr.newShapeId('text'),
		style : {
			x : width - option.endRight - 40 - 30,
			y : 110,
			brushType : 'fill',
			color : 'black',
			// shadowColor : 'yellow',
			// shadowBlur : 10,
			lineWidth : 3,
			text : option.dates[option.dates.length-1]
		},
		hoverable : false
	});

	// 绘画
	zr.render();
}