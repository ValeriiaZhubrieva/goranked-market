(() => {
    "use strict";
    const flsModules = {};
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                lockPaddingElements.forEach((lockPaddingElement => {
                    lockPaddingElement.style.paddingRight = "";
                }));
                document.body.style.paddingRight = "";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
            lockPaddingElements.forEach((lockPaddingElement => {
                lockPaddingElement.style.paddingRight = lockPaddingValue;
            }));
            document.body.style.paddingRight = lockPaddingValue;
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }

    !function(e) {
        "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? module.exports = e() : window.wNumb = e();
    }((function() {
        "use strict";
        var o = [ "decimals", "thousand", "mark", "prefix", "suffix", "encoder", "decoder", "negativeBefore", "negative", "edit", "undo" ];
        function w(e) {
            return e.split("").reverse().join("");
        }
        function h(e, t) {
            return e.substring(0, t.length) === t;
        }
        function f(e, t, n) {
            if ((e[t] || e[n]) && e[t] === e[n]) throw new Error(t);
        }
        function x(e) {
            return "number" == typeof e && isFinite(e);
        }
        function n(e, t, n, r, i, o, f, u, s, c, a, p) {
            var d, l, h, g = p, v = "", m = "";
            return o && (p = o(p)), !!x(p) && (!1 !== e && 0 === parseFloat(p.toFixed(e)) && (p = 0), 
            p < 0 && (d = !0, p = Math.abs(p)), !1 !== e && (p = function(e, t) {
                return e = e.toString().split("e"), (+((e = (e = Math.round(+(e[0] + "e" + (e[1] ? +e[1] + t : t)))).toString().split("e"))[0] + "e" + (e[1] ? e[1] - t : -t))).toFixed(t);
            }(p, e)), -1 !== (p = p.toString()).indexOf(".") ? (h = (l = p.split("."))[0], n && (v = n + l[1])) : h = p, 
            t && (h = w((h = w(h).match(/.{1,3}/g)).join(w(t)))), d && u && (m += u), r && (m += r), 
            d && s && (m += s), m += h, m += v, i && (m += i), c && (m = c(m, g)), m);
        }
        function r(e, t, n, r, i, o, f, u, s, c, a, p) {
            var d, l = "";
            return a && (p = a(p)), !(!p || "string" != typeof p) && (u && h(p, u) && (p = p.replace(u, ""), 
            d = !0), r && h(p, r) && (p = p.replace(r, "")), s && h(p, s) && (p = p.replace(s, ""), 
            d = !0), i && function(e, t) {
                return e.slice(-1 * t.length) === t;
            }(p, i) && (p = p.slice(0, -1 * i.length)), t && (p = p.split(t).join("")), n && (p = p.replace(n, ".")), 
            d && (l += "-"), "" !== (l = (l += p).replace(/[^0-9\.\-.]/g, "")) && (l = Number(l), 
            f && (l = f(l)), !!x(l) && l));
        }
        function i(e, t, n) {
            var r, i = [];
            for (r = 0; r < o.length; r += 1) i.push(e[o[r]]);
            return i.push(n), t.apply("", i);
        }
        return function e(t) {
            if (!(this instanceof e)) return new e(t);
            "object" == typeof t && (t = function(e) {
                var t, n, r, i = {};
                for (void 0 === e.suffix && (e.suffix = e.postfix), t = 0; t < o.length; t += 1) if (void 0 === (r = e[n = o[t]])) "negative" !== n || i.negativeBefore ? "mark" === n && "." !== i.thousand ? i[n] = "." : i[n] = !1 : i[n] = "-"; else if ("decimals" === n) {
                    if (!(0 <= r && r < 8)) throw new Error(n);
                    i[n] = r;
                } else if ("encoder" === n || "decoder" === n || "edit" === n || "undo" === n) {
                    if ("function" != typeof r) throw new Error(n);
                    i[n] = r;
                } else {
                    if ("string" != typeof r) throw new Error(n);
                    i[n] = r;
                }
                return f(i, "mark", "thousand"), f(i, "prefix", "negative"), f(i, "prefix", "negativeBefore"), 
                i;
            }(t), this.to = function(e) {
                return i(t, n, e);
            }, this.from = function(e) {
                return i(t, r, e);
            });
        };
    }));

    function rangeInit() {
        const rangePriceSlider = document.querySelectorAll(".range-price");
        if (rangePriceSlider.length) rangePriceSlider.forEach((range => {
            let minValue = parseInt(range.getAttribute("data-min"), 10);
            let maxValue = parseInt(range.getAttribute("data-max"), 10);
            initialize(range, {
                start: [ minValue, maxValue ],
                connect: true,
                range: {
                    min: minValue,
                    max: maxValue
                },
                format: wNumb({
                    decimals: 0
                })
            });
            const startValue = range.parentElement.querySelector("[data-start-value]");
            const endValue = range.parentElement.querySelector("[data-end-value]");
            const inputs = [ startValue, endValue ];
            if (startValue && endValue) {
                function setValues() {
                    let rankStartValue = parseInt(startValue.value, 10) || minValue;
                    let rankEndValue = parseInt(endValue.value, 10) || maxValue;
                    rankStartValue = Math.max(minValue, Math.min(rankStartValue, maxValue));
                    rankEndValue = Math.max(minValue, Math.min(rankEndValue, maxValue));
                    range.noUiSlider.set([ rankStartValue, rankEndValue ]);
                }
                range.noUiSlider.on("update", (function(values, handle) {
                    inputs[handle].value = values[handle];
                }));
                startValue.addEventListener("change", setValues);
                endValue.addEventListener("change", setValues);
            }
        }));
    }
    rangeInit();

    function initSliders() {
        if (document.querySelector(true && ".product__slider")) {
            const parentSliders = document.querySelector(".product__slider").parentElement;
            const arrowPrev = parentSliders.querySelector(".swiper-button-prev");
            const arrowNext = parentSliders.querySelector(".swiper-button-next");
            const countSlides = parentSliders.querySelector(".product__img-count");
            const pageProductThumbs = new Swiper(".product__small-slider", {
                modules: [],
                observer: true,
                observeParents: true,
                slidesPerView: 4,
                spaceBetween: 10,
                speed: 800,
                breakpoints: {
                    319.98: {
                        spaceBetween: 6
                    },
                    479.98: {
                        spaceBetween: 10
                    }
                }
            });
            new Swiper(".product__slider", {
                modules: [ Navigation, Thumb, Mousewheel ],
                observer: true,
                observeParents: true,
                slidesPerView: 1,
                spaceBetween: 16,
                speed: 800,
                grabCursor: true,
                mousewheel: {
                    forceToAxis: true,
                    releaseOnEdges: true
                },
                thumbs: {
                    swiper: pageProductThumbs
                },
                navigation: {
                    prevEl: arrowPrev,
                    nextEl: arrowNext
                },
                on: {
                    init: function() {
                        const totalSlides = countSlides;
                        totalSlides.textContent = this.slides.length;
                    }
                }
            });
        }
        if (document.querySelectorAll(".proposals__slider")) {
            const proposalSlider = document.querySelectorAll(".proposals__slider");
            proposalSlider.forEach((slider => {
                const parentPropSliders = slider.parentElement;
                const arrowPrev = parentPropSliders.querySelector(".swiper-button-prev");
                const arrowNext = parentPropSliders.querySelector(".swiper-button-next");
                new Swiper(slider, {
                    modules: [ Mousewheel, Navigation ],
                    observer: true,
                    observeParents: true,
                    slidesPerView: 4,
                    spaceBetween: 16,
                    speed: 800,
                    mousewheel: {
                        forceToAxis: true,
                        releaseOnEdges: true
                    },
                    navigation: {
                        prevEl: arrowPrev,
                        nextEl: arrowNext
                    },
                    breakpoints: {
                        319.98: {
                            slidesPerView: 1,
                            spaceBetween: 16
                        },
                        649.98: {
                            slidesPerView: 2,
                            spaceBetween: 16
                        },
                        767.98: {
                            slidesPerView: 3,
                            spaceBetween: 16
                        },
                        899.98: {
                            slidesPerView: 2,
                            spaceBetween: 16
                        },
                        1199.98: {
                            slidesPerView: 3,
                            spaceBetween: 16
                        },
                        1399.98: {
                            slidesPerView: 4,
                            spaceBetween: 16
                        }
                    }
                });
            }));
        }
    }
    window.addEventListener("load", (function(e) {
        initSliders();
    }));

    function addActiveClassSort(blockClass, optionsClass, parentActiveClass, selectedClass, currentElementClass) {
        const sortBlocks = document.querySelectorAll(blockClass);
        if (sortBlocks.length === 0) {
            console.warn("No sort blocks found on the page.");
            return;
        }
        sortBlocks.forEach((sortBlock => {
            const options = sortBlock.querySelectorAll(optionsClass);
            const currentElement = sortBlock.querySelector(currentElementClass);
            const parentElement = sortBlock;
            const breakpoint = 768;
            let isSortLockActive = false;
            if (!parentElement || !currentElement || options.length === 0) {
                console.warn(`Sort block is not fully initialized: missing required elements in ${blockClass}.`);
                return;
            }
            function updateLockState() {
                const screenWidth = window.innerWidth;
                if (screenWidth <= breakpoint) {
                    if (parentElement.classList.contains(parentActiveClass)) {
                        if (!document.documentElement.classList.contains("lock")) {
                            document.documentElement.classList.add("lock");
                            isSortLockActive = true;
                        }
                    } else if (isSortLockActive) {
                        const anyOtherSortOpen = Array.from(document.querySelectorAll(blockClass)).some((otherBlock => otherBlock !== parentElement && otherBlock.classList.contains(parentActiveClass)));
                        if (!anyOtherSortOpen) {
                            document.documentElement.classList.remove("lock");
                            isSortLockActive = false;
                        }
                    }
                } else if (isSortLockActive) {
                    document.documentElement.classList.remove("lock");
                    isSortLockActive = false;
                }
            }
            function handleOptionClick(e) {
                e.preventDefault();
                options.forEach((opt => {
                    opt.classList.remove(selectedClass);
                }));
                this.classList.add(selectedClass);
                const icon = this.querySelector(".sort-block__icon")?.cloneNode(true);
                const value = this.querySelector(".sort-block__value")?.textContent || "";
                currentElement.innerHTML = "";
                if (icon) currentElement.appendChild(icon);
                const valueSpan = document.createElement("span");
                valueSpan.classList.add("sort-block__value");
                valueSpan.textContent = value;
                currentElement.appendChild(valueSpan);
                if (parentElement.classList.contains(parentActiveClass)) parentElement.classList.remove(parentActiveClass); else parentElement.classList.add(parentActiveClass);
                updateLockState();
            }
            function handleCurrentClick(e) {
                e.preventDefault();
                if (parentElement.classList.contains(parentActiveClass)) parentElement.classList.remove(parentActiveClass); else parentElement.classList.add(parentActiveClass);
                updateLockState();
            }
            options.forEach((option => {
                option.addEventListener("click", handleOptionClick);
            }));
            currentElement.addEventListener("click", handleCurrentClick);
            function handleDocumentClick(e) {
                const isClickInsideOption = Array.from(options).some((option => option.contains(e.target)));
                const isClickInsideCurrent = currentElement.contains(e.target);
                if (!isClickInsideOption && !isClickInsideCurrent) {
                    parentElement.classList.remove(parentActiveClass);
                    updateLockState();
                }
            }
            document.addEventListener("click", handleDocumentClick);
            window.addEventListener("resize", updateLockState);
            const defaultSelected = sortBlock.querySelector(`${optionsClass}.${selectedClass}`);
            if (defaultSelected) {
                const icon = defaultSelected.querySelector(".sort-block__icon")?.cloneNode(true);
                const value = defaultSelected.querySelector(".sort-block__value")?.textContent || "";
                currentElement.innerHTML = "";
                if (icon) currentElement.appendChild(icon);
                const valueSpan = document.createElement("span");
                valueSpan.classList.add("sort-block__value");
                valueSpan.textContent = value;
                currentElement.appendChild(valueSpan);
            }
            updateLockState();
        }));
    }
    addActiveClassSort(".sort-block", ".sort-block__option", "sort-open", "selected", ".sort-block__current");

    document.addEventListener("click", (e => {
        const targetElement = e.target;
        if (targetElement.closest(".more-btn")) targetElement.closest(".more-btn").classList.add("active-load");
        if (targetElement.closest(".market__popular-btn")) targetElement.closest(".market__popular-btn").classList.toggle("active");
        if (targetElement.closest(".form-block__tag")) targetElement.closest(".form-block__tag").classList.toggle("active");
    }));

    const catalogBtnGrid = document.querySelector(".market__grid-items");
    const catalogBtnRow = document.querySelector(".market__row-items");
    const catalogItems = document.querySelector(".market__items");
    if (catalogBtnGrid && catalogBtnRow && catalogItems) {
        catalogBtnRow.addEventListener("click", (() => {
            catalogItems.classList.add("items-row");
            catalogBtnRow.classList.add("active");
            catalogBtnGrid.classList.remove("active");
        }));
        catalogBtnGrid.addEventListener("click", (() => {
            catalogItems.classList.remove("items-row");
            catalogBtnRow.classList.remove("active");
            catalogBtnGrid.classList.add("active");
        }));
    }

    (function() {
        const htmlElement = document.documentElement;
        const BREAKPOINT = 768;
        const isSmallScreen = () => window.innerWidth < BREAKPOINT;
        function toggleFilters(targetElement) {
            const isFilterBtn = targetElement.closest(".market__filter-btn");
            const isFilterArea = targetElement.closest(".aside-block__inner");
            const filtersOpen = htmlElement.classList.contains("filters-open");
            if (isFilterBtn) {
                htmlElement.classList.toggle("filters-open");
                updateLockClass();
            } else if (!isFilterArea && filtersOpen) {
                htmlElement.classList.remove("filters-open");
                updateLockClass();
            }
        }
        function updateLockClass() {
            if (isSmallScreen()) htmlElement.classList.toggle("lock", htmlElement.classList.contains("filters-open")); else htmlElement.classList.remove("lock");
        }
        document.addEventListener("click", (e => toggleFilters(e.target)));
        window.addEventListener("resize", updateLockClass);
        updateLockClass();
    })();

    function positionMoreInfo() {
        const orderInfos = document.querySelectorAll(".order-info");
        const isTouchDevice = window.matchMedia("(hover: none)").matches;
        orderInfos.forEach((orderInfo => {
            const moreBlock = orderInfo.querySelector(".order-info__more");
            if (moreBlock && orderInfo) if (isTouchDevice) {
                orderInfo.addEventListener("click", (e => {
                    e.preventDefault();
                    document.querySelectorAll(".order-info__more.active").forEach((block => {
                        if (block !== moreBlock) block.classList.remove("active");
                    }));
                    moreBlock.classList.toggle("active");
                    if (moreBlock.classList.contains("active")) {
                        const orderInfoRect = orderInfo.getBoundingClientRect();
                        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                        moreBlock.style.top = `${orderInfoRect.bottom + scrollTop}px`;
                        moreBlock.style.left = `${orderInfoRect.left}px`;
                        moreBlock.style.width = `${orderInfoRect.width}px`;
                    }
                }));
                document.addEventListener("click", (e => {
                    if (!e.target.closest(".order-info") && !e.target.closest(".order-info__more")) moreBlock.classList.remove("active");
                }));
            } else {
                orderInfo.addEventListener("mouseenter", (() => {
                    document.querySelectorAll(".order-info__more.active").forEach((block => {
                        if (block !== moreBlock) block.classList.remove("active");
                    }));
                    moreBlock.classList.add("active");
                    const orderInfoRect = orderInfo.getBoundingClientRect();
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    moreBlock.style.top = `${orderInfoRect.bottom + scrollTop}px`;
                    moreBlock.style.left = `${orderInfoRect.left}px`;
                    moreBlock.style.width = `${orderInfoRect.width}px`;
                }));
                orderInfo.addEventListener("mouseleave", (() => {
                    setTimeout((() => {
                        if (!moreBlock.matches(":hover")) moreBlock.classList.remove("active");
                    }), 100);
                }));
                moreBlock.addEventListener("mouseenter", (() => {
                    moreBlock.classList.add("active");
                }));
                moreBlock.addEventListener("mouseleave", (() => {
                    moreBlock.classList.remove("active");
                }));
            }
        }));
    }

    document.addEventListener("DOMContentLoaded", positionMoreInfo);
    window.matchMedia("(hover: none)").addEventListener("change", (() => {
        positionMoreInfo();
    }));
})();