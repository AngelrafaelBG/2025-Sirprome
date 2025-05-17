import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../assets/Barra_Lateral.css";
import "../../assets/infoGrupos.css";

interface Miembro {
  IdUsuario: string;
  Nombre: string;
  Rol:string
  Correo: string;
}

interface Grupo {
  Nombre: string;
  Codigo?: string;
  Imagen: string;
  Miembros: number;
  Rol: string; 
  MiembrosDatos: Miembro[];
  IdCriterio?: string; 
}

const InfoGrupo = () => {
  const { idUsuario, idGrupo } = useParams<{ idUsuario: string; idGrupo: string }>();
  const navigate = useNavigate();
  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const [carga, setCarga] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGrupoData = async () => {
      if (!idUsuario || !idGrupo) return;

      const url = `http://localhost:4100/InfoGrupo/${idUsuario}/${idGrupo}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setGrupo(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Error al cargar la información del grupo");
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Error al conectar con el servidor");
      } finally {
        setCarga(false);
      }
    };

    fetchGrupoData();
  }, [idUsuario, idGrupo]);


  const eliminarMiembro = async (idMiembro: string) => {
    if (!idUsuario || !idGrupo) {
      alert("No se encontró el grupo o usuario.");
      return;
    }

    const confirmacion = window.confirm(`¿Está seguro de que desea eliminar al miembro con ID ${idMiembro}?`);
    if (!confirmacion) return;

    setCarga(true);

    const url = `http://localhost:4100/EliminarMiembro/${idUsuario}/${idGrupo}/${idMiembro}`;

    try {
      const response = await fetch(url, {
        method: "POST",
      });

      if (response.ok) {
        alert("Miembro eliminado con éxito.");
        setGrupo((prevGrupo) => {
          if (!prevGrupo) return prevGrupo;
          const nuevosMiembros = prevGrupo.MiembrosDatos.filter((miembro) => miembro.IdUsuario !== idMiembro);
          return { ...prevGrupo, MiembrosDatos: nuevosMiembros, Miembros: nuevosMiembros.length };
        });
      } else {
        const error = await response.json();
        alert(error.message || "Error al eliminar el miembro.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error al conectar con el servidor.");
    } finally {
      setCarga(false);
    }
  };
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

  const MiembrosList = ({
    miembros,
    onEliminar,
    rol,
  }: {
    miembros: Miembro[];
    onEliminar: (idMiembro: string) => void;
    rol: string;
  }) => (
    <ul>
      {miembros.length > 0 ? (
        miembros.map((miembro, index) => (
          <li key={index} className="miembro-item">
            <p><b>Nombre:</b> {miembro.Nombre}</p>
            <p><b>Correo:</b> {miembro.Correo}</p>
            {rol === "estudiante" && (
              <button
                onClick={() => navigate(`/CriterioAlumno/${idUsuario}/${idGrupo}`)}
                className="btn btn-secondary"
              >
                Ver Criterios
              </button>
            )}
            {rol === "profesor" && miembro.IdUsuario && (
              <>
                <button
                  onClick={() => onEliminar(miembro.IdUsuario)}
                  className="Boton_EliminarCriterio_Detalles"
                >
                  Eliminar
                </button>
                <button
                  onClick={() =>
                    navigate(`/CalificarCriterio/${idUsuario}/${idGrupo}/${grupo?.IdCriterio}/${miembro.IdUsuario}`)
                  }
                  className="Calificar_Criterio_Detalle"
                >
                  Calificar Criterio
                </button>
              </>
            )}
          </li>
        ))
      ) : (
        <p>No hay miembros en este grupo.</p>
      )}
    </ul>
  );

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
              <a onClick={() => navigate(`/MisGrupos/${idUsuario}`)} className="Buscar">
                <img src="/Iconos/Icono-Contenido.svg" alt="" />
                <span>Mis Grupos</span>
              </a>
            </li>
            <li>
              <a onClick={() => navigate(`/InsertarCriterio/${idUsuario}/${idGrupo}/${grupo?.IdCriterio}`)} >
                <img src="/Iconos/Icono-Insertar.svg" alt="" />
                <span>Insertar Criterio</span>
              </a>
            </li>
            <li>
              <a onClick={() => navigate(`/CriterioGrupo/${idUsuario}/${idGrupo}`)} >
                <img src="/Iconos/Icono-Ver.svg" alt="" />
                <span>Ver Criterio</span>
              </a>
            </li>
            <li>
              <a onClick={() => navigate(`/MisGrupos/${idUsuario}`)} >
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

      <div className="info-grupo-container">
  <h2 className="titulo-grupo">Información del Grupo</h2>
  <hr className="linea-decorativa" />

  {carga && (
    <div className="carga-container">
      <div className="spinner"></div>
      <p>Cargando información del grupo...</p>
    </div>
  )}
  {error && <p className="error">{error}</p>}

  {grupo ? (
    <>
      <h3 className="subtitulo-grupo">{grupo.Nombre}</h3>
      <div className="contenido-principal">
        <div className="contenedor-izquierda animar-entrada">
          <div className="imagen-contenedor">
            <img
              className="imagen-grupo"
              src={grupo.Imagen}
              alt={`Imagen del grupo ${grupo.Nombre}`}
            />
          </div>
          <div className="datos-grupo">
            {grupo.Codigo && (
              <p>
                <span className="etiqueta">Código:</span>
                <span className="valor">{grupo.Codigo}</span>
              </p>
            )}
            <p>
              <span className="etiqueta">Miembros:</span>
              <span className="valor">{grupo.Miembros}</span>
            </p>
            <p>
              <span className="etiqueta">Rol:</span>
              <span className="valor rol">{grupo.Rol}</span>
            </p>
          </div>

          {grupo.IdCriterio && (
            <div className="botones-criterios">
              <button
                onClick={() => navigate(`/InsertarCriterio/${idUsuario}/${idGrupo}/${grupo.IdCriterio}`)}
                className="btn-criterio btn-insertar"
              >
                <i className="fas fa-plus-circle"></i> Insertar Criterio
              </button>
              <button
                onClick={() => navigate(`/CriterioGrupo/${idUsuario}/${idGrupo}`)}
                className="btn-criterio btn-ver"
              >
                <i className="fas fa-list-ul"></i> Ver Criterios
              </button>
            </div>
          )}

        </div>

        <div className="contenedor-derecha">
          <h4>
            <i className="fas fa-users"></i> Miembros del Grupo
          </h4>
          <MiembrosList miembros={grupo.MiembrosDatos} onEliminar={eliminarMiembro} rol={grupo.Rol} />
        </div>
      </div>
    </>
  ) : (
    !carga && (
      <div className="sin-info">
        <i className="fas fa-info-circle"></i>
        <p>No se ha encontrado información del grupo.</p>
      </div>
    )
  )}
      </div>
      </main>
    </>
  );
};

export default InfoGrupo;
