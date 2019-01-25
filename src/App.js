import React, { Component } from 'react';
import './App.css';
//import ShowMap from './ShowMap';
import axios from 'axios'; // ajax stuff similar to jquery but with promises
import escapeRegExp from 'escape-string-regexp'


var foursquare = require('react-foursquare')({
  clientID: '00BVPJHFDPUKMUOTIEO4IGK53GUPTYTMVIMUEKHBIIX3DSZO',
  clientSecret: 'IKB3WGDPXTVPMEUFWZB1GFHHULK0JE3VTGYG1OYMVRO3LNSK'  
});
var markers = [];
let filterMarkers = [];
//let showingItems;
var map ;
var center;
var marker;
var google;
var largeInfowindow;
var previousElement;
var previouswidth;
//var showingItems = [];

class App extends Component {
	constructor(props) {
		super(props);
				this.onPress= this.onPress.bind(this);
		this.state = {
			items: [],
			showingItems:[],
			error: false,
			info: null,
			windowHeight: undefined,
			windowWidth: undefined

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
	
	componentDidCatch(error, info) {
    // Something happened to one of my children.
    // Add error to state
		this.setState({
			error: error,
			info: info,
		});
	}
	
	handleResize = () =>{
		//this.setState({
		//windowHeight: window.innerHeight,
		//windowWidth: window.innerWidth
		//});
		//console.log(window.innerWidth);
			if(window.innerWidth > 801 && previouswidth < 801){
				this.rendermapOnly();
				this.rendermap();
				//console.log("render");
			}
			previouswidth=window.innerWidth;

	}


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
		.catch(error => {
				console.log("ERROR!! " + error)
		})
		//console.log(this.state.items);
	}
	
	updateQuery = (query) =>{
		document.getElementById('filter-listings').value = "";
		filterMarkers = []
		if(previousElement !== undefined){
			previousElement.classList.remove("active");
		}
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
		//console.log(params);
		//Removing the Markers from the map
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
	
	
	filterVenues = (query) =>{
		
		if(previousElement !== undefined){
			previousElement.classList.remove("active");
		}
		
		for (var i=0; i<markers.length; i++){
				markers[i].setMap(null);
		}
		
		markers = [];
		if(query){
		const match = new RegExp(escapeRegExp(query), 'i')
			filterMarkers = this.state.items.filter((venue) => match.test(venue.name))
		}else{
			filterMarkers = this.state.items;
		}
		//showingmarkers = markers.filter((venue) => venue.id === v.id);
		console.log(filterMarkers);
		this.rendermap()
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
	window.removeEventListener('resize', this.handleResize)
    this.getGoogleMaps();
  }

  componentDidMount() {
		previouswidth=window.innerWidth;
		this.handleResize();
		window.addEventListener('resize', this.handleResize)
		
		console.log(this.state.windowWidth);

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
		this.rendermapOnly()
		foursquare.venues.getVenues(params).then((res) => {
			this.setState({
				items: res.response.venues
			},this.rendermap()
			);
			//console.log(this.state.items);
			
		})
		.catch(error => {
				console.log("ERRORQQQQQQQQQQQQQQQQQQQQQQQQ!! " + error)
				this.setState({
				showingItems: []
			});
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
			document.getElementById('lat').value = center.lat;
			document.getElementById('lng').value = center.lng;
			this.map = new google.maps.Map(document.getElementById('map'), {
				zoom: 13,
				center: center,
				//styles: styles,
				mapTypeControl: false
			});
		})
		//this.rendermap();
	}
	
	
	rendermap(){
		// Once the Google Maps API has finished loading, initialize the map
		
		this.getGoogleMaps().then((google) => {
			//console.log(this.state.items);

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
			//console.log(this.state.items);
			//console.log(filterMarkers);
			if(filterMarkers.length === 0){
				//showingItems=this.state.items;
				//console.log("state");
				//this.rendermapOnly();
				this.setState({
				showingItems: this.state.items
			});

			}else{
				//showingItems = filterMarkers;
				//console.log("filter");
				//this.rendermapOnly();
				this.setState({
				showingItems: filterMarkers
			});

			}

			//console.log(showingItems);
			this.state.showingItems.map(venue => {
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
					address: venue.location.formattedAddress[0] +  " " + venue.location.formattedAddress[1],
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
							//console.log(markers);
							//var displayvenue = markers.filter((venue) => venue.id === marker.id);
							//console.log(displayvenue);
							infowindow.setContent('<div>' + marker.title +'</div>'+ marker.address+'<div id="pano"></div>');
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
	
	onPress(v,i){
		console.log(i.currentTarget);
		if(previousElement !== "" && previousElement !== undefined){
			previousElement.classList.remove("active");
		}
		//console.log(e);
		//console.log(this.populateInfoWindow);
		var displaymarker = markers.filter((venue) => venue.id === v.id);
		//this.state.items.map((venue) =>(
		//console.log(displaymarker);
		this.populateInfoWindow(displaymarker[0],largeInfowindow);
		//e.target.element.class="newGreenColor";
		i.currentTarget.classList.add('active');
		previousElement = i.currentTarget;
	
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
							infowindow.setContent('<div>' + marker.title + '</div>'+ marker.address+'<div id="pano"></div>');
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
		 if (this.state.showingItems === undefined) {
			// You can render any custom fallback UI
			return <h1>Sorry, Something went wrong.</h1>;
		}	
			return (
				<div className="App">
					<div id='map'></div>
					<div className='options-box'>
					{this.state.windowWidth} x {this.state.windowHeight}
						<h1>Options Menu</h1>
						<div>
							<div>
								<span>search </span>
								<input 
									id="search-listings" 
									type="text" 
									placeholder='Search: ex Food'
									onBlur={(event) => this.updateQuery(event.target.value)}
								/>
								
								<input 
									id="searchButton" 
									type="button" 
									value="Search"
								/>
							</div>

							<div>
								<span>Filter </span>
								<input 
									id="filter-listings" 
									type="text" 
									placeholder='Search: ex Food'
									onBlur={(event) => this.filterVenues(event.target.value)}
								/>
								<input 
									id="searchButton" 
									type="button" 
									value="Search"
								/>
							</div>
							
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
							{this.state.showingItems.map((venue,i) =>(
								<div key={venue.id} onClick={this.onPress.bind(this,venue)}>
								<ul id={venue.id} className='venue-list' >
								<h4>{venue.name}</h4>
								<p>{venue.location.formattedAddress[0]} {" "} {venue.location.formattedAddress[1]}</p>
								</ul>
								</div>
							))}
							</ul>

						</div>
				</div>
			);

	}
}

export default App;