import logo from "../assets/Logo.png";
import "../styles/Logo.css";

function Logo() {
    return(
        <div className="logo">
            <img src={logo} alt="Logo" width={"50px"}/>
            <h2>SWMap</h2>
        </div>
    );
}

export default Logo;