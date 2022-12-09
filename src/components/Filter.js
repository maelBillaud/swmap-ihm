import { Button } from '@mantine/core';
import { IconFilter } from "@tabler/icons";
import "../styles/Filter.css"

function Filter() {
    return(
        // <Button leftIcon={<IconFilter/>} variant="subtle" size="xl">Filters</Button>
        <div id='filter'>
            <IconFilter size={30} color="#339AF0" id='filter-icon'/>
            <Button id='filter-button'>Filters</Button>
        </div>
    )
}

export default Filter;