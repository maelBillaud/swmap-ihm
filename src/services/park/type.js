export class Equipment {
  equipmentId;
  horizontalBar;
  parallelBar;
  lowParallelBar;
  espalier;
  fixedRings;
  monkeyBridge;

  /**
   * Constructeur avec tous les composants d'un Equipment
   */
  constructor(
    equipmentId,
    horizontalBar,
    parallelBar,
    lowParallelBar,
    espalier,
    fixedRings,
    monkeyBridge
  ) {
    this.equipmentId = equipmentId;
    this.horizontalBar = horizontalBar;
    this.parallelBar = parallelBar;
    this.lowParallelBar = lowParallelBar;
    this.espalier = espalier;
    this.fixedRings = fixedRings;
    this.monkeyBridge = monkeyBridge;
  }

  setValues(...args) {
    for (const arg of args) {
      this[arg.name] = arg.value;
    }
  }
}

export class Park {
  parkId;
  equipment;
  latitude;
  longitude;
  country;
  city;
  postcode;
  street;
  houseNumber;
  isCovered;
  verifierNumber;
  creationAgent;
  creationDate;
  modificationAgent;
  modificationDate;

  constructor(
    parkId,
    equipment,
    latitude,
    longitude,
    country,
    city,
    postcode,
    street,
    houseNumber,
    isCovered,
    verifierNumber,
    creationAgent,
    creationDate,
    modificationAgent,
    modificationDate
  ) {
    this.parkId = parkId;
    this.equipment = equipment;
    this.latitude = latitude;
    this.longitude = longitude;
    this.country = country;
    this.city = city;
    this.postcode = postcode;
    this.street = street;
    this.houseNumber = houseNumber;
    this.isCovered = isCovered;
    this.verifierNumber = verifierNumber;
    this.creationAgent = creationAgent;
    this.creationDate = creationDate;
    this.modificationAgent = modificationAgent;
    this.modificationDate = modificationDate;
  }

  setValues(...args) {
    for (const arg of args) {
      this[arg.name] = arg.value;
    }
  }
}
