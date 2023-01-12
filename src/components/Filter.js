import { Button } from "@mantine/core";
import { IconFilter } from "@tabler/icons";
import "../styles/Menu.css";

function Filter({ showFilters, setShowFilters, setShowResearch }) {
  /**
   * Fonction qui permet de cacher les filtres
   */
  function switchFilterState() {
    setShowFilters(!showFilters);
    setShowResearch(false);
  }

  return (
    <div id="filter-container">
      <IconFilter
        size={30}
        color="#339AF0"
        id="filter-icon"
        onClick={switchFilterState}
      />
      <Button id="filter-button" onClick={switchFilterState}>
        Filtres
      </Button>
    </div>
  );
}

export default Filter;
