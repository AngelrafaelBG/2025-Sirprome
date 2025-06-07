import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import "../../assets/Barra_Lateral.css";
import "../../assets/insertarCriterios.css";

const InsertarCriterios = () => {
  const navigate = useNavigate();
  const { idProfesor, idGrupo, idCriterio } = useParams();
  const [criterio, setCriterio] = useState<string>("");
  const [valor, setValor] = useState<number>(0);
  const [cargando, setCargando] = useState<boolean>(false);

  const onInsertarCriterios = async () => {
    setCargando(true);

    if (!idProfesor || !idGrupo || !idCriterio) {
      Swal.fire({
        title: "Error",
        text: "Faltan parámetros en la URL (idProfesor, idGrupo o idCriterio).",
        icon: "error",
        confirmButtonText: "Entendido",
      });
      setCargando(false);
      return;
    }

    if (!criterio.trim()) {
      Swal.fire({
        title: "Campo requerido",
        text: "Por favor, introduce el nombre del criterio.",
        icon: "warning",
        confirmButtonText: "Entendido",
      });
      setCargando(false);
      return;
    }

    if (valor <= 0) {
      Swal.fire({
        title: "Valor inválido",
        text: "El valor del criterio debe ser mayor a 0.",
        icon: "warning",
        confirmButtonText: "Entendido",
      });
      setCargando(false);
      return;
    }

    const url = `http://localhost:4100/InsertarCriterio/${idProfesor}/${idGrupo}/${idCriterio}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ criterio, valor }),
      });

      if (response.ok) {
        Swal.fire({
          title: "Criterio insertado con éxito",
          text: "El criterio se ha insertado correctamente.",
          icon: "success",
          confirmButtonText: "Continuar",
        }).then(() => {
          navigate(`/InfoGrupo/${idProfesor}/${idGrupo}`);
        });
      } else {
        const error = await response.json();
        Swal.fire({
          title: "Error",
          text: error.message || "Hubo un error al insertar el criterio.",
          icon: "error",
          confirmButtonText: "Reintentar",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor.",
        icon: "error",
        confirmButtonText: "Reintentar",
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const menu = document.getElementById("menu");
    const barra = document.getElementById("barra");
    const main = document.getElementById("main");

    const toggleMenu = () => {
      barra!.classList.toggle("menu-contraer");
      menu!.classList.toggle("menu-toggle");
      main!.classList.toggle("menu-contraer");
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
              <img src="/Iconos/Icono-Menu.svg" alt="icon-menu" className="logo" />
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
                <img src="/Iconos/Icono-Contenedores.svg" alt="Info Grupo" />
                <span>Info Grupo</span>
              </a>
            </li>
            <li>
              <a onClick={onInsertarCriterios}>
                <img src="/Iconos/Icono-Insertar.svg" alt="Insertar Criterio" />
                <span>Insertar Criterio</span>
              </a>
            </li>
            <li>
              <a onClick={() => navigate(`/InfoGrupo/${idProfesor}/${idGrupo}`)}>
                <img src="/Iconos/Icono-Volver.svg" alt="Volver" />
                <span>Volver</span>
              </a>
            </li>
            <li>
              <a href="/">
                <img src="/Iconos/Icono-EliminarUsuario.svg" alt="Cerrar Sesión" />
                <span>Cerrar Sesión</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      
      <main id="main">
        <div className="fondo-criterios">
          <div className="contenedor-criterios">
            <h4 className="titulo-criterios">Insertar Criterios</h4>
            <div className="contenedor-criterio">
              <label htmlFor="criterio" className="criterio-texto">
                Nombre del Criterio:
              </label>
              <input
                className="input-criterio"
                id="criterio"
                type="text"
                placeholder="Introduce el nombre del criterio"
                value={criterio}
                onChange={(e) => setCriterio(e.target.value)}
              />
            </div>
            <div className="contenedor-criterio">
              <label htmlFor="valor" className="criterio-texto">
                Valor:
              </label>
              <input
                className="input-criterio"
                id="valor"
                type="number"
                placeholder="Introduce el valor del criterio"
                value={valor}
                onChange={(e) => setValor(Number(e.target.value))}
              />
            </div>
            <div>
              <button onClick={onInsertarCriterios} disabled={cargando} className="criterio-boton boton-subir">
                {cargando ? "Insertando..." : "Insertar Criterio"}
                <img src="/Iconos/Icono-Insertar.svg" className="imagen-subir" alt="Insertar" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default InsertarCriterios;
