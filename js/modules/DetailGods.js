// js/modules/DetailGods.js

import { getLongDescriptionForDetails } from "./TagSystem.js";

function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(/\r?\n/)
      .map(s => s.trim())
      .filter(Boolean);
  }
  return [];
}

function createSection(titleText) {
  const section = document.createElement("section");
  section.className = "detail-section detail-section--god";

  const title = document.createElement("h3");
  title.className = "detail-section__title";
  title.textContent = titleText;

  section.appendChild(title);
  return section;
}

function appendParagraph(section, text) {
  if (!text) return;
  const value = String(text).trim();
  if (!value) return;
  const p = document.createElement("p");
  p.className = "detail-text";
  p.textContent = value;
  section.appendChild(p);
}

function appendKeyValue(listEl, label, value) {
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

function appendDomainList(section, domainObj) {
  if (!domainObj || typeof domainObj !== "object") return;

  const entries = Object.entries(domainObj).filter(([, v]) => !!v);
  if (!entries.length) return;

  const ul = document.createElement("ul");
  ul.className = "detail-list detail-list--domain";

  entries.forEach(([key, value]) => {
    const li = document.createElement("li");
    const strong = document.createElement("strong");
    strong.textContent = key + ": ";
    const span = document.createElement("span");
    span.textContent = String(value);
    li.appendChild(strong);
    li.appendChild(span);
    ul.appendChild(li);
  });

  section.appendChild(ul);
}

export function renderGodDetail(god, container, chapterKey) {
  if (!god || !container) return;

  container.innerHTML = "";

  const card = document.createElement("article");
  card.className = "detail-card detail-card--god";

  // ================= HEADER =================

  const header = document.createElement("header");
  header.className = "detail-card__header";

  const headerMain = document.createElement("div");
  headerMain.className = "detail-card__header-main";

  const nameEl = document.createElement("h2");
  nameEl.className = "detail-card__name";
  nameEl.textContent = god.name || "Без имени";

  const subtitleEl = document.createElement("p");
  subtitleEl.className = "detail-card__subtitle";

  const subtitleParts = [];
  if (god.title) subtitleParts.push(god.title);
  if (god.deity_level || god.deityLevel) {
    subtitleParts.push(`уровень: ${god.deityLevel || god.deity_level}`);
  }
  if (god.aspect) subtitleParts.push(god.aspect);

  subtitleEl.textContent = subtitleParts.join(" • ");

  headerMain.appendChild(nameEl);
  if (subtitleEl.textContent) headerMain.appendChild(subtitleEl);

  const badges = document.createElement("div");
  badges.className = "detail-card__badges";

  if (god.pantheon) {
    const pan = document.createElement("span");
    pan.className = "pill pill--pantheon";
    pan.textContent = god.pantheon;
    badges.appendChild(pan);
  }

  if (god.alignment || god.allegiance) {
    const align = document.createElement("span");
    align.className = "pill pill--alignment";
    align.textContent = god.alignment || god.allegiance;
    badges.appendChild(align);
  }

  if (god.domain_type) {
    const dom = document.createElement("span");
    dom.className = "pill pill--domain";
    dom.textContent = god.domain_type;
    badges.appendChild(dom);
  }

  if (god.dangerClass) {
    const danger = document.createElement("span");
    danger.className = "pill pill--danger";
    danger.textContent = `Опасность ${god.dangerClass}`;
    badges.appendChild(danger);
  }

  header.appendChild(headerMain);
  if (badges.children.length) header.appendChild(badges);

  card.appendChild(header);

  // ================= BODY =================

  const body = document.createElement("div");
  body.className = "detail-card__body";

  // 1) Сущность (краткий, но емкий блок)
  const essenceSection = createSection("Сущность божества");

  let longDesc = "";
  if (typeof getLongDescriptionForDetails === "function") {
    try {
      longDesc =
        getLongDescriptionForDetails(god, chapterKey || "gods") || "";
    } catch (e) {
      longDesc = "";
    }
  }
  if (!longDesc) {
    longDesc = god.description || god.nature || "";
  }

  appendParagraph(essenceSection, longDesc || "Описание божества пока не заполнено.");

  const essenceList = document.createElement("ul");
  essenceList.className = "detail-info";

  appendKeyValue(essenceList, "Пантеон", god.pantheon);
  appendKeyValue(essenceList, "Уровень божества", god.deityLevel || god.deity_level);
  appendKeyValue(essenceList, "Аспект", god.aspect);
  appendKeyValue(essenceList, "Выравнивание", god.alignment || god.allegiance);
  appendKeyValue(essenceList, "Происхождение", god.origin);

  if (essenceList.children.length) {
    essenceSection.appendChild(essenceList);
  }
  body.appendChild(essenceSection);

  // 2) Облик и символика
  const appearanceSection = createSection("Облик и символика");

  if (god.appearance_small) {
    appendParagraph(appearanceSection, god.appearance_small);
  }

  const appearanceDetails = [];
  if (god.appearance_full && typeof god.appearance_full === "object") {
    const af = god.appearance_full;
    if (af.form) appearanceDetails.push({ label: "Форма", value: af.form });
    if (af.head) appearanceDetails.push({ label: "Голова и лицо", value: af.head });
    if (af.movement) appearanceDetails.push({ label: "Движение", value: af.movement });
    if (af.aura) appearanceDetails.push({ label: "Аура", value: af.aura });
    if (af.details) appearanceDetails.push({ label: "Детали", value: af.details });
  }
  if (god.visual && typeof god.visual === "object") {
    const v = god.visual;
    if (v.color) appearanceDetails.push({ label: "Цветовая гамма", value: v.color });
    if (v.symbolic_shape) {
      appearanceDetails.push({ label: "Символические формы", value: v.symbolic_shape });
    }
  }
  if (god.symbol) {
    appearanceDetails.push({ label: "Символ", value: god.symbol });
  }

  if (appearanceDetails.length) {
    const ul = document.createElement("ul");
    ul.className = "detail-info";
    appearanceDetails.forEach(item => {
      appendKeyValue(ul, item.label, item.value);
    });
    appearanceSection.appendChild(ul);
  }

  body.appendChild(appearanceSection);

  // 3) Сфера влияния
  const domainSection = createSection("Сфера влияния");

  if (god.aspect) {
    appendParagraph(domainSection, `Аспект: ${god.aspect}`);
  }
  if (god.domain_type) {
    appendParagraph(domainSection, `Тип домена: ${god.domain_type}`);
  }
  if (god.influence && god.influence.world_role) {
    appendParagraph(domainSection, `Роль в мироздании: ${god.influence.world_role}`);
  }
  if (god.influence && god.influence.signs) {
    appendParagraph(domainSection, `Знаки присутствия: ${god.influence.signs}`);
  }

  appendDomainList(domainSection, god.domain);

  body.appendChild(domainSection);

  // 4) Поклонение и культ
  if (god.worship) {
    const worshipSection = createSection("Поклонение и культ");
    const w = god.worship;

    const worshipList = document.createElement("ul");
    worshipList.className = "detail-info";

    appendKeyValue(worshipList, "Тип культа", w.cult_type);
    appendKeyValue(worshipList, "Жрецы и служители", w.priests);
    appendKeyValue(worshipList, "Места поклонения", w.places);

    if (w.rituals) {
      appendParagraph(worshipSection, `Обряды и практики: ${w.rituals}`);
    }
    if (w.contact) {
      appendParagraph(worshipSection, `Контакт с божеством: ${w.contact}`);
    }

    if (worshipList.children.length) {
      worshipSection.appendChild(worshipList);
    }

    body.appendChild(worshipSection);
  }

  // 5) Поведение и вмешательство
  if (god.behavior || god.shadow || god.current_status) {
    const behaviorSection = createSection("Поведение и вмешательство");

    if (god.behavior) {
      const b = god.behavior;
      if (b.mode) {
        appendParagraph(behaviorSection, `Основной стиль: ${b.mode}`);
      }
      if (b.intervention) {
        appendParagraph(behaviorSection, `Когда вмешивается: ${b.intervention}`);
      }
      if (b.restrictions) {
        appendParagraph(behaviorSection, `Ограничения вмешательства: ${b.restrictions}`);
      }
    }

    if (god.current_status) {
      appendParagraph(behaviorSection, `Текущее влияние: ${god.current_status}`);
    }

    if (god.shadow) {
      const sh = god.shadow;
      if (sh.corruption) {
        appendParagraph(behaviorSection, `Искаженный культ: ${sh.corruption}`);
      }
      if (sh.cult_risks) {
        appendParagraph(behaviorSection, `Риски культа: ${sh.cult_risks}`);
      }
    }

    body.appendChild(behaviorSection);
  }

  // 6) Способности и дары
  const abilities = toArray(god.abilities);
  const hasGifts = god.gifts && (god.gifts.boons || god.gifts.limits);

  if (abilities.length || hasGifts) {
    const abilitiesSection = createSection("Божественные способности и дары");

    if (abilities.length) {
      const ul = document.createElement("ul");
      ul.className = "detail-list detail-list--abilities";

      abilities.forEach(ability => {
        if (!ability) return;
        const li = document.createElement("li");

        if (typeof ability === "string") {
          li.textContent = ability;
        } else {
          const name = ability.name || "";
          const effect = ability.effect || ability.desc || "";
          if (name) {
            const strong = document.createElement("strong");
            strong.textContent = name + (effect ? ": " : "");
            li.appendChild(strong);
          }
          if (effect) {
            const span = document.createElement("span");
            span.textContent = effect;
            li.appendChild(span);
          }
        }

        ul.appendChild(li);
      });

      abilitiesSection.appendChild(ul);
    }

    if (hasGifts) {
      const g = god.gifts;

      if (g.boons) {
        const boonsTitle = document.createElement("h4");
        boonsTitle.className = "detail-subtitle";
        boonsTitle.textContent = "Благословения";
        abilitiesSection.appendChild(boonsTitle);

        const ulBoons = document.createElement("ul");
        ulBoons.className = "detail-list detail-list--boons";
        toArray(g.boons).forEach(text => {
          const li = document.createElement("li");
          li.textContent = text;
          ulBoons.appendChild(li);
        });
        abilitiesSection.appendChild(ulBoons);
      }

      if (g.limits) {
        const limitsTitle = document.createElement("h4");
        limitsTitle.className = "detail-subtitle";
        limitsTitle.textContent = "Ограничения и цена";
        abilitiesSection.appendChild(limitsTitle);

        const ulLimits = document.createElement("ul");
        ulLimits.className = "detail-list detail-list--limits";
        toArray(g.limits).forEach(text => {
          const li = document.createElement("li");
          li.textContent = text;
          ulLimits.appendChild(li);
        });
        abilitiesSection.appendChild(ulLimits);
      }
    }

    body.appendChild(abilitiesSection);
  }

  // 7) Мифы и легенды
  const myths = toArray(god.myths);
  if (myths.length) {
    const mythSection = createSection("Мифы и легенды");

    myths.forEach(mythText => {
      if (!mythText) return;
      const p = document.createElement("p");
      p.className = "detail-text";
      p.textContent = String(mythText);
      mythSection.appendChild(p);
    });

    body.appendChild(mythSection);
  }

  // 8) Отношения
  if (god.relations) {
    const relationsSection = createSection("Связи и отношения");
    const relList = document.createElement("ul");
    relList.className = "detail-info";

    const rel = god.relations;
    appendKeyValue(relList, "Союзники", rel.allies);
    appendKeyValue(relList, "Соперники", rel.rivals);
    appendKeyValue(relList, "Происхождение от", rel.descended_from);
    appendKeyValue(relList, "Противостоит", rel.opposed_by);

    if (relList.children.length) {
      relationsSection.appendChild(relList);
      body.appendChild(relationsSection);
    }
  }

  card.appendChild(body);
  container.appendChild(card);
}

export default renderGodDetail;
