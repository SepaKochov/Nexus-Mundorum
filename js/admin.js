// ==========================
//   НАСТРОЙКИ ULTRA-CMS
// ==========================

const MANIFEST_URL = "data/index.json"; // манифест с путями к файлам

// ==========================
//   ГЛОБАЛЬНОЕ СОСТОЯНИЕ
// ==========================

let manifest = {};
let sources = [];        // [{ sectionKey, sectionTitle, subKey, subTitle, path }]
let allObjects = [];     // все объекты (единая коллекция)
let filteredObjects = []; // после фильтров
let selectedIndex = -1;  // индекс в filteredObjects

let editorOriginal = null;
let isDirty = false;
let suppressEditorEvents = false;

// фильтр по разделу/подразделу (навигация слева)
let currentSectionFilter = "all";
let currentSubsectionFilter = "all";

// ==========================
//   DOM-ЭЛЕМЕНТЫ
// ==========================

// навигация
const navTreeRoot = document.getElementById("adminNavTree");

// фильтры
const searchInput = document.getElementById("searchInput");
const dangerFilter = document.getElementById("dangerFilter");
const tagFilter = document.getElementById("tagFilter");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");
const statsPanel = document.getElementById("statsPanel");

// таблица
const tableBody = document.getElementById("objectsTableBody");
const objectsCounter = document.getElementById("objectsCounter");

// редактор
const editorForm = document.getElementById("editorForm");
const editorTitle = document.getElementById("editorTitle");
const statusBadge = document.getElementById("statusBadge");

const fieldId = document.getElementById("fieldId");
const fieldName = document.getElementById("fieldName");
const fieldKind = document.getElementById("fieldKind");
const fieldType = document.getElementById("fieldType");
const fieldDanger = document.getElementById("fieldDanger");
const fieldTags = document.getElementById("fieldTags");
const fieldOrigin = document.getElementById("fieldOrigin");
const fieldImage = document.getElementById("fieldImage");
const fieldImageFile = document.getElementById("fieldImageFile");
const imagePreview = document.getElementById("imagePreview");
const fieldDescription = document.getElementById("fieldDescription");
const markdownPreview = document.getElementById("markdownPreview");

// кнопки управления
const btnNew = document.getElementById("btnNew");
const btnDuplicate = document.getElementById("btnDuplicate");
const btnDelete = document.getElementById("btnDelete");
const btnImport = document.getElementById("btnImport");
const btnExport = document.getElementById("btnExport");
const btnRevert = document.getElementById("btnRevert");
const importFileInput = document.getElementById("importFileInput");

// ==========================
//    ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ==========================


// генерация стабильного ID, если нет
function ensureId(baseObj, index) {
  if (baseObj.id && String(baseObj.id).trim() !== "") return String(baseObj.id);
  const baseName = (baseObj.name || "object").toString();
  const namePart = baseName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-а-яё]/gi, "");
  return `obj_${namePart || "item"}_${index}`;
}

// нормализация тегов (строка → массив)

// markdown-light → HTML
function renderMarkdown(text) {
  if (!text || !text.trim()) {
    return `<div class="markdown-preview-empty">Тут появится предпросмотр описания.</div>`;
  }

  let html = escapeHtml(text);

  // **жирный** и *курсив*
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // списки
  html = html.replace(/(^|\n)[\-\*]\s+(.*)/g, "$1<li>$2</li>");
  html = html.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");

  // абзацы
  html = html
    .split(/\n{2,}/)
    .map(p => `<p>${p.replace(/\n/g, "<br>")}</p>`)
    .join("");

  return html;
}

// статус
function setStatusIdle() {
  isDirty = false;
  if (statusBadge) {
    statusBadge.textContent = "Нет изменений";
    statusBadge.className = "badge badge-idle";
  }
}

function setStatusDirty() {
  isDirty = true;
  if (statusBadge) {
    statusBadge.textContent = "Есть несохраненные";
    statusBadge.className = "badge badge-dirty";
  }
}

function setStatusError(message) {
  isDirty = true;
  if (statusBadge) {
    statusBadge.textContent = message || "Ошибка";
    statusBadge.className = "badge badge-error";
  }
}

// ==========================
//   ЗАГРУЗКА MANIFEST + DATA
// ==========================

async function loadManifest() {
  const res = await fetch(MANIFEST_URL);
  if (!res.ok) {
    throw new Error(`Не удалось загрузить манифест: ${MANIFEST_URL}`);
  }
  const json = await res.json();
  manifest = json || {};
  sources = [];

  let counter = 0;

  for (const [sectionKey, rawSection] of Object.entries(manifest)) {
    if (!rawSection || typeof rawSection !== "object") continue;

    const sectionTitle = rawSection._title || sectionKey;

    for (const [subKey, subVal] of Object.entries(rawSection)) {
      if (subKey === "_title") continue;

      let path = "";
      let subTitle = subKey;

      if (typeof subVal === "string") {
        path = subVal;
      } else if (subVal && typeof subVal === "object") {
        path = subVal.path || "";
        subTitle = subVal.title || subKey;
      }

      if (!path) continue;

      sources.push({
        id: counter++,
        sectionKey,
        sectionTitle,
        subKey,
        subTitle,
        path
      });
    }
  }
}

async function loadAllData() {
  allObjects = [];

  for (const src of sources) {
    try {
      const res = await fetch(src.path);
      if (!res.ok) {
        console.warn("Файл не найден или не читается:", src.path);
        continue;
      }
      const json = await res.json();
      if (!Array.isArray(json)) {
        console.warn("Ожидался массив в файле:", src.path);
        continue;
      }

      json.forEach(obj => {
        const prepared = {
          ...obj,
          id: ensureId(obj, allObjects.length),
          kind: obj.kind || "", // тип объекта по данным
          tags: normalizeTags(obj.tags),
          __section: src.sectionKey,
          __sectionTitle: src.sectionTitle,
          __subsection: src.subKey,
          __subsectionTitle: src.subTitle,
          __sourcePath: src.path
        };
        allObjects.push(prepared);
      });
    } catch (e) {
      console.error("Ошибка при загрузке", src.path, e);
    }
  }
}

// ==========================
//        НАВИГАЦИЯ
// ==========================

function buildNavTree() {
  if (!navTreeRoot) return;

  navTreeRoot.innerHTML = "";

  // Кнопка "Все объекты"
  const allBtn = document.createElement("button");
  allBtn.className = "nav-item nav-tree-item nav-item-all active";
  allBtn.textContent = "Все объекты";
  allBtn.dataset.section = "all";
  allBtn.dataset.subsection = "all";
  allBtn.addEventListener("click", onNavItemClick);
  navTreeRoot.appendChild(allBtn);

  // Группировка по sectionKey
  const grouped = {};
  for (const src of sources) {
    if (!grouped[src.sectionKey]) {
      grouped[src.sectionKey] = {
        title: src.sectionTitle,
        items: []
      };
    }
    grouped[src.sectionKey].items.push(src);
  }

  Object.values(grouped).forEach(group => {
    const sectionDiv = document.createElement("div");
    sectionDiv.className = "nav-tree-section";

    const firstItem = group.items[0];
    const sectionKey = firstItem.sectionKey;

    // по умолчанию раскрыта только группа "creatures"
    if (sectionKey !== "creatures") {
      sectionDiv.classList.add("collapsed");
    }

    // Заголовок раздела
    const titleDiv = document.createElement("div");
    titleDiv.className = "nav-tree-section-title";
    titleDiv.textContent = group.title;
    sectionDiv.appendChild(titleDiv);

    // Клик по заголовку — сворачивание/разворачивание
    titleDiv.addEventListener("click", () => {
      sectionDiv.classList.toggle("collapsed");
    });

    // Список подпунктов
    const listDiv = document.createElement("div");
    listDiv.className = "nav-tree-list";

    group.items.forEach(src => {
      const btn = document.createElement("button");
      btn.className = "nav-item nav-tree-item";
      btn.textContent = src.subTitle;
      btn.dataset.section = src.sectionKey;
      btn.dataset.subsection = src.subKey;
      btn.addEventListener("click", onNavItemClick);
      listDiv.appendChild(btn);
    });

    sectionDiv.appendChild(listDiv);
    navTreeRoot.appendChild(sectionDiv);
  });

  // по умолчанию — все объекты
  currentSectionFilter = "all";
  currentSubsectionFilter = "all";
}

function onNavItemClick(event) {
  const btn = event.currentTarget;
  const section = btn.dataset.section || "all";
  const subsection = btn.dataset.subsection || "all";

  currentSectionFilter = section;
  currentSubsectionFilter = subsection;

  // подсветка активной кнопки
  if (navTreeRoot) {
    const allButtons = navTreeRoot.querySelectorAll(".nav-item");
    allButtons.forEach(b => b.classList.remove("active"));
  }
  btn.classList.add("active");

  applyFilters();
}

function resetNavSelection() {
  currentSectionFilter = "all";
  currentSubsectionFilter = "all";

  if (!navTreeRoot) return;
  const allButtons = navTreeRoot.querySelectorAll(".nav-item");
  allButtons.forEach(b => b.classList.remove("active"));

  const allBtn = navTreeRoot.querySelector('.nav-item[data-section="all"]');
  if (allBtn) {
    allBtn.classList.add("active");
  }
}

// ==========================
//       ФИЛЬТРАЦИЯ
// ==========================

function applyFilters() {
  let list = [...allObjects];

  // фильтр по разделу/подразделу
  if (currentSectionFilter !== "all") {
    list = list.filter(obj => obj.__section === currentSectionFilter);

    if (currentSubsectionFilter !== "all") {
      list = list.filter(obj => obj.__subsection === currentSubsectionFilter);
    }
  }

  // фильтр по опасности
  const dangerValue = dangerFilter ? dangerFilter.value : "all";
  if (dangerValue && dangerValue !== "all") {
    list = list.filter(
      obj => (obj.danger || "").toUpperCase() === dangerValue.toUpperCase()
    );
  }

  // фильтр по тегу
  const tagValue = (tagFilter?.value || "").trim().toLowerCase();
  if (tagValue) {
    list = list.filter(obj => {
      const tags = Array.isArray(obj.tags) ? obj.tags : [];
      const joined = tags.join(" ").toLowerCase();
      return joined.includes(tagValue);
    });
  }

  // поиск
  const search = (searchInput?.value || "").trim().toLowerCase();
  if (search) {
    list = list.filter(obj => {
      const haystack = [
        obj.name,
        obj.kind,
        obj.type,
        obj.origin,
        obj.element,
        Array.isArray(obj.tags) ? obj.tags.join(" ") : "",
        obj.description
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(search);
    });
  }

  filteredObjects = list;
  renderTable();
  updateStats();
}

// ==========================
//        ТАБЛИЦА
// ==========================

function renderTable() {
  if (!tableBody) return;
  tableBody.innerHTML = "";

  filteredObjects.forEach((obj, index) => {
    const tr = document.createElement("tr");
    tr.dataset.index = String(index);

    const danger = (obj.danger || "").toUpperCase();
    const tags = Array.isArray(obj.tags) ? obj.tags : [];

    tr.innerHTML = `
      <td class="col-name">${escapeHtml(obj.name || "Без имени")}</td>
      <td class="col-kind">${escapeHtml(obj.kind || "—")}</td>
      <td class="col-type">${escapeHtml(obj.type || "—")}</td>
      <td class="col-danger">
        ${
          danger
            ? `<span class="danger-pill danger-${danger}">${danger}</span>`
            : ""
        }
      </td>
      <td class="col-tags">
        <div class="table-tags">
          ${
            tags
              .map(t => `<span class="table-tag-pill">${escapeHtml(t)}</span>`)
              .join("")
          }
        </div>
      </td>
    `;

    tr.addEventListener("click", () => {
      selectRow(index);
    });

    tableBody.appendChild(tr);
  });

  if (objectsCounter) {
    objectsCounter.textContent = `${filteredObjects.length} объектов`;
  }

  highlightSelectedRow();
}

function highlightSelectedRow() {
  if (!tableBody) return;
  const rows = tableBody.querySelectorAll("tr");
  rows.forEach(row => row.classList.remove("selected"));
  if (selectedIndex >= 0) {
    const row = tableBody.querySelector(`tr[data-index="${selectedIndex}"]`);
    if (row) row.classList.add("selected");
  }
}

// ==========================
//          СТАТИСТИКА
// ==========================

function updateStats() {
  if (!statsPanel) return;

  const total = allObjects.length;
  const bySection = {};
  const byDanger = {};

  allObjects.forEach(obj => {
    const sectionTitle = obj.__sectionTitle || obj.__section || "прочее";
    bySection[sectionTitle] = (bySection[sectionTitle] || 0) + 1;

    const danger = (obj.danger || "—").toUpperCase();
    byDanger[danger] = (byDanger[danger] || 0) + 1;
  });

  const rows = [];

  rows.push(
    `<div class="stats-item"><span>Всего объектов</span><span>${total}</span></div>`
  );

  rows.push(`<div class="stats-item"><span>По разделам</span><span></span></div>`);
  Object.entries(bySection).forEach(([title, count]) => {
    rows.push(
      `<div class="stats-item"><span>${escapeHtml(title)}</span><span>${count}</span></div>`
    );
  });

  rows.push(`<div class="stats-item"><span>По опасности</span><span></span></div>`);
  Object.entries(byDanger).forEach(([danger, count]) => {
    rows.push(
      `<div class="stats-item"><span>${escapeHtml(danger)}</span><span>${count}</span></div>`
    );
  });

  statsPanel.innerHTML = rows.join("");
}

// ==========================
//   ФИЛЬТР ПО ОПАСНОСТИ (select)
// ==========================
function rebuildDangerFilterOptions() {
  if (typeof dangerFilter === 'undefined' || !dangerFilter) return;

  const dangers = new Set();

  allObjects.forEach(obj => {
    if (obj.danger) {
      dangers.add(String(obj.danger).toUpperCase());
    }
  });

  dangerFilter.innerHTML = "";

  const optAll = document.createElement("option");
  optAll.value = "all";
  optAll.textContent = "Все уровни";
  dangerFilter.appendChild(optAll);

  Array.from(dangers).sort().forEach(level => {
    const opt = document.createElement("option");
    opt.value = level;
    opt.textContent = level;
    dangerFilter.appendChild(opt);
  });
}

// ==========================
//          РЕДАКТОР
// ==========================


// ==========================
//          РЕДАКТОР
// ==========================

function getCurrentObject() {
  if (selectedIndex < 0) return null;
  return filteredObjects[selectedIndex] || null;
}

function fillEditor(obj) {
  if (!editorForm) return;
  suppressEditorEvents = true;

  if (!obj) {
    if (editorTitle) {
      editorTitle.textContent = "Редактор";
    }
    fieldId.value = "";
    fieldName.value = "";
    fieldKind.value = "";
    fieldType.value = "";
    fieldDanger.value = "";
    fieldTags.value = "";
    fieldOrigin.value = "";
    fieldImage.value = "";
    fieldDescription.value = "";

    if (imagePreview) {
      imagePreview.innerHTML = `<span class="hint">Нет изображения.</span>`;
    }

    if (markdownPreview) {
      markdownPreview.innerHTML = renderMarkdown("");
    }

    editorOriginal = null;
    suppressEditorEvents = false;
    setStatusIdle();
    return;
  }

  if (editorTitle) {
    editorTitle.textContent = `Редактор: ${obj.name || "Без имени"}`;
  }

  fieldId.value = obj.id || "";
  fieldName.value = obj.name || "";
  fieldKind.value = obj.kind || "";
  fieldType.value = obj.type || "";
  fieldDanger.value = obj.danger || "";
  fieldTags.value = (Array.isArray(obj.tags) ? obj.tags.join(", ") : obj.tags || "");
  fieldOrigin.value = obj.origin || "";
  fieldImage.value = obj.image || "";
  fieldDescription.value = obj.description || "";

  if (imagePreview) {
    if (obj.image) {
      imagePreview.innerHTML = `<img src="${escapeHtml(obj.image)}" alt="preview" />`;
    } else {
      imagePreview.innerHTML = `<span class="hint">Нет изображения.</span>`;
    }
  }

  if (markdownPreview) {
    markdownPreview.innerHTML = renderMarkdown(obj.description || "");
  }

  editorOriginal = structuredClone(obj);
  suppressEditorEvents = false;
  setStatusIdle();
}


function updateObjectFromEditor(obj) {
  if (!obj) return;

  obj.name = fieldName.value.trim();
  obj.kind = fieldKind.value.trim();
  obj.type = fieldType.value.trim();
  obj.danger = fieldDanger.value.trim();
  obj.tags = normalizeTags(fieldTags.value);
  obj.origin = fieldOrigin.value.trim();
  obj.image = fieldImage.value.trim();
  obj.description = fieldDescription.value;
}

function handleEditorChange() {
  if (suppressEditorEvents) return;
  const obj = getCurrentObject();
  if (!obj) return;

  updateObjectFromEditor(obj);

  if (markdownPreview) {
    markdownPreview.innerHTML = renderMarkdown(obj.description || "");
  }

  setStatusDirty();
  renderTable();
}

// ==========================
//        ВЫБОР СТРОКИ
// ==========================

function selectRow(index) {
  selectedIndex = index;
  highlightSelectedRow();
  const obj = getCurrentObject();
  fillEditor(obj);
}

// ==========================
//        CRUD ОПЕРАЦИИ
// ==========================

function createNewObject() {
  // по умолчанию создаем в первом источнике, если он есть
  const baseSource = sources[0] || null;

  const base = {
    id: "",
    name: "Новое существо",
    kind: "",
    type: "",
    danger: "",
    tags: [],
    origin: "",
    image: "",
    description: "",
    __section: baseSource ? baseSource.sectionKey : "misc",
    __sectionTitle: baseSource ? baseSource.sectionTitle : "Разное",
    __subsection: baseSource ? baseSource.subKey : "general",
    __subsectionTitle: baseSource ? baseSource.subTitle : "Общее",
    __sourcePath: baseSource ? baseSource.path : ""
  };

  base.id = ensureId(base, allObjects.length);
  allObjects.push(base);
  applyFilters();

  const idx = filteredObjects.findIndex(o => o.id === base.id);
  if (idx >= 0) {
    selectRow(idx);
  }
  setStatusDirty();
}

function duplicateCurrent() {
  const obj = getCurrentObject();
  if (!obj) return;
  const clone = structuredClone(obj);
  clone.id = ensureId({ name: (obj.name || "") + " копия" }, allObjects.length);
  clone.name = (obj.name || "Без имени") + " (копия)";
  allObjects.push(clone);
  applyFilters();
  const idx = filteredObjects.findIndex(o => o.id === clone.id);
  if (idx >= 0) {
    selectRow(idx);
  }
  setStatusDirty();
}

function deleteCurrent() {
  const obj = getCurrentObject();
  if (!obj) return;
  if (!confirm(`Удалить объект "${obj.name || obj.id}"?`)) return;

  const globalIndex = allObjects.findIndex(o => o === obj);
  if (globalIndex >= 0) {
    allObjects.splice(globalIndex, 1);
  }

  selectedIndex = -1;
  applyFilters();
  fillEditor(null);
}

// ==========================
//        ИМПОРТ / ЭКСПОРТ
// ==========================

function exportJsonAll() {
  const cleaned = allObjects.map(obj => {
    const copy = { ...obj };
    Object.keys(copy).forEach(k => {
      if (k.startsWith("__")) delete copy[k];
    });
    return copy;
  });

  const blob = new Blob([JSON.stringify(cleaned, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "bestiary_export.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function handleImportFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const text = e.target.result;
      const json = JSON.parse(text);

      if (Array.isArray(json)) {
        const baseSource = sources[0] || null;
        json.forEach(obj => {
          const prepared = {
            ...obj,
            id: ensureId(obj, allObjects.length),
            kind: obj.kind || "",
            tags: normalizeTags(obj.tags),
            __section: baseSource ? baseSource.sectionKey : "misc",
            __sectionTitle: baseSource ? baseSource.sectionTitle : "Разное",
            __subsection: baseSource ? baseSource.subKey : "general",
            __subsectionTitle: baseSource ? baseSource.subTitle : "Общее",
            __sourcePath: baseSource ? baseSource.path : ""
          };
          allObjects.push(prepared);
        });
        applyFilters();
      } else {
        alert("Ожидался массив объектов в импортируемом JSON.");
      }
    } catch (err) {
      console.error("Ошибка импорта JSON:", err);
      alert("Не удалось импортировать JSON: " + err.message);
    }
  };
  reader.readAsText(file);
}

// ==========================
//      ПОДПИСКИ НА СОБЫТИЯ
// ==========================

function setupEventHandlers() {
  if (searchInput) {
    searchInput.addEventListener("input", () => applyFilters());
  }
  if (dangerFilter) {
    dangerFilter.addEventListener("change", () => applyFilters());
  }
  if (tagFilter) {
    tagFilter.addEventListener("input", () => applyFilters());
  }
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      if (dangerFilter) dangerFilter.value = "all";
      if (tagFilter) tagFilter.value = "";
      resetNavSelection();
      applyFilters();
    });
  }

  if (editorForm) {
    editorForm.addEventListener("input", handleEditorChange);
    editorForm.addEventListener("change", handleEditorChange);

    // "Сохранить изменения" (кнопка типа submit)
    editorForm.addEventListener("submit", e => {
      e.preventDefault();
      const obj = getCurrentObject();
      if (!obj) return;
      updateObjectFromEditor(obj);
      editorOriginal = structuredClone(obj);
      setStatusIdle();
      alert("Изменения сохранены в памяти. Не забудь экспортировать JSON.");
    });
  }

  if (fieldImageFile && imagePreview) {
    fieldImageFile.addEventListener("change", () => {
      const file = fieldImageFile.files?.[0];
      if (!file) {
        imagePreview.innerHTML = `<span class="hint">Картинка не выбрана.</span>`;
        return;
      }
      const url = URL.createObjectURL(file);
      imagePreview.innerHTML = `<img src="${url}" alt="preview" />`;
    });
  }

  if (btnNew) {
    btnNew.addEventListener("click", createNewObject);
  }
  if (btnDuplicate) {
    btnDuplicate.addEventListener("click", duplicateCurrent);
  }
  if (btnDelete) {
    btnDelete.addEventListener("click", deleteCurrent);
  }

  if (btnExport) {
    btnExport.addEventListener("click", exportJsonAll);
  }

  if (btnImport && importFileInput) {
    btnImport.addEventListener("click", () => {
      importFileInput.value = "";
      importFileInput.click();
    });
    importFileInput.addEventListener("change", () => {
      const file = importFileInput.files?.[0];
      if (file) handleImportFile(file);
    });
  }

  if (btnRevert) {
    btnRevert.addEventListener("click", () => {
      if (!editorOriginal) return;
      const obj = getCurrentObject();
      if (!obj) return;
      Object.assign(obj, structuredClone(editorOriginal));
      fillEditor(obj);
      renderTable();
      setStatusIdle();
    });
  }
}

// ==========================
//          ИНИЦИАЛИЗАЦИЯ
// ==========================

async function initAdmin() {
  try {
    await loadManifest();
    await loadAllData();
    buildNavTree();
    setupEventHandlers();
    rebuildDangerFilterOptions();
    applyFilters();
    setStatusIdle();
  } catch (err) {
    console.error(err);
    setStatusError("Не удалось загрузить данные");
    if (statsPanel) {
      statsPanel.innerHTML = `<div class="stats-item"><span>Ошибка</span><span>${escapeHtml(
        err.message
      )}</span></div>`;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initAdmin();
});
