import { Button } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import "../styles/Menu.css";

function Research({ showResearch, setShowResearch, setShowFilters }) {
  /**
   * Fonction qui permet de cacher les l'ajout par rechercher
   */
  function switchResearchState() {
    setShowFilters(false);
    setShowResearch(!showResearch);
  }

  return (
    <div id="filter-container">
      <IconSearch
        size={27}
        color="#339AF0"
        id="filter-icon"
        onClick={switchResearchState}
      />
      <Button id="filter-button" onClick={switchResearchState}>
        Ajouter
      </Button>
    </div>
  );
}

export default Research;
