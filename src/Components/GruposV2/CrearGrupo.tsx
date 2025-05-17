import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../assets/Barra_Lateral.css";
import "../../assets/Crear_Grupo.css";

const CrearGrupo = () => {
  const navigate = useNavigate();
  const { idProfesor } = useParams<{ idProfesor: string }>();
  const [nombre, setNombre] = useState<string>("");
  const [imagen, setImagen] = useState<string>("");
  const [carga, setCarga] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ nombre?: string; imagen?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { nombre?: string; imagen?: string } = {};

    if (!nombre.trim()) {
      newErrors.nombre = "El nombre del grupo es requerido";
    }

    if (imagen.trim() && !isValidUrl(imagen.trim())) {
      newErrors.imagen = "Por favor ingresa una URL válida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const onCrearGrupo = async () => {
    if (!validateForm()) return;
    
    setCarga(true);

    const url = `http://localhost:4100/CrearGrupo/${idProfesor}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Nombre: nombre,
          Imagen: imagen,
          IdProfesor: idProfesor,
        }),
      });

      if (response.ok) {
        alert("Grupo creado con éxito");
        setNombre("");
        setImagen("");
        navigate(`/MisGrupos/${idProfesor}`);
      } else {
        const error = await response.json();
        alert(error.message || "Error al crear el grupo");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("No se pudo conectar con el servidor");
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
              <a onClick={() => navigate(`/MisGrupos/${idProfesor}`)} className="Buscar">
                <img src="/Iconos/Icono-Contenido.svg" alt="" />
                <span>Mis Grupos</span>
              </a>
            </li>
            <li>
              <a onClick={() => {}} className="active">
                <img src="/Iconos/Icono-CrearContenidos.svg" alt="" />
                <span>Crear Grupo</span>
              </a>
            </li>
            <li>
              <a onClick={() => navigate(`/MisGrupos/${idProfesor}`)}>
                <img src="/Iconos/Icono-Volver.svg" alt="" />
                <span>Volver</span>
              </a>
            </li>
            <li>
              <a href="/">
                <img src="/Iconos/Icono-EliminarUsuario.svg" alt="" />
                <span>Cerrar Sesión</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      
      <main id="main">
        <div className="crear-grupo-container">
          <h1>Crear Nuevo Grupo</h1>
          
          <div className="form-group">
            <label htmlFor="groupName">Nombre del Grupo</label>
            <input
              type="text"
              id="groupName"
              placeholder="Ingresa el nombre del grupo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={errors.nombre ? "input-error" : ""}
            />
            {errors.nombre && <div className="error-message">{errors.nombre}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="groupImage">Imagen del Grupo (URL)</label>
            <input
              type="url"
              id="groupImage"
              placeholder="Ingresa la URL de la imagen"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
              className={errors.imagen ? "input-error" : ""}
            />
            {errors.imagen && <div className="error-message">{errors.imagen}</div>}
            
            <div className="image-preview">
              {imagen ? (
                <img 
                  src={imagen} 
                  alt="Vista previa" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.style.display = "none";
                  }}
                />
              ) : (
                <span className="default-icon">👥</span>
              )}
            </div>
            
            <button 
              type="button" 
              className="upload-btn"
              onClick={() => alert("En una implementación real, esto abriría un selector de archivos")}
            >
              Subir imagen
            </button>
          </div>
          
          <div className="divider"></div>
          
          <button 
            type="button" 
            className="submit-btn"
            onClick={onCrearGrupo}
            disabled={carga}
          >
            {carga ? "Creando..." : "Crear Grupo"}
          </button>
        </div>
      </main>
    </>
  );
};

export default CrearGrupo;