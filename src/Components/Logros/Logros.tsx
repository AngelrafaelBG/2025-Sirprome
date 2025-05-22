import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../assets/Barra_Lateral.css";
import "../../assets/ObtenerLogros.css"; 

const Logros = () => {
  const { idUsuario } = useParams<{ idUsuario: string }>();
  const [logros, setLogros] = useState<
    { Id: string; Nombre: string; Descripcion: string; Desbloqueado: boolean }[]
  >([]);

  useEffect(() => {
    const obtenerLogros = async () => {
      try {
        const response = await fetch(`http://localhost:4100/api/Logros/Usuario/${idUsuario}`);
        const data = await response.json();
        console.log("Respuesta del backend:", data); // <-- Agrega esto para depurar

        if (response.ok) {
          setLogros(data);
        } else {
          console.error("Error al obtener los logros:", data.mensaje);
        }
      } catch (error) {
        console.error("Error al conectar con el servidor:", error);
      }
    };

    obtenerLogros();
  }, [idUsuario]);

  return (
    <div>
      <h1>Logros</h1>
      <ul>
        {logros.map((logro) => (
          <li
            key={logro.Id}
            style={{
              color: logro.Desbloqueado ? "green" : "gray",
              fontWeight: logro.Desbloqueado ? "bold" : "normal",
            }}
          >
            <h3>{logro.Nombre}</h3>
            <p>{logro.Descripcion}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Logros;