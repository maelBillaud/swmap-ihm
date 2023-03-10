import { useState } from "react";
import { TextInput, Checkbox, Button, Badge, Tooltip } from "@mantine/core";
import { IconCloudRain, IconUmbrella } from "@tabler/icons";
import Emitter from "../services/emitter";
import "../styles/AddPark.css";
import { getCoordinateFromAddress } from "../services/park/api";

function AddPark({ setShowResearch }) {
  //Valeurs pour la création d'un parc
  const [horizontalBar, setHorizontalBar] = useState(0);
  const [parallelBar, setParallelBar] = useState(0);
  const [lowParallelBar, setLowParallelBar] = useState(0);
  const [espalier, setEspalier] = useState(0);
  const [fixedRings, setFixedRings] = useState(0);
  const [monkeyBridge, setMonkeyBridge] = useState(0);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState();
  const [isCovered, setIsCovered] = useState(false);

  async function createParkFromAddress() {
    const res = await getCoordinateFromAddress(
      houseNumber,
      street,
      postcode,
      city,
      country
    );

    const data = res.data.features[0].properties;

    const parkToCreate = {
      equipment: {
        horizontalBar: horizontalBar,
        parallelBar: parallelBar,
        lowParallelBar: lowParallelBar,
        espalier: espalier,
        fixedRings: fixedRings,
        monkeyBridge: monkeyBridge,
      },
      latitude: data.lat,
      longitude: data.lon,
      country: country,
      city: city,
      postcode: postcode,
      street: street,
      housenumber: houseNumber,
      isCovered: isCovered,
      creationAgent: "admin",
    };

    Emitter.emit("ADD_PARK_FROM_ADDRESS", parkToCreate);
  }

  return (
    <div className="container">
      <div className="first-text">
        <p className="title">Adresse du parc :</p>
        <div>
          <Tooltip
            label="Vous pouvez ajouter un parc en double cliquant à l'endroit souhaité sur la map"
            position="bottom-end"
            multiline
            width={220}
            withArrow
            transition="slide-left"
            transitionDuration={200}
            events={{ hover: true, touch: false }}
          >
            <Badge radius="xl">info</Badge>
          </Tooltip>
        </div>
      </div>
      <div className="address-input">
        <div className="block-input">
          <TextInput
            label="Numéro de rue"
            placeholder="Numéro de la rue"
            variant="filled"
            type="text"
            className="text-input"
            value={houseNumber}
            onChange={(event) => setHouseNumber(event.currentTarget.value)}
          />
          <TextInput
            label="Rue"
            placeholder="Nom de la rue"
            variant="filled"
            type="text"
            className="text-input"
            value={street}
            onChange={(event) => setStreet(event.currentTarget.value)}
          />
        </div>
        <div className="block-input">
          <TextInput
            label="Code postal"
            placeholder="Code postal de la ville"
            variant="filled"
            type="text"
            className="text-input"
            value={postcode}
            onChange={(event) => setPostcode(event.currentTarget.value)}
          />
          <TextInput
            label="Ville"
            placeholder="Nom de la ville"
            variant="filled"
            type="text"
            className="text-input"
            value={city}
            onChange={(event) => setCity(event.currentTarget.value)}
          />
        </div>
        <div className="block-pays">
          <TextInput
            label="Pays"
            placeholder="Nom du Pays"
            variant="filled"
            type="text"
            className="text-input"
            value={country}
            onChange={(event) => setCountry(event.currentTarget.value)}
          />
        </div>
      </div>
      <p className="title">Équipements du parc :</p>
      <div className="addPark-equipment-input">
        <div className="block-input">
          <TextInput
            label="Barre fixe"
            placeholder="Nombre de barre fixe"
            variant="filled"
            type="number"
            className="text-input"
            value={horizontalBar}
            onChange={(event) => setHorizontalBar(event.currentTarget.value)}
          />
          <TextInput
            label="Barre parallèle"
            placeholder="Nombre de barre parallèle"
            variant="filled"
            type="number"
            className="text-input"
            value={parallelBar}
            onChange={(event) => setParallelBar(event.currentTarget.value)}
          />
        </div>
        <div className="block-input">
          <TextInput
            label="Barre parallèle basse"
            placeholder="Nombre de barre parallèle basse"
            variant="filled"
            type="number"
            className="text-input"
            value={lowParallelBar}
            onChange={(event) => setLowParallelBar(event.currentTarget.value)}
          />
          <TextInput
            label="Anneaux fixes"
            placeholder="Nombre d'anneaux fixes"
            variant="filled"
            type="number"
            className="text-input"
            value={fixedRings}
            onChange={(event) => setFixedRings(event.currentTarget.value)}
          />
        </div>
        <div className="block-input">
          <TextInput
            label="Espalier"
            placeholder="Nombre d'espalier"
            variant="filled"
            type="number"
            className="text-input"
            value={espalier}
            onChange={(event) => setEspalier(event.currentTarget.value)}
          />
          <TextInput
            label="Pont de singe"
            placeholder="Nombre de pont de singe"
            variant="filled"
            type="number"
            className="text-input"
            value={monkeyBridge}
            onChange={(event) => setMonkeyBridge(event.currentTarget.value)}
          />
        </div>
      </div>
      <p className="title">Informations :</p>
      <div id="information-input">
        <Checkbox
          checked={isCovered}
          onChange={(event) => setIsCovered(event.currentTarget.checked)}
          label={
            isCovered ? (
              <div className="text">
                <IconUmbrella size={20} color="blue" className="icons" />
                <span className="overflow-ok">
                  Le parc possède une protection contre les intempéries
                </span>
              </div>
            ) : (
              <div className="text">
                <IconCloudRain size={20} color="gray" className="icons" />
                <span className="overflow-ok">
                  Le parc possède une protection contre les intempéries
                </span>
              </div>
            )
          }
        />
      </div>
      <div className="button-dialog-validation">
        <Button radius="md" uppercase onClick={createParkFromAddress}>
          Créer le Parc
        </Button>
        <Button
          color="gray"
          radius="md"
          uppercase
          onClick={() => setShowResearch(false)}
        >
          Annuler
        </Button>
      </div>
    </div>
  );
}

export default AddPark;
