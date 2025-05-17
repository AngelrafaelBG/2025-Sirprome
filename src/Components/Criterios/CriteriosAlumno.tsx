import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import "../../assets/CriterioAlumno.css";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface CriterioAlumnos {
  IdCriterio: string;
  Alumno: string;
  Criterios: string[];
  Valor: number[];
  Evaluacion: number[];
  ComentariosRecibidos: Array<{ Id: string; EscritoPor: string; Comentario: string }>;
  ComentariosEnviados: Array<{ Id: string; EscritoPor: string; Comentario: string }>;
}

interface Grupo {
  IdProfesor: string;
  Nombre: string;
  Imagen: string;
}

const CriterioAlumno = () => {
  const { id, idGrupo } = useParams();
  const navigate = useNavigate();
  const [grupo, setGrupo] = useState<Grupo>();
  const [criteriosAlumnos, setCriteriosAlumnos] = useState<CriterioAlumnos[]>([]);
  const [carga, setCarga] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState<string>("");

  const criteriosFiltrados = criteriosAlumnos.filter((criterio) =>
    criterio.Alumno.toLowerCase().includes(busqueda.toLowerCase())
  );

  useEffect(() => {
    const fetchCriteriosAlumno = async () => {
      if (!id || !idGrupo) return;

      const url = `http://localhost:4100/CriterioAlumno/${id}/${idGrupo}`;
      try {
        const response = await fetch(url, { method: "GET" });
        if (response.ok) {
          const data = await response.json();
          setGrupo({ Nombre: data.Grupo, Imagen: data.Imagen, IdProfesor: data.IdProfesor });

          const criteriosConComentarios = data.CriteriosAlumnos.map(
            (criterio: any) => ({
              ...criterio,
              ComentariosRecibidos: Array.isArray(criterio.ComentariosRecibidos)
                ? criterio.ComentariosRecibidos
                : [],
              ComentariosEnviados: Array.isArray(criterio.ComentariosEnviados)
                ? criterio.ComentariosEnviados
                : [],
            })
          );

          setCriteriosAlumnos(criteriosConComentarios);
        } else {
          const errorData = await response.json();
          setError(
            errorData.message || "Error al cargar los criterios de los alumnos."
          );
        }
      } catch (err) {
        setError("Error al conectar con el servidor");
      } finally {
        setCarga(false);
      }
    };

    fetchCriteriosAlumno();
  }, [id, idGrupo]);

  useEffect(() => {
    const menu = document.getElementById("menu");
    const barra = document.getElementById("barra");
    const main = document.getElementById("main");

    const toggleMenu = () => {
      barra!.classList.toggle('menu-contraer');
      menu!.classList.toggle('menu-toggle');
      main!.classList.toggle('menu-contraer');
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

  const EliminarComentario = async (
    idComentario: string,
    idCriterio: string
  ) => {
    if (!window.confirm("¿Está seguro de eliminar este comentario?")) return;
    setCarga(true);
  
    try {
      const url = `http://localhost:4100/EliminarComentario/${grupo?.IdProfesor}/${idGrupo}/${idComentario}`;
      const res = await fetch(url, { method: "POST" });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al eliminar el comentario.");
      }
  
      alert("Comentario eliminado con éxito.");
  
      setCriteriosAlumnos((prev) =>
        prev.map((criterio) =>
          criterio.IdCriterio === idCriterio
            ? {
                ...criterio,
                ComentariosRecibidos: criterio.ComentariosRecibidos.filter(
                  (comentario) => comentario.Id !== idComentario
                ),
              }
            : criterio
        )
      );
    } catch (error) {
      alert("Error al eliminar el comentario.");
    } finally {
      setCarga(false);
    }
  };

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
            <li>
              <a onClick={() => navigate(`/VerGrupos/${id}`)} className="Buscar">
                <img src="/Iconos/Icono-Contenido.svg" alt="" />
                <span>Grupos Estudiante</span>
              </a>
            </li>
            <li>
              <a onClick={() => navigate(`/InsertarComentario/${grupo?.IdProfesor}/${idGrupo}/${id}`)}>
                <img src="/Iconos/Icono-Comentario.svg" alt="" />
                <span> Insertar Comentario</span>
              </a>
            </li>
            <li>
              <a onClick={() => navigate(`/VerGrupos/${id}`)}>
                <img src="/Iconos/Icono-Volver.svg" alt="" />
                <span>Volver</span>
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
      
      <main id="main">
        <div className="contenedor-alumno">
          <div className="contenedor-alumno1">
            {carga && <p>Cargando información...</p>}
            {error && <p className="error">{error}</p>}
            
            <input 
              className="input-criterioalumnos"
              type="text"
              placeholder="Buscar por nombre de alumno..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            {grupo && (
              <div className="student-header">
                <div className="student-info">
                  <div className="student-avatar">
                    {grupo.Nombre.charAt(0)}
                  </div>
                  <div>
                    <h3>{grupo.Nombre}</h3>
                    <div className="student-name">
                      {criteriosFiltrados.length > 0 ? criteriosFiltrados[0].Alumno : "Alumno"}
                    </div>
                  </div>
                </div>
                <div className="student-average">
                  Promedio: {criteriosFiltrados.length > 0 ? 
                    (criteriosFiltrados[0].Evaluacion.reduce((a, b) => a + b, 0) / 
                     criteriosFiltrados[0].Evaluacion.length).toFixed(1) : "0"}/10
                </div>
              </div>
            )}

            <h4>Criterios de los Alumnos</h4>
          </div>

          {criteriosFiltrados.length > 0 ? (
            criteriosFiltrados.map((criterio, index) => {
              const datosRadar = criterio.Criterios.map((c, idx) => ({
                criterio: c,
                valor: criterio.Evaluacion[idx],
              }));

              return (
                <div key={index} className="evaluation-container">
                  <div className="criteria-grid">
                    {criterio.Criterios.map((criterioName, idx) => (
                      <div key={idx} className="criteria-item">
                        <div className="criteria-label">{criterioName}</div>
                        <div className="criteria-value">
                          {criterio.Evaluacion[idx]}/10
                        </div>
                      </div>
                    ))}
                  </div>

                  {datosRadar.length > 0 && (
                    <div className="chart-container">
                      <h3 className="chart-title">Gráfica de Evaluación</h3>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={datosRadar}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="criterio" />
                          <PolarRadiusAxis />
                          <Radar
                            name={criterio.Alumno}
                            dataKey="valor"
                            stroke="#8884d7"
                            fill="#8884d8"
                            fillOpacity={0.5}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  <div className="comments-section">
                    <div className="comments-title">Comentarios del Instructor</div>
                    {criterio.ComentariosRecibidos.length > 0 ? (
                      <ul>
                        {criterio.ComentariosRecibidos.map((comentario) => (
                          <li key={comentario.EscritoPor}>
                            <p><b>Comentario:</b> {comentario.Comentario}</p>
                            <button
                              onClick={() => EliminarComentario(comentario.Id, criterio.IdCriterio)} 
                              className="boton-criterios boton-subir"
                            >
                              Eliminar Comentario
                              <MdDelete style={{ fontSize: "20px" }} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="no-comments">No hay comentarios registrados para este período</p>
                    )}
                  </div>

                  <button
                    onClick={() => navigate(`/InsertarComentario/${grupo?.IdProfesor}/${idGrupo}/${id}`)}
                    className="boton-criterios boton-subir"
                  >
                    Enviar Comentario
                    <img src="/Iconos/Icono-Comentario.svg" className="imagen-subir" />
                  </button>
                </div>
              );
            })
          ) : (
            <p>No existen criterios que coincidan con la búsqueda.</p>
          )}
        </div>
      </main>
    </>
  );
};

export default CriterioAlumno;