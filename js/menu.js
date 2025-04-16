function addActiveClass(buttonsClass, activeClass, bodyLockStatus = false) {
    const buttons = document.querySelectorAll(buttonsClass);
    document.addEventListener("click", function (e) {
        const isClickInsideButtons = Array.from(buttons).some((button) =>
            button.contains(e.target)
        );
        if (!isClickInsideButtons) {
            buttons.forEach((item) => {
                const parent = item.closest(buttonsClass).parentElement;
                if (parent.classList.contains(activeClass) && bodyLockStatus) {
                    bodyLockToggle();
                }
                parent.classList.remove(activeClass);
            });
        }
    });

    buttons.forEach((item) => {
        item.addEventListener("click", function (e) {
            e.preventDefault();
            const parent = this.closest(buttonsClass).parentElement;
            const isActive = parent.classList.contains(activeClass);

            parent.classList.toggle(activeClass);

            if (bodyLockStatus) {
                if (!isActive) {
                    bodyLockToggle();
                } else {
                    bodyLockToggle();
                }
            }

            buttons.forEach((otherItem) => {
                if (otherItem !== this) {
                    const otherParent = otherItem.closest(buttonsClass).parentElement;
                    if (otherParent.classList.contains(activeClass) && bodyLockStatus) {
                        bodyLockToggle();
                    }
                    otherParent.classList.remove(activeClass);
                }
            });
        });
    });
}

addActiveClass(".games-menu__current", "open-game-menu", true);
addActiveClass(".services-links__current", "open-services-links", true);
addActiveClass(".language-select__current", "language-select__list--active");
addActiveClass(".top-language__current", "top-language__active");

addActiveClass("#user-menu", "open-user-menu");

function eventsHoverTabs(tabsContainer, tabsTitle, tabsBody) {
    const tabContainer = document.querySelectorAll(tabsContainer);
    if (tabContainer.length)
        tabContainer.forEach((container) => {
            const tabTitles = container.querySelectorAll(tabsTitle);
            const tabContents = container.querySelectorAll(tabsBody);
            if (tabTitles.length > 0 && tabContents.length > 0)
                tabTitles.forEach((title, index) => {
                    title.addEventListener("mouseenter", () => {
                        tabTitles.forEach((t) =>
                            t.classList.remove("active-tab")
                        );
                        tabContents.forEach((content) =>
                            content.classList.remove("active-tab")
                        );
                        title.classList.add("active-tab");
                        tabContents[index].classList.add("active-tab");
                    });
                });
        });
}
eventsHoverTabs("[data-tabs]", "[data-tabs-title]", "[data-tabs-body]");

if (document.querySelector(".icon-menu"))
    document.addEventListener("click", function (e) {
        if (bodyLockStatus && e.target.closest(".icon-menu")) {
            bodyLockToggle();
            document.documentElement.classList.toggle("menu-open");
        } if (window.innerWidth <= 767.98 && bodyLockStatus && e.target.closest(".top-nav__user")) {
            bodyLockToggle();
            document.documentElement.classList.toggle("menu-open");
        }
    });

let bodyLockStatus = true;
let bodyLockToggle = (delay = 150) => {
    if (document.documentElement.classList.contains("lock")) bodyUnlock(delay);
    else bodyLock(delay);
};

let bodyUnlock = (delay = 150) => {
    if (bodyLockStatus) {
        const lockPaddingElements = document.querySelectorAll("[data-lp]");
        setTimeout(() => {
            lockPaddingElements.forEach((lockPaddingElement) => {
                lockPaddingElement.style.paddingRight = "";
            });
            document.body.style.paddingRight = "";
            document.documentElement.classList.remove("lock");
        }, delay);
        bodyLockStatus = false;
        setTimeout(function () {
            bodyLockStatus = true;
        }, delay);
    }
};

let bodyLock = (delay = 150) => {
    if (bodyLockStatus) {
        const lockPaddingElements = document.querySelectorAll("[data-lp]");
        const lockPaddingValue =
            window.innerWidth - document.body.offsetWidth + "px";
        lockPaddingElements.forEach((lockPaddingElement) => {
            lockPaddingElement.style.paddingRight = lockPaddingValue;
        });
        document.body.style.paddingRight = lockPaddingValue;
        document.documentElement.classList.add("lock");
        bodyLockStatus = false;
        setTimeout(function () {
            bodyLockStatus = true;
        }, delay);
    }
};

// window.addEventListener("scroll", () => {
//     const topNav = document.querySelector(".top-nav");
//     if (topNav) {
//         if (window.scrollY > 0) {
//             topNav.classList.add("top-nav--scroll");
//         } else {
//             topNav.classList.remove("top-nav--scroll");
//         }
//     }
// });

document.addEventListener("click", (e) => {
    const targetElement = e.target;
    if (targetElement.closest(".header__support-btn")) {
        bodyUnlock();
        document.documentElement.classList.remove("menu-open");
        document.documentElement.classList.toggle("open-support");
    }
    if (!targetElement.closest(".header__support-btn")) {
        document.documentElement.classList.remove("open-support");
    }
});

document.querySelector('#user-menu')
