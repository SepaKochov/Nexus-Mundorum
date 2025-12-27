// js/modules/DetailView.js

import * as DetailGods from "./DetailGods.js";
import * as DetailCreatures from "./DetailCreatures.js";
import * as DetailArtifacts from "./DetailArtifacts.js";

/**
 * Вспомогательный вызов модуля-рендера:
 * 1) сначала пробуем именованную функцию;
 * 2) потом default-экспорт;
 * 3) иначе — false (будет fallback).
 */
function callRenderer(module, preferredFnName, entity, container, chapterKey) {
  if (!module) return false;

  if (preferredFnName && typeof module[preferredFnName] === "function") {
    module[preferredFnName](entity, container, chapterKey);
    return true;
  }

  if (typeof module.default === "function") {
    module.default(entity, container, chapterKey);
    return true;
  }

  return false;
}

/**
 * Универсальный JSON-fallback, если специализированный модуль не сработал.
 */
function renderFallbackDetail(entity, container, chapterKey) {
  if (!entity || !container) return;

  container.innerHTML = "";

  const card = document.createElement("article");
  card.className = "detail-card detail-card--generic";

  const header = document.createElement("header");
  header.className = "detail-card__header";

  const title = document.createElement("h2");
  title.className = "detail-card__name";
  title.textContent = entity.name || entity.title || "Объект";

  header.appendChild(title);
  card.appendChild(header);

  const body = document.createElement("div");
  body.className = "detail-card__body";

  const pre = document.createElement("pre");
  pre.className = "detail-card__raw-json";

  try {
    pre.textContent = JSON.stringify(entity, null, 2);
  } catch (e) {
    pre.textContent = String(entity);
  }

  body.appendChild(pre);
  card.appendChild(body);

  container.appendChild(card);
}

/**
 * Универсальный рендер больших карточек.
 * @param {string} chapterKey - "gods/high", "creatures/beasts" и т.п.
 * @param {Object} entity     - объект из JSON
 * @param {HTMLElement} container - контейнер внутри оверлея
 */
export function renderDetailView(chapterKey, entity, container) {
  if (!container) return;

  const key = typeof chapterKey === "string" ? chapterKey : "";

  // Боги — модуль DetailGods
  if (/^gods/i.test(key)) {
    const ok = callRenderer(DetailGods, "renderGodDetail", entity, container, key);
    if (!ok) renderFallbackDetail(entity, container, key);
    return;
  }

  // Существа — модуль DetailCreatures
  if (/^creatures/i.test(key)) {
    const ok = callRenderer(
      DetailCreatures,
      "renderCreatureDetail",
      entity,
      container,
      key
    );
    if (!ok) renderFallbackDetail(entity, container, key);
    return;
  }

  // Артефакты — модуль DetailArtifacts
  if (/^artifacts/i.test(key)) {
    const ok = callRenderer(
      DetailArtifacts,
      "renderArtifactDetail",
      entity,
      container,
      key
    );
    if (!ok) renderFallbackDetail(entity, container, key);
    return;
  }

  // Остальные главы — пока общий fallback
  renderFallbackDetail(entity, container, key);
}

/**
 * Публичный вход для main.js:
 * открывает оверлей и отдает сущность в нужный модуль по главе.
 *
 * @param {Object} entity
 * @param {Object} options
 *   - detailOverlay
 *   - detailContent
 *   - section      (например "creatures" или "gods")
 *   - subsection   (опционально, "beasts", "high" и т.п.)
 */
export function openDetailCard(entity, options = {}) {
  if (!entity) return;

  const overlay =
    options.detailOverlay ||
    document.getElementById("detailOverlay") ||
    document.getElementById("detail-overlay") ||
    document.getElementById("detail-panel");

  const content =
    options.detailContent ||
    document.getElementById("detailBody") ||
    document.getElementById("detail-body") ||
    document.getElementById("detail-content");

  if (!overlay || !content) {
    console.error("DetailView: контейнеры оверлея не найдены.");
    return;
  }

  const section =
    options.section ||
    (typeof window !== "undefined" && window.currentSection) ||
    "creatures";

  const subsection =
    options.subsection ||
    (typeof window !== "undefined" && window.currentSubsection) ||
    "";

  const chapterKey = subsection ? `${section}/${subsection}` : section;

  renderDetailView(chapterKey, entity, content);

  overlay.hidden = false;
  overlay.classList.add("open");

  if (typeof overlay.scrollTo === "function") {
    overlay.scrollTo({ top: 0 });
  }
}

export default openDetailCard;
