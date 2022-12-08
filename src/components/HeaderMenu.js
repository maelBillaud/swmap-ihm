import logo from "../assets/Logo.png";
import "../styles/HeaderMenu.css";

function HeaderMenu() {
    return(
        <div id="container">
            <img src={logo} alt="Logo" width={"50px"} id="logo"/>
            <h2 id="name">SWMap</h2>
        </div>
    );
}

export default HeaderMenu;