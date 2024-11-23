import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import axios from "axios";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const defaultCenter = { lat: -27.4675279, lng: -58.8263367 }; // Coordenadas por defecto

const MapScreen = () => {
  const [locations, setLocations] = useState([]); // Datos de los supermercados
  const [selected, setSelected] = useState(null); // Supermercado seleccionado
  const [currentLocation, setCurrentLocation] = useState(null); // Ubicación actual del usuario
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  // Cargar ubicaciones desde la API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/superusers");
        const data = response.data.map((superuser) => ({
          id: superuser.id,
          lat: superuser.ubicacion.latitud,
          lng: superuser.ubicacion.longitud,
          name: superuser.cadena,
          address: superuser.direccion,
          ciudad: superuser.ciudad,
          telefono: superuser.telefono,
        }));
        setLocations(data);
      } catch (err) {
        console.error("Error al cargar las ubicaciones:", err);
        setError("No se pudieron cargar las ubicaciones.");
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Obtener la ubicación actual del usuario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          console.error("Error al obtener la ubicación actual:", err);
          setError("No se pudo obtener tu ubicación.");
        }
      );
    } else {
      setError("La geolocalización no está soportada por este navegador.");
    }
  }, []);

  if (error) return <p>Error: {error}</p>;

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentLocation || defaultCenter}
        zoom={currentLocation ? 16 : 14}
      >
        {/* Marcador para la ubicación actual */}
        {currentLocation && (
          <Marker
            position={currentLocation}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            }}
          />
        )}

        {/* Marcadores de supermercados */}
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={{ lat: location.lat, lng: location.lng }}
            onClick={() => setSelected(location)} // Seleccionar el supermercado
          />
        ))}

        {/* InfoWindow para el supermercado seleccionado */}
        {selected && (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => setSelected(null)} // Cerrar InfoWindow
          >
            <div>
              <h3>{selected.name}</h3>
              <p>Dirección: {selected.address}</p>
              <p>Ciudad: {selected.ciudad}</p>
              <p>Teléfono: {selected.telefono}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapScreen;
