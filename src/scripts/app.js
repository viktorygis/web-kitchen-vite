//src/js/app.js

console.log("app.js loaded");

// Кастомная функция из папки с модулями
import * as flsFunctions from "./modules/functions.js";
flsFunctions.isWebp();

// Готовая функция, которую установили в папку node_modules/
/* import Swiper, { Navigation, Pagination } from 'swiper'; */

import { initMobileMenu, initSubmenu, initTabsScrollSpy, initBackToTop, CopyCode } from "./modules/custom.js"; // Правильный путь
// Инициализация только после загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
  // Ваш Swiper
  /*  const swiper = new Swiper();
  swiper.prop = 123; */

  // Инициализация кастомных модулей
  const submenu = initSubmenu();
  const mobileMenu = initMobileMenu();
  mobileMenu.setCloseAllSubmenus(() => submenu.closeAllSubmenus());

  initTabsScrollSpy();
  initBackToTop();
  new CopyCode();
});
