import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../assets/Barra_Lateral.css";
import "../../assets/criterioGrupo.css";
const CriterioGrupo = () => {
  const { idProfesor, idGrupo } = useParams();
  const navigate = useNavigate();
  const [grupo, setGrupo] = useState<any | null>(null);
  const [criterios, setCriterios] = useState<any[]>([]);
  const [carga, setCarga] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCriteriosGrupo = async () => {
      if (!idProfesor || !idGrupo) return;

      const url = `http://localhost:4100/CriterioGrupo/${idProfesor}/${idGrupo}`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setGrupo({ Nombre: data.Grupo, Imagen: data.Imagen });
          setCriterios(data.Criterio || []); 
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Error al cargar los criterios del grupo.");
        }
      } catch (err) {
        setError("Error al conectar con el servidor.");
      } finally {
        setCarga(false);
      }
    };

    fetchCriteriosGrupo();
  }, [idProfesor, idGrupo]);
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

  const eliminarCriterio = async (criterio: string, idCriterio: string) => {
    if (!window.confirm(`¿Está seguro de eliminar el criterio "${criterio}"?`)) return;
    setCarga(true);
  
    try {
      const res = await fetch(
        `http://localhost:4100/EliminarCriterio/${idProfesor}/${idGrupo}/${idCriterio}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Criterio: criterio }),
        }
      );
  
      if (!res.ok) {
        throw new Error(await res.text());
      }
  

      setCriterios((prev) => prev.filter((c) => c.IdCriterio !== idCriterio));
      alert("Criterio eliminado con éxito.");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar el criterio.");
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
              <a onClick={() => navigate(`/InfoGrupo/${idProfesor}/${idGrupo}`)} className="Buscar">
                <img src="/Iconos/Icono-Contenedores.svg" alt="" />
                <span>Info Grupo</span>
              </a>
            </li>
            <li>
              <a onClick={() => navigate(`/InfoGrupo/${idProfesor}/${idGrupo}`)} >
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
        <div className="info-grupo">
          {carga && <div className="carga">Cargando información...</div>}
          {error && <div className="error-message">{error}</div>}

          {!carga && !error && grupo && (
            <div className="grupo-header">
              <h1 className="grupo-titulo">
                <span className="grupo-nombre">{grupo.Nombre}</span>
                <span className="grupo-subtitulo">Criterios de Evaluación</span>
              </h1>
              <div className="decorative-line"></div>
            </div>
          )}

          <div className="criterios-container">
            {criterios.length > 0 ? (
              <div className="criterios-lista">
                {criterios.map((criterio) => (
                  <div key={criterio.IdCriterio} className="criterio-item">
                    <div className="criterio-contenido">
                      <h3 className="criterio-nombre">
                        {criterio.Criterio.join(", ")}
                      </h3>
                      <p className="criterio-valor">
                        <span className="valor-label">Valores:</span> 
                        {criterio.Valor.join(", ")}
                      </p>
                    </div>
                    <div className="criterio-acciones">
                      <button
                        className="boton-accion boton-actualizar"
                        onClick={() => navigate(`/ActualizarCriterio/${idProfesor}/${idGrupo}/${criterio.IdCriterio}`)}
                      >
                        <img src="/Iconos/Icono-Insertar.svg" alt="Actualizar" className="icono-accion" />
                        <span>Editar</span>
                      </button>
                      <button
                        className="boton-accion boton-eliminar"
                        onClick={() => eliminarCriterio(criterio.Criterio.join(", "), criterio.IdCriterio)}
                      >
                        <img src="/Iconos/Icono-Eliminar.svg" alt="Eliminar" className="icono-accion" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !carga && <div className="sin-criterios">
                <p>No se han definido criterios para este grupo</p>
                <button 
                  className="boton-primario"
                  onClick={() => navigate(`/AgregarCriterio/${idProfesor}/${idGrupo}`)}
                >
                  Agregar Primer Criterio
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default CriterioGrupo;
