import { getShortDescriptionForCard, getLongDescriptionForDetails } from "./modules/TagSystem.js";
import { getTagsForCard } from "./modules/TagSystemUnified.js";
import { openDetailCard } from "./modules/DetailView.js";
// ==========================
//  ГЛОБАЛЬНОЕ СОСТОЯНИЕ
// ==========================

let creaturesData = [];
let currentSection = "creatures";
let currentSubsection = "beasts";

// ==========================
//  DOM-ЭЛЕМЕНТЫ
// ==========================

// Контейнер карточек (новая разметка: #grid)
const creaturesContainer =
  document.querySelector("#creatures-container") ||
  document.querySelector("#grid");

// Окно подробной карточки / оверлей
// Поддерживаем оба варианта ID (camelCase и kebab-case),
// чтобы не зависеть от старой/новой верстки.
const detailOverlay =
  document.getElementById("detailOverlay") ||
  document.getElementById("detail-overlay") ||
  document.getElementById("detail-panel");

const detailContent =
  document.getElementById("detailBody") ||
  document.getElementById("detail-body") ||
  document.getElementById("detail-content");

const detailClose =
  document.getElementById("detailCloseBtn") ||
  document.getElementById("detail-close-btn") ||
  document.getElementById("detail-close");

// Фильтры
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const elementFilter = document.getElementById("elementFilter");
const dangerFilter = document.getElementById("dangerFilter");
const resetBtn = document.getElementById("resetBtn");
const statusBar = document.getElementById("statusBar");

// Стартовый экран
const startScreen = document.getElementById("startScreen");
const pageBody = document.body;

function showStartScreen() {
  if (pageBody) pageBody.classList.add("start-mode");
}

function hideStartScreen() {
  if (pageBody) pageBody.classList.remove("start-mode");
}

function setupStartScreenButtons() {
  if (!startScreen) return;
  const buttons = startScreen.querySelectorAll("[data-section][data-subsection]");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const section = btn.getAttribute("data-section");
      const subsection = btn.getAttribute("data-subsection");
      if (!section || !subsection) return;
      hideStartScreen();
      loadCategory(section, subsection);
    });
  });
}

function setupStartModeNavHide() {
  // Прячем стартовый экран при клике по ссылкам в боковом меню
  document.addEventListener("click", (e) => {
    const navLink = e.target.closest(".side-nav__link");
    if (!navLink) return;
    if (typeof hideStartScreen === "function") {
      hideStartScreen();
    }
  });
}

function setupTitleClick() {
  const titleEl = document.querySelector(".site-header .site-title");
  if (!titleEl) return;
  titleEl.style.cursor = "pointer";
  titleEl.addEventListener("click", () => {
    showStartScreen();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}



// ==========================
//  ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ==========================





// getShortDescriptionForCard вынесен в TagSystem.js


function updateStatusBar(shownCount) {
  if (!statusBar) return;

  const total = creaturesData.length;
  if (!total) {
    statusBar.textContent = "Данных для этой категории пока нет.";
    return;
  }

  if (shownCount === total) {
    statusBar.textContent = `Показано ${shownCount} сущ. (без фильтрации).`;
  } else {
    statusBar.textContent = `Показано ${shownCount} из ${total} сущ. (применены фильтры).`;
  }
}

// Заполнение select-ов уникальными значениями
function fillSelect(select, values, allLabel) {
  if (!select) return;
  const items = Array.from(values).filter(Boolean).sort((a, b) =>
    a.localeCompare(b, "ru", { sensitivity: "base" })
  );

  const prev = select.value;
  select.innerHTML =
    `<option value="all">${escapeHtml(allLabel)}</option>` +
    items.map(v => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join("");

  if (items.includes(prev)) {
    select.value = prev;
  } else {
    select.value = "all";
  }
}

// Собираем значения для фильтров из текущих данных
function rebuildFilterOptions() {
  const types = new Set();
  const elements = new Set();
  const dangers = new Set();

  for (const c of creaturesData) {
    if (c.type) types.add(c.type);
    if (c.element) elements.add(c.element);
    if (c.danger) dangers.add(String(c.danger).toUpperCase());
  }

  fillSelect(typeFilter, types, "Все типы");
  fillSelect(elementFilter, elements, "Все элементы");
  fillSelect(dangerFilter, dangers, "Все уровни");
}


// Генератор стабильного цвета по тексту тега

// Удобный помощник: превращаем строку/массив в нормальный массив строк

// ==========================
//     БОЛЬШАЯ КАРТОЧКА
// ==========================
//
// Детальный рендер вынесен в js/modules/DetailView.js (openDetailCard).
// Здесь оставляем только логику закрытия оверлея.

function closeDetail() {
  if (!detailOverlay) return;
  detailOverlay.classList.remove("open");
  detailOverlay.hidden = true;
}

if (detailClose) {
  detailClose.addEventListener("click", (e) => {
    e.stopPropagation();
    closeDetail();
  });
}

if (detailOverlay) {
  detailOverlay.addEventListener("click", (e) => {
    if (e.target === detailOverlay) {
      closeDetail();
    }
  });
}

// ==========================
//     РЕНДЕР КАРТОЧЕК
// ==========================





// ==========================
//       ФИЛЬТРАЦИЯ
// ==========================



// ==========================
//     ОБРАБОТЧИКИ ФИЛЬТРОВ

/* ===== UNIFIED FILTERS SYSTEM: STEP 1 ===== */

if (searchInput) {
  searchInput.addEventListener("input", () => {
    if (window.BestiaryFilters) {
      window.BestiaryFilters.activeFilters.search = searchInput.value.trim();
      window.BestiaryFilters.refreshFilteredItems();
    } else {
      applyFilters();
    }
  });
}

if (typeFilter) {
  typeFilter.addEventListener("change", () => {
    const val = typeFilter.value === "all" ? "" : typeFilter.value;
    if (window.BestiaryFilters) {
      window.BestiaryFilters.activeFilters.type = val;
      window.BestiaryFilters.refreshFilteredItems();
    } else {
      applyFilters();
    }
  });
}

if (elementFilter) {
  elementFilter.addEventListener("change", () => {
    const val = elementFilter.value === "all" ? "" : elementFilter.value;
    if (window.BestiaryFilters) {
      window.BestiaryFilters.activeFilters.element = val;
      window.BestiaryFilters.refreshFilteredItems();
    } else {
      applyFilters();
    }
  });
}

if (dangerFilter) {
  dangerFilter.addEventListener("change", () => {
    const val = dangerFilter.value === "all" ? "" : dangerFilter.value.toUpperCase();
    if (window.BestiaryFilters) {
      window.BestiaryFilters.activeFilters.danger = val;
      window.BestiaryFilters.refreshFilteredItems();
    } else {
      applyFilters();
    }
  });
}

if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    if (typeFilter) typeFilter.value = "all";
    if (elementFilter) elementFilter.value = "all";
    if (dangerFilter) dangerFilter.value = "all";

    if (window.BestiaryFilters) {
      window.BestiaryFilters.activeFilters = { search: "" };
      window.BestiaryFilters.refreshFilteredItems();
    } else {
      applyFilters();
    }
  });
}

/* ===== END UNIFIED FILTERS SYSTEM STEP 1 ===== */

// ==========================
//      ЗАГРУЗКА ДАННЫХ
// ==========================


async function loadCategory(section, subsection) {
  currentSection = section;
  currentSubsection = subsection;

  const path = `data/${section}/${subsection}.json`;
  console.log("ЗАГРУЗКА:", path);

  const loader = document.getElementById("loader");
  const loadError = document.getElementById("loadError");
  const retryBtn = document.getElementById("retryBtn");

  // Сбрасываем состояние
  if (loader) loader.style.display = "block";
  if (loadError) loadError.style.display = "none";
  if (statusBar) {
    statusBar.textContent = `Загрузка данных: ${section}/${subsection}…`;
  }

  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error("Файл не найден");

    const json = await response.json();
    if (!Array.isArray(json)) throw new Error("Ожидался массив объектов");

    creaturesData = json;
    rebuildFilterOptions();
    applyFilters();

    if (loader) loader.style.display = "none";
  } catch (err) {
    console.error("Ошибка загрузки:", err);
    creaturesData = [];
    renderCards([]);

    if (loader) loader.style.display = "none";
    if (loadError) loadError.style.display = "block";
    if (statusBar) {
      statusBar.textContent = `Ошибка загрузки: ${section}/${subsection}`;
    }

    if (retryBtn) {
      retryBtn.onclick = () => loadCategory(section, subsection);
    }
  }
}


// ==========================
//  СЛУШАТЕЛЬ НАВИГАЦИИ
// ==========================

// nav.js должен диспатчить такое событие:
// window.dispatchEvent(new CustomEvent("bestiary:navigate", { detail: { section, subsection }}));

window.addEventListener("bestiary:navigate", e => {
  const { section, subsection } = e.detail || {};
  if (!section || !subsection) return;
  loadCategory(section, subsection);
});

// ==========================
//      АВТО-ЗАПУСК
// ==========================

document.addEventListener("DOMContentLoaded", () => {
  showStartScreen();
  setupStartScreenButtons();
  setupTitleClick();
  setupStartModeNavHide();
});

// === BESTIARY FILTER SYSTEM ===
(function() {
  "use strict";

  // Конфиг фильтров по разделам
  var FILTER_CONFIG = {
    creatures: {
      searchFields: ["name", "short", "description"],
      filters: {
        class: { field: "class" },
        type: { field: "type" },
        danger: { field: "danger" },
        size: { field: "size" },
        environment: { field: "environment" },
        intellect: { field: "intellect" },
        status: { field: "status" },
        origin: { field: "origin" }
      }
    },
    gods: {
      searchFields: ["name", "title", "description"],
      filters: {
        deityLevel: { field: "deityLevel" },
        domain: { field: "domain_type" },
        pantheon: { field: "pantheon" },
        aspect: { field: "aspect" },
        worshipType: { field: "worship.cult_type" },
        status: { field: "allegiance" }
      }
    },
    artifacts: {
      searchFields: ["name", "short", "description"],
      filters: {
        powerClass: { field: "powerClass" },
        artifactType: { field: "artifactType" },
        material: { field: "material" },
        effect: { field: "effect" },
        status: { field: "status" },
        originEra: { field: "originEra" },
        bindingType: { field: "bindingType" }
      }
    },
    races: {
      searchFields: ["name", "short", "description"],
      filters: {
        raceCategory: { field: "raceCategory" },
        civilizationType: { field: "civilizationType" },
        devLevel: { field: "devLevel" },
        habitat: { field: "habitat" },
        cultureTraits: { field: "cultureTraits" },
        physiology: { field: "physiology" }
      }
    },
    locations: {
      searchFields: ["name", "short", "description"],
      filters: {
        locationType: { field: "locationType" },
        climate: { field: "climate" },
        locationDanger: { field: "danger" },
        locationStatus: { field: "status" },
        locationEra: { field: "originEra" },
        dominantForce: { field: "dominantForce" }
      }
    },
    magic: {
      searchFields: ["name", "short", "description"],
      filters: {
        magicNature: { field: "magicNature" },
        phenomenonType: { field: "phenomenonType" },
        impactLevel: { field: "impactLevel" },
        stability: { field: "stability" },
        source: { field: "source" }
      }
    },
    history: {
      searchFields: ["name", "short", "description"],
      filters: {
        recordType: { field: "recordType" },
        epoch: { field: "epoch" },
        sourceForm: { field: "sourceForm" },
        reliability: { field: "reliability" },
        topic: { field: "topic" }
      }
    },
    organizations: {
      searchFields: ["name", "short", "description"],
      filters: {
        orgType: { field: "orgType" },
        status: { field: "status" },
        influence: { field: "influence" },
        activitySphere: { field: "activitySphere" },
        allegiance: { field: "allegiance" }
      }
    },
    materials: {
      searchFields: ["name", "short", "description"],
      filters: {
        materialType: { field: "materialType" },
        rarity: { field: "rarity" },
        origin: { field: "origin" },
        usage: { field: "usage" },
        stability: { field: "stability" }
      }
    },
    languages: {
      searchFields: ["name", "short", "description"],
      filters: {
        languageType: { field: "languageType" },
        complexity: { field: "complexity" },
        transmission: { field: "transmission" },
        languageOrigin: { field: "languageOrigin" },
        languageStatus: { field: "languageStatus" }
      }
    },
    heroes: {
      searchFields: ["name", "short", "description"],
      filters: {
        role: { field: "role" },
        influenceLevel: { field: "influenceLevel" },
        affiliation: { field: "affiliation" },
        powerType: { field: "powerType" },
        historyStatus: { field: "historyStatus" }
      }
    },
    templates: {
      searchFields: ["name", "description"],
      filters: {}
    }
  };

  var currentSectionKey = null;
  var currentItems = [];
  var activeFilters = { search: "" };
  var renderCallback = null;

  function getItemFieldValue(item, fieldPath) {
    if (!item || !fieldPath) {
      return null;
    }
    var parts = fieldPath.split(".");
    var value = item;
    for (var i = 0; i < parts.length; i++) {
      if (value == null) {
        return null;
      }
      value = value[parts[i]];
    }
    return value;
  }

  // Для существ вызываем getTagsForCard, чтобы TagSystemUnified
  // отнормализовал поля (class, type, danger, size, environment и т.д.)
  function projectFiltersForSection(sectionKey, items) {
    if (!items || !Array.isArray(items)) {
      return items || [];
    }
    if (typeof getTagsForCard !== "function") {
      return items;
    }
    return items.map(function(item) {
      try {
        // Вызов нужен ради побочного эффекта normalize* внутри TagSystemUnified
        getTagsForCard(item, sectionKey);
      } catch (e) {
        // игнорируем ошибки
      }
      return item;
    });
  }

  function buildFilterOptionsForSelect(selectElement, fieldName) {
    if (!selectElement || !fieldName) {
      return;
    }
    if (!currentItems || !Array.isArray(currentItems)) {
      return;
    }

    var valuesSet = {};
    currentItems.forEach(function(item) {
      var value = getItemFieldValue(item, fieldName);
      if (value === null || value === undefined) {
        return;
      }
      var str = String(value);
      if (!str) {
        return;
      }
      valuesSet[str] = true;
    });

    var values = Object.keys(valuesSet).sort();

    while (selectElement.firstChild) {
      selectElement.removeChild(selectElement.firstChild);
    }

    var anyOption = document.createElement("option");
    anyOption.value = "";
    anyOption.textContent = "Все";
    selectElement.appendChild(anyOption);

    values.forEach(function(val) {
      var option = document.createElement("option");
      option.value = val;
      option.textContent = val;
      selectElement.appendChild(option);
    });
  }

  function applyFiltersConfigForSection(sectionKey) {
    currentSectionKey = sectionKey;

    var panel = document.getElementById("filters-panel");
    if (!panel) {
      return;
    }

    var dynamicBlocks = panel.querySelectorAll(".dynamic-filter");
    dynamicBlocks.forEach(function(block) {
      block.style.display = "none";
    });

    activeFilters = { search: "" };

    var searchInput = document.getElementById("filter-search-input");
    if (searchInput) {
      searchInput.value = "";
    }

    var sectionConfig = FILTER_CONFIG[sectionKey];
    if (!sectionConfig) {
      refreshFilteredItems();
      return;
    }

    var filtersConfig = sectionConfig.filters || {};
    Object.keys(filtersConfig).forEach(function(filterKey) {
      var blockId = "filter-" + filterKey;
      var block = document.getElementById(blockId);
      if (!block) {
        return;
      }
      block.style.display = "block";

      var selectElement = block.querySelector("select");
      if (!selectElement) {
        return;
      }
      buildFilterOptionsForSelect(selectElement, filtersConfig[filterKey].field);
      selectElement.value = "";
      activeFilters[filterKey] = "";
    });

    refreshFilteredItems();
  }

  function applySearchFilterToItem(item) {
    var sectionConfig = FILTER_CONFIG[currentSectionKey];
    if (!sectionConfig) {
      return true;
    }

    var searchValue = activeFilters.search;
    if (!searchValue) {
      return true;
    }

    var fields = sectionConfig.searchFields || [];
    if (!fields.length) {
      return true;
    }

    var needle = searchValue.toLowerCase();

    for (var i = 0; i < fields.length; i++) {
      var fieldName = fields[i];
      var fieldValue = getItemFieldValue(item, fieldName);
      if (fieldValue == null) {
        continue;
      }
      var text = String(fieldValue).toLowerCase();
      if (text.indexOf(needle) !== -1) {
        return true;
      }
    }

    return false;
  }

  function applyFieldFiltersToItem(item) {
    var sectionConfig = FILTER_CONFIG[currentSectionKey];
    if (!sectionConfig) {
      return true;
    }
    var filtersConfig = sectionConfig.filters || {};
    var keys = Object.keys(filtersConfig);

    for (var i = 0; i < keys.length; i++) {
      var filterKey = keys[i];
      var expected = activeFilters[filterKey];
      if (!expected) {
        continue;
      }
      var fieldName = filtersConfig[filterKey].field;
      var value = getItemFieldValue(item, fieldName);
      if (value == null) {
        return false;
      }
      var str = String(value);
      if (str !== expected) {
        return false;
      }
    }

    return true;
  }

  function getFilteredItems() {
    if (!currentItems || !Array.isArray(currentItems)) {
      return [];
    }
    return currentItems.filter(function(item) {
      if (!applySearchFilterToItem(item)) {
        return false;
      }
      if (!applyFieldFiltersToItem(item)) {
        return false;
      }
      return true;
    });
  }

  function refreshFilteredItems() {
    var items = getFilteredItems();
    if (typeof renderCallback === "function") {
      renderCallback(items);
    }
  }

  function initFiltersUi() {
    var panel = document.getElementById("filters-panel");
    if (panel) {
      var dynamicBlocks = panel.querySelectorAll(".dynamic-filter");
      dynamicBlocks.forEach(function(block) {
        block.style.display = "none";
      });
    }

    var searchInput = document.getElementById("filter-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", function() {
        activeFilters.search = searchInput.value.trim();
        refreshFilteredItems();
      });
    }

    var selects = document.querySelectorAll(".filter-select-control");
    selects.forEach(function(selectElement) {
      selectElement.addEventListener("change", function() {
        var key = selectElement.getAttribute("data-filter-key");
        if (!key) {
          return;
        }
        activeFilters[key] = selectElement.value || "";
        refreshFilteredItems();
      });
    });

    // Кнопка "Сбросить фильтры" (создаем динамически)
    if (panel) {
      var resetBtn = document.createElement("button");
      resetBtn.type = "button";
      resetBtn.className = "filters-reset-button";
      resetBtn.textContent = "Сбросить фильтры";
      panel.appendChild(resetBtn);

      resetBtn.addEventListener("click", function() {
        // поиск
        if (searchInput) {
          searchInput.value = "";
        }
        activeFilters.search = "";

        // селекты
        var selectsInner = panel.querySelectorAll(".filter-select-control");
        selectsInner.forEach(function(sel) {
          var key = sel.getAttribute("data-filter-key");
          sel.value = "";
          if (key) {
            activeFilters[key] = "";
          }
        });

        refreshFilteredItems();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFiltersUi);
  } else {
    initFiltersUi();
  }

  if (!window.BestiaryFilters) {
    window.BestiaryFilters = {};
  }

  window.BestiaryFilters.setContext = function(sectionKey, items, renderFn) {
    currentSectionKey = sectionKey;
    currentItems = Array.isArray(items) ? items.slice() : [];
    currentItems = projectFiltersForSection(sectionKey, currentItems);
    renderCallback = typeof renderFn === "function" ? renderFn : null;
    applyFiltersConfigForSection(sectionKey);
    refreshFilteredItems();
  };

  window.BestiaryFilters.activeFilters = activeFilters;
  window.BestiaryFilters.refreshFilteredItems = refreshFilteredItems;

})();  // end BESTIARY FILTER SYSTEM

  





// getLongDescriptionForDetails вынесен в TagSystem.js






// getTagsForCard вынесен в TagSystem.js



/* ===== UNIFIED_APPLYFILTERS_SHIM (BestiaryFilters) ===== */

function applyFilters() {
  // Если новая система фильтров есть — используем только ее
  if (window.BestiaryFilters) {
    const bf = window.BestiaryFilters;

    // Обновляем контекст
    if (typeof bf.setContext === "function") {
      bf.setContext(currentSection, creaturesData || [], renderCards);
    } else {
      bf.currentSection = currentSection;
      bf.items = creaturesData || [];
      bf.renderCallback = renderCards;
    }

    // Готовим объект активных фильтров
    if (!bf.activeFilters || typeof bf.activeFilters !== "object") {
      bf.activeFilters = {};
    }
    const af = bf.activeFilters;

    // Поиск
    if (typeof searchInput !== "undefined" && searchInput) {
      af.search = searchInput.value.trim();
    }

    // Тип
    if (typeof typeFilter !== "undefined" && typeFilter) {
      const val = typeFilter.value;
      af.type = val === "all" ? "" : val;
    }

    // Элемент
    if (typeof elementFilter !== "undefined" && elementFilter) {
      const val = elementFilter.value;
      af.element = val === "all" ? "" : val;
    }

    // Опасность
    if (typeof dangerFilter !== "undefined" && dangerFilter) {
      const val = dangerFilter.value;
      af.danger = val === "all" ? "" : val.toUpperCase();
    }

    if (typeof bf.refreshFilteredItems === "function") {
      bf.refreshFilteredItems();
    } else {
      // На всякий случай — прямой рендер, если что-то пошло не так
      renderCards(bf.items || creaturesData || []);
    }
    return;
  }

  // Fallback: если по какой-то причине BestiaryFilters нет
  if (Array.isArray(creaturesData)) {
    renderCards(creaturesData);
  } else {
    renderCards([]);
  }
}

// Экспорт части состояния и DOM в window для модулей
window.currentSection = currentSection;
window.creaturesData = creaturesData;
window.creaturesContainer = creaturesContainer;
window.searchInput = searchInput;
window.elementFilter = elementFilter;
window.dangerFilter = dangerFilter;
window.updateStatusBar = updateStatusBar;
window.applyFilters = applyFilters;



/* ===== END UNIFIED_APPLYFILTERS_SHIM ===== */





/* ============================================================
   РЕНДЕР КАРТОЧЕК — ВОЗВРАЩЕНО ИЗ СТАРОГО main.js
   ============================================================ */



window.renderCards = renderCards;

// ==========================
//     РЕНДЕР КАРТОЧЕК
// ==========================

function renderCards(list) {
  if (!creaturesContainer) {
    console.error("Контейнер для карточек не найден (#creatures-container или #grid).");
    return;
  }

  creaturesContainer.innerHTML = "";

  if (!list || list.length === 0) {
    creaturesContainer.innerHTML = `
      <div class="empty-message">
        <p>Нет данных в этой категории.</p>
      </div>`;
    updateStatusBar(0);
    return;
  }

  list.forEach(creature => {
    const card = document.createElement("article");
    card.className = "card";

    const name = escapeHtml(creature.name || "Без имени");
    const type = escapeHtml(creature.type || creature.kind || "Неизвестный тип");
    const danger = (currentSection === "gods")
      ? ""
      : (creature.danger || "").toUpperCase();
    const element = escapeHtml(creature.element || "");
    const originText = typeof getOriginText === "function"
      ? getOriginText(creature.origin)
      : (creature.origin || "");
    let tags = [];
    if (typeof getTagsForCard === "function") {
      try {
        const res = getTagsForCard(creature, currentSection);
        if (Array.isArray(res)) {
          tags = res;
        } else if (Array.isArray(creature.tags)) {
          tags = creature.tags;
        }
      } catch (e) {
        console.error("Ошибка генерации тегов для объекта:", creature, e);
        if (Array.isArray(creature.tags)) {
          tags = creature.tags;
        }
      }
    } else if (Array.isArray(creature.tags)) {
      tags = creature.tags;
    }

    // Дополнительная генерация тегов для богов, если система тегов ничего не вернула
    if ((!tags || !tags.length) && currentSection === "gods") {
      tags = [];

      const pushTag = (key, value, label) => {
        if (!value) return;
        const text = String(value).trim();
        if (!text) return;
        tags.push({ key, value: text, label: label || text });
      };

      // уровень божества
      const deityLevel = creature.deityLevel || creature.deity_level;
      pushTag("deityLevel", deityLevel);

      // сфера влияния / домен
      const domainType =
        creature.domain_type ||
        (creature.domain && (creature.domain.type || creature.domain.name));
      pushTag("domain_type", domainType);

      // пантеон
      pushTag("pantheon", creature.pantheon);

      // аспект
      pushTag("aspect", creature.aspect);

      // тип поклонения
      const worshipType =
        creature.worshipType ||
        (creature.worship && (creature.worship.cult_type || creature.worship.type));
      pushTag("worshipType", worshipType);

      // статус / выравнивание
      const status = creature.status || creature.allegiance || creature.alignment;
      pushTag("status", status);
    }

    const rawShort = (typeof getShortDescriptionForCard === "function")
      ? getShortDescriptionForCard(creature, currentSection, originText)
      : (creature.description || creature.flavor || creature.summary || originText || "");
    const descShort = shorten(rawShort, 200);

    card.innerHTML = `
      <header class="card-header">
        <div>
          <h3 class="card-title">${name}</h3>
          <p class="card-subtitle">${type}</p>
        </div>
        <div class="card-badges">
          ${
            element
              ? `<span class="pill pill--element" data-type="${element}">${element}</span>`
              : ""
          }
          ${
            danger
              ? `<span class="pill pill--danger" data-danger="${danger}">Опасность ${danger}</span>`
              : ""
          }
        </div>
      </header>

      <div class="card-body">
        <p class="card-text">${escapeHtml(descShort || "Описание пока пустое.")}</p>
      </div>

      ${
        tags.length
          ? `<footer class="card-footer">
               <div class="card-tags">
                 ${tags
                                      .map(t => {
                     const isObject = t && typeof t === "object";
                     const text = isObject
                       ? (t.label || String(t.value || ""))
                       : String(t);
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
                   }).join("")}
               </div>
             </footer>`
          : ""
      }
    `;

    // Клик по карточке — открываем подробную
    card.addEventListener("click", () => openDetailCard(creature, { detailOverlay, detailContent, searchInput, applyFilters, section: currentSection }));;

    // Клик по тегу — применяем поиск по тегу
    card.querySelectorAll(".tag-pill").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        const tag = btn.dataset.tag || "";
        if (searchInput) {
          searchInput.value = tag;
        }
        applyFilters();
      });
    });

    // Клик по элементу
    card.querySelectorAll(".pill[data-type]").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        if (elementFilter && btn.dataset.type) {
          elementFilter.value = btn.dataset.type;
          applyFilters();
        }
      });
    });

    // Клик по опасности
    card.querySelectorAll(".pill[data-danger]").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        if (dangerFilter && btn.dataset.danger) {
          dangerFilter.value = btn.dataset.danger;
          applyFilters();
        }
      });
    });

    creaturesContainer.appendChild(card);
  });

  updateStatusBar(list.length);
}


// ============================================================
//  ГЛОБАЛЬНЫЙ ОБРАБОТЧИК КЛИКОВ ПО ТЕГАМ (универсальный)
//  Клик по тегу пытается найти подходящий фильтр по значению;
//  если не находит — просто запускает поиск по тексту тега.
// ============================================================

(function() {
  document.addEventListener(
    "click",
    function(e) {
      const btn = e.target.closest(".tag-pill");
      if (!btn) {
        return;
      }

      const tagText = (btn.dataset.tag || btn.textContent || "").trim();
      const tagValue = btn.dataset.tagValue || tagText;

      if (!tagText) {
        return;
      }

      // Гасим дефолтное поведение
      e.stopImmediatePropagation();
      e.preventDefault();

      let applied = false;

      if (typeof window.applyFilters === "function") {
        const selects = document.querySelectorAll(".filter-select-control");
        outer: for (const select of selects) {
          for (const opt of select.options) {
            if (opt.value === tagValue || opt.textContent === tagValue) {
              select.value = opt.value;
              const evt = new Event("change", { bubbles: true });
              select.dispatchEvent(evt);
              applied = True
              break outer
            }
          }
        }
      }

      // Фолбэк: поиск по самому тексту тега
      if (!applied) {
        if (typeof window.searchInput !== "undefined" && window.searchInput) {
          window.searchInput.value = tagText;
        }
        if (typeof window.applyFilters === "function") {
          window.applyFilters();
        }
      }
    },
    true
  );
})();;

