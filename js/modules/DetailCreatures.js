// js/modules/DetailCreatures.js

import { getLongDescriptionForDetails } from "./TagSystem.js";

function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function createSection(titleText) {
  const section = document.createElement("section");
  section.className = "detail-section detail-section--creature";

  const title = document.createElement("h3");
  title.className = "detail-section__title";
  title.textContent = titleText;

  section.appendChild(title);
  return section;
}

function appendInfoRow(listEl, label, value) {
  if (!value) return;
  const text = String(value).trim();
  if (!text) return;

  const li = document.createElement("li");
  li.className = "detail-info__row";
  li.innerHTML =
    `<span class="detail-info__label">${label}:</span> ` +
    `<span class="detail-info__value">${text}</span>`;
  listEl.appendChild(li);
}

export function renderCreatureDetail(creature, container, chapterKey) {
  if (!creature || !container) return;

  container.innerHTML = "";

  const card = document.createElement("article");
  card.className = "detail-card detail-card--creature";

  // ====== HEADER ======
  const header = document.createElement("header");
  header.className = "detail-card__header";

  const headerMain = document.createElement("div");
  headerMain.className = "detail-card__header-main";

  const nameEl = document.createElement("h2");
  nameEl.className = "detail-card__name";
  nameEl.textContent = creature.name || "Без имени";

  const subtitleEl = document.createElement("p");
  subtitleEl.className = "detail-card__subtitle";
  const typePart = creature.type || creature.kind || "";
  const rolePart = creature.role || "";
  const subtitleParts = [];
  if (typePart) subtitleParts.push(typePart);
  if (rolePart) subtitleParts.push(rolePart);
  subtitleEl.textContent = subtitleParts.join(" — ");

  headerMain.appendChild(nameEl);
  if (subtitleEl.textContent) headerMain.appendChild(subtitleEl);

  const badges = document.createElement("div");
  badges.className = "detail-card__badges";

  const element = creature.element;
  const danger = creature.danger;

  if (element) {
    const elBadge = document.createElement("span");
    elBadge.className = "pill pill--element";
    elBadge.dataset.type = String(element);
    elBadge.textContent = element;
    badges.appendChild(elBadge);
  }

  if (danger) {
    const dangerBadge = document.createElement("span");
    dangerBadge.className = "pill pill--danger";
    dangerBadge.dataset.danger = String(danger).toUpperCase();
    dangerBadge.textContent = `Опасность ${danger}`;
    badges.appendChild(dangerBadge);
  }

  header.appendChild(headerMain);
  if (badges.children.length) header.appendChild(badges);

  if (creature.image) {
    const imgWrap = document.createElement("div");
    imgWrap.className = "detail-card__image-wrapper";

    const img = document.createElement("img");
    img.className = "detail-card__image";
    img.src = creature.image;
    img.alt = creature.name || "Изображение существа";

    imgWrap.appendChild(img);
    header.appendChild(imgWrap);
  }

  card.appendChild(header);

  // ====== BODY ======
  const body = document.createElement("div");
  body.className = "detail-card__body";

  // 1) Описание
  const descSection = createSection("Описание");
  const descText = document.createElement("p");
  descText.className = "detail-text";

  let longDesc = "";
  if (typeof getLongDescriptionForDetails === "function") {
    try {
      longDesc =
        getLongDescriptionForDetails(
          creature,
          chapterKey || "creatures"
        ) || "";
    } catch (e) {
      longDesc = "";
    }
  }
  if (!longDesc) {
    longDesc =
      creature.description ||
      creature.flavor ||
      "Подробное описание пока не заполнено.";
  }

  descText.textContent = longDesc;
  descSection.appendChild(descText);
  body.appendChild(descSection);

  // 2) Основные характеристики
  const infoSection = createSection("Основные характеристики");
  const infoList = document.createElement("ul");
  infoList.className = "detail-info";

  appendInfoRow(infoList, "Происхождение", creature.origin);
  appendInfoRow(infoList, "Среда обитания", creature.habitat);
  appendInfoRow(infoList, "Интеллект", creature.intellect);
  appendInfoRow(infoList, "Темперамент", creature.temperament);
  appendInfoRow(infoList, "Размер", creature.size);
  appendInfoRow(infoList, "Скорость", creature.speed);
  appendInfoRow(infoList, "Сила", creature.power);
  appendInfoRow(infoList, "Живучесть", creature.resilience);
  appendInfoRow(infoList, "Магический уровень", creature.magicLevel);
  appendInfoRow(infoList, "Возраст", creature.age);
  appendInfoRow(infoList, "Редкость", creature.rarity);

  infoSection.appendChild(infoList);
  body.appendChild(infoSection);

  // 3) Поведение
  const behaviorList = toArray(creature.behavior);
  if (behaviorList.length) {
    const behaviorSection = createSection("Поведение");
    const ul = document.createElement("ul");
    ul.className = "detail-list detail-list--behavior";
    behaviorList.forEach((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      ul.appendChild(li);
    });
    behaviorSection.appendChild(ul);
    body.appendChild(behaviorSection);
  }

  // 4) Слабости
  const weaknessesList = toArray(creature.weaknesses);
  if (weaknessesList.length) {
    const weaknessesSection = createSection("Слабости");
    const ul = document.createElement("ul");
    ul.className = "detail-list detail-list--weaknesses";
    weaknessesList.forEach((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      ul.appendChild(li);
    });
    weaknessesSection.appendChild(ul);
    body.appendChild(weaknessesSection);
  }

  // 5) Способности
  const abilities = toArray(creature.abilities);
  if (abilities.length) {
    const abilitiesSection = createSection("Способности");
    const ul = document.createElement("ul");
    ul.className = "detail-list detail-list--abilities";

    abilities.forEach((ability) => {
      if (!ability) return;
      const li = document.createElement("li");

      if (typeof ability === "string") {
        li.textContent = ability;
      } else {
        const name = ability.name || "";
        const desc = ability.desc || ability.effect || "";
        if (name) {
          const strong = document.createElement("strong");
          strong.textContent = name + (desc ? ": " : "");
          li.appendChild(strong);
        }
        if (desc) {
          const span = document.createElement("span");
          span.textContent = desc;
          li.appendChild(span);
        }
      }

      ul.appendChild(li);
    });

    abilitiesSection.appendChild(ul);
    body.appendChild(abilitiesSection);
  }

  // 6) Теги
  const tags = toArray(creature.tags);
  if (tags.length) {
    const tagsSection = createSection("Теги");
    const tagsWrap = document.createElement("div");
    tagsWrap.className = "detail-tags";

    tags.forEach((tag) => {
      const text = typeof tag === "string" ? tag : String(tag || "").trim();
      if (!text) return;
      const span = document.createElement("span");
      span.className = "tag-pill tag-pill--static";
      span.dataset.tag = text;
      span.textContent = text;
      tagsWrap.appendChild(span);
    });

    tagsSection.appendChild(tagsWrap);
    body.appendChild(tagsSection);
  }

  // 7) Связанные объекты
  const related = toArray(creature.related);
  if (related.length) {
    const relatedSection = createSection("Связанные объекты");
    const ul = document.createElement("ul");
    ul.className = "detail-list detail-list--related";

    related.forEach((item) => {
      const li = document.createElement("li");
      li.textContent =
        (item && item.name) || (typeof item === "string" ? item : "");
      ul.appendChild(li);
    });

    relatedSection.appendChild(ul);
    body.appendChild(relatedSection);
  }

  card.appendChild(body);
  container.appendChild(card);
}

export default renderCreatureDetail;
