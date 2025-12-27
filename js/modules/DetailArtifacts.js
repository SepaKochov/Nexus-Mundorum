// js/modules/DetailArtifacts.js

function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/\r?\n|[,;]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function createSection(titleText) {
  const section = document.createElement("section");
  section.className = "detail-section detail-section--artifact";

  const title = document.createElement("h3");
  title.className = "detail-section__title";
  title.textContent = titleText;

  section.appendChild(title);
  return section;
}

function renderTextBlock(container, title, raw) {
  if (!raw) return;
  const text = String(raw).trim();
  if (!text) return;

  const section = createSection(title);
  const p = document.createElement("p");
  p.className = "detail-text";
  p.innerHTML = escapeHtml(text).replace(/\n/g, "<br>");
  section.appendChild(p);
  container.appendChild(section);
}

function renderListBlock(container, title, rawList) {
  const list = toArray(rawList);
  if (!list.length) return;

  const section = createSection(title);
  const ul = document.createElement("ul");
  ul.className = "detail-list detail-list--artifact";

  list.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = escapeHtml(String(item)).replace(/\n/g, "<br>");
    ul.appendChild(li);
  });

  section.appendChild(ul);
  container.appendChild(section);
}

function renderInfoBlock(container, origin) {
  if (!origin) return;
  const originObj = typeof origin === "string" ? { происхождение: origin } : origin;
  if (typeof originObj !== "object") return;
  const rows = [
    ["Эпоха", originObj["эпоха"] || originObj["эра"] || originObj.epoch || originObj.era],
    ["Пантеон", originObj["пантеон"] || originObj.pantheon],
    ["Божество", originObj["божество"] || originObj.deity || originObj.god],
    ["Природа", originObj["природа"] || originObj.nature],
    ["Источник", originObj["происхождение"] || originObj.origin]
  ].filter(([, v]) => !!v);

  if (!rows.length) return;

  const section = createSection("Происхождение");
  const ul = document.createElement("ul");
  ul.className = "detail-info";

  rows.forEach(([label, value]) => {
    const li = document.createElement("li");
    li.className = "detail-info__row";
    li.innerHTML =
      `<span class="detail-info__label">${escapeHtml(label)}:</span>` +
      `<span class="detail-info__value">${escapeHtml(String(value))}</span>`;
    ul.appendChild(li);
  });

  section.appendChild(ul);
  container.appendChild(section);
}

function renderChips(container, title, items) {
  const values = toArray(items);
  if (!values.length) return;

  const section = createSection(title);
  const wrap = document.createElement("div");
  wrap.className = "detail-tags";

  values.forEach((v) => {
    const chip = document.createElement("span");
    chip.className = "tag-pill tag-pill--static";
    chip.textContent = v;
    wrap.appendChild(chip);
  });

  section.appendChild(wrap);
  container.appendChild(section);
}

export function renderArtifactDetail(artifact, container, chapterKey) {
  if (!artifact || !container) return;

  container.innerHTML = "";

  const card = document.createElement("article");
  card.className = "detail-card detail-card--artifact";

  // HEADER
  const header = document.createElement("header");
  header.className = "detail-card__header";

  const headerMain = document.createElement("div");
  headerMain.className = "detail-card__header-main";

  const nameEl = document.createElement("h2");
  nameEl.className = "detail-card__name";
  nameEl.textContent = artifact.name || "Без имени";

  const subtitleEl = document.createElement("p");
  subtitleEl.className = "detail-card__subtitle";
  const subtitleParts = [];
  const typePart =
    artifact.artifactType ||
    artifact.subtype ||
    artifact.type ||
    "";
  if (typePart) subtitleParts.push(typePart);
  const secondaryType = artifact.kind || artifact.category || "";
  if (secondaryType) subtitleParts.push(secondaryType);
  subtitleEl.textContent = subtitleParts.join(" — ");

  headerMain.appendChild(nameEl);
  if (subtitleEl.textContent) headerMain.appendChild(subtitleEl);

  const badges = document.createElement("div");
  badges.className = "detail-card__badges";
  const powerClass = artifact.powerClass || artifact.class_power;
  if (powerClass) {
    const badge = document.createElement("span");
    badge.className = "pill pill--power";
    badge.dataset.power = String(powerClass).toUpperCase();
    badge.textContent = `Класс ${String(powerClass).toUpperCase()}`;
    badges.appendChild(badge);
  }

  header.appendChild(headerMain);
  if (badges.children.length) header.appendChild(badges);
  card.appendChild(header);

  // BODY
  const body = document.createElement("div");
  body.className = "detail-card__body";

  const big = artifact.big_card || {};
  const small = artifact.small_card || {};

  renderInfoBlock(body, artifact.origin);

  renderChips(body, "Аспекты", artifact.aspects);

  const tags = [];
  if (artifact.tags) {
    if (Array.isArray(artifact.tags)) {
      tags.push(...artifact.tags);
    } else if (typeof artifact.tags === "object") {
      Object.values(artifact.tags).forEach((val) => {
        if (Array.isArray(val)) {
          tags.push(...val);
        } else {
          tags.push(val);
        }
      });
    }
  }
  renderChips(body, "Теги", tags);

  renderTextBlock(
    body,
    "Описание",
    big.description || small.description || artifact.description
  );

  renderTextBlock(
    body,
    "Эффект",
    big.effect || small.effect || artifact.effect
  );

  renderTextBlock(body, "Характер", big.character || artifact.character);

  renderListBlock(body, "Способности", big.abilities || artifact.abilities);

  renderListBlock(
    body,
    "Ограничения",
    big.limitations || small.limitations
  );

  renderTextBlock(body, "Влияние", big.influence || artifact.influence);
  renderTextBlock(
    body,
    "Использование",
    big.possible_use || big["возможное использование в сюжете"]
  );

  renderTextBlock(
    body,
    "Цена",
    big.price || small.price || artifact.price || artifact.cost
  );

  card.appendChild(body);
  container.appendChild(card);
}

export default renderArtifactDetail;
