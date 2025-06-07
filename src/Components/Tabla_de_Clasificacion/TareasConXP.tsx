import React, { useEffect, useState } from "react";

const TareasConXP = ({ idGrupo, idUsuario }: { idGrupo: string; idUsuario: string }) => {
  const [data, setData] = useState<{ XP: number; Tareas: any[] }>({ XP: 0, Tareas: [] });

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const response = await fetch(`http://localhost:4100/api/Grupos/${idGrupo}/TareasConXP/${idUsuario}`);
        const result = await response.json();

        if (response.ok) {
          setData(result);
        } else {
          console.error("Error al obtener los datos:", result.mensaje);
        }
      } catch (error) {
        console.error("Error al conectar con el servidor:", error);
      }
    };

    obtenerDatos();
  }, [idGrupo, idUsuario]);

  return (
    <div>
      <h2>XP Total: {data.XP}</h2>
      <table>
        <thead>
          <tr>
            <th>Tarea</th>
            <th>Descripción</th>
            <th>Valor Máximo</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {data.Tareas.map((tarea) => (
            <tr key={tarea.IdTarea}>
              <td>{tarea.Titulo}</td>
              <td>{tarea.Descripcion}</td>
              <td>{tarea.ValorMax}</td>
              <td>{tarea.Entregada ? "Entregada" : "Pendiente"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TareasConXP;