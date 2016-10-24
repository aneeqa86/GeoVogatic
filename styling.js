//Default Style => give the files a default style

	var defaultStyle = {
			'Point': new ol.style.Style({
				image: new ol.style.Circle({
				fill: new ol.style.Fill({
					color: 'rgba(255,255,0,0.5)'
						}),
				radius: 5,
				stroke: new ol.style.Stroke({
					color: '#ff0',
					width: 1
						})
					})
				}),
			'LineString': new ol.style.Style({
				stroke: new ol.style.Stroke({
				color: '#f00',
				width: 3
					})
				}),
			'Polygon': new ol.style.Style({
				fill: new ol.style.Fill({
				color: 'rgba(0,255,255,0.5)'
					}),
				stroke: new ol.style.Stroke({
				color: '#0ff',
				width: 1
					})
				}),
			'MultiPoint': new ol.style.Style({
			  image: new ol.style.Circle({
				fill: new ol.style.Fill({
				color: 'rgba(255,0,255,0.5)'
					}),
				radius: 5,
				stroke: new ol.style.Stroke({
					color: '#f0f',
					width: 1
						})
					})
				}),
			'MultiLineString': new ol.style.Style({
				stroke: new ol.style.Stroke({
				color: '#0f0',
				width: 3
						})
					}),
			'MultiPolygon': new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgba(0,0,255,0.5)'
				}),
				stroke: new ol.style.Stroke({
				color: '#00f',
				width: 1
						})
					})
				};

// Style Function => This is the link between the GeoJSON file and the default style 			
   
	var styleFunction = function(feature, resolution) {
        var featureStyleFunction = feature.getStyleFunction();
        if (featureStyleFunction) {
			return featureStyleFunction.call(feature, resolution);
			} 
		else {
			return defaultStyle[feature.getGeometry().getType()];
			}
		};

//Drag and drop Function => allows the map to load the given extensions
		
    var dragAndDropInteraction = new ol.interaction.DragAndDrop({
        formatConstructors: [
			ol.format.GPX,
			ol.format.GeoJSON,
			ol.format.IGC,
			ol.format.KML,
			ol.format.TopoJSON
			]
		});

//Map => creates the map
      
	var map = new ol.Map({
        interactions: ol.interaction.defaults().extend([dragAndDropInteraction]),
        layers: [
			new ol.layer.Tile({
			source: new ol.source.OSM()
				})
			],
        target: 'map',
        view: new ol.View({
          center: [0, 0],
          zoom: 2
        })
      });

//  Drag and Drop interaction Function => describes how to respond once the file is dragged and dropped 
  
	dragAndDropInteraction.on('addfeatures', function(event) {
        var vectorSource = new ol.source.Vector({
			features: event.features
			});
        map.addLayer(new ol.layer.Vector({
			source: vectorSource,
			style: styleFunction
			}));
        map.getView().fit(
            vectorSource.getExtent(), /** @type {ol.Size} */ (map.getSize()));
		
	//GeoJSON/GML Button
	
		var button = document.createElement("button");
		button.setAttribute("class", "layers");
		button.innerHTML = "L";
		var div = document.getElementsByTagName("div")[0];
		div.appendChild(button); 
	});

//Display Feature Function => I am not quite sure how this works // Maybe important for hover function
	//Detect features that intersect a pixel on the viewport, and execute a callback with each intersecting feature.

    var displayFeatureInfo = function(pixel) {
        var features = [];
        map.forEachFeatureAtPixel(pixel, function(feature) {        
			features.push(feature);
        });
        if (features.length > 0) {
			var info = [];
			var i, ii;
			for (i = 0, ii = features.length; i < ii; ++i) {
				info.push(features[i].get('name'));
			}
			document.getElementById('info').innerHTML = info.join(', ') || '&nbsp';
			} 
		else {
			document.getElementById('info').innerHTML = '&nbsp;';
			}
        };

	map.on('pointermove', function(evt) {
        if (evt.dragging) {
			return;
			}
        var pixel = map.getEventPixel(evt.originalEvent);
			displayFeatureInfo(pixel);
		});

	map.on('click', function(evt) {
        displayFeatureInfo(evt.pixel);
		});