import "../styles/NavBar.css";
import HeaderMenu from "./HeaderMenu.js";
import Filter from "./Filter";

function NavBar({ showFilters, setShowFilters }) {
  return (
    <div id="menu">
      <HeaderMenu />
      <Filter showFilters={showFilters} setShowFilters={setShowFilters} />
    </div>
  );
}

export default NavBar;
