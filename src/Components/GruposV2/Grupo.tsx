import { useEffect, useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import "../../assets/Barra_Lateral.css";
import "../../assets/Grupo.css";

interface Tarea {
  IdUsuario: string;
  IdTarea: string;
  Titulo: string;
  Descripcion: string;
  ValorMax: number;
  Calificacion?: number; 
  Evidencia?: string;    
}

interface Grupo {
  IdUsuario: string;
  Nombre: string;
  Imagen: string;
  Tareas: Tarea[];
  Rol: string;
  IdProfesor?: string;
  Miembros?: string[];
}

const Grupo = () => {
  const { idUsuario, idGrupo } = useParams<{ idUsuario: string; idGrupo: string }>();
  const navigate = useNavigate();
  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGrupoData = async () => {
      if (!idUsuario || !idGrupo) return;

      const url = `http://localhost:4100/Grupo/${idUsuario}/${idGrupo}`;
      try {
        const response = await fetch(url, { method: "GET" });

        if (response.ok) {
          const data = await response.json();
          setGrupo(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Error al cargar la información del grupo.");
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Error al conectar con el servidor.");
      } finally {
        setCargando(false);
      }
    };

    fetchGrupoData();
  }, [idUsuario, idGrupo]);

  useEffect(() => {
    const menu = document.getElementById("menu");
    const barra = document.getElementById("barra");
    const main = document.getElementById("main");

    const toggleMenu = () => {
      barra?.classList.toggle('menu-contraer');
      menu?.classList.toggle('menu-toggle');
      main?.classList.toggle('menu-contraer');
    };

    if (menu) {
      menu.addEventListener("click", toggleMenu);
    }

    return () => {
      if (menu) {
        menu.removeEventListener("click", toggleMenu);
      }
    };
  }, []);

  return (
    <>
      <header>
        <div className="izq">
          <div className="menu-conteiner">
            <div className="menu" id="menu">
              <img src="/Iconos/Icono-Menu.svg" alt="icon-udemy" className="logo" />
            </div>
          </div>
          <div className="brand">
            <span className="uno">Sirprome</span>
          </div>
        </div>
      </header>
      <div className="barra-lateral" id="barra">
        <nav>
          <ul>
            {grupo && grupo.Rol === "estudiante" && (
              <li>
                <a onClick={() => navigate(`/VerGrupos/${idUsuario}`)} className="Buscar">
                  <img src="/Iconos/Icono-Contenido.svg" alt="" />
                  <span>Ver Grupos</span>
                </a>
              </li>
            )}
            {grupo && grupo.Rol === "profesor" && (
              <li>
                <a onClick={() => navigate(`/MisGrupos/${idUsuario}`)} className="Buscar">
                  <img src="/Iconos/Icono-Contenido.svg" alt="" />
                  <span>Ver Grupos</span>
                </a>
              </li>
            )}
            <li>
              <a onClick={() => navigate(`/MisGrupos/${idUsuario}`)}>
                <img src="/Iconos/Icono-Volver.svg" alt="" />
                <span>Volver</span>  
              </a>
            </li>
            <li>
              <a onClick={() => navigate(`/SubirTarea/${idUsuario}/${idGrupo}`)}>
                <img src="/Iconos/Icono-CrearContenidos.svg" alt="" />
                <span>Subir Evidencia</span>
              </a>
            </li>
            <li>
              <a href="/">
                <img src="/Iconos/Icono-EliminarUsuario.svg" alt="" />
                <span>Cerrar Sesion</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="info-grupo nuevo-estilo">
  <div className="header-grupo">
    <h4 className="titulo-principal">Información del Grupo</h4>
  </div>

  {cargando && <p>Cargando...</p>}
  {error && <p className="error">{error}</p>}

  {grupo && (
    <div className="contenido-grupo">
      <div className="lado-izquierdo">
        <h5 className="nombre-grupo">{grupo.Nombre}</h5>
        {grupo.Rol === "profesor" && (
          <button
            className="boton boton-crear"
            onClick={() => navigate(`/InsertarTarea/${idUsuario}/${idGrupo}`)}
          >
            <IoIosAddCircle />
            Crear Tarea
          </button>
        )}
      </div>

      <div className="lado-derecho animado fade-in">
        <h6 className="sub-titulo">Tareas:</h6>
        <div className="tasks-grid">
          {grupo.Tareas.map((tarea) => (
            <div key={tarea.IdTarea} className="task-card slide-in-bottom">
              <div className="task-header">
                <h3>{tarea.Titulo}</h3>
                <div className="task-points">{tarea.ValorMax} pts</div>
              </div>
              <p className="task-description">{tarea.Descripcion}</p>

              {grupo.Rol === "estudiante" && (
                <>
                  <p><b>Calificación:</b> {tarea.Calificacion ?? "Sin calificar"}</p>
                  <p><b>Evidencia:</b> {tarea.Evidencia ?? "No enviada"}</p>
                  <button
                    onClick={() =>
                      navigate(`/SubirTarea/${idUsuario}/${idGrupo}/${tarea.IdTarea}`)
                    }
                    className="boton-subir"
                  >
                    Subir Evidencia
                    <img src="/Iconos/Icono-CrearContenido.svg" className="imagen-subir" />
                  </button>
                </>
              )}

              {grupo.Rol === "profesor" && (
                <div className="acciones-tarea">
                  <button
                    onClick={() =>
                      navigate(`/ActualizarTarea/${idUsuario}/${idGrupo}/${tarea.IdTarea}`)
                    }
                    className="boton boton-actualizar"
                  >
                    <img src="/Iconos/Icono-Insertar.svg" alt="Actualizar" />
                    Actualizar Tarea
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/TareaAlumnos/${idUsuario}/${idGrupo}/${tarea.IdTarea}`)
                    }
                    className="boton boton-ver"
                  >
                    <img src="/Iconos/Icono-Ver.svg" alt="Ver" />
                    Ver Tarea
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )}

  {!cargando && !grupo && <p>No se encontró información del grupo.</p>}
</div>

    </>
  );
};

export default Grupo;
