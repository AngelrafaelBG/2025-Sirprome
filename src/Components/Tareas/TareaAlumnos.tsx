import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../assets/TareaAlumnos.css";

interface Tarea {
  Id: string;
  IdMiembro: string;
  Miembro: string;
  Titulo: string;
  Descripcion: string;
  ValorMaximo: number;
  Calificacion: number | string;
}

const TareaAlumnos = () => {
  const { idProfesor, idGrupo, idTarea } = useParams<{
    idProfesor: string;
    idGrupo: string;
    idTarea: string;
  }>();
  const navigate = useNavigate();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [carga, setCarga] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTareas = async () => {
      if (!idProfesor || !idGrupo || !idTarea) return;

      const url = `http://localhost:4100/TareaAlumnos/${idProfesor}/${idGrupo}/${idTarea}`;

      try {
        const response = await fetch(url, { method: "GET" });
        if (response.ok) {
          const data = await response.json();
          setTareas(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Error al cargar las tareas.");
        }
      } catch (err) {
        console.error(err);
        setError("Error al conectar con el servidor.");
      } finally {
        setCarga(false);
      }
    };

    fetchTareas();
  }, [idProfesor, idGrupo, idTarea]);

  return (
    <main id="main">
      <div>
        {carga && <p className="mensaje-vacio">Cargando tareas...</p>}
        {error && <p className="mensaje-vacio">{error}</p>}
        {tareas.length > 0 ? (
          <div>
            <h4 className="Sub-titulo">Lista de Tareas</h4>
            <ul className="tareas listas">
              {tareas.map((tarea) => (
                <li key={tarea.Id} className="tarea-item">
                  <h5>{tarea.Titulo}</h5>
                  <p>
                    <b>Miembro:</b> {tarea.Miembro}
                  </p>
                  <p>
                    <b>Descripción:</b> {tarea.Descripcion}
                  </p>
                  <p>
                    <b>Valor Máximo:</b> {tarea.ValorMaximo} puntos
                  </p>
                  <p>
                    <b>Calificación:</b> {tarea.Calificacion || "Pendiente"}
                  </p>
                  <button
                    className="boton-criterios"
                    onClick={() =>
                      navigate(
                        `/CalificarTarea/${idProfesor}/${idGrupo}/${idTarea}/${tarea.IdMiembro}`
                      )
                    }
                  >
                    Calificar
                    <img
                      src="/Iconos/Icono-Enviar.svg"
                      alt="Calificar"
                      className="imagen-subir"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          !carga && (
            <p className="mensaje-vacio">
              No se encontraron tareas asignadas.
            </p>
          )
        )}
      </div>
    </main>
  );
};

export default TareaAlumnos;
