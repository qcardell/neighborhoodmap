import React from 'react';

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
      const center = {lat: 40.7413549, lng: -73.9980244};
      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: center,
		mapTypeControl: false
      });
      const marker = new google.maps.Marker({
        position: center,
        map: map
      });
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