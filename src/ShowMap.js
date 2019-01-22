import React from 'react';

var locations = [
	{title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
	{title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
	{title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
	{title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
	{title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
	{title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
];
var markers = [];
var itemlocations = [];
class ContactBody extends React.Component {
  getGoogleMaps() {
    // If we haven't already defined the promise, define it
    if (!this.googleMapsPromise) {
      this.googleMapsPromise = new Promise((resolve) => {
        // Add a global handler for when the API finishes loading
        window.resolveGoogleMapsPromise = () => {
			const google = window.google;
          // Resolve the promise
          resolve(google);

          // Tidy up
          delete window.resolveGoogleMapsPromise;
        };

        // Load the Google Maps API
        const script = document.createElement("script");
        const API = 'AIzaSyAOoEVFmUBvaqUgrMpSZQEGpgp1x9_y-I4';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=resolveGoogleMapsPromise`;
        script.async = true;
        document.body.appendChild(script);
      });
    }

    // Return a promise for the Google Maps API
    return this.googleMapsPromise;
  }

  componentWillMount() {
    // Start Google Maps API loading since we know we'll soon need it
    this.getGoogleMaps();
  }

  componentDidMount() {
    // Once the Google Maps API has finished loading, initialize the map
    this.getGoogleMaps().then((google) => {
		var styles =[
			{
				featureType: 'water',
				stylers: [
					{color: '#19a0d8'}
				]
			},{
				featureType: 'administrative',
				elementType: 'labels.text.stroke',
				stylers: [
					{color: '#ffffff'},
					{weight: 6}
				]
			},{
				featureType: 'road.highway',
				elementType: 'geometry.stroke',
				stylers: [
					{color: '#efe9e4'},
					{lightness: -40 }				
				]
			},{
				featureType: 'transit.station',
				stylers: [
					{weight: 9},
					{hue: '#e85113' }
				]
			},{
				featureType: 'road.highway',
				elementType: 'labels.icon',
				stylers: [
					{visibility: 'off'}
				]
			},{
				featureType: 'road.highway',
				elementType: 'geometry.fill',
				stylers: [
					{color: '#efe9e4'},
					{lightness: -25}
				]
				}
		]
		const center = {lat: 37.7749, lng: -122.4194};
		//		const center = {lat: 40.7413549, lng: -73.9980244};
		//37.7749,-122.4194"
		const map = new google.maps.Map(document.getElementById('map'), {
			zoom: 13,
			center: center,
			//styles: styles,
			mapTypeControl: false
		});
	  
		var largeInfowindow = new google.maps.InfoWindow();
		
		var defaultIcon = makeMarkerIcon('0091ff');
		
		var highlightedIcon = makeMarkerIcon('FFFF24');
		
		//const marker = new google.maps.Marker({
		//	position: center,
		//	map: map
		//});
		
		//var bounds = new google.maps.LatLngBounds();
		for (var i=0; i < locations.length; i++) {
			var position = locations[i].location;
			var title = locations[i].title;
			
			var marker = new google.maps.Marker({
				position: position,
				title: title,
				icon: defaultIcon,
				animation: google.maps.Animation.DROP,
				id: i,
				map:map
			});
		
			markers.push(marker);
			
			//bounds.extend(marker.position);
			
			marker.addListener('click', function() {
				populateInfoWindow(this, largeInfowindow);
			});
			
			marker.addListener('mouseover', function(){
				this.setIcon(highlightedIcon);
			});
			marker.addListener('mouseout', function(){
				this.setIcon(defaultIcon);
			});
		}
		
		
		
		function populateInfoWindow(marker, infowindow) {
			if (infowindow.marker != marker) {
				infowindow.setContent('');
				infowindow.marker = marker;
				
				infowindow.addListener('closeclick', function(){
					infowindow.setMarker(null);
				});
				var streetViewService = new google.maps.StreetViewService();
				var radius = 50;
				
				
				
		function getStreetView(data, status){
				//console.log();
					if (status == google.maps.StreetViewStatus.OK){
						var nearStreetViewLocation = data.location.latLng;
						var heading = google.maps.geometry.spherical.computeHeading(
							nearStreetViewLocation, marker.position);
						//console.log(heading);
						infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
						//console.log(infowindow);
						var panoramaOptions = {
						position: nearStreetViewLocation,
						pov: {
							heading: heading,
							pitch: 30
						}
					};
					var panorama = new google.maps.StreetViewPanorama(
						document.getElementById('pano'), panoramaOptions);
						//console.log(panorama);
					}else {
						//console.log(marker);
						infowindow.setContent('<div>' + marker.title + '</div>' +
						'<div>No Street View Found</div>');
					}
				}
				streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
				
				infowindow.open(map, marker);
		}
		
		}
		function makeMarkerIcon(markerColor){
			var markerImage = new google.maps.MarkerImage(
				'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+markerColor+'|40|_|%E2%80%A2',
				new google.maps.Size(21, 34),
				new google.maps.Point(0,0),
				new google.maps.Point(10, 34),
				new google.maps.Size(21, 34));
			//console.log(markerImage);
			return markerImage;
		}
    });
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
  }

  render() {
    return (
      <div>
        <h1>Map</h1>
        <div id="map"></div>
      </div>
    )
  }
}


export default ContactBody