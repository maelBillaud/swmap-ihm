import { Button } from '@mantine/core';
import { IconFilter } from "@tabler/icons";

function Filter() {
    return(
        <Button leftIcon={<IconFilter/>} variant="subtle" size="xl">Filters</Button>
    )
}

export default Filter;