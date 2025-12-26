// Автоматически созданный модуль для тегов

export function getTagsForCard(entity, section) {
  if (!entity || typeof entity !== "object") {
    return [];
  }

  const tags = [];
  const sec = section || (typeof currentSection === "string" ? currentSection : "creatures");

  const push = (value) => {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach(push);
      return;
    }
    const str = String(value).trim();
    if (!str) return;
    tags.push(str);
  };

  const addRawTags = () => {
    if (Array.isArray(entity.tags)) {
      entity.tags.forEach(push);
    } else if (entity.tags && typeof entity.tags === "object") {
      Object.values(entity.tags).forEach(push);
    }
  };

  if (sec === "creatures") {
    // === СУЩЕСТВА ===
    // Базовые теги: класс, тип, опасность, среда, интеллект, размер, происхождение
    const cls    = entity.class || entity.classType || entity.creatureClass;
    const type   = entity.type  || entity.creatureType;
    const env    = entity.environment || entity.habitat || entity.biome;
    const intel  = entity.intellect;
    const size   = entity.sizeCategory || entity.size_group || entity.size;
    const origin = entity.origin || entity.originType;

    push(cls);
    push(type);

    if (entity.danger) {
      push(`Опасность ${String(entity.danger).toUpperCase()}`);
    }

    push(env);
    push(intel);
    push(size);
    push(origin);

    // Доп. информация: аспект, стихия, роль (не более 3 тегов)
    const extras = [];
    if (entity.aspect)  extras.push(entity.aspect);
    if (entity.element) extras.push(entity.element);
    if (entity.role)    extras.push(entity.role);
    extras.slice(0, 3).forEach(push);

  } else if (sec === "artifacts") {
    // === АРТЕФАКТЫ ===
    push(entity.powerClass || entity.class_power);
    push(entity.artifactType || entity.subtype);
    push(entity.material);
    push(entity.effectType || entity.effect);
    push(entity.status);
    push(entity.epoch);
    push(entity.bindingType);

    if (entity.small_card && typeof entity.small_card === "object") {
      push(entity.small_card.type || entity.small_card["тип"]);
      push(entity.small_card.usage || entity.small_card["назначение"]);
      push(entity.small_card.aspect || entity.small_card["аспект"]);
    }

    addRawTags();

  } else if (sec === "locations") {
    // === ЛОКАЦИИ ===
    push(entity.locationType);
    push(entity.region);
    push(entity.climate);
    push(entity.dangerLevel);
    push(entity.status);
    push(entity.dominantPower);
    addRawTags();

  } else if (sec === "gods") {
    // === БОГИ ===
    push(entity.deityLevel);
    push(entity.domain);
    push(entity.pantheon);
    push(entity.aspect);
    push(entity.worshipType);
    push(entity.status);
    addRawTags();

  } else if (sec === "languages") {
    // === ЯЗЫКИ ===
    push(entity.languageFamily);
    push(entity.writingType);
    push(entity.rarity);
    push(entity.status);
    addRawTags();

  } else {
    // Остальные разделы — пока только "сырые" теги
    addRawTags();
  }

  // Убираем дубли
  const uniq = [];
  const seen = new Set();
  for (const t of tags) {
    if (!seen.has(t)) {
      seen.add(t);
      uniq.push(t);
    }
  }
  return uniq;
}




export function getShortDescriptionForCard(entity, section, originText) {
  if (!entity || typeof entity !== "object") {
    return "";
  }

  const sec = section || "";

  function pickFrom(obj) {
    if (!obj || typeof obj !== "object") return "";
    return (
      obj.short ||
      obj.description ||
      obj["описание"] ||
      obj.summary ||
      ""
    );
  }

  let base = "";

  // Расы: main.json (base / extended / high / full)
  if (sec === "races") {
    // в коротком описании стараемся взять именно краткий текст
    if (entity.base && typeof entity.base === "object") {
      base =
        entity.base.short ||
        entity.base.description ||
        entity.base["описание"] ||
        "";
    }
    if (!base && entity.small_card && typeof entity.small_card === "object") {
      base = pickFrom(entity.small_card);
    }
    if (!base) {
      base =
        pickFrom(entity.full) ||
        pickFrom(entity.high) ||
        pickFrom(entity.extended) ||
        "";
    }
  } else if (
    sec === "artifacts" ||
    sec === "locations" ||
    sec === "magic" ||
    sec === "materials" ||
    sec === "languages" ||
    sec === "orgs" ||
    sec === "history" ||
    sec === "gods"
  ) {
    // Остальные главы: сначала small_card / small / card
    base =
      pickFrom(entity.small_card) ||
      pickFrom(entity.small) ||
      pickFrom(entity.card);
  }

  if (!base) {
    base =
      entity.description ||
      entity.flavor ||
      entity.summary ||
      originText ||
      "";
  }

  return shorten(base, 200);
}
export function getLongDescriptionForDetails(entity, section, originText) {
  if (!entity || typeof entity !== "object") {
    return "";
  }

  const sec = section || (typeof currentSection === "string" ? currentSection : "");

  function pickFrom(obj) {
    if (!obj || typeof obj !== "object") return "";
    return (
      obj.long ||
      obj.full ||
      obj.description_long ||
      obj.description ||
      obj["описание"] ||
      obj.summary ||
      obj.short ||
      ""
    );
  }

  let base = "";

  // Расы (main.json) — пробуем собрать из full / high / extended / base
  if (!base && sec === "races") {
    base =
      pickFrom(entity.full) ||
      pickFrom(entity.high) ||
      pickFrom(entity.extended) ||
      pickFrom(entity.base);
  }

  // Источники магии (magic/sources): в первую очередь big_card
  if (!base && sec === "magic" && entity.big_card && typeof entity.big_card === "object") {
    const b = entity.big_card;
    const parts = [];

    if (b.title) {
      parts.push(String(b.title));
    }
    if (b.description) {
      parts.push(String(b.description));
    }
    if (b.structure && typeof b.structure === "object") {
      const structParts = Object.keys(b.structure).map(function (key) {
        const label = String(key).replace(/_/g, " ");
        const val = b.structure[key];
        return label + ": " + String(val);
      });
      if (structParts.length) {
        parts.push(structParts.join("\n"));
      }
    }
    if (b.usage && typeof b.usage === "object") {
      const usageParts = Object.keys(b.usage).map(function (key) {
        const label = String(key).replace(/_/g, " ");
        const val = b.usage[key];
        return label + ": " + String(val);
      });
      if (usageParts.length) {
        parts.push("Использование:\n" + usageParts.join("\n"));
      }
    }
    if (Array.isArray(b.origins) && b.origins.length) {
      parts.push("Происхождение:\n" + b.origins.join("; "));
    }
    if (Array.isArray(b.effects_on_world) && b.effects_on_world.length) {
      parts.push("Влияние на мир:\n" + b.effects_on_world.join("; "));
    }

    base = parts.join("\n\n");
  }

  // Герои и антигерои (history/heroes): big_card героя
  if (
    !base &&
    sec === "history" &&
    entity.hero_type &&
    entity.big_card &&
    typeof entity.big_card === "object"
  ) {
    const b = entity.big_card;
    const parts = [];
    if (b.title) {
      parts.push(String(b.title));
    }
    if (b.appearance) {
      parts.push("Внешность: " + String(b.appearance));
    }
    if (b.origin) {
      parts.push("Происхождение: " + String(b.origin));
    }
    if (Array.isArray(b.abilities) && b.abilities.length) {
      parts.push("Способности:\n" + b.abilities.join("\n"));
    }
    if (b.personality) {
      parts.push("Характер: " + String(b.personality));
    }
    if (b.role_in_world) {
      parts.push("Роль в мире: " + String(b.role_in_world));
    }
    if (Array.isArray(b.weaknesses) && b.weaknesses.length) {
      parts.push("Слабости:\n" + b.weaknesses.join("\n"));
    }
    if (b.symbolism) {
      parts.push("Символика: " + String(b.symbolism));
    }
    base = parts.join("\n\n");
  }

  // Для прочих глав (и запасной вариант для magic/history/races)
  if (
    !base &&
    (
      sec === "artifacts" ||
      sec === "locations" ||
      sec === "magic" ||
      sec === "materials" ||
      sec === "languages" ||
      sec === "races" ||
      sec === "orgs" ||
      sec === "history" ||
      sec === "gods"
    )
  ) {
    base =
      pickFrom(entity.full_card) ||
      pickFrom(entity.card) ||
      pickFrom(entity.small_card) ||
      pickFrom(entity.small);
  }

  // Общий fallback
  if (!base) {
    base =
      entity.description_long ||
      entity.description ||
      entity.flavor ||
      entity.summary ||
      originText ||
      "";
  }

  return base;
}
