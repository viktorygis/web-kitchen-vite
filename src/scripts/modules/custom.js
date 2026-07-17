//src/js/modules/custom.js

//initMobileMenu - отвечает за открытие/закрытие мобильного меню и закрытие всех подменю при закрытии основного меню.
export function initMobileMenu() {
  class MobileMenu {
    constructor({ menuSelector = "#mobile-menu", navSelector = ".nav" } = {}) {
      this.menuButton = document.querySelector(menuSelector);
      this.nav = document.querySelector(navSelector);
      if (this.menuButton && this.nav) {
        this.menuButton.addEventListener("click", () => this.toggleNav());
      }
    }

    toggleNav() {
      this.nav.classList.toggle("active");
      if (!this.nav.classList.contains("active") && this.closeAllSubmenus) {
        this.closeAllSubmenus();
      }
    }

    setCloseAllSubmenus(fn) {
      this.closeAllSubmenus = fn;
    }
  }
  return new MobileMenu();
}

//initSubmenu - отвечает за открытие/закрытие подменю в мобильной навигации и закрытие всех подменю при клике вне их.
export function initSubmenu() {
  class Submenu {
    constructor({ submenuToggleSelector = ".submenu-toggle", submenuListSelector = ".subnav-list", navItemSelector = ".nav-item" } = {}) {
      this.submenuToggles = document.querySelectorAll(submenuToggleSelector);
      this.submenuListSelector = submenuListSelector;
      this.navItemSelector = navItemSelector;

      this.submenuToggles.forEach((toggle) => {
        toggle.addEventListener("click", (event) => this.toggleSubmenu(event, toggle));
      });

      document.addEventListener("click", (event) => {
        if (!event.target.closest(submenuToggleSelector) && !event.target.closest(submenuListSelector)) {
          this.closeAllSubmenus();
        }
      });
    }

    closeAllSubmenus() {
      document.querySelectorAll(`${this.submenuListSelector}.active`).forEach((submenu) => {
        submenu.classList.remove("active");
      });
    }

    toggleSubmenu(event, toggle) {
      if (window.innerWidth > 768) return;
      event.preventDefault();

      const parentItem = toggle.closest(this.navItemSelector);
      const submenu = parentItem.querySelector(this.submenuListSelector) || toggle.nextElementSibling;

      if (!submenu) return;
      this.closeAllSubmenus();
      submenu.classList.add("active");
      event.stopPropagation();
    }
  }
  return new Submenu();
}

//initTabsScrollSpy - отвечает за плавную прокрутку к разделам при клике на вкладки и подсветку активной вкладки при прокрутке страницы.
export function initTabsScrollSpy() {
  class TabsScrollSpy {
    constructor({ sectionSelector = "section[id]", navTabSelector = ".nav-tabs a", offset = 100 } = {}) {
      this.sections = document.querySelectorAll(sectionSelector);
      this.navLinks = document.querySelectorAll(navTabSelector);
      this.offset = offset;

      this.setupSmoothScrolling();
      window.addEventListener("scroll", () => this.onScroll());
    }

    setupSmoothScrolling() {
      this.navLinks.forEach((link) => {
        link.addEventListener("click", (e) => this.scrollToSection(e, link));
      });
    }

    scrollToSection(e, link) {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - this.offset,
          behavior: "smooth",
        });

        this.updateActiveTab(link);
      }
    }

    updateActiveTab(activeLink) {
      this.navLinks.forEach((link) => link.classList.remove("active"));
      if (activeLink) activeLink.classList.add("active");
    }

    onScroll() {
      let scrollPos = window.scrollY + this.offset;
      let currentId = "";

      this.sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          currentId = section.id;
        }
      });

      this.navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${currentId}`) {
          link.classList.add("active");
        }
      });
    }
  }
  return new TabsScrollSpy();
}

//initBackToTop - отвечает за плавную прокрутку страницы к началу при клике на кнопку "Назад к началу".
export function initBackToTop() {
  const backToTopBtn = document.querySelector(".back-to-top");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

//CopyCode - отвечает за добавление кнопки "Скопировать" к каждому блоку кода и реализацию функции копирования в буфер обмена при клике на эту кнопку.
export class CopyCode {
  constructor({ buttonSelector = ".copy-btn" } = {}) {
    this.buttonSelector = buttonSelector;
    this.addButtonsToAllPreCode();
    this.buttons = document.querySelectorAll(this.buttonSelector);
    this.init();
  }

  // Добавляет кнопку ко всем <pre><code> без кнопки
  addButtonsToAllPreCode() {
    document.querySelectorAll("pre code").forEach((codeBlock) => {
      const parent = codeBlock.parentElement;
      // Не добавлять, если кнопка уже есть
      if (!parent.querySelector(".copy-btn")) {
        const btn = document.createElement("button");
        btn.className = "copy-btn";
        btn.type = "button";
        btn.textContent = "Скопировать";
        parent.appendChild(btn);
      }
    });
  }

  init() {
    this.buttons.forEach((button) => {
      button.addEventListener("click", () => this.copyHandler(button));
    });
  }

  copyHandler(button) {
    // Находим <code> в предыдущем соседнем элементе или внутри
    let codeBlock = button.previousElementSibling;
    if (!codeBlock || codeBlock.tagName.toLowerCase() !== "pre") {
      // Может быть просто <code> перед кнопкой
      if (codeBlock && codeBlock.tagName.toLowerCase() === "code") {
        // ok
      } else {
        // Попробуем найти <code> внутри <pre>
        codeBlock = button.parentElement.querySelector("code");
      }
    }
    const code = codeBlock && codeBlock.tagName.toLowerCase() === "code" ? codeBlock.innerText : codeBlock && codeBlock.querySelector ? codeBlock.querySelector("code")?.innerText || "" : "";

    navigator.clipboard.writeText(code).then(() => {
      const originalText = button.textContent;
      button.textContent = "Скопировано!";
      setTimeout(() => {
        button.textContent = originalText;
      }, 2000);
    });
  }
}// src/js/modules/custom.js



/**
 * initFaqAccordion - инициализирует доступный accordion для FAQ
 * @param {Object} options
 * @param {string} options.faqSelector - селектор контейнера FAQ (по умолчанию '.faq')
 * @param {boolean} options.closeOthers - закрывать ли остальные пункты при открытии одного
 * @returns {Object|null} API { closeAll, openById, destroy } или null если элемент не найден
 */
export function initFaqAccordion({ faqSelector = ".faq", closeOthers = false } = {}) {
  const faq = document.querySelector(faqSelector);
  if (!faq) return null;

  // храним обработчики чтобы можно было удалить их при destroy
  const handlers = {
    click: null,
    keydown: null,
  };

  // Инициализация: убедиться что панели скрыты и aria выставлены корректно
  function initPanels() {
    faq.querySelectorAll(".faq__item").forEach((item, index) => {
      const btn = item.querySelector(".faq__question");
      const panel = item.querySelector(".faq__answer");
      if (!btn || !panel) return;

      // присвоим id если нет
      if (!btn.id) btn.id = `${faqSelector.replace(/[^a-z0-9_-]/gi, "")}-q-${index + 1}`;
      if (!panel.id) panel.id = `${btn.id}-panel`;

      btn.setAttribute("aria-controls", panel.id);

      // если aria-expanded не выставлен — по умолчанию закрываем
      if (!btn.hasAttribute("aria-expanded")) btn.setAttribute("aria-expanded", "false");
      // скроем панель если aria-expanded=false
      const expanded = btn.getAttribute("aria-expanded") === "true";
      panel.hidden = !expanded;
      // сбросим maxHeight — будет выставляться при открытии
      panel.style.maxHeight = expanded ? `${panel.scrollHeight}px` : "0px";
    });
  }

  function closeAll() {
    faq.querySelectorAll(".faq__question[aria-expanded='true']").forEach((btn) => {
      const panel = document.getElementById(btn.getAttribute("aria-controls"));
      btn.setAttribute("aria-expanded", "false");
      if (panel) {
        panel.style.maxHeight = "0px";
        panel.hidden = true;
      }
      btn.closest(".faq__item")?.classList.remove("open");
    });
  }

  function openById(panelId) {
    const panel = document.getElementById(panelId);
    if (!panel) return;
    const btnId = panel.getAttribute("aria-labelledby");
    const btn = btnId ? document.getElementById(btnId) : faq.querySelector(`.faq-question[aria-controls="${panelId}"]`);
    if (!btn) return;

    if (closeOthers) closeAll();

    btn.setAttribute("aria-expanded", "true");
    panel.hidden = false;
    // выставляем точную высоту для плавного открытия
    requestAnimationFrame(() => {
      panel.style.maxHeight = panel.scrollHeight + "px";
    });
    btn.closest(".faq__item")?.classList.add("open");
  }

  function toggleItem(button) {
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    const panelId = button.getAttribute("aria-controls");
    const panel = document.getElementById(panelId);
    const item = button.closest(".faq__item");

    if (isExpanded) {
      button.setAttribute("aria-expanded", "false");
      if (panel) {
        // анимированное сворачивание
        panel.style.maxHeight = panel.scrollHeight + "px"; // текущая высота
        requestAnimationFrame(() => {
          panel.style.maxHeight = "0px";
        });
        // скрываем после анимации — но простая реализация: установить hidden сразу
        panel.hidden = true;
      }
      item?.classList.remove("open");
    } else {
      if (closeOthers) closeAll();
      button.setAttribute("aria-expanded", "true");
      if (panel) {
        panel.hidden = false;
        // выставляем высоту для анимации
        requestAnimationFrame(() => {
          panel.style.maxHeight = panel.scrollHeight + "px";
        });
      }
      item?.classList.add("open");
    }
  }

  // делаем делегирование кликов по контейнеру faq
  handlers.click = (e) => {
    const btn = e.target.closest(".faq__question");
    if (!btn || !faq.contains(btn)) return;
    e.preventDefault();
    toggleItem(btn);
  };

  // поддержка клавиатуры: Enter / Space активируют кнопку
  handlers.keydown = (e) => {
    const btn = e.target.closest(".faq__question");
    if (!btn || !faq.contains(btn)) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleItem(btn);
    }
    // навигация стрелками (опционально) можно добавить при необходимости
  };

  faq.addEventListener("click", handlers.click);
  faq.addEventListener("keydown", handlers.keydown);

  // Инициализация панелей
  initPanels();

  // API для внешнего использования
  return {
    closeAll,
    openById,
    destroy() {
      faq.removeEventListener("click", handlers.click);
      faq.removeEventListener("keydown", handlers.keydown);
      // убрать inline maxHeight/hidden, восстановить состояние (опционально)
      faq.querySelectorAll(".faq__answer").forEach((panel) => {
        panel.style.maxHeight = "";
        panel.hidden = panel.getAttribute("data-initially-open") !== "true" && panel.hidden;
      });
    },
  };
}
