import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Registrar = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [carga, setCarga] = useState(false);
  const [logro, setLogro] = useState<{ Id: string; Nombre: string; Descripcion: string } | null>(null);
  const [logroMostrado, setLogroMostrado] = useState<boolean>(false); // Estado para controlar si el logro ya se mostró

  const onRegistrar = async () => {
    setCarga(true);

    if (!nombre.trim()) {
      alert("El nombre es necesario");
      setCarga(false);
      return;
    }
    if (!correo.trim()) {
      alert("El correo es necesario");
      setCarga(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      alert("Ingrese un correo electrónico válido");
      setCarga(false);
      return;
    }
    if (!contraseña.trim()) {
      alert("Es necesaria una contraseña");
      setCarga(false);
      return;
    }

    const url = "http://localhost:4100/Registrar";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Nombre: nombre,
          Correo: correo,
          Contraseña: contraseña,
        }),
      });

      const data = await response.json();
      console.log("Respuesta del backend:", data); // Depuración para verificar la respuesta

      if (!response.ok) {
        Swal.fire({
          title: "Error",
          text: data.mensaje || response.statusText,
          icon: "error",
        });
      } else {
        if (!logroMostrado && data.logroDesbloqueado) {
          // Solo mostrar el logro si no se ha mostrado antes y si existe
          setLogro(data.logroDesbloqueado);
          setLogroMostrado(true); // Marcar el logro como mostrado
          Swal.fire({
            title: "¡Éxito!",
            text: `Usuario registrado correctamente.\n¡Logro desbloqueado: ${data.logroDesbloqueado.Nombre}!`,
            icon: "success",
          });
        }
        const idUsuario = data.id;
        if (!idUsuario) throw new Error("No se recibió un id válido");
        navigate(`/Seleccionar-Rol/${idUsuario}`);
      }
    } catch (error) {
      console.error("Error: ", error);
      alert("Error al conectar con el servidor");
    } finally {
      setCarga(false);
    }
  };

  return (
    <div className="fondo">
      <div className="contenedor">
        <div className="titulo">
          <h4>SIRPROME</h4>
        </div>

        <div className="agrupador-nombre">
          <div>Nombre</div>
          <input
            type="text"
            placeholder="Ingresa tu nombre"
            className="caja-nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="agrupador-correo">
          <div>Correo Electrónico</div>
          <input
            type="email"
            placeholder="Ingresa tu correo electrónico"
            className="caja-correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>

        <div className="agrupador-password">
          <div>Contraseña</div>
          <input
            type="password"
            placeholder="Ingresa tu contraseña"
            className="caja-password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
          />
        </div>

        <div className="agrupador-boton">
          <button className="boton-registrar" onClick={onRegistrar} disabled={carga}>
            {carga ? "Registrando..." : "Registrar"}
          </button>
        </div>
        <div className="otros-botones">
          <button onClick={() => navigate("/")} disabled={carga}>
            Inicio de sesión
          </button>
          <button onClick={() => navigate("/recuperar")} disabled={carga}>
            Olvidé mi contraseña
          </button>
        </div>

        {/* Mostrar el logro desbloqueado */}
        {logro && (
          <div className="logro-desbloqueado">
            <h3>¡Logro Desbloqueado!</h3>
            <p><strong>{logro.Nombre}</strong></p>
            <p>{logro.Descripcion}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Registrar;