(() => {
    "use strict";
    const modules_flsModules = {};

    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout(() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(
                    new CustomEvent("slideUpDone", {
                        detail: {
                            target,
                        },
                    })
                );
            }, duration);
        }
    };

    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout(() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(
                    new CustomEvent("slideDownDone", {
                        detail: {
                            target,
                        },
                    })
                );
            }, duration);
        }
    };

    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration);
        else return _slideUp(target, duration);
    };

    function spollers() {
        const spollersArray = document.querySelectorAll("[data-spollers]");
        if (spollersArray.length > 0) {
            document.addEventListener("click", setSpollerAction);
            const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
                return !item.dataset.spollers.split(",")[0];
            });
            if (spollersRegular.length) initSpollers(spollersRegular);
            let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
            if (mdQueriesArray && mdQueriesArray.length)
                mdQueriesArray.forEach((mdQueriesItem) => {
                    mdQueriesItem.matchMedia.addEventListener("change", function () {
                        initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                    });
                    initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                });
            function initSpollers(spollersArray, matchMedia = false) {
                spollersArray.forEach((spollersBlock) => {
                    spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spollersBlock.classList.add("_spoller-init");
                        initSpollerBody(spollersBlock);
                    } else {
                        spollersBlock.classList.remove("_spoller-init");
                        initSpollerBody(spollersBlock, false);
                    }
                });
            }
            function initSpollerBody(spollersBlock, hideSpollerBody = true) {
                let spollerItems = spollersBlock.querySelectorAll("details");
                if (spollerItems.length)
                    spollerItems.forEach((spollerItem) => {
                        let spollerTitle = spollerItem.querySelector("summary");
                        if (hideSpollerBody) {
                            spollerTitle.removeAttribute("tabindex");
                            if (!spollerItem.hasAttribute("data-open")) {
                                spollerItem.open = false;
                                spollerTitle.nextElementSibling.hidden = true;
                            } else {
                                spollerTitle.classList.add("_spoller-active");
                                spollerItem.open = true;
                            }
                        } else {
                            spollerTitle.setAttribute("tabindex", "-1");
                            spollerTitle.classList.remove("_spoller-active");
                            spollerItem.open = true;
                            spollerTitle.nextElementSibling.hidden = false;
                        }
                    });
            }
            function setSpollerAction(e) {
                const el = e.target;
                if (el.closest("summary") && el.closest("[data-spollers]")) {
                    e.preventDefault();
                    if (el.closest("[data-spollers]").classList.contains("_spoller-init")) {
                        const spollerTitle = el.closest("summary");
                        const spollerBlock = spollerTitle.closest("details");
                        const spollersBlock = spollerTitle.closest("[data-spollers]");
                        const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
                        const scrollSpoller = spollerBlock.hasAttribute("data-spoller-scroll");
                        const spollerSpeed = spollersBlock.dataset.spollersSpeed
                            ? parseInt(spollersBlock.dataset.spollersSpeed)
                            : 500;
                        if (!spollersBlock.querySelectorAll("._slide").length) {
                            if (oneSpoller && !spollerBlock.open) hideSpollersBody(spollersBlock);
                            !spollerBlock.open
                                ? (spollerBlock.open = true)
                                : setTimeout(() => {
                                      spollerBlock.open = false;
                                  }, spollerSpeed);
                            spollerTitle.classList.toggle("_spoller-active");
                            _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
                            if (scrollSpoller && spollerTitle.classList.contains("_spoller-active")) {
                                const scrollSpollerValue = spollerBlock.dataset.spollerScroll;
                                const scrollSpollerOffset = +scrollSpollerValue ? +scrollSpollerValue : 0;
                                const scrollSpollerNoHeader = spollerBlock.hasAttribute("data-spoller-scroll-noheader")
                                    ? document.querySelector(".header").offsetHeight
                                    : 0;
                                window.scrollTo({
                                    top: spollerBlock.offsetTop - (scrollSpollerOffset + scrollSpollerNoHeader),
                                    behavior: "smooth",
                                });
                            }
                        }
                    }
                }
                if (!el.closest("[data-spollers]")) {
                    const spollersClose = document.querySelectorAll("[data-spoller-close]");
                    if (spollersClose.length)
                        spollersClose.forEach((spollerClose) => {
                            const spollersBlock = spollerClose.closest("[data-spollers]");
                            const spollerCloseBlock = spollerClose.parentNode;
                            if (spollersBlock.classList.contains("_spoller-init")) {
                                const spollerSpeed = spollersBlock.dataset.spollersSpeed
                                    ? parseInt(spollersBlock.dataset.spollersSpeed)
                                    : 500;
                                spollerClose.classList.remove("_spoller-active");
                                _slideUp(spollerClose.nextElementSibling, spollerSpeed);
                                setTimeout(() => {
                                    spollerCloseBlock.open = false;
                                }, spollerSpeed);
                            }
                        });
                }
            }
            function hideSpollersBody(spollersBlock) {
                const spollerActiveBlock = spollersBlock.querySelector("details[open]");
                if (spollerActiveBlock && !spollersBlock.querySelectorAll("._slide").length) {
                    const spollerActiveTitle = spollerActiveBlock.querySelector("summary");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed
                        ? parseInt(spollersBlock.dataset.spollersSpeed)
                        : 500;
                    spollerActiveTitle.classList.remove("_spoller-active");
                    _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
                    setTimeout(() => {
                        spollerActiveBlock.open = false;
                    }, spollerSpeed);
                }
            }
        }
    }

    function uniqArray(array) {
        return array.filter(function (item, index, self) {
            return self.indexOf(item) === index;
        });
    }

    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter(function (item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        });
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item) => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            });
            let mdQueries = breakpointsArray.map(function (item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            });
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint) => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter(function (item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    });
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia,
                    });
                });
                return mdQueriesArray;
            }
        }
    }

    !(function (e) {
        "function" == typeof define && define.amd
            ? define([], e)
            : "object" == typeof exports
              ? (module.exports = e())
              : (window.wNumb = e());
    })(function () {
        "use strict";
        var o = [
            "decimals",
            "thousand",
            "mark",
            "prefix",
            "suffix",
            "encoder",
            "decoder",
            "negativeBefore",
            "negative",
            "edit",
            "undo",
        ];
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
            var d,
                l,
                h,
                g = p,
                v = "",
                m = "";
            return (
                o && (p = o(p)),
                !!x(p) &&
                    (!1 !== e && 0 === parseFloat(p.toFixed(e)) && (p = 0),
                    p < 0 && ((d = !0), (p = Math.abs(p))),
                    !1 !== e &&
                        (p = (function (e, t) {
                            return (
                                (e = e.toString().split("e")),
                                (+(
                                    (e = (e = Math.round(+(e[0] + "e" + (e[1] ? +e[1] + t : t))))
                                        .toString()
                                        .split("e"))[0] +
                                    "e" +
                                    (e[1] ? e[1] - t : -t)
                                )).toFixed(t)
                            );
                        })(p, e)),
                    -1 !== (p = p.toString()).indexOf(".")
                        ? ((h = (l = p.split("."))[0]), n && (v = n + l[1]))
                        : (h = p),
                    t && (h = w((h = w(h).match(/.{1,3}/g)).join(w(t)))),
                    d && u && (m += u),
                    r && (m += r),
                    d && s && (m += s),
                    (m += h),
                    (m += v),
                    i && (m += i),
                    c && (m = c(m, g)),
                    m)
            );
        }
        function r(e, t, n, r, i, o, f, u, s, c, a, p) {
            var d,
                l = "";
            return (
                a && (p = a(p)),
                !(!p || "string" != typeof p) &&
                    (u && h(p, u) && ((p = p.replace(u, "")), (d = !0)),
                    r && h(p, r) && (p = p.replace(r, "")),
                    s && h(p, s) && ((p = p.replace(s, "")), (d = !0)),
                    i &&
                        (function (e, t) {
                            return e.slice(-1 * t.length) === t;
                        })(p, i) &&
                        (p = p.slice(0, -1 * i.length)),
                    t && (p = p.split(t).join("")),
                    n && (p = p.replace(n, ".")),
                    d && (l += "-"),
                    "" !== (l = (l += p).replace(/[^0-9\.\-.]/g, "")) &&
                        ((l = Number(l)), f && (l = f(l)), !!x(l) && l))
            );
        }
        function i(e, t, n) {
            var r,
                i = [];
            for (r = 0; r < o.length; r += 1) i.push(e[o[r]]);
            return i.push(n), t.apply("", i);
        }
        return function e(t) {
            if (!(this instanceof e)) return new e(t);
            "object" == typeof t &&
                ((t = (function (e) {
                    var t,
                        n,
                        r,
                        i = {};
                    for (void 0 === e.suffix && (e.suffix = e.postfix), t = 0; t < o.length; t += 1)
                        if (void 0 === (r = e[(n = o[t])]))
                            "negative" !== n || i.negativeBefore
                                ? "mark" === n && "." !== i.thousand
                                    ? (i[n] = ".")
                                    : (i[n] = !1)
                                : (i[n] = "-");
                        else if ("decimals" === n) {
                            if (!(0 <= r && r < 8)) throw new Error(n);
                            i[n] = r;
                        } else if ("encoder" === n || "decoder" === n || "edit" === n || "undo" === n) {
                            if ("function" != typeof r) throw new Error(n);
                            i[n] = r;
                        } else {
                            if ("string" != typeof r) throw new Error(n);
                            i[n] = r;
                        }
                    return f(i, "mark", "thousand"), f(i, "prefix", "negative"), f(i, "prefix", "negativeBefore"), i;
                })(t)),
                (this.to = function (e) {
                    return i(t, n, e);
                }),
                (this.from = function (e) {
                    return i(t, r, e);
                }));
        };
    });

    function rangeInit() {
        const rangeSlider = document.querySelectorAll(".range-two");
        const rangeOneSlider = document.querySelectorAll(".range-one");
        if (rangeSlider.length)
            rangeSlider.forEach((range) => {
                let minValue = parseInt(range.getAttribute("data-min"), 10);
                let maxValue = parseInt(range.getAttribute("data-max"), 10);
                initialize(range, {
                    start: [minValue, maxValue],
                    connect: true,
                    range: {
                        min: minValue,
                        max: maxValue,
                    },
                    format: wNumb({
                        decimals: 0,
                    }),
                });
                const startValue = document.querySelector("#start-value");
                const endValue = document.querySelector("#end-value");
                const inputs = [startValue, endValue];
                if (startValue && endValue) {
                    function setValues() {
                        let rankStartValue = parseInt(startValue.value, 10) || minValue;
                        let rankEndValue = parseInt(endValue.value, 10) || maxValue;
                        rankStartValue = Math.max(minValue, Math.min(rankStartValue, maxValue));
                        rankEndValue = Math.max(minValue, Math.min(rankEndValue, maxValue));
                        range.noUiSlider.set([rankStartValue, rankEndValue]);
                    }
                    range.noUiSlider.on("update", function (values, handle) {
                        inputs[handle].value = values[handle];
                    });
                    startValue.addEventListener("change", setValues);
                    endValue.addEventListener("change", setValues);
                    document.addEventListener("click", function (e) {
                        let targetElement = e.target;
                        if (
                            targetElement.closest("[data-quantity-plus]") ||
                            targetElement.closest("[data-quantity-minus]")
                        ) {
                            const valueElement = targetElement
                                .closest("[data-quantity]")
                                .querySelector("[data-quantity-value]");
                            let value = parseInt(valueElement.value);
                            if (targetElement.hasAttribute("data-quantity-plus")) {
                                value += 30;
                                setValues();
                                if (+valueElement.dataset.quantityMax && +valueElement.dataset.quantityMax < value)
                                    value = valueElement.dataset.quantityMax;
                            } else {
                                value -= 30;
                                setValues();
                                if (+valueElement.dataset.quantityMin) {
                                    if (+valueElement.dataset.quantityMin > value)
                                        value = valueElement.dataset.quantityMin;
                                } else if (value < 1) value = 1;
                            }
                            targetElement.closest("[data-quantity]").querySelector("[data-quantity-value]").value =
                                value;
                        }
                    });
                }
            });
        if (rangeOneSlider.length)
            rangeOneSlider.forEach((range) => {
                let minValue = parseInt(range.getAttribute("data-min"), 10);
                let maxValue = parseInt(range.getAttribute("data-max"), 10);
                initialize(range, {
                    start: maxValue,
                    connect: "lower",
                    range: {
                        min: minValue,
                        max: maxValue,
                    },
                    format: wNumb({
                        decimals: 0,
                    }),
                });
                let nonLinearStepSliderValueElement = document.querySelector(".range-block__level");
                if (nonLinearStepSliderValueElement)
                    range.noUiSlider.on("update", function (values) {
                        nonLinearStepSliderValueElement.innerHTML = values.join(" - ");
                    });
            });
    }
    rangeInit();

    if (document.querySelector("[data-tippy-content]")) {
        const tippy_esm = tippy;
        modules_flsModules.tippy = tippy_esm("[data-tippy-content]", {});
    }

    function initSliders() {
        const resizableSwiper = (breakpoint, swiperClass, swiperSettings, callback) => {
            if (document.querySelector(swiperClass)) {
                let swiper;
                breakpoint = window.matchMedia(breakpoint);
                const enableSwiper = function (className, settings) {
                    swiper = new Swiper(className, settings);
                };
                const checker = function () {
                    if (breakpoint.matches) return enableSwiper(swiperClass, swiperSettings);
                    else {
                        if (swiper !== void 0) swiper.destroy(true, true);
                        return;
                    }
                };
                breakpoint.addEventListener("change", checker);
                checker();
            }
        };
        resizableSwiper("(min-width: 649.98px)", ".increase-rating__slider", {
            modules: [Navigation, Mousewheel],
            observer: true,
            observeParents: true,
            slidesPerView: 3.5,
            spaceBetween: 16,
            speed: 800,
            mousewheel: {
                forceToAxis: true,
                releaseOnEdges: true,
            },
            navigation: {
                prevEl: ".increase-rating__arrows .swiper-button-prev",
                nextEl: ".increase-rating__arrows .swiper-button-next",
            },
            breakpoints: {
                649.98: {
                    slidesPerView: 1.4,
                    spaceBetween: 10,
                },
                767.98: {
                    slidesPerView: 2,
                    spaceBetween: 10,
                },
                991.98: {
                    slidesPerView: 3,
                    spaceBetween: 10,
                },
                1267.98: {
                    slidesPerView: 3.5,
                    spaceBetween: 10,
                },
            },
        });
        if (document.querySelectorAll(".review__slider--left"))
            new Swiper(".review__slider--left", {
                modules: [Autoplay],
                observer: true,
                observeParents: true,
                slidesPerView: 4,
                spaceBetween: 16,
                speed: 5e3,
                autoplay: {
                    delay: 1,
                },
                loop: true,
                breakpoints: {
                    319.98: {
                        slidesPerView: 1,
                        spaceBetween: 15,
                    },
                    767.98: {
                        slidesPerView: 2,
                        spaceBetween: 16,
                    },
                    1099.98: {
                        slidesPerView: 3,
                        spaceBetween: 16,
                    },
                    1499.98: {
                        slidesPerView: 4,
                        spaceBetween: 16,
                    },
                },
            });
        if (document.querySelectorAll(".review__slider--right"))
            new Swiper(".review__slider--right", {
                modules: [Autoplay],
                observer: true,
                observeParents: true,
                slidesPerView: 4,
                spaceBetween: 16,
                speed: 5e3,
                autoplay: {
                    delay: 1,
                    reverseDirection: true,
                },
                loop: true,
                breakpoints: {
                    319.98: {
                        slidesPerView: 1,
                        spaceBetween: 15,
                    },
                    767.98: {
                        slidesPerView: 2,
                        spaceBetween: 16,
                    },
                    1099.98: {
                        slidesPerView: 3,
                        spaceBetween: 16,
                    },
                    1499.98: {
                        slidesPerView: 4,
                        spaceBetween: 16,
                    },
                },
            });
        if (document.querySelectorAll(".all-gaming__slider"))
            new Swiper(".all-gaming__slider", {
                modules: [Mousewheel, Navigation],
                observer: true,
                observeParents: true,
                slidesPerView: 7,
                spaceBetween: 16,
                speed: 800,
                mousewheel: {
                    forceToAxis: true,
                    releaseOnEdges: true,
                },
                navigation: {
                    prevEl: ".swiper-button-prev",
                    nextEl: ".swiper-button-next",
                },
                // loop: true,
                breakpoints: {
                    319.98: {
                        slidesPerView: 1.65,
                        spaceBetween: 16,
                    },
                    649.98: {
                        slidesPerView: 3.2,
                        spaceBetween: 16,
                    },
                    1099.98: {
                        slidesPerView: 5.3,
                        spaceBetween: 16,
                    },
                    1499.98: {
                        slidesPerView: 7,
                        spaceBetween: 16,
                    },
                },
            });
    }
    window.addEventListener("load", function (e) {
        if (document.querySelector(".swiper")) {
            initSliders();
        }
    });

    function eventsHoverTabs(tabsContainer, tabsTitle, tabsBody) {
        const tabContainer = document.querySelectorAll(tabsContainer);
        if (tabContainer.length)
            tabContainer.forEach((container) => {
                const tabTitles = container.querySelectorAll(tabsTitle);
                const tabContents = container.querySelectorAll(tabsBody);
                if (tabTitles.length > 0 && tabContents.length > 0)
                    tabTitles.forEach((title, index) => {
                        title.addEventListener("mouseenter", () => {
                            tabTitles.forEach((t) => t.classList.remove("active-tab"));
                            tabContents.forEach((content) => content.classList.remove("active-tab"));
                            title.classList.add("active-tab");
                            tabContents[index].classList.add("active-tab");
                        });
                    });
            });
    }
    eventsHoverTabs("[data-tabs]", "[data-tabs-title]", "[data-tabs-body]");

    const selectInit = () => {
        const selectArray = document.querySelectorAll(".custom-select");
        if (selectArray.length > 0) {
            selectArray.forEach((element) => {
                const selectTag = element.querySelector("select");
                if (!selectTag) return;
                const selectOption = selectTag.querySelectorAll("option");
                const selectWrapper = document.createElement("div"),
                    selectLabel = document.createElement("div"),
                    selectItemList = document.createElement("div"),
                    selectLabelSpan = document.createElement("span"),
                    selectLabelArea = document.createElement("span"),
                    selectOptionsWrapper = document.createElement("div");
                selectTag.hidden = true;
                selectWrapper.classList.add("select__wrapper");
                selectLabel.classList.add("select__label");
                selectLabelSpan.classList.add("select__name");
                selectLabelArea.classList.add("select__area");
                const selectedOption = selectTag[selectTag.selectedIndex];
                if (selectedOption.dataset.icon) {
                    const selectLabelIcon = document.createElement("img");
                    selectLabelIcon.classList.add("select__label-icon");
                    selectLabelIcon.src = selectedOption.dataset.icon;
                    selectLabel.append(selectLabelIcon);
                }
                selectLabelSpan.textContent = selectedOption.textContent;
                selectLabel.append(selectLabelSpan);
                selectItemList.classList.add("select__content", "select__content--hidden");
                selectOptionsWrapper.classList.add("select__options");
                selectWrapper.append(selectLabel);
                element.append(selectLabelArea);
                element.append(selectWrapper);
                const updateSelectedClass = (currentSelectedItem) => {
                    const allItems = selectItemList.querySelectorAll(".select__item");
                    allItems.forEach((item) => item.classList.remove("selected"));
                    currentSelectedItem.classList.add("selected");
                };
                selectOption.forEach((option, index) => {
                    const selectItem = document.createElement("div");
                    selectItem.classList.add("select__item");
                    const optionIconUrl = option.dataset.icon;
                    if (optionIconUrl) {
                        const optionIcon = document.createElement("img");
                        optionIcon.classList.add("select__item-icon");
                        optionIcon.src = optionIconUrl;
                        selectItem.append(optionIcon);
                    }
                    const optionText = document.createElement("span");
                    optionText.textContent = option.textContent;
                    selectItem.append(optionText);
                    if (selectTag.selectedIndex === index) selectItem.classList.add("selected");
                    selectItem.addEventListener("click", (e) => {
                        const selectItemTag = e.target.closest(".custom-select").querySelector("select"),
                            selectItemOptions = selectItemTag.querySelectorAll("option");
                        selectItemOptions.forEach((element, index) => {
                            if (element.textContent === optionText.textContent) {
                                selectItemTag.selectedIndex = index;
                                selectLabelSpan.textContent = element.textContent;
                                const iconUrl = element.dataset.icon;
                                const selectLabelIcon = selectLabel.querySelector(".select__label-icon");
                                if (iconUrl)
                                    if (!selectLabelIcon) {
                                        const newSelectLabelIcon = document.createElement("img");
                                        newSelectLabelIcon.classList.add("select__label-icon");
                                        newSelectLabelIcon.src = iconUrl;
                                        selectLabel.append(newSelectLabelIcon);
                                    } else selectLabelIcon.src = iconUrl;
                                else if (selectLabelIcon) selectLabel.removeChild(selectLabelIcon);
                                const event = new Event("change", {
                                    bubbles: true,
                                });
                                selectItemTag.dispatchEvent(event);
                                updateSelectedClass(selectItem);
                            }
                        });
                        selectLabel.click();
                    });
                    selectOptionsWrapper.append(selectItem);
                });
                selectItemList.append(selectOptionsWrapper);
                selectWrapper.append(selectItemList);
                if (selectOption.length < 2) {
                    element.classList.add("non-active");
                    return false;
                }
                selectLabelArea.addEventListener("click", (e) => {
                    e.stopPropagation();
                    closeAllSelect(selectLabel);
                    window.innerHeight - selectItemList.getBoundingClientRect().bottom < 100
                        ? (selectItemList.classList.add("select__content--top"),
                          selectLabel.classList.add("select__label--top"))
                        : (selectItemList.classList.remove("select__content--top"),
                          selectLabel.classList.remove("select__label--top"));
                    selectItemList.classList.toggle("select__content--hidden");
                    selectLabel.classList.toggle("select__label--active");
                    element.classList.toggle("active");
                });
                selectTag.addEventListener("change", () => {
                    const selectItemOptions = selectTag.options,
                        selectedItem = selectItemOptions[selectTag.selectedIndex];
                    selectLabelSpan.textContent = selectedItem.textContent;
                    const iconUrl = selectedItem.dataset.icon;
                    const selectLabelIcon = selectLabel.querySelector(".select__label-icon");
                    if (iconUrl)
                        if (!selectLabelIcon) {
                            const newSelectLabelIcon = document.createElement("img");
                            newSelectLabelIcon.classList.add("select__label-icon");
                            newSelectLabelIcon.src = iconUrl;
                            selectLabel.append(newSelectLabelIcon);
                        } else selectLabelIcon.src = iconUrl;
                    else if (selectLabelIcon) selectLabel.removeChild(selectLabelIcon);
                    const allItems = selectItemList.querySelectorAll(".select__item");
                    allItems.forEach((item, idx) => {
                        if (idx === selectTag.selectedIndex) item.classList.add("selected");
                        else item.classList.remove("selected");
                    });
                });
            });
            document.addEventListener("click", closeAllSelect);
        }
    };
    const closeAllSelect = (select) => {
        const selectContentArray = document.querySelectorAll(".select__content"),
            selectLabelArray = document.querySelectorAll(".select__label");
        const customSelect = document.querySelectorAll(".custom-select");
        selectLabelArray.forEach((element, index) => {
            element !== select
                ? (element.classList.remove("select__label--active"),
                  selectContentArray[index].classList.add("select__content--hidden"),
                  customSelect[index].classList.remove("active"))
                : null;
        });
    };

    const tipArray = document.querySelectorAll(".tip");
    tipArray.forEach((tip) => {
        tip.querySelector(".tip-content");
        const tipLabelContent = tip.querySelector(".calculator-checkbox__label");
        window.innerWidth;
        window.innerHeight;
        let tipOffset = tip.getBoundingClientRect().left;
        if (tipLabelContent) tipOffset = tipLabelContent.getBoundingClientRect().left - 8;
        tip.style.setProperty("--left-offset", `${-tipOffset}px`);
    });

    document.querySelectorAll(".search-block__input").forEach((input) => {
        input.addEventListener("focus", () => {
            input.parentElement.parentElement.classList.add("search-block--active");
        });
        input.addEventListener("blur", () => {
            setTimeout(() => {
                input.parentElement.parentElement.classList.remove("search-block--active");
            }, 600);
        });
    });

    document.querySelectorAll(".all-gaming__line-body").forEach((line) => {
        const copyLine = document.querySelector(".all-gaming__line-items").cloneNode(true);
        line.appendChild(copyLine);
    });

    function autoSwitchTabs(tabsContainer, tabsTitle, tabsBody, interval = 10000) {
        const tabContainers = document.querySelectorAll(tabsContainer);

        if (tabContainers.length) {
            tabContainers.forEach((container) => {
                const tabTitles = container.querySelectorAll(tabsTitle);
                const tabContents = container.querySelectorAll(tabsBody);

                if (tabTitles.length > 0 && tabContents.length > 0) {
                    let currentIndex = 0;
                    let autoSwitching = false;
                    let switchInterval;

                    // Функция для переключения табов
                    function switchTab() {
                        tabTitles[currentIndex].classList.remove("active-tab");
                        tabContents[currentIndex].classList.remove("active-tab");
                        currentIndex = (currentIndex + 1) % tabTitles.length;
                        tabTitles[currentIndex].classList.add("active-tab");
                        tabContents[currentIndex].classList.add("active-tab");
                    }

                    // Настроим переключение табов
                    function startAutoSwitching() {
                        if (switchInterval) {
                            clearInterval(switchInterval); // Очищаем старый интервал
                        }

                        switchInterval = setInterval(() => {
                            if (autoSwitching) {
                                switchTab();
                            }
                        }, interval);
                    }

                    // Функция для отслеживания видимости контейнера
                    const observer = new IntersectionObserver(
                        (entries) => {
                            entries.forEach((entry) => {
                                if (entry.isIntersecting) {
                                    autoSwitching = true;
                                    container.classList.add("visible");
                                    startAutoSwitching();
                                } else {
                                    autoSwitching = false;
                                    container.classList.remove("visible");
                                    clearInterval(switchInterval);
                                }
                            });
                        },
                        { threshold: 0.5 }
                    ); // 50% item in scope

                    observer.observe(container);

                    // handlers for switching tabs manually
                    tabTitles.forEach((title, index) => {
                        title.addEventListener("click", () => {
                            // Останавливаем автоматическое переключение при клике
                            autoSwitching = false;
                            clearInterval(switchInterval); // Stop the current interval

                            // Переключаем таб вручную
                            tabTitles[currentIndex].classList.remove("active-tab");
                            tabContents[currentIndex].classList.remove("active-tab");
                            currentIndex = index;
                            tabTitles[currentIndex].classList.add("active-tab");
                            tabContents[currentIndex].classList.add("active-tab");

                            // After clicking again, we restart automatic switching from the current tab
                            autoSwitching = true;
                            startAutoSwitching();
                        });
                    });

                    // Start automatic switching immediately after booting up
                    startAutoSwitching();
                }
            });
        }
    }
    autoSwitchTabs("[data-tabs-auto]", "[data-tabs-title]", "[data-tabs-body]", "10000");

    selectInit();
    spollers();

    if (document.querySelector(".category-games__search-input")) {
        const input = document.querySelector(".category-games__search-input");
        const button = document.querySelector(".category-games__search-clear");
        const activeClass = "active";
        input.addEventListener("input", function () {
            if (input.value.trim()) button.classList.add(activeClass);
            else button.classList.remove(activeClass);
        });
        button.addEventListener("click", function () {
            input.value = "";
            button.classList.remove(activeClass);
            input.focus();
        });
    }
})();