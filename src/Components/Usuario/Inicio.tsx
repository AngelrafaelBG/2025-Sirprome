import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../assets/Inicio_Secion.css";
import Swal from "sweetalert2";

const GestionUsuario = () => {
  const navigate = useNavigate();
  const { idUsuario } = useParams();
  const [vistaActual, setVistaActual] = useState("inicio");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState("");
  const [carga, setCarga] = useState(false);

  useEffect(() => {
    if (vistaActual === "actualizarRol" && (!idUsuario || idUsuario.length !== 36)) {
      alert("Acceso inválido");
      navigate("/");
    }
  }, [vistaActual, idUsuario, navigate]);

  const onIngresar = async () => {
    setCarga(true);
    if (!correo.trim() || !contraseña.trim()) {
      Swal.fire({
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos.",
        icon: "warning",
        confirmButtonText: "Entendido",
      });
      setCarga(false);
      return;
    }

    const url = "http://localhost:4100/Inicio";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Correo: correo, Contraseña: contraseña }),
      });

      if (response.ok) {
        const data = await response.json();
        const idUsuario = data.id;
        const rol = data.rol;

        if (!idUsuario) throw new Error("No se recibió un ID válido");

        // Mostrar animación de inicio de sesión exitoso
        Swal.fire({
          title: "Inicio de sesión exitoso",
          text: "¡Bienvenido a SIRPROME!",
          icon: "success",
          confirmButtonText: "Continuar",
        }).then(() => {
          navigate(rol === "estudiante" ? `/VerGrupos/${idUsuario}` : `/MisGrupos/${idUsuario}`);
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Error al iniciar sesión.",
          icon: "error",
          confirmButtonText: "Reintentar",
        });
      }
    } catch {
      Swal.fire({
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor.",
        icon: "error",
        confirmButtonText: "Reintentar",
      });
    } finally {
      setCarga(false);
    }
  };

  const onRegistrar = async () => {
    setCarga(true);
    if (!nombre.trim() || !correo.trim() || !contraseña.trim()) {
      alert("Por favor, completa todos los campos.");
      setCarga(false);
      return;
    }
    const url = "http://localhost:4100/Registrar";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Nombre: nombre, Correo: correo, Contraseña: contraseña }),
      });
      if (response.ok) {
        const data = await response.json();
        navigate(`/Seleccionar-Rol/${data.id}`);
      } else {
        alert("Error al registrar usuario.");
      }
    } catch {
      alert("Error al conectar con el servidor.");
    } finally {
      setCarga(false);
    }
  };

  const onRecuperar = async () => {
    setCarga(true);
    if (!correo.trim()) {
      alert("Por favor, ingresa un correo.");
      setCarga(false);
      return;
    }
    const url = "http://localhost:4100/Recuperar";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Correo: correo }),
      });
      if (response.ok) {
        alert("Correo enviado para recuperación.");
        setVistaActual("inicio");
      } else {
        alert("Error al recuperar contraseña.");
      }
    } catch {
      alert("Error al conectar con el servidor.");
    } finally {
      setCarga(false);
    }
  };

  const onActualizarRol = async () => {
    setCarga(true);
    if (!rol.trim()) {
      alert("Selecciona un rol.");
      setCarga(false);
      return;
    }
    const url = `http://localhost:4100/ActualizarRol/${idUsuario}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Rol: rol }),
      });
      if (response.ok) {
        navigate(rol === "estudiante" ? `/VerGrupos/${idUsuario}` : `/MisGrupos/${idUsuario}`);
      } else {
        alert("Error al actualizar el rol.");
      }
    } catch {
      alert("Error al conectar con el servidor.");
    } finally {
      setCarga(false);
    }
  };

  return (
    <div className="fondo">
      <div className="contenedor">
        <div className="parte-superior">
          
          {vistaActual === "inicio" && (
  <div className="login-container">
    <div className="logo">
      <h1>SIRPROME</h1>
      <p className="bienvenida-texto">Bienvenido de nuevo, por favor inicia sesión</p>
    </div>
    <div className="form-group">
      <label htmlFor="email" className="label-mini">Correo electrónico</label>
      <input
        type="email"
        id="email"
        className="form-control mini-input"
        placeholder="correo@gmail.com"
        value={correo}
        onChange={e => setCorreo(e.target.value)}
        disabled={carga}
        autoComplete="username"
      />
    </div>
    <div className="form-group">
      <label htmlFor="password" className="label-mini">Contraseña</label>
      <input
        type="password"
        id="password"
        className="form-control mini-input"
        placeholder="••••••"
        value={contraseña}
        onChange={e => setContraseña(e.target.value)}
        disabled={carga}
        autoComplete="current-password"
      />
    </div>
    <button
      className="btn btn-primary btn-mini"
      disabled={carga}
      onClick={onIngresar}
    >
      {carga ? (
        <>
          <div className="loading"></div>
          <span className="btn-text">Iniciando sesión...</span>
        </>
      ) : (
        <span className="btn-text">Iniciar sesión</span>
      )}
    </button>
    <div className="links links-mini">
      <a href="#" onClick={e => { e.preventDefault(); setVistaActual("recuperar"); }}>¿Olvidaste tu contraseña?</a>
      <a href="#" onClick={e => { e.preventDefault(); setVistaActual("registro"); }}>Registrarse</a>
    </div>
    <div className="divider divider-mini">o continúa con</div>
    <div className="social-login social-login-mini">
      <div className="social-btn" title="Google">
        {/* Google SVG */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#4285F4">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      </div>
      <div className="social-btn" title="Facebook">
        {/* Facebook SVG */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
        </svg>
      </div>
      <div className="social-btn" title="Twitter">
        {/* Twitter SVG */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#1DA1F2">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      </div>
    </div>
  </div>
)}

          {vistaActual === "registro" && (
            <>
              <h1 className="fondo-azul">Registrar Usuario</h1>
              <div className="subtitulos">Nombre</div>
              <input
                type="text"
                placeholder="Ingresa tu nombre completo" className="Pequeñas-letras"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              <div className="subtitulos">Correo</div>
              <input
                type="email"
                placeholder="Ingresa tu correo electrónico" className="Pequeñas-letras"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
              <div className="subtitulos">Contraseña</div>
              <input
                type="password"
                placeholder="Crea una contraseña segura" className="Pequeñas-letras"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
              />
              <div className="Botones-Inicio">
              <button onClick={() => setVistaActual("inicio")} className="Volver-Boton-inicio ">
                Volver
              </button>
              <button onClick={onRegistrar} disabled={carga} className="Enter-Recuperar">
                {carga ? "Cargando..." : "Registrar"}
              </button>
              
              </div>
            </>
          )}

          {vistaActual === "recuperar" && (
            <>
              <h4 className="fondo-azul">Recuperar Contraseña</h4>
              <div className="subtitulos">Correo Electrónico</div> 
              <input
                type="email"
                placeholder="Ingresa tu correo registrado " className="Pequeñas-letras"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
              <div className="Botones-Inicio">
              
              <button onClick={() => setVistaActual("inicio")} className="Volver-Boton-inicio ">
                Volver
              </button>
              <button onClick={onRecuperar} disabled={carga} className="Enter-Recuperar">
                {carga ? "Cargando..." : "Recuperar"}
              </button>
              </div>
            </>
          )}

          {vistaActual === "actualizarRol" && (
            <>
              <h4>Actualizar Rol</h4>
              <p>ID Usuario: {idUsuario}</p>
              <button onClick={() => setRol("estudiante")}>Estudiante</button>
              <button onClick={() => setRol("profesor")}>Profesor</button>
              <button onClick={onActualizarRol} disabled={carga}>
                {carga ? "Cargando..." : "Actualizar"}
              </button>
              <button onClick={() => setVistaActual("inicio")}>Volver</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionUsuario;
