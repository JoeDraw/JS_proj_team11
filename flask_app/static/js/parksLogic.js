var map = L.map('map').setView([37.8, -96], 4);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	maxZoom: 18,
	attribution: 'We made this',
	id: 'mapbox.light'
}).addTo(map);


	// control that shows state info on hover
	var info = L.control();

	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	};

	info.update = function (props) {
		this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
			'<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
			: 'Hover over a state');
	};

	info.addTo(map);


	// get color depending on population density value
	function getColor(d) {
		return d>0 ?'#FFEDA0':'blue';
	}

	function style(feature) {
		return {
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7,
			fillColor: getColor(feature.properties.density)
		};
	}

	function highlightFeature(e) {
		var layer = e.target;

		layer.setStyle({
			weight: 5,
			color: '#666',
			dashArray: '',
			fillOpacity: 0.7
		});

		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			layer.bringToFront();
		}

		info.update(layer.feature.properties);
	}

	var geojson;

	function resetHighlight(e) {
		geojson.resetStyle(e.target);
		info.update();
	}

	function zoomToFeature(e) {
		map.fitBounds(e.target.getBounds());
	}

	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature
		});
	}

	geojson = L.geoJson(statesData, {
		style: style,
		onEachFeature: onEachFeature
	}).addTo(map);

	map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


  

var parks = {};
console.log("About to run D3.json")

// This code below does not work even though it did before August 24, 2016 13:00(1:00PM).

// d3.json('/parks', function(data) {
// 	parks = data;
	// for (var i = 0; i < parks.length; i++) {
 //    var location = [parks[i].latitude, parks[i].longitude]
 //    console.log(location)
 //    L.marker(location).addTo(myMap);
 //  }
// });

//To make it work, we had to split the d3.json and the .then into two parts.
//Just as Abraham split the goat into two to sacrifice for God.
//Now it works. It's ugly. But it works.

// And yes, we tried this too:

  // var request = new XMLHttpRequest()
  // // Open a new connection, using the GET request on the URL endpoint
  // request.open('GET', '/parks', true)
  // request.onload = function (parks) {
  //   console.log(parks)
  // };

//Call d3.json on the parks to get the API
d3_call = d3.json('/parks');

//See giant comment blog above for explanation.
setTimeout(function(){
    d3_call.then(function(parks){
    	//Loop through all the parks and get their geo-coordinates
  		for (var i = 0; i < parks.length; i++) {
		    var location = [parks[i].latitude, parks[i].longitude]
		    //Create markers on map based on the coordinates
		    L.marker(location).addTo(map);
  }
    })
}, 500);