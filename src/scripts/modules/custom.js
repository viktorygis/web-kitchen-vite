//src/js/modules/custom.js

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

export function initBackToTop() {
    const backToTopBtn = document.querySelector(".back-to-top");
    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
}

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
}
