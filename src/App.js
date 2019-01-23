import React, { Component } from 'react';
import './App.css';
//import ShowMap from './ShowMap';
import axios from 'axios'; // ajax stuff similar to jquery but with promises

var foursquare = require('react-foursquare')({
  clientID: '00BVPJHFDPUKMUOTIEO4IGK53GUPTYTMVIMUEKHBIIX3DSZO',
  clientSecret: 'IKB3WGDPXTVPMEUFWZB1GFHHULK0JE3VTGYG1OYMVRO3LNSK'  
});
var markers = [];
var map ;
var center;
var marker;
var google;
var largeInfowindow;

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			items: []
		};
	}
		//componentDidMount() {   
			//this.getVenues();
		//	foursquare.venues.getVenues(params).then((res) => {
		//		this.setState({
		//			items: res.response.venues
		//		});
		//		console.log(this.state);
		//	})
			//console.log(this.state);
		//}
	
	getVenues = () => {
		const endPoint = "https://api.foursquare.com/v2/venues/explore?";
		var params = {
			// 40.7413549, lng: -73.9980244
			//clientID: '00BVPJHFDPUKMUOTIEO4IGK53GUPTYTMVIMUEKHBIIX3DSZO',
			//clientSecret: 'IKB3WGDPXTVPMEUFWZB1GFHHULK0JE3VTGYG1OYMVRO3LNSK',
			"ll": "37.7749,-122.4194",
			"query": 'food',
			// v: "20180323",
			//"near": "Dallas, Tx"
	
  
			 //   "near": "Dallas, Tx",
			 // "categoryId": '4d4b7105d754a06374d81259',
			 // "radius":"250"
			 //	this.state.items.map(item=> { return<div key={item.id}><p>{item.name}</p></div>})
		};
		
		//axios.get(endPoint + new URLSearchParams(params))
		//	.then(response => {
		//		console.log(response);
		//	})
		//	.catch(error => {
		//		console.log("ERROR!! " + error)
		//	})
			
		foursquare.venues.getVenues(params).then((res) => {
			this.setState({
				items: res.response.venues
			});
			//console.log(this.state);
		})
		//console.log(this.state.items);
	}
	
	updateQuery = (query) =>{
		var params = {
			// 40.7413549, lng: -73.9980244
			//clientID: '00BVPJHFDPUKMUOTIEO4IGK53GUPTYTMVIMUEKHBIIX3DSZO',
			//clientSecret: 'IKB3WGDPXTVPMEUFWZB1GFHHULK0JE3VTGYG1OYMVRO3LNSK',
			"ll": "37.7749,-122.4194",
			"query": query,
			// v: "20180323",
			//"near": "Dallas, Tx"
	
  
		 //   "near": "Dallas, Tx",
		 // "categoryId": '4d4b7105d754a06374d81259',
		 // "radius":"250"
		 //	this.state.items.map(item=> { return<div key={item.id}><p>{item.name}</p></div>}) }

		};
		//this.setState({query: query.trim()})
		console.log(params);
		for (var i=0; i<markers.length; i++){
				markers[i].setMap(null);
		}
		markers = [];
		foursquare.venues.getVenues(params).then((res) => {
			this.setState({
				items: res.response.venues
			},this.rendermap()
			)
			//console.log(this.state.items);
		})
		
		
	}
	
	
	getGoogleMaps() {
    // If we haven't already defined the promise, define it
		if (!this.googleMapsPromise) {
		  this.googleMapsPromise = new Promise((resolve) => {
			// Add a global handler for when the API finishes loading
			window.resolveGoogleMapsPromise = () => {
				google = window.google;
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
	  
		var params = {
			// 40.7413549, lng: -73.9980244
			//clientID: '00BVPJHFDPUKMUOTIEO4IGK53GUPTYTMVIMUEKHBIIX3DSZO',
			//clientSecret: 'IKB3WGDPXTVPMEUFWZB1GFHHULK0JE3VTGYG1OYMVRO3LNSK',
			"ll": "37.7749,-122.4194",
			"query": '',
			// v: "20180323",
			//"near": "Dallas, Tx"
			
	  
			 //   "near": "Dallas, Tx",
			 // "categoryId": '4d4b7105d754a06374d81259',
			 // "radius":"250"
			 //	this.state.items.map(item=> { return<div key={item.id}><p>{item.name}</p></div>}) }
		};
		  
		//Get 4 square Data.
		foursquare.venues.getVenues(params).then((res) => {
			this.setState({
				items: res.response.venues
			}, this.rendermapOnly()
			);
			console.log(this.state.items);
		})

	}
	
	rendermapOnly(){
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
			center = {lat: 37.7749, lng: -122.4194};
				//const center = {lat: 40.7413549, lng: -73.9980244};
				//37.7749,-122.4194"
			this.map = new google.maps.Map(document.getElementById('map'), {
				zoom: 13,
				center: center,
				//styles: styles,
				mapTypeControl: false
			});
		})
		this.rendermap();
	}
	
	
	rendermap(){
		// Once the Google Maps API has finished loading, initialize the map
		this.getGoogleMaps().then((google) => {
			
			//const center = {lat: 37.7749, lng: -122.4194};
				//const center = {lat: 40.7413549, lng: -73.9980244};
				//37.7749,-122.4194"
			//const map = new google.maps.Map(document.getElementById('map'), {
			//	zoom: 13,
			//	center: center,
				//styles: styles,
			//	mapTypeControl: false
			//});
	  
			largeInfowindow = new google.maps.InfoWindow();
		
			var defaultIcon = makeMarkerIcon('0091ff');
		
			var highlightedIcon = makeMarkerIcon('FFFF24');
		
			//const marker = new google.maps.Marker({
			//	position: center,
			//	map: map
			//});
			
			//var bounds = new google.maps.LatLngBounds();
			//console.log(this.state.items);
			this.state.items.map(venue => {
			//for (var i=0; i < locations.length; i++) {
				//location: {lat: 40.7713024, lng: -73.9632393}
				//var position = locations[i].location;
				var position = {lat: venue.location.lat,lng:venue.location.lng};

				var title = venue.name; //locations[i].title;
				
				marker = new google.maps.Marker({
					position: position,
					title: title,
					icon: defaultIcon,
					animation: google.maps.Animation.DROP,
					id: venue.id,
					map:this.map
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
			})
			
			
			function populateInfoWindow(marker, infowindow) {
				//console.log(marker);
				//console.log(infowindow);
				//if (infowindow.marker !== marker) {
					infowindow.setContent('');
					infowindow.marker = marker;
					
					infowindow.addListener('closeclick', function(){
						//infowindow.setMarker(null);
					});
					var streetViewService = new google.maps.StreetViewService();
					var radius = 50;
					
					
					
					function getStreetView(data, status){
						//console.log();
						if (status === google.maps.StreetViewStatus.OK){
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
				//}
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
	
	onPress(event){
		//console.log(event);
		//console.log(this.populateInfoWindow);
		var displaymarker = markers.filter((venue) => venue.id === event.id);
		//this.state.items.map((venue) =>(
		//console.log(displaymarker);
		this.populateInfoWindow(displaymarker[0],largeInfowindow);
	}
	
	populateInfoWindow(marker, infowindow) {
				//if (infowindow.marker !== marker) {
					infowindow.setContent('');
					infowindow.marker = marker;
					
					infowindow.addListener('closeclick', function(){
						//infowindow.setMarker(null);
					});
					var streetViewService = new google.maps.StreetViewService();
					var radius = 50;
					
					
					
					function getStreetView(data, status){
						//console.log();
						if (status === google.maps.StreetViewStatus.OK){
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
				//}
	}

	render() {
		return (
			<div className="App">
				<div className='options-box'>
					<h1>Options Menu</h1>
					<div>
						<span>Filter  </span>
						<input 
							id="hide-listings" 
							type="text" 
							placeholder='Search: ex Food'
							onBlur={(event) => this.updateQuery(event.target.value)}
						>
						</input>
						<input 
							id="hide-listings" 
							type="button" 
							value="Search"
							onChange={(event) => this.updateQuery(event.target.value)}>
						</input>
					</div>
					<div>
						<span>Lat: </span>
						<input id="lat" type="input" ></input>
						<span>  Lng: </span>
						<input id="lng" type="input" ></input>
					</div>
				</div>
					<div className='venue-box'>
						<h3>Places</h3>
						<ul className='list'>
						{this.state.items.map((venue) =>(
							<div key={venue.id}>
							<li className='venue-list' onClick={() => this.onPress(venue)}>
							<h4>{venue.name}</h4>
							<p>{venue.location.formattedAddress[0]} {" "} {venue.location.formattedAddress[1]}</p>
							</li>
							</div>
						))}
						</ul>

					</div>
				<div id='map'></div>
			</div>
		);
	}
}

export default App;