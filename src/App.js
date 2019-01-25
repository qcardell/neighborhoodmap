import React, { Component } from 'react';
import './App.css';
//import axios from 'axios'; // ajax stuff similar to jquery but with promises
import escapeRegExp from 'escape-string-regexp'


var foursquare = require('react-foursquare')({
  clientID: '',
  clientSecret: ''  
});

//Goole map key
const API = '';
//Google map key

var markers = [];
let filterMarkers = [];
var map ;
var center;
var marker;
var google;
var largeInfowindow;
var previousElement;
var previouswidth;

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
			windowWidth: undefined,
			googleApiERROR: [
				{name:'Error loading page please check Google API key, and check console for more info'}
				],
			fourSquareERROR: [] 
		};
	}
		
	componentDidCatch(error, info) {
		this.setState({
			error: error,
			info: info,
		});
	}
	
	handleResize = () =>{
		if(window.innerWidth > 801 && previouswidth < 801){
			this.rendermapOnly();
			this.rendermap();
		}
		previouswidth=window.innerWidth;

	}
	
	updateQuery = (query) =>{
		document.getElementById('filter-listings').value = "";
		filterMarkers = []
		if(previousElement !== undefined){
			previousElement.classList.remove("active");
		}
		var params = {
			"ll": "37.7749,-122.4194",
			"query": document.getElementById('search-listings').value,
		};
		for (var i=0; i<markers.length; i++){
				markers[i].setMap(null);
		}
		
		markers = [];
		foursquare.venues.getVenues(params).then((res) => {
			this.setState({
				items: res.response.venues
			},this.rendermap()
			)
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
		if(document.getElementById('filter-listings').value){
		const match = new RegExp(escapeRegExp(document.getElementById('filter-listings').value), 'i')
			filterMarkers = this.state.items.filter((venue) => match.test(venue.name))
		}else{
			filterMarkers = this.state.items;
		}
		console.log(filterMarkers);
		this.rendermap()
	}
	
	getGoogleMaps() {
    // If we haven't already defined the promise, define it
	//console.log(!this.googleMapsPromise);
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
			
			script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=resolveGoogleMapsPromise`;
			script.async = true;
			document.body.appendChild(script);
		  });
		}else{
			//document.getElementById('errorMessage').text = "Error loading page";
			console.log('ERROR loading the GOOGLE API.  Please check your keys');
			this.setState({
				showingItems: this.state.googleApiERROR
			})
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
		
		var params = {
			"ll": "37.7749,-122.4194",
			"query": '',
		};
		  
		//Get 4 square Data.
		this.rendermapOnly()
		foursquare.venues.getVenues(params).then((res) => {
			this.setState({
				items: res.response.venues
			},this.rendermap()
			);			
		})
		.catch(error => {
				console.log("foursquare ERROR!! " + error)
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
			document.getElementById('lat').value = center.lat;
			document.getElementById('lng').value = center.lng;
			this.map = new google.maps.Map(document.getElementById('map'), {
				zoom: 13,
				center: center,
				styles: styles,
				mapTypeControl: false
			});
		})
	}
	
	
	rendermap(){
		// Once the Google Maps API has finished loading, initialize the map
		
		this.getGoogleMaps().then((google) => {
			largeInfowindow = new google.maps.InfoWindow();
		
			var defaultIcon = makeMarkerIcon('0091ff');
		
			var highlightedIcon = makeMarkerIcon('FFFF24');
		
			if(filterMarkers.length === 0){
				this.setState({
				showingItems: this.state.items
			});

			}else{
				this.setState({
				showingItems: filterMarkers
				});
			}

			if(this.state.showingItems === undefined){
				this.setState({
					showingItems: []
				});
			}
			this.state.showingItems.map(venue => {
				var position = {lat: venue.location.lat,lng:venue.location.lng};
				
				var title = venue.name;
				
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
					infowindow.setContent('');
					infowindow.marker = marker;
					
					infowindow.addListener('closeclick', function(){
					});
					var streetViewService = new google.maps.StreetViewService();
					var radius = 50;
					
					
					
					function getStreetView(data, status){
						if (status === google.maps.StreetViewStatus.OK){
							var nearStreetViewLocation = data.location.latLng;
							var heading = google.maps.geometry.spherical.computeHeading(
								nearStreetViewLocation, marker.position);

							infowindow.setContent('<div>' + marker.title +'</div>'+ marker.address+'<div id="pano"></div>');
							var panoramaOptions = {
								position: nearStreetViewLocation,
								pov: {
									heading: heading,
									pitch: 30
								}
							};
							var panorama = new google.maps.StreetViewPanorama(
								document.getElementById('pano'), panoramaOptions);
							}else {
								infowindow.setContent('<div>' + marker.title + '</div>' +
								'<div>No Street View Found</div>');
							}
						}
						
						streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
						
						infowindow.open(map, marker);
			}
		
			function makeMarkerIcon(markerColor){
				var markerImage = new google.maps.MarkerImage(
					'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+markerColor+'|40|_|%E2%80%A2',
					new google.maps.Size(21, 34),
					new google.maps.Point(0,0),
					new google.maps.Point(10, 34),
					new google.maps.Size(21, 34));
					return markerImage;
			}
		});
		
	}
	
	onPress(v,i){
		if(previousElement !== "" && previousElement !== undefined){
			previousElement.classList.remove("active");
		}
		var displaymarker = markers.filter((venue) => venue.id === v.id);
		this.populateInfoWindow(displaymarker[0],largeInfowindow);
		i.currentTarget.classList.add('active');
		previousElement = i.currentTarget;
	
	}
	
	populateInfoWindow(marker, infowindow) {
					infowindow.setContent('');
					infowindow.marker = marker;
					
					infowindow.addListener('closeclick', function(){
					});
					var streetViewService = new google.maps.StreetViewService();
					var radius = 50;
					
					
					
					function getStreetView(data, status){
						if (status === google.maps.StreetViewStatus.OK){
							var nearStreetViewLocation = data.location.latLng;
							var heading = google.maps.geometry.spherical.computeHeading(
								nearStreetViewLocation, marker.position);
							infowindow.setContent('<div>' + marker.title + '</div>'+ marker.address+'<div id="pano"></div>');
							var panoramaOptions = {
								position: nearStreetViewLocation,
								pov: {
									heading: heading,
									pitch: 30
								}
							};
							var panorama = new google.maps.StreetViewPanorama(
								document.getElementById('pano'), panoramaOptions);
							}else {
								infowindow.setContent('<div>' + marker.title + '</div>' +
								'<div>No Street View Found</div>');
							}
						}
						
						streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
						infowindow.open(map, marker);
	}

	render() {
		 if (this.state.showingItems === undefined || this.state.showingItems.formattedAddress === undefined) {
			// You can render any custom fallback UI
			return <h1>Sorry, Something went wrong.  Please check console for more information{this.state.googleApiERROR.name}</h1>;
		}	
			return (
				<div className="App">
					<div id='map'></div>
					<div className='options-box'>
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
						<div><p id='errorMessage'>ERROR:</p></div>
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