import {GoogleMap, LoadScript, Marker} from "@react-google-maps/api";

import React, {useMemo} from "react";

export interface IMapProps {
    location: {
        latitude: number;
        longitude: number;
    }
}

export interface IMapProps {
    location: {
        latitude: number;
        longitude: number;
    };
    onClick?: ((e: google.maps.MapMouseEvent) => void) | undefined;
}

const mapContainerStyle = {
    height: "200px",
    width: "200px"
};

const center = {
    lat: 0,
    lng: 0
};

export const TravelMap = ({ location: { latitude, longitude }, onClick }: IMapProps) => {
    const [mapLoaded, setMapLoaded] = React.useState(false);

    const onLoad = () => {
        setMapLoaded(true);
    };

    const onLoadError = (error: Error) => {
        console.error("Error loading Google Maps:", error);
    };

    const mapOptions = useMemo(() => ({
        mapTypeId: "roadmap"
    }), []);

    center.lat = latitude;
    center.lng = longitude;

    return (
        <LoadScript
            googleMapsApiKey="AIzaSyAJMQBQHGFFFYkG7G4JeabqyjrCDpu3Mwc"
            onLoad={onLoad}
            onError={onLoadError}
        >
            {mapLoaded && (
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={15}
                    options={mapOptions}
                    onClick={onClick}
                >
                    <Marker position={center} />
                </GoogleMap>
            )}
        </LoadScript>
    );
};

