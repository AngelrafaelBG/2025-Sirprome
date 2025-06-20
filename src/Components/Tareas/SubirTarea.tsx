import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import "../../assets/Barra_Lateral.css";
import "../../assets/SubirTarea.css";

const SubirTarea = () => {
  const navigate = useNavigate();
  const { idUsuario, idGrupo, idTarea } = useParams<{ idUsuario: string; idGrupo: string; idTarea: string }>();
  const [evidencia, setEvidencia] = useState<string>("");
  const [cargando, setCargando] = useState<boolean>(false);
  const [logro, setLogro] = useState<string>("");

  const subirTarea = async () => {
    if (!evidencia.trim()) {
      Swal.fire({
        title: "Campo requerido",
        text: "Por favor, ingresa la evidencia.",
        icon: "warning",
        confirmButtonText: "Entendido",
      });
      return;
    }

    setCargando(true);

    try {
      const response = await fetch(
        `http://localhost:4100/SubirTarea/${idUsuario}/${idGrupo}/${idTarea}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Evidencia: evidencia }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        Swal.fire({
          title: "Error",
          text: data.mensaje || response.statusText,
          icon: "error",
          confirmButtonText: "Reintentar",
        });
      } else {
        setLogro(data.logroDesbloqueado);
        Swal.fire({
          title: "Tarea subida con éxito",
          text: data.logroDesbloqueado
            ? `¡Logro desbloqueado: ${data.logroDesbloqueado}!`
            : "La tarea se ha subido correctamente.",
          icon: "success",
          confirmButtonText: "Continuar",
        }).then(() => {
          navigate(`/Grupos/${idUsuario}/${idGrupo}`);
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al subir la tarea.",
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
              <a href="#" className="Buscar">
                <img src="/Iconos/Icono-Contenedores.svg" alt="" />
                <span>Tareas de Estudiante</span>
              </a>
            </li>
            <li>
              <a onClick={() => navigate(`/Grupos/${idUsuario}/${idGrupo}`)}>
                <img src="/Iconos/Icono-Volver.svg" alt="" />
                <span>Volver</span>
              </a>
            </li>
            <li>
              <a onClick={subirTarea}>
                <img src="/Iconos/Icono-Contenedor.svg" alt="" />
                <span>Subir Evidencia</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <main id="main">
        <div className="fondo-subir">
          <div className="contenedor-subir">
            <h4 className="titulo-subir">Subir Evidencia de Tarea</h4>
            <div className="acomodo-subir">
              <div className="arreglo-subir">
                <label htmlFor="evidencia">Evidencia:</label>
              </div>
              <textarea
                id="evidencia"
                value={evidencia}
                onChange={(e) => setEvidencia(e.target.value)}
                rows={5}
                cols={40}
                placeholder="Escribe aquí tu evidencia (texto, enlace, etc.)"
                disabled={cargando}
              />
            </div>
            <button onClick={subirTarea} className="boton-criterios boton-subir" disabled={cargando}>
              {cargando ? "Subiendo..." : "Subir Tarea"}
              <img src="/Iconos/Icono-Enviar.svg" className="imagen-subir" />
            </button>
            {/* Mostrar el logro desbloqueado */}
            {logro && (
              <div className="logro-desbloqueado">
                <h3>¡Logro Desbloqueado!</h3>
                <p>{logro}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default SubirTarea;
