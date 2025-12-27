import { getShortDescriptionForCard } from "./TagSystem.js";
import { getTagsForCard } from "./TagSystemUnified.js";
import { openDetailCard } from "./DetailView.js";

function resolveContainer(provided) {
  if (provided) return provided;
  return (
    document.querySelector("#creatures-container") ||
    document.querySelector("#grid")
  );
}

function safeGetTags(entity, sectionKey) {
  try {
    const tags = getTagsForCard(entity, sectionKey);
    return Array.isArray(tags) ? tags : [];
  } catch (e) {
    console.error("Ошибка генерации тегов:", e);
    return [];
  }
}

function buildSubtitle(entity, sectionKey) {
  if (sectionKey === "artifacts") {
    const type =
      entity.artifactType ||
      entity.subtype ||
      entity.type ||
      entity.kind ||
      "Артефакт";
    return type;
  }

  const primary =
    entity.type ||
    entity.kind ||
    entity.category ||
    "";
  return primary || "Неизвестный тип";
}

function buildBadges(entity, sectionKey) {
  const badges = [];

  if (sectionKey === "creatures") {
    const element = entity.element || "";
    const danger = entity.danger ? String(entity.danger).toUpperCase() : "";

    if (element) {
      badges.push({
        className: "pill pill--element",
        text: element,
        dataset: { type: element }
      });
    }
    if (danger) {
      badges.push({
        className: "pill pill--danger",
        text: `Опасность ${danger}`,
        dataset: { danger }
      });
    }
  } else if (sectionKey === "artifacts") {
    const powerClass = entity.powerClass || entity.class_power;
    if (powerClass) {
      badges.push({
        className: "pill pill--power",
        text: `Класс ${String(powerClass).toUpperCase()}`,
        dataset: { power: String(powerClass).toUpperCase() }
      });
    }

    const secondary =
      entity.bindingType ||
      entity.originEra ||
      entity.status ||
      "";

    if (secondary) {
      badges.push({
        className: "pill pill--artifact",
        text: secondary,
        dataset: { artifactMeta: secondary }
      });
    }
  }

  return badges;
}

function renderBadgesHtml(badges) {
  return badges
    .map(badge => {
      const dataAttrs = Object.entries(badge.dataset || {})
        .map(([key, value]) => `data-${key}="${escapeHtml(value)}"`)
        .join(" ");

      return `<span class="${badge.className}" ${dataAttrs}>${escapeHtml(badge.text)}</span>`;
    })
    .join("");
}

function renderTagsHtml(tags) {
  if (!tags.length) return "";

  const items = tags.map(t => {
    const isObject = t && typeof t === "object";
    const text = isObject ? (t.label || String(t.value || "")) : String(t);
    const color = tagColorFromText(text);
    const key = isObject ? (t.key || "") : "";
    const value = isObject ? String(t.value ?? "") : text;
    const dataAttrs = key
      ? `data-tag="${escapeHtml(text)}" data-tag-key="${escapeHtml(key)}" data-tag-value="${escapeHtml(value)}"`
      : `data-tag="${escapeHtml(text)}"`;
    return `<button 
              type="button" 
              class="tag-pill" 
              ${dataAttrs}
              style="background:${color}; border-color:${color};"
            >${escapeHtml(text)}</button>`;
  });

  return `<div class="card-tags">${items.join("")}</div>`;
}

function attachInteractions(cardEl, entity, context) {
  const {
    detailOverlay,
    detailContent,
    searchInput,
    elementFilter,
    dangerFilter,
    applyFilters,
    sectionKey
  } = context;

  cardEl.addEventListener("click", () =>
    openDetailCard(entity, {
      detailOverlay,
      detailContent,
      searchInput,
      applyFilters,
      section: sectionKey
    })
  );

  cardEl.querySelectorAll(".tag-pill").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const tag = btn.dataset.tag || "";
      if (searchInput) {
        searchInput.value = tag;
      }
      if (typeof applyFilters === "function") {
        applyFilters();
      }
    });
  });

  cardEl.querySelectorAll(".pill[data-type]").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      if (elementFilter && btn.dataset.type) {
        elementFilter.value = btn.dataset.type;
        if (typeof applyFilters === "function") {
          applyFilters();
        }
      }
    });
  });

  cardEl.querySelectorAll(".pill[data-danger]").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      if (dangerFilter && btn.dataset.danger) {
        dangerFilter.value = btn.dataset.danger;
        if (typeof applyFilters === "function") {
          applyFilters();
        }
      }
    });
  });

  cardEl.querySelectorAll(".pill[data-power]").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      if (searchInput) {
        searchInput.value = btn.dataset.power || "";
      }
      if (typeof applyFilters === "function") {
        applyFilters();
      }
    });
  });
}

export function renderCards(list, options = {}) {
  const container = resolveContainer(options.container);
  const sectionKey =
    options.section ||
    (typeof window !== "undefined" && window.currentSection) ||
    "creatures";

  if (!container) {
    console.error("CardRenderer: контейнер карточек не найден.");
    return;
  }

  container.innerHTML = "";

  if (!list || list.length === 0) {
    container.innerHTML = `
      <div class="empty-message">
        <p>Нет данных в этой категории.</p>
      </div>`;
    if (typeof options.updateStatusBar === "function") {
      options.updateStatusBar(0);
    }
    return;
  }

  list.forEach(entity => {
    const card = document.createElement("article");
    card.className = "card";

    const name = escapeHtml(entity.name || "Без имени");
    const subtitle = escapeHtml(buildSubtitle(entity, sectionKey));

    const tags = safeGetTags(entity, sectionKey);
    const descriptionRaw = getShortDescriptionForCard(entity, sectionKey, getOriginText(entity.origin));
    const descShort = shorten(descriptionRaw, 200);

    const badges = buildBadges(entity, sectionKey);
    const badgesHtml = renderBadgesHtml(badges);
    const tagsHtml = renderTagsHtml(tags);

    card.innerHTML = `
      <header class="card-header">
        <div class="card-title-block">
          <h3 class="card-title">${name}</h3>
          <p class="card-subtitle">${subtitle}</p>
        </div>
        <div class="card-header-meta">
          <div class="card-badges">
            ${badgesHtml}
          </div>
          ${tagsHtml}
        </div>
      </header>

      <div class="card-body">
        <p class="card-text">${escapeHtml(descShort || "Описание пока пустое.")}</p>
      </div>

    `;

    attachInteractions(card, entity, {
      detailOverlay: options.detailOverlay,
      detailContent: options.detailContent,
      searchInput: options.searchInput,
      elementFilter: options.elementFilter,
      dangerFilter: options.dangerFilter,
      applyFilters: options.applyFilters,
      sectionKey
    });

    container.appendChild(card);
  });

  if (typeof options.updateStatusBar === "function") {
    options.updateStatusBar(list.length);
  }
}
