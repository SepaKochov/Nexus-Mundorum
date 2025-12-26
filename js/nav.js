document.addEventListener("DOMContentLoaded", () => {
  const groups = Array.from(document.querySelectorAll(".side-nav__group"));
  const groupToggles = Array.from(document.querySelectorAll(".side-nav__group-toggle"));
  const links = Array.from(document.querySelectorAll(".side-nav__link"));

  // Открываем по умолчанию "Существа"
  const defaultGroup = groups.find(g => g.dataset.section === "creatures");
  if (defaultGroup) {
    defaultGroup.classList.add("side-nav__group--open", "side-nav__group--active");
  }

  function setActiveLink(link) {
    links.forEach(l => l.classList.remove("side-nav__link--active"));
    if (link) link.classList.add("side-nav__link--active");

    // Подсвечиваем группу
    const group = link ? link.closest(".side-nav__group") : null;
    groups.forEach(g => g.classList.remove("side-nav__group--active"));
    if (group) group.classList.add("side-nav__group--active");
  }

  // Сворачивание/разворачивание групп
  groupToggles.forEach(btn => {
    btn.addEventListener("click", () => {
      const group = btn.closest(".side-nav__group");
      const isOpen = group.classList.contains("side-nav__group--open");
      if (isOpen) {
        group.classList.remove("side-nav__group--open");
      } else {
        group.classList.add("side-nav__group--open");
      }
    });
  });

  // Поведение при клике по подкатегории
  links.forEach(link => {
    link.addEventListener("click", () => {
      setActiveLink(link);

      const section = link.dataset.section;
      const subsection = link.dataset.subsection;

      // Пока только лог: сюда позже подвяжем загрузку JSON
      console.log("Навигация:", { section, subsection });

      // Для интеграции с бестиарием: кидаем кастомное событие
      window.dispatchEvent(new CustomEvent("bestiary:navigate", {
        detail: { section, subsection }
      }));
    });
  });
});
