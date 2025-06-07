import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Logo from "../../assets/Logo.jpg";

const ActualizarRol = () => {
  const { idUsuario } = useParams();
  const navigate = useNavigate();
  const [rol, setRol] = useState("");
  const [carga, setCarga] = useState(false);

  useEffect(() => {
    if (!idUsuario || idUsuario.length !== 36) { 
      Swal.fire({
        title: "Acceso inválido",
        text: "El ID de usuario no es válido.",
        icon: "error",
        confirmButtonText: "Entendido",
      }).then(() => navigate("/"));
    }
  }, [idUsuario, navigate]);

  const onActualizarRol = async () => {
    setCarga(true);

    if (!rol.trim() || (rol.toLowerCase() !== "estudiante" && rol.toLowerCase() !== "profesor")) {
      Swal.fire({
        title: "Rol inválido",
        text: "El rol debe ser 'estudiante' o 'profesor'.",
        icon: "warning",
        confirmButtonText: "Entendido",
      });
      setCarga(false);
      return;
    }

    const url = `http://localhost:4100/ActualizarRol/${idUsuario}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Rol: rol }),
      });

      if (response.ok) {
        Swal.fire({
          title: "Rol actualizado con éxito",
          text: `Logro desbloqueado. Un nuevo comienso`,
          icon: "success",
          confirmButtonText: "Continuar",
        }).then(() => {
          if (rol.toLowerCase() === "estudiante") {
            navigate(`/VerGrupos/${idUsuario}`);
          } else if (rol.toLowerCase() === "profesor") {
            navigate(`/MisGrupos/${idUsuario}`);
          }
        });
      } else {
        const error = await response.json();
        Swal.fire({
          title: "Error",
          text: error.message || "Error al actualizar el rol.",
          icon: "error",
          confirmButtonText: "Reintentar",
        });
      }
    } catch (error) {
      console.error("Error: ", error);
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

  return (
    <div className="fondo-rol">
      <div className="contenedor-rol">
        <img src={Logo} className="Logo" alt="Logo" />
        <h4>Actualizar Rol</h4>

        <div>Nuevo Rol</div>
        <div>
          <button onClick={() => setRol("estudiante")} disabled={carga} className="boton-criterios distancia">
            Estudiante
          </button>
          <button onClick={() => setRol("profesor")} disabled={carga} className="boton-criterios roles">
            Profesor
          </button>
        </div>

        <div>
          <button onClick={onActualizarRol} disabled={carga || !rol} className="boton-criterios roles">
            {carga ? "Cargando..." : "Seleccionar Rol"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActualizarRol;