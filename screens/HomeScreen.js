import React, { Component } from 'react';
import { Image } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

export default class HomeScreen extends Component {
  state = {
    mapRegion: null,
    hasLocationPermissions: false,
    locationResult: null
  };
  // watchID: ?number = null;

  async componentDidMount() {
    await this._getLocationAsync();
  }

  _getLocationAsync = async () => {
    console.log('location changed');
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        locationResult: 'Permission to access location was denied',
      });
    } else {
      this.setState({ hasLocationPermissions: true });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ locationResult: JSON.stringify(location) });

    // Center the map on the location we just fetched.
    this.setState({ mapRegion: { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 } });
  };

  render() {
    console.log('mapRegion=>',this.state.mapRegion)
    const origin = this.state.mapRegion;
    const destination = { latitude: 28.5976, longitude: 77.3723 };
    const GOOGLE_MAPS_APIKEY = 'AIzaSyDy-8kG1XAugFXi7Z0rUktRkD7xcixjvh8';
    const waypoints = [
      { latitude: 28.6185, longitude: 77.3726 },
      { latitude: 28.6280, longitude: 77.3649 },
      { latitude: 28.6091, longitude: 77.3730 },
      { latitude: 28.6343, longitude: 77.3699 }
    ]
    if(this.state.mapRegion){
      return (
        <MapView style={{ flex: 1, alignSelf: 'stretch', height: 400 }}
          initialRegion={this.state.mapRegion}
          region={this.state.mapRegion}
          onRegionChange={()=> this._getLocationAsync}
        >
          <MapView.Marker
            coordinate={this.state.mapRegion}
          >
            <Image
              source={require('../assets/images/bus_logo.png')}
              style={{ width: 20, height: 20 }}
            />
          </MapView.Marker>
          {waypoints.map((marker,key) => (
            <MapView.Marker
              key={key}
              coordinate={marker}
            />
          ))}
          <MapView.Marker
            coordinate={destination}
            title="noida sector 61"
          />
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="gray"
            waypoints={waypoints}
          />
        </MapView>
      );
    } else {
      return null;
    }
  }
}