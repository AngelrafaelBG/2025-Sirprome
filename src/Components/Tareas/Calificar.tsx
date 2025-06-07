import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CalificarTarea = () => {
  const navigate = useNavigate();
  const { idProfesor, idGrupo, idTarea, idUsuario } = useParams();
  const [calificacion, setCalificacion] = useState<number>(0);
  const [cargando, setCargando] = useState<boolean>(false);

  const onCalificar = async () => {
    setCargando(true);

    if (calificacion < 0) {
       Swal.fire({
        title: "Valor inválido",
        text: "Por favor, ingresa una calificación válida.",
        icon: "warning",
        confirmButtonText: "Entendido",
      });
      setCargando(false);
      return;
    }

    const url = `http://localhost:4100/CalificarTarea/${idProfesor}/${idGrupo}/${idTarea}/${idUsuario}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Calificacion: calificacion }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "Tarea calificada con éxito",
          text: "La tarea ha sido calificada correctamente.",
          icon: "success",
          confirmButtonText: "Continuar",
        }).then(() => {
          navigate(`/TareaAlumnos/${idProfesor}/${idGrupo}/${idTarea}`);
        });
      } else {
        Swal.fire({
          title: "Error",
          text: data.mensaje || "Hubo un error al calificar la tarea.",
          icon: "error",
          confirmButtonText: "Reintentar",
        });
      }
    } catch (error) {
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
              <img
                src="/Iconos/Icono-Menu.svg"
                alt="icon-udemy"
                className="logo"
              />
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
              <a
                onClick={() =>
                  navigate(`/TareaAlumnos/${idProfesor}/${idGrupo}/${idTarea}`)
                }
                className="Buscar"
              >
                <img src="/Iconos/Icono-Contenedores.svg" alt="" />
                <span>Tareas</span>
              </a>
            </li>
            <li>
              <a>
                <img src="/Iconos/Icono-Enviar.svg" alt="" />
                <span>Calificar Tarea</span>
              </a>
            </li>
            <li>
              <a
                onClick={() =>
                  navigate(`/TareaAlumnos/${idProfesor}/${idGrupo}/${idTarea}`)
                }
              >
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
        <div className="fondo-ver">
          <div className="contenedor-ver">
            <h4>Calificar Tarea</h4>
            <div className="agregar-clase">
              <label htmlFor="calificacion">Calificación:</label>
              <input
                className="agregar-miembro"
                id="calificacion"
                type="number"
                value={calificacion}
                onChange={(e) => setCalificacion(Number(e.target.value))}
                min="0"
              />
            </div>
            <div>
              <button
                onClick={onCalificar}
                disabled={cargando}
                className="boton-criterios boton-subir"
              >
                {cargando ? "Calificando..." : "Calificar Tarea"}{" "}
                <img
                  src="/Iconos/Icono-Enviar.svg"
                  className="imagen-subir"
                ></img>
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default CalificarTarea;