import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../assets/ActualizarTarea.css";

const ActualizarTarea = () => {
  const navigate = useNavigate();
  const { idProfesor, idGrupo, idTarea } = useParams();

  const [titulo, setTitulo] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [valorMax, setValorMax] = useState<number | null>(null);
  const [carga, setCarga] = useState<boolean>(false);

  const onActualizarTarea = async () => {
    setCarga(true);
    if (!titulo.trim()) {
      alert("Ingrese el título de la tarea");
      setCarga(false);
      return;
    }
    if (!descripcion.trim()) {
      alert("Ingrese la descripción de la tarea");
      setCarga(false);
      return;
    }
    if (!valorMax || valorMax <= 0) {
      alert("El valor máximo debe ser mayor a 0");
      setCarga(false);
      return;
    }

    const url = `http://localhost:4100/ActualizarTarea/${idProfesor}/${idGrupo}/${idTarea}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Titulo: titulo,
          Descripcion: descripcion,
          ValorMax: valorMax,
        }),
      });

      if (response.ok) {
        alert("Tarea actualizada con éxito");
        navigate(`/TareasGrupo/${idGrupo}`);
      } else {
        const error = await response.json();
        alert(error.message || "Error al actualizar la tarea");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("No se pudo conectar con el servidor para actualizar la tarea");
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
              <a onClick={() => navigate(`/Grupos/${idProfesor}/${idGrupo}`)} className="Buscar">
                <img src="/Iconos/Icono-Contenedores.svg" alt="" />
                <span>Tareas</span>
              </a>
            </li>
            <li>
              <a >
                <img src="/Iconos/Icono-Enviar.svg" alt="" />
                <span>Actualizar Tarea</span>
              </a>
            </li>
            
            <li>
              <a onClick={() => navigate(`/Grupos/${idProfesor}/${idGrupo}`)} >
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
        <div className="fondo1">
          <div className="contenedor-formulario">
            <h4 className="titulo-formulario">Actualizar Tarea</h4>

            <div className="campo-formulario">
              <label>Título de la Tarea</label>
              <input
                className="input-criterio"
                type="text"
                placeholder="Título de la tarea"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>

            <div className="campo-formulario">
              <label>Descripción de la Tarea</label>
              <textarea
                className="input-area"
                placeholder="Descripción de la tarea"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              ></textarea>
            </div>

            <div className="campo-formulario">
              <label>Valor Máximo</label>
              <input
                className="input-criterio"
                type="number"
                placeholder="Valor máximo"
                value={valorMax || ""}
                onChange={(e) => setValorMax(Number(e.target.value))}
              />
            </div>

            <div className="boton-contenedor">
              <button
                onClick={onActualizarTarea}
                disabled={carga}
                className="boton boton-actualizar"
              >
                {carga ? "Actualizando..." : "Actualizar Tarea"}
                <img src="/Iconos/Icono-Enviar.svg" className="imagen-subir" alt="Actualizar" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ActualizarTarea;
