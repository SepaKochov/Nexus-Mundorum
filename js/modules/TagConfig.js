// TagConfig.js

export const TagConfig = {
  creatures: {
    core: [
      "creature_class",
      "creature_type",
      "danger_rank",
      "habitat",
      "intellect",
      "status",
      "size_category",
      "origin"
    ],
    extra: [
      "aspect",
      "magic_nature",
      "world_role"
    ],
    maxExtra: 3
  },
  artifacts: {
    core: [
      "power_class",
      "artifact_type",
      "material",
      "effect_scope",
      "status",
      "epoch",
      "binding_type"
    ],
    extra: [
      "aspect",
      "usage_price"
    ],
    maxExtra: 3
  },
  gods: {
    core: [
      "deity_rank",
      "domain",
      "pantheon",
      "aspect",
      "worship_type",
      "status"
    ],
    extra: [
      "symbol",
      "sacred_creature",
      "key_artifact"
    ],
    maxExtra: 2
  },
  races: {
    core: [
      "race_category",
      "cultural_trait",
      "civilization_type",
      "development_level",
      "habitat",
      "political_system",
      "religion_model",
      "language_group",
      "people_issue"
    ],
    extra: [
      "internal_factions"
    ],
    maxExtra: 2
  },
  locations: {
    core: [
      "location_type",
      "region",
      "climate",
      "danger_rank",
      "status",
      "dominant_power"
    ],
    extra: [
      "location_role"
    ],
    maxExtra: 2
  },
  magic: {
    core: [
      "magic_category",
      "magic_nature",
      "impact_level",
      "stability",
      "manifestation_form",
      "theme"
    ],
    extra: [
      "energy_type"
    ],
    maxExtra: 2
  },
  languages: {
    core: [
      "language_family",
      "script_type",
      "complexity",
      "status",
      "spread"
    ],
    extra: [
      "magic_potential",
      "race_binding"
    ],
    maxExtra: 2
  },
  heroes: {
    core: [
      "role",
      "influence_level",
      "affiliation",
      "power_type",
      "history_status"
    ],
    extra: [
      "main_conflict",
      "key_gift"
    ],
    maxExtra: 2
  },
  organizations: {
    core: [],
    extra: [],
    maxExtra: 0,
    draft: true
  },
  materials: {
    core: [],
    extra: [],
    maxExtra: 0,
    draft: true
  },
  history: {
    core: [],
    extra: [],
    maxExtra: 0,
    draft: true
  }
};

// Словари значений для ключевых полей.
// Если для ключа/значения нет записи в TagDicts, в label будет подставлено само значение.

export const TagDicts = {
  danger_rank: {
    S: "Опасность S",
    A: "Опасность A",
    B: "Опасность B",
    C: "Опасность C",
    D: "Опасность D"
  },
  size_category: {
    TINY: "крошечное",
    SMALL: "малое",
    MEDIUM: "среднее",
    LARGE: "крупное",
    HUGE: "гигантское"
  },
  power_class: {
    S: "Класс S",
    A: "Класс A",
    B: "Класс B",
    C: "Класс C",
    D: "Класс D",
    OMEGA: "Класс Ω",
    LAMBDA: "Класс Λ"
  },
  influence_level: {
    LOCAL: "локальный",
    REGIONAL: "региональный",
    WORLD: "мировой",
    MULTIWORLD: "межмировой"
  },
  history_status: {
    LEGENDARY: "легендарный",
    HALF_FORGOTTEN: "полузабытый",
    CONTEMPORARY: "современный",
    HIDDEN: "спрятанный"
  },
  intellect: {
    NONE: "без разума",
    INSTINCT: "инстинктивный",
    LIMITED: "ограниченный",
    SENTIENT: "разумный",
    SUPERIOR: "высший разум"
  },
  creature_class: {
    BEAST: "зверь",
    MONSTER: "монстр",
    SPIRIT: "дух",
    ELEMENTAL: "элементаль",
    DRAGON: "дракон",
    UNDEAD: "нежить",
    DEMON: "демон",
    ANGEL: "ангел",
    CONSTRUCT: "конструкт",
    ABERRATION: "аберрация",
    FAE: "фея",
    OTHER: "существо"
  },
  creature_type: {
    PREDATOR: "хищник",
    GUARDIAN: "страж",
    SWARM: "рой",
    PACK: "стаевая форма",
    HERD: "стадное",
    SOLITARY: "одиночное",
    BEAST_OF_BURDEN: "вьючное",
    SCOUT: "разведчик",
    MOUNT: "верховое",
    OTHER: "существо"
  },
  habitat: {
    FOREST: "лес",
    MOUNTAINS: "горы",
    SWAMP: "болота",
    DESERT: "пустыня",
    PLAINS: "степи и равнины",
    UNDERGROUND: "подземья",
    RUINS: "руины",
    URBAN: "города",
    SEA: "моря и океаны",
    SKY: "небо",
    OTHER: "иные территории"
  },
  status: {
    WILD: "дикое",
    DOMESTICATED: "одомашненное",
    RARE: "редкое",
    LEGENDARY: "легендарное",
    UNIQUE: "уникальное",
    EXTINCT: "вымершее",
    COMMON: "обычное"
  },
  origin: {
    NATURAL: "естественное",
    MAGICAL: "магическое",
    DIVINE: "божественное",
    ANOMALOUS: "аномальное",
    MIXED: "смешанное",
    ANCIENT: "древнее",
    OTHERWORLDLY: "иномирное"
  }
};

export function getTagLabel(key, value) {
  if (value === undefined || value === null) {
    return "";
  }
  const dict = TagDicts[key];
  if (dict && Object.prototype.hasOwnProperty.call(dict, value)) {
    return dict[value];
  }
  return String(value);
}
