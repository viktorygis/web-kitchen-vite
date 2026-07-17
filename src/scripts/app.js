// src/js/app.js

console.log("app.js loaded");

// Кастомная функция из папки с модулями
import * as flsFunctions from "./modules/functions.js";
flsFunctions.isWebp();

import { initMobileMenu, initSubmenu, initTabsScrollSpy, initBackToTop, CopyCode, initFaqAccordion } from "./modules/custom.js";

document.addEventListener("DOMContentLoaded", () => {
  // Инициализация кастомных модулей
  const submenu = initSubmenu();
  const mobileMenu = initMobileMenu();
  if (mobileMenu && submenu && typeof mobileMenu.setCloseAllSubmenus === "function") {
    mobileMenu.setCloseAllSubmenus(() => submenu.closeAllSubmenus());
  }

  initTabsScrollSpy();
  initBackToTop();
  new CopyCode();

  // Инициализация FAQ аккордеона
  // closeOthers: true — только один пункт открыт одновременно. Поставьте false если допустимо несколько открытых.
  const faqModule = initFaqAccordion({ faqSelector: ".faq", closeOthers: true });

  // при желании можно управлять аккордеоном из кода:
  // faqModule.openById('faq-2-panel');
  // faqModule.closeAll();
});