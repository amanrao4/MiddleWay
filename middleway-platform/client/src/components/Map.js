import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix the marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const Map = ({ center, markers = [], zoom = 13, height = '400px' }) => {
    useEffect(() => {
        // Force a resize event after the map is loaded
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 100);
    }, []);

    return (
        <MapContainer
            center={center || [42.3398, -71.0892]} // Default to Northeastern University
            zoom={zoom}
            style={{ height, width: '100%' }}
            scrollWheelZoom={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {markers.map((marker, index) => (
                <Marker key={index} position={[marker.lat, marker.lng]}>
                    <Popup>{marker.name || 'Marker'}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;