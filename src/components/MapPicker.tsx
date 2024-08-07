import React from 'react';
import {GoogleMap, LoadScript, Marker, Autocomplete, Libraries} from '@react-google-maps/api';
import {ILocation} from '../models/ordersModels';
import {Input} from "@material-tailwind/react";

const containerStyle = {
    width: '80%',
    height: '60vh'
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
    };

    const onMarkerSelected = (e: google.maps.MapMouseEvent) => {

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
                    placeholder="Buscar un lugar"
                    className="w-full md:w-96 p-3 border border-gray-300 rounded-full shadow-md outline-none text-gray-800 placeholder-gray-500 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
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


