import { MapContainer, TileLayer, Rectangle, useMap } from 'react-leaflet';
import { useEffect } from 'react';

// Helper component to auto-zoom the map to the satellite image bounds
function MapBounds({ bounds }: { bounds: [[number, number], [number, number]] }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
}

export default function GeoMap({ boundsData }: { boundsData: any }) {
  if (!boundsData) return null;

  // Leaflet expects [lat, lng] format (Y, X)
  const leafletBounds: [[number, number], [number, number]] = [
    [boundsData.bottom, boundsData.left], // South-West
    [boundsData.top, boundsData.right]    // North-East
  ];

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden border border-slate-800 relative z-0">
      <MapContainer 
        bounds={leafletBounds} 
        scrollWheelZoom={false} 
        className="h-full w-full bg-slate-900"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />
        <Rectangle 
          bounds={leafletBounds} 
          pathOptions={{ color: '#14b8a6', weight: 2, fillOpacity: 0.2 }} 
        />
        <MapBounds bounds={leafletBounds} />
      </MapContainer>
    </div>
  );
}