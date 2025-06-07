import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../assets/Estilos.css";

const Recuperar = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [carga, setCarga] = useState(false);

  const onOlvidemicontraseña = async () => {
    setCarga(true);
    if (!correo) {
      alert("Por favor, ingresa un correo electrónico.");
      setCarga(false);
      return;
    }

    const url = "http://localhost:4100/Recuperar";
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ Correo: correo }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const mensaje = await response.text();
        alert(mensaje);
      } else {
        alert("Se envió un correo para recuperar la contraseña.");
        navigate("/");
      }
    } catch (error) {
      alert("Hubo un problema al conectar con el servidor. Por favor, intenta de nuevo.");
      console.error(error);
    } finally {
      setCarga(false);
    }
  };

  return (
    <div className="recuperar-fondo">
      <div className="recuperar-contenedor">
        <div className="recuperar-header">
          <h2 className="recuperar-titulo">Recuperar Contraseña</h2>
          <div className="recuperar-logo">SIRPROME</div>
        </div>
        <div className="recuperar-formulario">
          <div className="form-group">
            <label htmlFor="correo">Correo Electrónico</label>
            <input
              id="correo"
              type="email"
              placeholder="Ingrese tu correo electrónico"
              className="form-input"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              disabled={carga}
            />
          </div>
          <button
            className="recuperar-btn"
            onClick={onOlvidemicontraseña}
            disabled={carga}
          >
            {carga ? "Enviando..." : "Recuperar Contraseña"}
          </button>
          <div className="otros-botones">
            <button onClick={() => navigate("/Registro")} disabled={carga}>
              Registrarse
            </button>
            <button onClick={() => navigate("/")} disabled={carga}>
              Inicio de sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recuperar;