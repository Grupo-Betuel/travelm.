import React from 'react';
import {GoogleMap, LoadScript, Marker, Autocomplete, Libraries} from '@react-google-maps/api';
import {ILocation} from '../models/ordersModels';
import {Input} from "@material-tailwind/react";

const containerStyle = {
    width: '400px',
    height: '400px'
};

const center = {
    lat: -3.745,
    lng: -38.523
};

interface MapPickerProps {
    onLocationSelect: (location: ILocation) => void;
}

const mapLibraries: Libraries = ['places'];

const MapPicker: React.FC<MapPickerProps> = ({onLocationSelect}) => {
    const [marker, setMarker] = React.useState(center);
    const mapRef = React.useRef<any>(null);
    const autocomplete = React.useRef<any>(null)

    const onLoad = (mapInstance: google.maps.Map) => {
        mapRef.current = mapInstance;
        // mapInstance.addListener('mouseover', () => {
        //     // @ts-ignore
        //     mapInstance.getDiv().style.cursor = 'pointer';
        // });
        // mapInstance.addListener('mouseout', () => {
        //     // @ts-ignore
        //     mapInstance.getDiv().style.cursor = '';
        // });
    };

    const onMarkerSelected = (e: google.maps.MapMouseEvent) => {
        // const location: ILocation = {
        //     latitude: e?.latLng?.lat() || 0,
        //     longitude: e?.latLng?.lng() || 0,
        //     address: '',
        //     city: '',
        //     country: '',
        //     province: '',
        //     description: '',
        //     link: ''
        // };

        onPlaceSelected({geometry: {location: e.latLng} as google.maps.places.PlaceResult})
    }

    const onPlaceSelected = (placeData?: any) => {
        if (autocomplete.current !== null) {
            const place: any = placeData || autocomplete.current.getPlace();
            if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                const link = place.place_id ?
                    `https://www.google.com/maps/place/?q=place_id:${place.place_id}` :
                    `https://www.google.com/maps/place/?q=${lat},${lng}`;
                const location: ILocation = {
                    link,
                    latitude: lat,
                    longitude: lng,
                    address: place.formatted_address || '',
                    city: place.address_components?.find(ac => ac.types.includes("locality"))?.long_name || '',
                    country: place.address_components?.find(ac => ac.types.includes("country"))?.long_name || '',
                    province: place.address_components?.find(ac => ac.types.includes("administrative_area_level_1"))?.long_name || '',
                    description: '',
                };

                // setMarker(place.geometry.location.toJSON());
                onLocationSelect(location);
                setMarker({lat: place.geometry.location.lat(), lng: place.geometry.location.lng()});
                mapRef.current?.panTo(place.geometry.location);
            }
        }
    };

    // @ts-ignore
    return (
        <LoadScript
            googleMapsApiKey="AIzaSyAJMQBQHGFFFYkG7G4JeabqyjrCDpu3Mwc"
            libraries={mapLibraries}
        >

            <Autocomplete
                onLoad={(auto) => {
                    autocomplete.current = auto;
                }}
                onPlaceChanged={() => onPlaceSelected(autocomplete.current?.getPlace())}
            >
                <input
                    type="text"
                    placeholder="Search for a place"
                    style={{
                        boxSizing: `border-box`,
                        border: `1px solid transparent`,
                        width: `240px`,
                        height: `32px`,
                        padding: `0 12px`,
                        borderRadius: `3px`,
                        boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                        fontSize: `14px`,
                        outline: `none`,
                        textOverflow: `ellipses`,
                        position: `absolute`,
                        left: `50%`,
                        marginLeft: `-120px`,
                        zIndex: 99999999
                    }}
                />
            </Autocomplete>
            <GoogleMap
                onLoad={onLoad}
                mapContainerStyle={containerStyle}
                center={center}
                zoom={15}
                onClick={onMarkerSelected}
            >
                <Marker position={marker}/>
            </GoogleMap>
        </LoadScript>
    );
}

export default MapPicker;


