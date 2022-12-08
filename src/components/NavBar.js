import "../styles/NavBar.css"
import HeaderMenu from "./HeaderMenu.js"
import Filter from "./Filter";

function NavBar() {
    return(
        <div id="menu">
            <HeaderMenu/>
            <Filter/>
        </div>
    );
}

export default NavBar;