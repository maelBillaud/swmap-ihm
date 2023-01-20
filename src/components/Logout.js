import { IconLogout } from "@tabler/icons";
import { useNavigate } from "react-router-dom";
import "../styles/Menu.css";

function Logout() {

    const navigate = useNavigate();

    /**
     * Renvoie vers la page de connection 
     * et supprime le token et le role qui sont en sessionStorage
     */
    function logout() {
        navigate("/login", { replace: true });
        sessionStorage.setItem("token", "");
        sessionStorage.setItem("role", "");
    }

  return (
    <div id="filter-container">
      <IconLogout
        size={30}
        color="#339AF0"
        id="filter-icon"
        onClick={logout}
      />
    </div>
  );
}

export default Logout;