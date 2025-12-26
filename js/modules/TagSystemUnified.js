// js/modules/TagSystemUnified.js
// Unified tag & normalization system for creatures section.

function toStr(val) {
  if (val == null) return "";
  return String(val);
}

function normStr(val) {
  return toStr(val).trim().toLowerCase();
}

function concatText(parts) {
  return parts
    .filter(Boolean)
    .map(toStr)
    .join(" ")
    .toLowerCase();
}

function hasAny(haystack, needles) {
  if (!haystack) return false;
  const s = haystack.toLowerCase();
  for (let i = 0; i < needles.length; i++) {
    if (s.indexOf(needles[i].toLowerCase()) !== -1) return true;
  }
  return false;
}

function pushTag(list, key, label, value) {
  if (!label) return;
  const v = value != null ? value : label;
  list.push({
    key,
    value: v,
    label: label
  });
}

// ==========================
// КЛАСС СУЩЕСТВА
// ==========================

function detectCreatureClass(entity) {
  const text = concatText([
    entity.name,
    entity.kind,
    entity.type,
    entity.role,
    entity.description,
    entity.origin,
    entity.habitat,
    Array.isArray(entity.behavior) ? entity.behavior.join(" ") : "",
    Array.isArray(entity.tags) ? entity.tags.join(" ") : ""
  ]);

  // 1. бесплотный
  if (
    hasAny(text, [
      "дух",
      "призрак",
      "эфирн",
      "астрал",
      "астральн",
      "нематериал",
      "бестелес",
      "тень",
      "теневое существо"
    ])
  ) {
    return "бесплотный";
  }

  // 2. элементаль
  if (
    hasAny(text, [
      "элементаль",
      "огненн",
      "пламенн",
      "ледян",
      "морозн",
      "каменн",
      "скалист",
      "водян",
      "землян",
      "магмов",
      "плазм",
      "элементной природы"
    ])
  ) {
    return "элементаль";
  }

  // 3. аберрация
  if (
    hasAny(text, [
      "аберрац",
      "искажен",
      "искажен",
      "искаженная",
      "чужой разум",
      "аномал",
      "мутац",
      "выверн",
      "пустотн",
      "чужда реальности"
    ])
  ) {
    return "аберрация";
  }

  // 4. дракон
  if (
    hasAny(text, [
      "дракон",
      "драконид",
      "змей огненный",
      "драконоподобн"
    ])
  ) {
    return "дракон";
  }

  // 5. нежить
  if (
    hasAny(text, [
      "нежить",
      "мертв",
      "мумия",
      "скелет",
      "лич",
      "восставш",
      "погибшее тело"
    ])
  ) {
    return "нежить";
  }

  // 6. демон
  if (
    hasAny(text, [
      "демон",
      "демонич",
      "инферн",
      "адск",
      "пекл",
      "адское порождение"
    ])
  ) {
    return "демон";
  }

  // 7. конструкт
  if (
    hasAny(text, [
      "конструкт",
      "голем",
      "создан",
      "искусственно созданное",
      "механизм",
      "автоматон",
      "артефакт-существо"
    ])
  ) {
    return "конструкт";
  }

  // 8. зверь
  if (
    (entity.kind && normStr(entity.kind) === "beast") ||
    hasAny(text, [
      "зверь",
      "животн",
      "млекопит",
      "кошач",
      "волч",
      "ящер",
      "ящероподобн",
      "хищник",
      "травояд",
      "звероподобн"
    ])
  ) {
    return "зверь";
  }

  // 9. фолбек
  return "существо";
}

// ==========================
// ТИП (ПИТАНИЕ)
// ==========================

function detectFeedingType(entity) {
  const text = concatText([
    entity.type,
    entity.role,
    entity.description,
    Array.isArray(entity.behavior) ? entity.behavior.join(" ") : "",
    Array.isArray(entity.tags) ? entity.tags.join(" ") : "",
    Array.isArray(entity.abilities)
      ? entity.abilities.map(a => (a && a.desc ? a.desc : "")).join(" ")
      : ""
  ]);

  // 1. маноед
  if (
    hasAny(text, [
      "маноед",
      "питается маной",
      "питается магией",
      "питается энергией",
      "поглощает энергию",
      "поглощает магию",
      "вытягивает магию",
      "вампирит силу",
      "вампирит энергию",
      "питается источником",
      "энергоед"
    ])
  ) {
    return "маноед";
  }

  // 2. минералоед
  if (
    hasAny(text, [
      "питается минералами",
      "ест камень",
      "поедает камни",
      "поедает руду",
      "минералояден",
      "питается породой",
      "питается кристаллами"
    ])
  ) {
    return "минералоед";
  }

  // 3. хищник
  if (
    hasAny(text, [
      "хищник",
      "охот",
      "охотится",
      "питается мясом",
      "ест мясо",
      "кровь",
      "кровопийца",
      "жертвы",
      "жертва",
      "пьет кровь",
      "пьет кровь",
      "хищническ"
    ])
  ) {
    return "хищник";
  }

  // 4. падальщик
  if (
    hasAny(text, [
      "падальщ",
      "питается трупами",
      "питается мертвечиной",
      "мертвечин",
      "кормится останками",
      "ест падаль"
    ])
  ) {
    return "падальщик";
  }

  // 5. всеядный
  if (
    hasAny(text, [
      "всеяд",
      "всеяда",
      "питается всем",
      "ест что угодно",
      "смешанное питание"
    ])
  ) {
    return "всеядный";
  }

  // 6. травоядный
  if (
    hasAny(text, [
      "травояд",
      "растительнояд",
      "питается травой",
      "питается листьями",
      "питается листвой",
      "листва",
      "побеги",
      "корнеплоды",
      "зерно",
      "зернов"
    ])
  ) {
    return "травоядный";
  }

  // 7. фолбек
  return "неопределен";
}

// ==========================
// ОПАСНОСТЬ
// ==========================

function detectDanger(entity) {
  const raw = toStr(entity.danger).toUpperCase();
  if (!raw) return "";
  const m = raw.match(/[SABCDE]/);
  return m ? m[0] : "";
}

// ==========================
// СРЕДА ОБИТАНИЯ
// ==========================

function detectEnvironment(entity) {
  const text = concatText([entity.habitat, entity.origin, entity.description]);

  if (!text) return "";

  if (hasAny(text, ["болот", "топь", "топи", "трясин", "тростник"])) {
    return "болота";
  }
  if (
    hasAny(text, [
      "лес",
      "роща",
      "чащ",
      "джунгл",
      "заросшие чащи",
      "лесные тропы"
    ])
  ) {
    return "леса";
  }
  if (
    hasAny(text, [
      "пещер",
      "карст",
      "катакомб",
      "подзем",
      "тоннел",
      "туннел",
      "штольн",
      "шахт"
    ])
  ) {
    return "подземье";
  }
  if (
    hasAny(text, [
      "горы",
      "горные цепи",
      "хребт",
      "утес",
      "скалист",
      "плато",
      "ущелье",
      "каньон"
    ])
  ) {
    return "горы";
  }
  if (
    hasAny(text, [
      "степь",
      "степн",
      "равнин",
      "луга",
      "прерий",
      "плато степи",
      "холмистые равнины"
    ])
  ) {
    return "степи";
  }
  if (hasAny(text, ["пустын", "бархан", "дюн", "сухие пески"])) {
    return "пустыня";
  }
  if (hasAny(text, ["город", "поселени", "крепост", "замок"])) {
    return "города";
  }
  if (hasAny(text, ["руин", "заброшенн", "обломк", "остатки храмов"])) {
    return "руины";
  }
  if (
    hasAny(text, [
      "мор",
      "океан",
      "залив",
      "риф",
      "прибрежн",
      "соленые воды",
      "соленые воды"
    ])
  ) {
    return "моря и океаны";
  }
  if (
    hasAny(text, [
      "озер",
      "озер",
      "река",
      "ручей",
      "водоем",
      "водоем",
      "болотные озера"
    ])
  ) {
    return "водоемы";
  }
  if (hasAny(text, ["туман", "мгл", "мираж"])) {
    return "туманные земли";
  }

  return "иные территории";
}

// ==========================
// РАЗМЕР
// ==========================

function parseMaxMetersFromSize(raw) {
  if (!raw) return null;
  let s = toStr(raw).replace(",", ".");
  const nums = s.match(/(\d+(?:\.\d+)?)/g);
  if (!nums || !nums.length) return null;
  let max = 0;
  nums.forEach(n => {
    const v = parseFloat(n);
    if (!isNaN(v) && v > max) {
      max = v;
    }
  });
  return max || null;
}

function detectSizeCategory(entity) {
  const s = normStr(entity.size);
  if (!s) return "";

  const maxM = parseMaxMetersFromSize(entity.size);
  if (maxM != null) {
    if (maxM < 0.5) return "крошечное";
    if (maxM < 1.0) return "малое";
    if (maxM < 2.0) return "среднее";
    if (maxM < 4.0) return "крупное";
    return "гигантское";
  }

  if (hasAny(s, ["крошечн", "миниатюр", "очень мал"])) return "крошечное";
  if (hasAny(s, ["мелк", "небольш", "маленьк"])) return "малое";
  if (hasAny(s, ["гигант", "огромн", "колосс"])) return "гигантское";
  if (hasAny(s, ["крупн", "масштабн", "большое"])) return "крупное";

  return "среднее";
}

// ==========================
// ИНТЕЛЛЕКТ
// ==========================

function detectIntellect(entity) {
  const s = normStr(entity.intellect);
  if (!s) return "";

  // 1. без разума
  if (
    hasAny(s, [
      "без разума",
      "лишен разума",
      "лишен разума",
      "неразум",
      "разума нет"
    ])
  ) {
    return "без разума";
  }

  // 2. инстинктивный
  if (
    hasAny(s, [
      "инстинкт",
      "инстинктив",
      "простые реакции",
      "рефлекс"
    ])
  ) {
    return "инстинктивный";
  }

  // 3. высший разум
  if (
    hasAny(s, [
      "очень высокий",
      "выше среднего",
      "коллективный разум",
      "сложная эхолокационная навигация",
      "стратегическ",
      "развитая координация",
      "сложная координация"
    ])
  ) {
    return "высший разум";
  }

  // 4. разумный
  if (
    hasAny(s, [
      "высокий",
      "разумн",
      "хитрый",
      "развитая память",
      "осторожность и память"
    ])
  ) {
    return "разумный";
  }

  // 5. ограниченный
  if (
    hasAny(s, [
      "средний",
      "ниже среднего",
      "низкий",
      "ограничен",
      "ограниченн",
      "примитив"
    ])
  ) {
    return "ограниченный";
  }

  // фолбек
  return "ограниченный";
}

// ==========================
// ПРОИСХОЖДЕНИЕ
// ==========================

function detectOrigin(entity) {
  const text = concatText([entity.origin, entity.description]);

  if (!text) return "";

  // божественное
  if (hasAny(text, ["божествен", "бог", "пантеон", "дочерь богов"])) {
    return "божественное";
  }

  // магическое
  if (
    hasAny(text, [
      "магическ",
      "заклинан",
      "чарод",
      "волшеб",
      "колдун",
      "теневой магией",
      "проклят"
    ])
  ) {
    return "магическое";
  }

  // аномальное
  if (
    hasAny(text, [
      "аномаль",
      "искажен",
      "искажен",
      "аберрац",
      "изуродован",
      "мутац"
    ])
  ) {
    return "аномальное";
  }

  // иномирное
  if (
    hasAny(text, [
      "иномир",
      "иной мир",
      "другая плоскость",
      "другой мир",
      "вне мира"
    ])
  ) {
    return "иномирное";
  }

  // смешанное
  if (
    hasAny(text, [
      "смешан",
      "гибридн",
      "смешанное происхождение"
    ])
  ) {
    return "смешанное";
  }

  // древнее
  if (
    hasAny(text, [
      "древн",
      "древние святилища",
      "дописьмен",
      "прошлых эпох"
    ])
  ) {
    return "древнее";
  }

  // естественное
  if (
    hasAny(text, [
      "естествен",
      "естественная эволюция",
      "эволюция",
      "эволюционная ветвь"
    ])
  ) {
    return "естественное";
  }

  // фолбек
  return "естественное";
}

// ==========================
// СТАТУС
// ==========================

function detectStatus(entity) {
  const text = concatText([entity.status, entity.rarity, entity.description]);

  if (hasAny(text, ["одомашн", "домашн"])) return "одомашненное";
  if (hasAny(text, ["легендар", "мифич"])) return "легендарное";
  if (hasAny(text, ["уникаль", "единствен"])) return "уникальное";
  if (hasAny(text, ["вымерш", "исчезн"])) return "вымершее";
  if (hasAny(text, ["редк", "нечаст"])) return "редкое";

  return "дикое";
}

// ==========================
// АРТЕФАКТЫ: НОРМАЛИЗАЦИЯ
// ==========================

function detectArtifactPowerClass(entity) {
  if (!entity) return null;
  const raw = entity.powerClass || entity.class_power || entity.classPower || entity.rank;
  if (!raw) return null;
  const s = normStr(raw)
    .replace("класс", "")
    .replace("ранг", "")
    .trim()
    .toUpperCase();
  if (!s) return null;

  if (s.indexOf("OME") !== -1 || s.indexOf("ОМЕГА") !== -1) {
    return "Ω";
  }
  if (s.indexOf("LAMB") !== -1 || s.indexOf("ЛАМБ") !== -1) {
    return "Λ";
  }

  const code = s.replace(/[^SABCDΩΛ]/g, "");
  if (code === "S" || code === "A" || code === "B" || code === "C" || code === "D" || code === "Ω" || code === "Λ") {
    return code;
  }

  return toStr(raw).trim();
}

function detectArtifactType(entity) {
  if (!entity) return null;
  const raw = entity.artifactType || entity.subtype || entity.type;
  if (!raw) return null;
  return toStr(raw).trim();
}

function detectArtifactMaterial(entity) {
  if (!entity) return null;
  if (entity.material) {
    return toStr(entity.material).trim();
  }
  const t = entity.tags || {};
  let value = null;

  if (Array.isArray(t.material)) {
    value = t.material.join(", ");
  } else if (Array.isArray(t["материал"])) {
    value = t["материал"].join(", ");
  } else if (t.material || t["материал"]) {
    value = t.material || t["материал"];
  }

  if (!value) return null;
  return toStr(value).trim();
}

function detectArtifactEffect(entity) {
  if (!entity) return null;
  if (entity.effect) {
    return toStr(entity.effect).trim();
  }

  const t = entity.tags || {};
  let value = null;

  if (Array.isArray(t.effect)) {
    value = t.effect.join(", ");
  } else if (Array.isArray(t["назначение"])) {
    value = t["назначение"].join(", ");
  } else if (t.effect || t["назначение"]) {
    value = t.effect || t["назначение"];
  }

  if (!value) {
    const sc = entity.small_card || {};
    const raw = sc.effect;
    if (raw) {
      value = raw;
    }
  }

  if (!value) return null;
  return toStr(value).trim();
}

function detectArtifactStatus(entity) {
  if (!entity) return null;
  if (entity.status) {
    return toStr(entity.status).trim();
  }

  const t = entity.tags || {};
  if (t.status || t["статус"]) {
    return toStr(t.status || t["статус"]).trim();
  }

  const text = concatText([
    entity.origin && (entity.origin.состояние || entity.origin["состояние"] || entity.origin.природа || entity.origin["природа"]),
    entity.description,
    entity.small_card && entity.small_card.description,
    entity.big_card && entity.big_card.description
  ]);

  if (hasAny(text, ["утерян", "потерян", "затерян", "утрач"])) {
    return "утраченный";
  }
  if (hasAny(text, ["разрушен", "осквернен"])) {
    return "разрушенный";
  }
  if (hasAny(text, ["запечатан", "опечатан", "заперт", "скреплен"])) {
    return "запечатанный";
  }
  if (hasAny(text, ["проклят", "проклят"])) {
    return "проклятый";
  }

  return null;
}

function detectArtifactEpoch(entity) {
  if (!entity) return null;
  const origin = entity.origin || {};
  const raw =
    origin.epoch ||
    origin["эпоха"] ||
    entity.epoch ||
    entity.originEra;
  if (!raw) return null;
  return toStr(raw).trim();
}

function detectArtifactBinding(entity) {
  if (!entity) return null;
  if (entity.bindingType) {
    return toStr(entity.bindingType).trim();
  }

  const t = entity.tags || {};
  if (t.bindingType || t["привязка"]) {
    return toStr(t.bindingType || t["привязка"]).trim();
  }

  const sc = entity.small_card || {};
  const bc = entity.big_card || {};
  const text = concatText([
    sc.limitations,
    bc.limitations,
    sc.price,
    bc.price
  ]);

  if (hasAny(text, ["кровн", "кровь владельца", "кровная связь"])) {
    return "кровная привязка";
  }
  if (hasAny(text, ["жертва", "жертв", "плата"])) {
    return "жертвенная привязка";
  }
  if (hasAny(text, ["выбирает владельца", "привязан к владельцу", "требует носителя"])) {
    return "личная привязка";
  }

  return null;
}

function detectArtifactCost(entity) {
  if (!entity) return null;
  if (entity.cost) {
    return toStr(entity.cost).trim();
  }
  const sc = entity.small_card || {};
  const bc = entity.big_card || {};
  const raw = sc.price || bc.price || sc["цена"] || bc["цена"];
  if (!raw) return null;
  return toStr(raw).trim();
}

function normalizeArtifact(entity) {
  if (!entity || typeof entity !== "object") {
    return entity;
  }

  const powerClass = detectArtifactPowerClass(entity);
  if (powerClass) {
    entity.powerClass = powerClass;
  }

  const artifactType = detectArtifactType(entity);
  if (artifactType) {
    entity.artifactType = artifactType;
  }

  const material = detectArtifactMaterial(entity);
  if (material) {
    entity.material = material;
  }

  const effect = detectArtifactEffect(entity);
  if (effect) {
    entity.effect = effect;
  }

  const status = detectArtifactStatus(entity);
  if (status) {
    entity.status = status;
  }

  const epoch = detectArtifactEpoch(entity);
  if (epoch) {
    entity.originEra = epoch;
  }

  const binding = detectArtifactBinding(entity);
  if (binding) {
    entity.bindingType = binding;
  }

  const cost = detectArtifactCost(entity);
  if (cost) {
    entity.cost = cost;
  }

  return entity;
}

// ==========================
// БОГИ: НОРМАЛИЗАЦИЯ
// ==========================

function detectGodDeityLevel(e) {
const raw = e.deityLevel || e.level || e.rank || null;
  return raw ? toStr(raw).trim() : null;
}

function detectGodDomain(e) {
  const raw = e.domain || e.sphere || e["сфера"] || e["домен"];
  if (!raw) return null;
  if (Array.isArray(raw)) return raw.map(toStr).join(", ");
  return toStr(raw).trim();
}

function detectGodPantheon(e) {
  const raw = e.pantheon || e["пантеон"];
  return raw ? toStr(raw).trim() : null;
}

function detectGodAspect(e) {
  const raw = e.aspect || e["аспект"];
  if (!raw) return null;
  if (Array.isArray(raw)) return raw.map(toStr).join(", ");
  return toStr(raw).trim();
}

function detectGodAllegiance(e) {
  const raw =
    e.allegiance || e.alignment || e.side || e["сторона"] || e["принадлежность"];
  return raw ? toStr(raw).trim() : null;
}

function detectGodNature(e) {
  const raw = e.nature || e["природа"] || e.essence;
  return raw ? toStr(raw).trim() : null;
}

function detectGodEpoch(e) {
  const raw = e.epoch || e["эпоха"] || (e.origin && e.origin.epoch);
  return raw ? toStr(raw).trim() : null;
}

function detectGodStatus(e) {
  const raw = e.status || e.state || e["статус"];
  return raw ? toStr(raw).trim() : null;
}

function detectGodSymbol(e) {
  const raw = e.symbol || e["символ"];
  return raw ? toStr(raw).trim() : null;
}

function detectGodAnimal(e) {
  const raw = e.animal || e.totem || e["тотем"];
  return raw ? toStr(raw).trim() : null;
}

function detectGodCultType(e) {
  const raw = e.cultType || e.worshipType || e["тип_культа"] || e.cult;
  return raw ? toStr(raw).trim() : null;
}

function normalizeGod(e) {
  if (!e || typeof e !== "object") return e;

  const deityLevel = detectGodDeityLevel(e);
  if (deityLevel) e.deityLevel = deityLevel;

  const domain = detectGodDomain(e);
  if (domain) e.domain = domain;

  const pantheon = detectGodPantheon(e);
  if (pantheon) e.pantheon = pantheon;

  const aspect = detectGodAspect(e);
  if (aspect) e.aspect = aspect;

  const allegiance = detectGodAllegiance(e);
  if (allegiance) e.allegiance = allegiance;

  const nature = detectGodNature(e);
  if (nature) e.nature = nature;

  const epoch = detectGodEpoch(e);
  if (epoch) e.epoch = epoch;

  const status = detectGodStatus(e);
  if (status) e.status = status;

  const symbol = detectGodSymbol(e);
  if (symbol) e.symbol = symbol;

  const animal = detectGodAnimal(e);
  if (animal) e.animal = animal;

  const cultType = detectGodCultType(e);
  if (cultType) {
    e.cultType = cultType;
    if (!e.worshipType) e.worshipType = cultType;
  }

  return e;
}

// ==========================
// РАСЫ: НОРМАЛИЗАЦИЯ
// ==========================

function detectRaceType(e) {
  const raw = e.raceType || e.type || (e.tags && e.tags.raceType) || (e.tags && e.tags["тип_расы"]);
  return raw ? toStr(raw).trim() : null;
}

function detectRaceOriginType(e) {
  const raw = e.originType || e.origin || e["происхождение"];
  return raw ? toStr(raw).trim() : null;
}

function detectRaceHabitat(e) {
  const raw = e.habitat || e.environment || e["среда_обитания"] || e["среда"];
  if (!raw) return null;
  if (Array.isArray(raw)) return raw.map(toStr).join(", ");
  return toStr(raw).trim();
}

function detectRaceTemperament(e) {
  const raw = e.temperament || e["характер"];
  return raw ? toStr(raw).trim() : null;
}

function detectRaceHeightRange(e) {
  const raw = e.heightRange || e.height || e["рост"];
  return raw ? toStr(raw).trim() : null;
}

function detectRaceSkin(e) {
  const raw = e.skin || e.skin_color || e["цвет_кожи"] || e["покров"];
  return raw ? toStr(raw).trim() : null;
}

function detectRaceBodyFeatures(e) {
  const raw = e.bodyFeatures || e.body || e["особенности_тела"] || e["телосложение"];
  return raw ? toStr(raw).trim() : null;
}

function detectRaceLifespan(e) {
  const raw = e.lifespan || e["долголетие"] || e["срок_жизни"];
  return raw ? toStr(raw).trim() : null;
}

function detectRaceAspect(e) {
  const raw = e.aspect || e["аспект"];
  if (!raw) return null;
  if (Array.isArray(raw)) return raw.map(toStr).join(", ");
  return toStr(raw).trim();
}

function detectRaceMagicAffinity(e) {
  const raw = e.magicAffinity || e.magic || e["магическая_склонность"] || e["магия"];
  return raw ? toStr(raw).trim() : null;
}

function detectRaceSocietyType(e) {
  const raw = e.societyType || e.society || e.structure || e["структура_общества"];
  return raw ? toStr(raw).trim() : null;
}

function detectRacePolityType(e) {
  const raw = e.polityType || e.politics || e.political_system || e["политический_строй"];
  return raw ? toStr(raw).trim() : null;
}

function detectRaceReligiosity(e) {
  const raw = e.religiosity || e.religion || e["религиозность"];
  return raw ? toStr(raw).trim() : null;
}

function detectRaceLanguage(e) {
  const raw = e.language || e["язык"];
  return raw ? toStr(raw).trim() : null;
}

function detectRaceInnerProblems(e) {
  const raw = e.innerProblems || e.problems || e["проблематика"];
  return raw ? toStr(raw).trim() : null;
}

function detectRaceFactions(e) {
  const raw = e.factions || e["фракции"];
  if (!raw) return null;
  if (Array.isArray(raw)) return raw.map(toStr).join(", ");
  return toStr(raw).trim();
}

function normalizeRace(e) {
  if (!e || typeof e !== "object") return e;

  const raceType = detectRaceType(e);
  if (raceType) e.raceType = raceType;

  const originType = detectRaceOriginType(e);
  if (originType) e.originType = originType;

  const habitat = detectRaceHabitat(e);
  if (habitat) e.habitat = habitat;

  const temperament = detectRaceTemperament(e);
  if (temperament) e.temperament = temperament;

  const heightRange = detectRaceHeightRange(e);
  if (heightRange) e.heightRange = heightRange;

  const skin = detectRaceSkin(e);
  if (skin) e.skin = skin;

  const bodyFeatures = detectRaceBodyFeatures(e);
  if (bodyFeatures) e.bodyFeatures = bodyFeatures;

  const lifespan = detectRaceLifespan(e);
  if (lifespan) e.lifespan = lifespan;

  const aspect = detectRaceAspect(e);
  if (aspect) e.aspect = aspect;

  const magicAffinity = detectRaceMagicAffinity(e);
  if (magicAffinity) e.magicAffinity = magicAffinity;

  const societyType = detectRaceSocietyType(e);
  if (societyType) e.societyType = societyType;

  const polityType = detectRacePolityType(e);
  if (polityType) e.polityType = polityType;

  const religiosity = detectRaceReligiosity(e);
  if (religiosity) e.religiosity = religiosity;

  const language = detectRaceLanguage(e);
  if (language) e.language = language;

  const innerProblems = detectRaceInnerProblems(e);
  if (innerProblems) e.innerProblems = innerProblems;

  const factions = detectRaceFactions(e);
  if (factions) e.factions = factions;

  return e;
}

// ==========================
// СБОРКА СУЩЕСТВА
// ==========================

function normalizeCreature(entity) {
  if (!entity || typeof entity !== "object") return entity;

  if (!entity._originalType && entity.type) {
    entity._originalType = entity.type;
  }

  const cls = detectCreatureClass(entity);
  entity.class = cls;

  const feedingType = detectFeedingType(entity);
  entity.type = feedingType;

  const dangerRank = detectDanger(entity);
  if (dangerRank) {
    entity.danger = dangerRank;
  }

  const env = detectEnvironment(entity);
  if (env) {
    entity.environment = env;
  }

  const sizeCat = detectSizeCategory(entity);
  if (sizeCat) {
    entity.size = sizeCat;
  }

  const intel = detectIntellect(entity);
  if (intel) {
    entity.intellect = intel;
  }

  const orig = detectOrigin(entity);
  if (orig) {
    entity.origin = orig;
  }

  const status = detectStatus(entity);
  if (status) {
    entity.status = status;
  }

  return entity;
}

// ==========================
// ГЛАВНАЯ ФУНКЦИЯ ТЕГОВ
// ==========================

export function getTagsForCard(entity, sectionKey = "creatures") {
  if (!entity || typeof entity !== "object") {
    return [];
  }

  const tags = [];

  if (sectionKey === "creatures") {
    normalizeCreature(entity);

    if (entity.class) {
      pushTag(tags, "class", entity.class);
    }
    if (entity.type) {
      pushTag(tags, "type", entity.type);
    }
    if (entity.danger) {
      pushTag(tags, "danger", entity.danger);
    }
    if (entity.size) {
      pushTag(tags, "size", entity.size);
    }
    if (entity.environment) {
      pushTag(tags, "environment", entity.environment);
    }
    if (entity.intellect) {
      pushTag(tags, "intellect", entity.intellect);
    }
    if (entity.status) {
      pushTag(tags, "status", entity.status);
    }
    if (entity.origin) {
      pushTag(tags, "origin", entity.origin);
    }

    return tags;
  }


else if (sectionKey === "gods") {
  normalizeGod(entity);

  if (entity.deityLevel)   pushTag(tags, "deityLevel", entity.deityLevel);
  if (entity.domain)       pushTag(tags, "domain", entity.domain);
  if (entity.pantheon)     pushTag(tags, "pantheon", entity.pantheon);
  if (entity.aspect)       pushTag(tags, "aspect", entity.aspect);
  if (entity.allegiance)   pushTag(tags, "allegiance", entity.allegiance);
  if (entity.nature)       pushTag(tags, "nature", entity.nature);
  if (entity.epoch)        pushTag(tags, "epoch", entity.epoch);
  if (entity.status)       pushTag(tags, "status", entity.status);

  if (entity.symbol)       pushTag(tags, "symbol", entity.symbol);
  if (entity.animal)       pushTag(tags, "animal", entity.animal);
  if (entity.cultType)     pushTag(tags, "cultType", entity.cultType);
}

else if (sectionKey === "races") {
  normalizeRace(entity);

  if (entity.raceType)      pushTag(tags, "raceType", entity.raceType);
  if (entity.originType)    pushTag(tags, "originType", entity.originType);
  if (entity.habitat)       pushTag(tags, "habitat", entity.habitat);
  if (entity.temperament)   pushTag(tags, "temperament", entity.temperament);
  if (entity.heightRange)   pushTag(tags, "heightRange", entity.heightRange);
  if (entity.skin)          pushTag(tags, "skin", entity.skin);
  if (entity.bodyFeatures)  pushTag(tags, "bodyFeatures", entity.bodyFeatures);
  if (entity.lifespan)      pushTag(tags, "lifespan", entity.lifespan);
  if (entity.aspect)        pushTag(tags, "aspect", entity.aspect);
  if (entity.magicAffinity) pushTag(tags, "magicAffinity", entity.magicAffinity);
  if (entity.societyType)   pushTag(tags, "societyType", entity.societyType);
  if (entity.polityType)    pushTag(tags, "polityType", entity.polityType);
  if (entity.religiosity)   pushTag(tags, "religiosity", entity.religiosity);
  if (entity.language)      pushTag(tags, "language", entity.language);
  if (entity.innerProblems) pushTag(tags, "innerProblems", entity.innerProblems);
  if (entity.factions)      pushTag(tags, "factions", entity.factions);
}






else if (sectionKey === "artifacts") {
  normalizeArtifact(entity);

  if (entity.powerClass) {
    pushTag(tags, "powerClass", entity.powerClass);
  }
  if (entity.artifactType) {
    pushTag(tags, "artifactType", entity.artifactType);
  }
  if (entity.material) {
    pushTag(tags, "material", entity.material);
  }
  if (entity.effect) {
    pushTag(tags, "effect", entity.effect);
  }
  if (entity.status) {
    pushTag(tags, "status", entity.status);
  }
  if (entity.originEra) {
    pushTag(tags, "originEra", entity.originEra);
  }
  if (entity.bindingType) {
    pushTag(tags, "bindingType", entity.bindingType);
  }
  if (Array.isArray(entity.aspects)) {
    entity.aspects.forEach(function(a) {
      pushTag(tags, "aspect", a);
    });
  }
  if (entity.cost) {
    pushTag(tags, "cost", entity.cost);
  }
}

  if (Array.isArray(entity.tags)) {
    return entity.tags.map(t => {
      if (t && typeof t === "object") {
        return t;
      }
      const label = String(t);
      return { key: "misc", value: label, label };
    });
  }

  return [];
}
