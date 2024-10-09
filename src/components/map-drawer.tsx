import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Rectangle,
  useMapEvents,
} from "react-leaflet";
import { LatLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";

interface Coordinates {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const MapDrawer: React.FC = () => {
  const [firstPoint, setFirstPoint] = useState<[number, number] | null>(null);
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  const DrawControl = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        if (!firstPoint) {
          setFirstPoint([lat, lng]);
          setBounds(new LatLngBounds([lat, lng], [lat, lng]));
        } else {
          const newBounds = new LatLngBounds(firstPoint, [lat, lng]);
          setBounds(newBounds);

          const sw = newBounds.getSouthWest();
          const ne = newBounds.getNorthEast();
          setCoordinates({
            x1: sw.lng,
            y1: ne.lat,
            x2: ne.lng,
            y2: sw.lat,
          });

          // Reset firstPoint for the next rectangle
          setFirstPoint(null);
        }
      },
    });

    return bounds ? <Rectangle bounds={bounds} /> : null;
  };

  return (
    <div>
      <MapContainer
        center={[0, 0]}
        zoom={3}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <DrawControl />
      </MapContainer>
      {coordinates && (
        <div>
          <h3>Rectangle Coordinates:</h3>
          <p>
            Top-left: ({coordinates.x1.toFixed(6)}, {coordinates.y1.toFixed(6)})
          </p>
          <p>
            Bottom-right: ({coordinates.x2.toFixed(6)},{" "}
            {coordinates.y2.toFixed(6)})
          </p>
        </div>
      )}
    </div>
  );
};

export default MapDrawer;
