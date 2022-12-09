import { Button } from "@mantine/core";
import { IconFilter } from "@tabler/icons";
import "../styles/Filter.css";

function Filter({ showFilters, setShowFilters }) {
  function switchFilterState() {
    setShowFilters(!showFilters);
  }

  return (
    // <Button leftIcon={<IconFilter/>} variant="subtle" size="xl">Filters</Button>
    <div id="filter">
      <IconFilter
        size={30}
        color="#339AF0"
        id="filter-icon"
        onClick={switchFilterState}
      />
      <Button id="filter-button" onClick={switchFilterState}>
        Filters
      </Button>
    </div>
  );
}

export default Filter;
