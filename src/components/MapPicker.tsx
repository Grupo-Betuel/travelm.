import React from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete, Libraries } from '@react-google-maps/api';
import { ILocation } from '../models/ordersModels';
import { Input } from "@material-tailwind/react";

const containerStyle = {
    width: '100%',
    height: '50vh'
};

interface MapPickerProps {
    initialLocation: {
        latitude: number;
        longitude: number;
    };
    onLocationSelect: (location: ILocation) => void;
}

const mapLibraries: Libraries = ['places'];

const MapPicker: React.FC<MapPickerProps> = ({ initialLocation, onLocationSelect }) => {
    const [marker, setMarker] = React.useState({
        lat: initialLocation.latitude,
        lng: initialLocation.longitude
    });

    const mapRef = React.useRef<google.maps.Map | null>(null);
    const autocomplete = React.useRef<any>(null);

    const onLoad = (mapInstance: google.maps.Map) => {
        mapRef.current = mapInstance;
    };

    const onMarkerSelected = (e: google.maps.MapMouseEvent) => {
        onPlaceSelected({ geometry: { location: e.latLng } as google.maps.places.PlaceResult });
    };

    const onPlaceSelected = (placeData?: any) => {
        if (autocomplete.current !== null) {
            const place: any = placeData || autocomplete.current.getPlace();
            if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                const link = place.place_id
                    ? `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
                    : `https://www.google.com/maps/place/?q=${lat},${lng}`;
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

                onLocationSelect(location);
                setMarker({ lat, lng });
                mapRef.current?.panTo(place.geometry.location);
            }
        }
    };

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
                    className="w-full p-2 border border-gray-300 rounded-md shadow-md outline-none text-gray-800 placeholder-gray-500 transition-all focus:border-gray-900 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                />
            </Autocomplete>
            <GoogleMap
                onLoad={onLoad}
                mapContainerStyle={containerStyle}
                center={marker}
                zoom={15}
                onClick={onMarkerSelected}
            >
                <Marker position={marker} />
            </GoogleMap>
        </LoadScript>
    );
}

export default MapPicker;
