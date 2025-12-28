// js/chapters/creatures/beasts/BeastsRenderer.js
// Специализированный рендерер для подкатегории "Звери".
// Здесь будем развивать отдельную логику, не влияя на остальные подкатегории существ.

import { renderCards as renderCardsModule } from "../../../modules/CardRenderer.js";

export function renderBeasts(list, ctx) {
  // На этом шаге просто проксируем в общий рендерер,
  // но точка расширения уже выделена.
  renderCardsModule(list, {
    ...ctx,
    section: "creatures"
  });
}
