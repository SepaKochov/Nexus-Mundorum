// Общие утилиты для Bestiary CMS
// Этот файл подключается до main.js и admin.js

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function shorten(text, max = 180) {
  if (!text) return "";
  const clean = String(text).replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max).trim() + "…";
}

function getOriginText(origin) {
  if (!origin) return "";
  if (typeof origin === "string") return origin;

  if (Array.isArray(origin)) {
    return origin
      .map(v => String(v).trim())
      .filter(Boolean)
      .join(", ");
  }

  if (typeof origin === "object") {
    return Object.keys(origin)
      .filter(key => Object.prototype.hasOwnProperty.call(origin, key) && origin[key])
      .map(key => String(origin[key]).trim())
      .filter(Boolean)
      .join(", ");
  }

  return String(origin);
}

function tagColorFromText(text) {
  const value = String(text || "");
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 68%, 58%)`;
}

function normalizeTags(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw
      .map(t => String(t).trim())
      .filter(Boolean);
  }
  return String(raw)
    .split(",")
    .map(t => t.trim())
    .filter(Boolean);
}

function ensureId(baseObj, index) {
  const obj = baseObj || {};
  if (obj.id && String(obj.id).trim() !== "") {
    return String(obj.id).trim();
  }
  const baseName = (obj.name || obj.title || "object").toString();
  const namePart = baseName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-а-яё]/gi, "");
  const safeName = namePart || "item";
  return `obj_${safeName}_${index}`;
}

function normalizeStringOrArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map(v => String(v).trim())
      .filter(Boolean);
  }
  return String(value)
    .split(/[,;]\s*|\n+/)
    .map(v => v.trim())
    .filter(Boolean);
}
