import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import axios from 'axios';
import './NotificationManager.css'; // Importa el CSS aquí

const NotificationManager = () => {
  const [productos, setProductos] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [titulo, setTitulo] = useState('');
  const [cuerpo, setCuerpo] = useState('');
  const [dias, setDias] = useState([]);
  const [hora, setHora] = useState('');

  // Días de la semana
  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  // Obtener productos de la API
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/productos/');
        setProductos(response.data);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };
    fetchProductos();
  }, []);

  // Manejar cambios en los campos
  const handleProductoChange = (event) => setSelectedProduct(event.target.value);
  const handleTituloChange = (event) => setTitulo(event.target.value);
  const handleCuerpoChange = (event) => setCuerpo(event.target.value);
  const handleHoraChange = (event) => setHora(event.target.value);

  const handleDiaToggle = (dia) => {
    if (dias.includes(dia)) {
      setDias(dias.filter((d) => d !== dia));
    } else {
      setDias([...dias, dia]);
    }
  };

  const handleSubmit = () => {
    const nuevaNotificacion = {
      producto: selectedProduct,
      titulo,
      cuerpo,
      dias,
      hora,
    };
    console.log('Notificación creada:', nuevaNotificacion);
    // Aquí podrías enviar la notificación al backend si es necesario
  };

  return (
    <div className="notification-manager-page">
      <div className="notification-manager-container">
        <h1 className="notification-manager-title">Gestión de Notificaciones</h1>

        {/* Formulario de notificación */}
        <form className="notification-manager-form">
          {/* Campo para seleccionar producto */}
          <FormControl fullWidth>
            <InputLabel>Seleccionar Producto</InputLabel>
            <Select value={selectedProduct} onChange={handleProductoChange}>
              {productos.map((producto) => (
                <MenuItem key={producto.id} value={producto.id}>
                  {producto.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Campo para el título de la notificación */}
          <TextField
            label="Título de la Notificación"
            variant="outlined"
            fullWidth
            value={titulo}
            onChange={handleTituloChange}
          />

          {/* Campo para el cuerpo de la notificación */}
          <TextField
            label="Cuerpo de la Notificación"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={cuerpo}
            onChange={handleCuerpoChange}
          />

          {/* Selección de días de la semana */}
          <div className="notification-manager-checkbox-group">
            <h4>Días de la Semana</h4>
            {diasSemana.map((dia) => (
              <FormControlLabel
                key={dia}
                control={
                  <Checkbox
                    checked={dias.includes(dia)}
                    onChange={() => handleDiaToggle(dia)}
                  />
                }
                label={dia}
              />
            ))}
          </div>

          {/* Campo para seleccionar la hora */}
          <TextField
            label="Hora"
            type="time"
            variant="outlined"
            fullWidth
            value={hora}
            onChange={handleHoraChange}
            InputLabelProps={{ shrink: true }}
          />

          {/* Botón para crear la notificación */}
          <Button
            className="notification-manager-button"
            onClick={handleSubmit}
          >
            Crear Notificación
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NotificationManager;
