// Codex Primordialis — единый реестр схем тегов для всех глав
(function(global) {
  "use strict";

  /**
   * TAG SCHEMA REGISTRY
   *
   * Разделы:
   *  - creatures   — существа
   *  - artifacts   — артефакты
   *  - gods        — боги и пантеоны
   *  - races       — расы и народы
   *  - locations   — локации и регионы
   *  - magic       — магия и явления
   *  - history     — история и мифы
   *  - organizations — организации
   *  - materials   — материалы и компоненты
   *  - languages   — языки
   *
   * Поля схемы:
   *  - normalizeFields: какие поля должны быть отнормированы TagSystemUnified
   *  - tagFields: какие поля выводятся как теги
   *  - filterFields: по каким полям строятся фильтры
   *  - aliases: словарь алиасов -> нормализованное имя поля
   */

  var CodexTagSchema = {
    creatures: {
      normalizeFields: [
        "class",
        "type",
        "danger",
        "size",
        "environment",
        "intellect",
        "status",
        "origin",
        "category"
      ],
      tagFields: [
        "class",
        "type",
        "danger",
        "size",
        "environment",
        "intellect",
        "status",
        "origin",
        "category"
      ],
      filterFields: [
        "class",
        "type",
        "danger",
        "size",
        "environment",
        "intellect",
        "status",
        "origin"
      ],
      aliases: {
        // класс/тип
        "raceClass": "class",
        "creatureClass": "class",
        "creatureType": "type",
        "subtype": "type",

        // опасность / размер / интеллект / статус / происхождение
        "dangerLevel": "danger",
        "danger_class": "danger",
        "threat": "danger",
        "scale": "size",
        "habitat": "environment",
        "env": "environment",
        "mind": "intellect",
        "ai": "intellect",
        "state": "status",
        "originType": "origin"
      }
    },

    artifacts: {
      normalizeFields: [
        "powerClass",
        "artifactType",
        "material",
        "effect",
        "status",
        "originEra",
        "bindingType",
        "aspect",
        "cost"
      ],
      tagFields: [
        "powerClass",
        "artifactType",
        "material",
        "effect",
        "status",
        "originEra",
        "bindingType",
        "aspect",
        "cost"
      ],
      filterFields: [
        "powerClass",
        "artifactType",
        "material",
        "effect",
        "status",
        "originEra",
        "bindingType"
      ],
      aliases: {
        // класс мощности
        "class_power": "powerClass",
        "classPower": "powerClass",
        "rank": "powerClass",

        // тип артефакта
        "subtype": "artifactType",
        "type": "artifactType",

        // материал
        "материал": "material",

        // эффект / назначение
        "назначение": "effect",

        // статус
        "статус": "status",

        // эпоха
        "epoch": "originEra",
        "эпоха": "originEra",

        // привязка
        "binding": "bindingType",
        "привязка": "bindingType",

        // аспект
        "aspects": "aspect",

        // стоимость
        "price": "cost",
        "цена": "cost"
      }
    },

    
gods: {
  normalizeFields: [
    "deityLevel",
    "domain",
    "pantheon",
    "aspect",
    "allegiance",
    "nature",
    "epoch",
    "status"
  ],
  tagFields: [
    "deityLevel",
    "domain",
    "pantheon",
    "aspect",
    "allegiance",
    "nature",
    "epoch",
    "status",
    "symbol",
    "animal",
    "cultType"
  ],
  filterFields: [
    "deityLevel",
    "domain",
    "pantheon",
    "aspect",
    "allegiance",
    "epoch",
    "status"
  ],
  aliases: {
    "level": "deityLevel",
    "rank": "deityLevel",
    "уровень": "deityLevel",
    "божественный_уровень": "deityLevel",

    "сфера": "domain",
    "домен": "domain",
    "domain": "domain",
    "сфера_влияния": "domain",

    "пантеон": "pantheon",
    "pantheon": "pantheon",

    "аспект": "aspect",
    "aspect": "aspect",

    "alignment": "allegiance",
    "allegiance": "allegiance",
    "сторона": "allegiance",
    "принадлежность": "allegiance",
    "фракция": "allegiance",

    "nature": "nature",
    "природа": "nature",
    "essence": "nature",

    "эпоха": "epoch",
    "epoch": "epoch",
    "age": "epoch",

    "state": "status",
    "статус": "status",

    "symbol": "symbol",
    "символ": "symbol",

    "animal": "animal",
    "totem": "animal",
    "тотем": "animal",

    "cult": "cultType",
    "cultType": "cultType",
    "тип_культа": "cultType"
  }
},

    
races: {
  normalizeFields: [
    "raceType",
    "originType",
    "habitat",
    "temperament",
    "heightRange",
    "skin",
    "bodyFeatures",
    "lifespan",
    "aspect",
    "magicAffinity",
    "societyType",
    "polityType",
    "religiosity",
    "language",
    "innerProblems",
    "factions"
  ],
  tagFields: [
    "raceType",
    "originType",
    "habitat",
    "temperament",
    "heightRange",
    "skin",
    "bodyFeatures",
    "lifespan",
    "aspect",
    "magicAffinity",
    "societyType",
    "polityType",
    "religiosity",
    "language",
    "innerProblems",
    "factions"
  ],
  filterFields: [
    "raceType",
    "originType",
    "habitat",
    "magicAffinity",
    "societyType",
    "polityType",
    "religiosity",
    "language",
    "lifespan"
  ],
  aliases: {
    "type": "raceType",
    "raceClass": "raceType",
    "race_type": "raceType",
    "тип_расы": "raceType",

    "origin": "originType",
    "происхождение": "originType",

    "habitat": "habitat",
    "environment": "habitat",
    "среда": "habitat",
    "среда_обитания": "habitat",

    "temperament": "temperament",
    "характер": "temperament",

    "height": "heightRange",
    "height_range": "heightRange",
    "рост": "heightRange",

    "skin_color": "skin",
    "skin": "skin",
    "цвет_кожи": "skin",
    "покров": "skin",

    "body": "bodyFeatures",
    "телосложение": "bodyFeatures",
    "особенности_тела": "bodyFeatures",

    "lifespan": "lifespan",
    "долголетие": "lifespan",
    "срок_жизни": "lifespan",

    "aspect": "aspect",
    "аспект": "aspect",

    "magic": "magicAffinity",
    "magicAffinity": "magicAffinity",
    "магическая_склонность": "magicAffinity",
    "магия": "magicAffinity",

    "society": "societyType",
    "structure": "societyType",
    "структура_общества": "societyType",

    "politics": "polityType",
    "political_system": "polityType",
    "политический_строй": "polityType",

    "религиозность": "religiosity",
    "religion": "religiosity",

    "language": "language",
    "язык": "language",

    "problems": "innerProblems",
    "проблематика": "innerProblems",

    "factions": "factions",
    "фракции": "factions"
  }
},

    locations: {
      normalizeFields: [],
      tagFields: [],
      filterFields: [],
      aliases: {}
    },

    magic: {
      normalizeFields: [],
      tagFields: [],
      filterFields: [],
      aliases: {}
    },

    history: {
      normalizeFields: [],
      tagFields: [],
      filterFields: [],
      aliases: {}
    },

    organizations: {
      normalizeFields: [],
      tagFields: [],
      filterFields: [],
      aliases: {}
    },

    materials: {
      normalizeFields: [],
      tagFields: [],
      filterFields: [],
      aliases: {}
    },

    languages: {
      normalizeFields: [],
      tagFields: [],
      filterFields: [],
      aliases: {}
    }
  };

  function getTagSchema(sectionKey) {
    if (!sectionKey) return null;
    return CodexTagSchema[sectionKey] || null;
  }

  // Экспорт в глобальную область
  var root =
    typeof global !== "undefined"
      ? global
      : (typeof window !== "undefined"
          ? window
          : (typeof globalThis !== "undefined" ? globalThis : this));

  root.CodexTagSchema = CodexTagSchema;
  root.getTagSchema = getTagSchema;

})(this);
