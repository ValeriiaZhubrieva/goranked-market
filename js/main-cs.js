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

    function findRank(value) {
        let hero = []; //null;
        for (const h in rankArray) {
            if (value >= rankArray[h].value) {
                hero["id"] = rankArray[h].id;
                hero["name"] = rankArray[h].name;
                hero["icon"] = rankArray[h].icon;
                hero["value"] = rankArray[h].value;
                hero["number"] = rankArray[h].number;
            } else {
                break;
            }
        }
        return hero;
    }

    function rangeInit() {
        const rangeSlider = document.querySelectorAll(".range-two");
        const rangeOneSlider = document.querySelectorAll(".range-one");

        if (rangeSlider.length)
            rangeSlider.forEach((range) => {
                let minValue = parseInt(range.getAttribute("data-min"), 10);
                let maxValue = parseInt(range.getAttribute("data-max"), 10);

                let minDefault = parseInt(range.closest(".ranges-block").querySelector("#start-value").value, 10);
                let maxDefault = parseInt(range.closest(".ranges-block").querySelector("#end-value").value, 10);
                initialize(range, {
                    start: [minDefault, maxDefault],
                    connect: true,
                    range: {
                        min: minValue,
                        max: maxValue,
                    },
                    format: wNumb({
                        decimals: 0,
                    }),
                });
                const startValue = range.closest(".ranges-block").querySelector("#start-value");
                const endValue = range.closest(".ranges-block").querySelector("#end-value");
                const startRang = document.querySelector("#start_rang");
                const endRang = document.querySelector("#end_rang");

                const rankItemNameFrom = document.querySelector(".rank-drop__block.from");

                const rankItemNameTo = document.querySelector(".rank-drop__block.to");

                const inputs = [startValue, endValue];
                if (startValue && endValue) {
                    function setValues() {
                        let rankStartValue = parseInt(startValue.value, 10) || minValue;
                        let rankEndValue = parseInt(endValue.value, 10) || maxValue;
                        rankStartValue = Math.max(minValue, Math.min(rankStartValue, maxValue));
                        rankEndValue = Math.max(minValue, Math.min(rankEndValue, maxValue));
                        range.noUiSlider.set([rankStartValue, rankEndValue]);
                    }

                    if (rankItemNameFrom) {
                        for (var item of rankItemNameFrom.querySelectorAll(".rank-drop__item")) {
                            item.addEventListener("click", function () {
                                startValue.value = this.getAttribute("data-mmr");
                                setValues();
                            });
                        }
                    }

                    if (rankItemNameTo) {
                        for (var item of rankItemNameTo.querySelectorAll(".rank-drop__item")) {
                            item.addEventListener("click", function () {
                                endValue.value = this.getAttribute("data-mmr");
                                setValues();
                            });
                        }
                    }

                    range.noUiSlider.on("update", function (values, handle) {
                        inputs[handle].value = values[handle];

                        const newRankFrom = findRank(startValue.value);
                        const newRankTo = findRank(endValue.value);

                        if (newRankFrom.name && Object.keys(newRankFrom).length) {
                            rankItemNameFrom.querySelector(".rank-drop__name").textContent = newRankFrom["name"];
                            rankItemNameFrom.querySelector(".rank-drop__img").setAttribute("src", newRankFrom["icon"]);

                            document.querySelectorAll(".order-rang-from-name").forEach((element) => {
                                element.textContent = newRankFrom["name"];
                            });
                            document.querySelectorAll(".order-rang-from-icon").forEach((element) => {
                                element.setAttribute("src", newRankFrom["icon"]);
                            });

                            for (var item of rankItemNameFrom.querySelectorAll(".rank-drop__item")) {
                                item.classList.remove("active");
                            }
                            rankItemNameFrom
                                .querySelector("[data-id='" + newRankFrom["id"] + "']")
                                .classList.add("active");
                            startRang.value = newRankFrom["number"];
                        }

                        if (newRankTo.name && Object.keys(newRankTo).length) {
                            rankItemNameTo.querySelector(".rank-drop__name").textContent = newRankTo["name"];
                            rankItemNameTo.querySelector(".rank-drop__img").setAttribute("src", newRankTo["icon"]);

                            document.querySelectorAll(".order-rang-to-name").forEach((element) => {
                                element.textContent = newRankTo["name"];
                            });
                            document.querySelectorAll(".order-rang-to-icon").forEach((element) => {
                                element.setAttribute("src", newRankTo["icon"]);
                            });

                            for (var item of rankItemNameTo.querySelectorAll(".rank-drop__item")) {
                                item.classList.remove("active");
                            }
                            rankItemNameTo.querySelector("[data-id='" + newRankTo["id"] + "']").classList.add("active");
                            endRang.value = newRankTo["number"];
                        }

                        if (document.querySelector("#boost_slug").value == "decency") {
                            calculatorDecency();
                        } else {
                            calculatorBoostMmr();
                        }
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
                                if (+valueElement.dataset.quantitymax && +valueElement.dataset.quantitymax < value)
                                    value = valueElement.dataset.quantitymax;
                                setValues();
                            } else {
                                value -= 30;
                                if (+valueElement.dataset.quantitymin) {
                                    if (+valueElement.dataset.quantitymin > value)
                                        value = valueElement.dataset.quantitymin;
                                } else if (value < 1) value = 1;
                            }
                            targetElement.closest("[data-quantity]").querySelector("[data-quantity-value]").value =
                                value;
                            setValues();
                        }
                    });
                }
            });
        if (rangeOneSlider.length)
            rangeOneSlider.forEach((range) => {
                let minValue = parseInt(range.getAttribute("data-min"), 10);
                let maxValue = parseInt(range.getAttribute("data-max"), 10);
                let startValue = parseInt(range.getAttribute("data-start"), 10);
                initialize(range, {
                    start: startValue,
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
                        document.querySelector(".calc-aside__matches-quantity").innerHTML = values.join(" - ");
                        nonLinearStepSliderValueElement.value = values.join(" - ");
                        if (document.querySelector("#boost_slug").value == "lp") {
                            calculatorLp();
                        } else {
                            calculatorCalibration();
                        }
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
            spaceBetween: 10,
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
    }
    window.addEventListener("load", function (e) {
        if (document.querySelector(".swiper")) {
            initSliders();
        }
    });

    document.addEventListener("click", (e) => {
        const targetElement = e.target;
        if (targetElement.closest(".calc-aside__code-btn")) {
            let promocode = document.getElementById("promocode");
            let csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
            fetch("/promocode/use", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                body: JSON.stringify({
                    code: promocode.value,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.type === "success") {
                        location.reload();
                    }
                    promocode.value = "";
                })
                .catch((error) => {
                    console.error(error);
                });
        }
        if (targetElement.closest(".calc-aside__code-reset"))
            targetElement.closest(".calc-aside__code-body").classList.remove("active");
    });

    const selectInit2 = () => {
        const selectArray = document.querySelectorAll(".cs .custom-select");
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

                    document
                        .querySelector(".calc-aside__rank-img img")
                        .setAttribute("src", selectedOption.dataset.icon);

                    document.querySelector(".calc-aside__rank-name").innerHTML = selectedOption.dataset.name;

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
                        const selectItemTag = e.target.closest(".cs .custom-select").querySelector("select"),
                            selectItemOptions = selectItemTag.querySelectorAll("option");
                        selectItemOptions.forEach((element, index) => {
                            if (element.textContent === optionText.textContent) {
                                selectItemTag.selectedIndex = index;
                                selectLabelSpan.textContent = element.textContent;
                                const iconUrl = element.dataset.icon;
                                const name = element.dataset.name;
                                const selectLabelIcon = selectLabel.querySelector(".select__label-icon");
                                if (iconUrl) {
                                    if (!selectLabelIcon) {
                                        const newSelectLabelIcon = document.createElement("img");
                                        newSelectLabelIcon.classList.add("select__label-icon");
                                        newSelectLabelIcon.src = iconUrl;
                                        document
                                            .querySelector(".calc-aside__rank-img img")
                                            .setAttribute("src", iconUrl);
                                        document.querySelector(".calc-aside__rank-name").innerHTML = name;
                                        selectLabel.append(newSelectLabelIcon);
                                    } else {
                                        selectLabelIcon.src = iconUrl;
                                        document
                                            .querySelector(".calc-aside__rank-img img")
                                            .setAttribute("src", iconUrl);
                                        document.querySelector(".calc-aside__rank-name").innerHTML = name;
                                    }
                                    if (document.querySelector("#boost_slug").value == "decency") {
                                        calculatorDecency();
                                    } else {
                                        calculatorCalibration();
                                    }
                                } else if (selectLabelIcon) selectLabel.removeChild(selectLabelIcon);
                                const event = new Event("change", {
                                    bubbles: true,
                                });
                                selectItemTag.dispatchEvent(event);
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
                    const wasHidden = selectItemList.classList.contains("select__content--hidden");
                    closeAllSelect2(selectLabel);
                    if (window.innerWidth <= 767.98) {
                        if (wasHidden) {
                            bodyLockToggle();
                        } else {
                            bodyLockToggle();
                        }
                    }

                    selectItemList.classList.toggle("select__content--hidden");
                    selectLabel.classList.toggle("select__label--active");
                    element.classList.toggle("active");
                });
                selectTag.addEventListener("change", () => {
                    const selectItemOptions = selectTag.options,
                        selectedItem = selectItemOptions[selectTag.selectedIndex];
                    selectLabelSpan.textContent = selectedItem.textContent;
                });
            });
            document.addEventListener("click", (e) => {
                closeAllSelect2();
            });
        }
    };

    const closeAllSelect2 = (select) => {
        const selectContentArray = document.querySelectorAll(".select__content"),
            selectLabelArray = document.querySelectorAll(".select__label");
        const customSelect = document.querySelectorAll(".cs .custom-select");
        selectLabelArray.forEach((element, index) => {
            if (element !== select) {
                const content = selectContentArray[index];
                if (!content.classList.contains("select__content--hidden")) {
                    content.classList.add("select__content--hidden");
                    element.classList.remove("select__label--active");
                    customSelect[index].classList.remove("active");
                    if (window.innerWidth <= 767.98) {
                        bodyLockToggle();
                    }
                }
            }
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

    function calculatorBoostMmr() {
        let actionSale = 0;
        let price = 0;
        let start_mmr = document.querySelector("#start-value").value;
        let end_mmr = document.querySelector("#end-value").value;

        if (
            document.querySelector(".from .rank-drop__item.active") &&
            document.querySelector(".to .rank-drop__item.active") &&
            document.querySelector("#show_quantity").value == 0
        ) {
            start_mmr = document.querySelector(".from .rank-drop__item.active").getAttribute("data-mmr");
            end_mmr = document.querySelector(".to .rank-drop__item.active").getAttribute("data-mmr");
        }

        let min = parseInt(start_mmr);
        let max = parseInt(end_mmr);

        document.querySelector("#diapason_price").value = start_mmr + "-" + end_mmr;

        // Считаем диапазон
        price = +updateCustomPrice(
            min,
            max,
            price,
            parseRangeLimits(document.querySelector("#diapason_price").dataset.range)
        ).toFixed(2);

        let show_promo = document.querySelector("#show_promo").value;
        if (show_promo == 1) {
            let promo_value = document.querySelector("#promo_value");

            document.querySelector("#need_mmr").innerHTML =
                Math.abs(+promo_value.value - (+end_mmr - +start_mmr)) + " ELO";

            if (+promo_value.value <= +end_mmr - +start_mmr) {
                document.querySelector(".calc-aside__proposal").classList.add("hidden");
                document.querySelector(".calc-aside__proposal.green").classList.remove("hidden");
                actionSale = +document.querySelector("#promo_percent").value;
                document.querySelector(".calc-aside__total-sale").style.visibility = "visible";
            } else {
                document.querySelector(".calc-aside__proposal").classList.remove("hidden");
                document.querySelector(".calc-aside__proposal.green").classList.add("hidden");
                actionSale = 0;
                document.querySelector(".calc-aside__total-sale").style.visibility = "hidden";
            }
        }

        let InterimPrice = price;

        // Считаем доп опции
        let additionsChecked = document.querySelectorAll(".additions:checked");
        if (additionsChecked.length !== 0) {
            // Доп опции с data-prefix="1"
            document.querySelectorAll('.additions[data-prefix="1"]:checked').forEach(function (element) {
                price += +element.dataset.price;
            });

            let price_no_perc = +price; // Цена без процентов

            // Доп опции с data-prefix="0"
            document.querySelectorAll('.additions[data-prefix="0"]:checked').forEach(function (element) {
                price += +(+price_no_perc * (+element.dataset.price / 100));
            });
        }

        document.querySelectorAll(".options").forEach((element) => {
            price += +(InterimPrice * (+element.options[element.selectedIndex].dataset.percent / 100));
        });

        let currency_rate = document.querySelector("#currency_usdt").value;

        document.querySelector("#sale-promocode").textContent = Math.round(Number(price / +currency_rate));

        // Promocode
        if (promocode_sum != 0 && +price >= +promocode_sum) {
            if (promocode_perc == 1) {
                price -= +price * (+promocode / 100);
            } else {
                price -= promocode;
            }
            document.querySelector(".calc-aside__total-sale").style.visibility = "visible";
        }

        // endpromocode
        if (actionSale) {
            price -= +price * (+actionSale / 100);
        }

        let result_price = Number(price / +currency_rate).toFixed(2);
        let result_price_2 = Number(InterimPrice / +currency_rate).toFixed(2);

        if (currency_rate == 1) {
            result_price = Math.trunc(result_price);
            result_price_2 = Math.trunc(result_price_2);
        }

        document.querySelectorAll(".calculator-price-cs").forEach((element) => {
            element.textContent = result_price;
        });

        if (actionSale) {
            document.querySelectorAll(".calculator-sale-cs").forEach((element) => {
                element.textContent = result_price - actionSale;
            });
            if (document.querySelector(".total-price-fixed__sale")) {
                document.querySelector(".total-price-fixed__sale").style.visibility = "visible";
            }
        } else {
            if (document.querySelector(".total-price-fixed__sale")) {
                document.querySelector(".total-price-fixed__sale").style.visibility = "hidden";
            }
        }

        document.querySelector("#price_cs").value = result_price;
        document.querySelector("#price_clear_cs").value = result_price_2;
        if (document.querySelector(".calc-aside__result-price.total")) {
            document.querySelector(".calc-aside__result-price.total").textContent = result_price_2;
        }
    }

    function calculatorCalibration() {
        let actionSale = 0;
        let mmr = document.querySelector(".calculator-calibration-slider").value,
            rank = document.querySelector("#calculator-calibration-rank").value,
            price = 0,
            result = +mmr * +mmr_game,
            id;

        // Ищем значение по rank
        for (var key in rankArray) {
            if (rankArray[key].id == rank) {
                price = rankArray[key].price;
                result = rankArray[key].value;
                id = rankArray[key].id;
                break;
            }
        }

        // Ищем следующее значение больше result
        for (var key in rankArray) {
            if (rankArray[key].value > result) {
                result = {
                    name: key,
                    icon: rankArray[key].icon,
                };
                break;
            }
        }

        price *= +mmr;

        let InterimPrice = price;

        // Считаем доп опции
        let additionsChecked = document.querySelectorAll(".additions-calibration:checked");
        if (additionsChecked.length !== 0) {
            document.querySelectorAll('.additions-calibration[data-prefix="1"]:checked').forEach(function (element) {
                price += +element.dataset.price;
            });

            let price_no_perc = +price; // Цена без процентов

            document.querySelectorAll('.additions-calibration[data-prefix="0"]:checked').forEach(function (element) {
                price += +(+price_no_perc * (+element.dataset.price / 100));
            });
        }

        let currency_rate = document.querySelector("#currency_usdt").value;

        // Promocode
        document.querySelector("#sale-promocode").textContent = Math.round(Number(price / +currency_rate));

        if (promocode_sum != 0 && +price >= +promocode_sum) {
            if (promocode_perc == 1) {
                price -= +price * (+promocode / 100);
            } else {
                price -= promocode;
            }
            document.querySelector(".calc-aside__total-sale").style.visibility = "visible";
        }
        // endpromocode

        let result_price = Number(price / +currency_rate).toFixed(2);
        let result_price_2 = Number(InterimPrice / +currency_rate).toFixed(2);

        if (currency_rate == 1) {
            result_price = Math.trunc(result_price);
            result_price_2 = Math.trunc(result_price_2);
        }

        document.querySelectorAll(".calculator-price-cs").forEach((element) => {
            element.textContent = result_price;
        });

        if (actionSale) {
            document.querySelectorAll(".calculator-sale-cs").forEach((element) => {
                element.textContent = result_price - actionSale;
            });
            if (document.querySelector(".total-price-fixed__sale")) {
                document.querySelector(".total-price-fixed__sale").style.visibility = "visible";
            }
        } else {
            if (document.querySelector(".total-price-fixed__sale")) {
                document.querySelector(".total-price-fixed__sale").style.visibility = "hidden";
            }
        }

        document.querySelector("#price_cs").value = result_price;
        document.querySelector("#price_clear_cs").value = result_price_2;

        if (document.querySelector(".calc-aside__result-price.total")) {
            document.querySelector(".calc-aside__result-price.total").textContent = result_price_2;
        }
    }

    function calculatorLp() {
        let actionSale = 0;

        let games = document.querySelector('input[name="game_count"]').value;
        let price = 0;

        price += +games * +gamesArray[games];

        let InterimPrice = price;

        // Считаем доп опции
        let additionsChecked = document.querySelectorAll(".additions-calibration:checked");
        if (additionsChecked.length !== 0) {
            document.querySelectorAll('.additions-calibration[data-prefix="1"]:checked').forEach(function (element) {
                price += +element.dataset.price;
            });

            let price_no_perc = +price; // Цена без процентов

            document.querySelectorAll('.additions-calibration[data-prefix="0"]:checked').forEach(function (element) {
                price += +(+price_no_perc * (+element.dataset.price / 100));
            });
        }

        let currency_rate = document.querySelector("#currency_usdt").value;

        // Promocode
        document.querySelector("#sale-promocode").textContent = Math.round(Number(price / +currency_rate));

        if (promocode_sum != 0 && +price >= +promocode_sum) {
            if (promocode_perc == 1) {
                price -= +price * (+promocode / 100);
            } else {
                price -= promocode;
            }
            document.querySelector(".calc-aside__total-sale").style.visibility = "visible";
        }
        // endpromocode

        let result_price = Number(price / +currency_rate).toFixed(2);
        let result_price_2 = Number(InterimPrice / +currency_rate).toFixed(2);

        if (currency_rate == 1) {
            result_price = Math.trunc(result_price);
            result_price_2 = Math.trunc(result_price_2);
        }

        document.querySelectorAll(".calculator-price-cs").forEach((element) => {
            element.textContent = result_price;
        });

        if (actionSale) {
            document.querySelectorAll(".calculator-sale-cs").forEach((element) => {
                element.textContent = result_price - actionSale;
            });
            if (document.querySelector(".total-price-fixed__sale")) {
                document.querySelector(".total-price-fixed__sale").style.visibility = "visible";
            }
        } else {
            if (document.querySelector(".total-price-fixed__sale")) {
                document.querySelector(".total-price-fixed__sale").style.visibility = "hidden";
            }
        }

        document.querySelector("#price_cs").value = result_price;
        document.querySelector("#price_clear_cs").value = result_price_2;

        if (document.querySelector(".calc-aside__result-price.total")) {
            document.querySelector(".calc-aside__result-price.total").textContent = result_price_2;
        }
    }

    function calculatorDecency() {
        let actionSale = 0;

        let decency_start = document.querySelector(".calculator-decency-start").value, //Текущая вежливость
            decency_end = document.querySelector(".calculator-decency-end").value, // Желаемая вежливость
            decency_communication_start = document.querySelector(".calculator-decency-communication-start").value, // Текущая порядочность
            decency_communication_end = document.querySelector(".calculator-decency-communication-end").value, // Желаемая порядочность
            price_rank = RANKS_PERC[document.querySelector("#rank_user").value],
            price = 0,
            count_step = 0;

        count_step =
            Math.max(decency_end, decency_communication_end) - Math.min(decency_start, decency_communication_start);

        price += (+count_step / +STEP) * +STEP_PRICE * (1 + +price_rank);

        let InterimPrice = price;

        // Считаем доп опции
        let additionsChecked = document.querySelectorAll(".additions:checked");
        if (additionsChecked.length !== 0) {
            document.querySelectorAll('.additions[data-prefix="1"]:checked').forEach(function (element) {
                price += +element.dataset.price;
            });

            let price_no_perc = +price; // Цена без процентов

            document.querySelectorAll('.additions[data-prefix="0"]:checked').forEach(function (element) {
                price += +(+price_no_perc * (+element.dataset.price / 100));
            });
        }

        let currency_rate = document.querySelector("#currency_usdt").value;

        // Promocode
        document.querySelector("#sale-promocode").textContent = Math.round(Number(price / +currency_rate));

        if (promocode_sum != 0 && +price >= +promocode_sum) {
            if (promocode_perc == 1) {
                price -= +price * (+promocode / 100);
            } else {
                price -= promocode;
            }
            document.querySelector(".calc-aside__total-sale").style.visibility = "visible";
        }
        // endpromocode

        let result_price = Number(price / +currency_rate).toFixed(2);
        let result_price_2 = Number(InterimPrice / +currency_rate).toFixed(2);

        if (currency_rate == 1) {
            result_price = Math.trunc(result_price);
            result_price_2 = Math.trunc(result_price_2);
        }

        document.querySelectorAll(".calculator-price-cs").forEach((element) => {
            element.textContent = result_price;
        });

        if (actionSale) {
            document.querySelectorAll(".calculator-sale-cs").forEach((element) => {
                element.textContent = result_price - actionSale;
            });
            if (document.querySelector(".total-price-fixed__sale")) {
                document.querySelector(".total-price-fixed__sale").style.visibility = "visible";
            }
        } else {
            if (document.querySelector(".total-price-fixed__sale")) {
                document.querySelector(".total-price-fixed__sale").style.visibility = "hidden";
            }
        }

        document.querySelector("#price_cs").value = result_price;
        document.querySelector("#price_clear_cs").value = result_price_2;

        if (document.querySelector(".calc-aside__result-price.total")) {
            document.querySelector(".calc-aside__result-price.total").textContent = result_price_2;
        }
    }

    function parseRangeLimits(string) {
        let result = [];
        if (string) {
            result = string.split(";").map((range) => {
                const rangeData = range.match(/-?\d+(\.\d+)?/g); //range.match(/\d+(\.\d+)?/g);
                return {
                    min: Number(rangeData[0]),
                    max: Math.abs(Number(rangeData[1])),
                    price: Number(rangeData[2]),
                    step: Number(rangeData[3]),
                };
            });
        }
        return result;
    }

    if (document.getElementById("map")) {
        document.getElementById("map").addEventListener("change", function () {
            document.querySelector(".calc-aside__map-name").innerHTML =
                this.parentElement.querySelector(".select__name").innerText;
            document
                .querySelector(".calc-aside__map-img")
                .setAttribute("src", mapsArray[this.parentElement.querySelector(".select__name").innerText].icon);
        });
    }

    function updateCustomPrice(min, max, constPrice = 0, range_data) {
        const rangePrice = getRangePrice(min, max, range_data); // + Number(constPrice);
        return rangePrice;
    }

    function getRangePrice(min, max, range_data) {
        let rangePrice = 0;
        for (let i = 0; i < range_data.length; i++) {
            if (min > range_data[i].max) {
                continue;
            }
            if (max > range_data[i].max) {
                rangePrice += (range_data[i].max - min) * range_data[i].price;
                if (range_data[i + 1]) {
                    min = range_data[i + 1].min;
                }
            } else {
                rangePrice += (max - min) * range_data[i].price;
                break;
            }
        }
        return rangePrice;
    }

    document.querySelectorAll(".options").forEach(function (element) {
        element.addEventListener("change", function () {
            if (document.querySelector("#boost_slug").value == "decency") {
                calculatorDecency();
            } else {
                calculatorBoostMmr();
            }
            let optionsMain = document.querySelector("#options");
            if (optionsMain) {
                let price = +document.querySelector(".calculator-price-cs .result-price").textContent;
                let currency_symbol = document.querySelector("#currency_symbol").value;
                let currency_code = document.querySelector("#currency_code").value;
                optionsMain.innerHTML = "";
                let optionSelected = document.querySelectorAll(".options");
                optionSelected.forEach((item) => {
                    if (item.value) {
                        let temp = document.createElement("div");
                        temp.classList.add("calc-aside__result-item");
                        temp.innerHTML = `
                                <div class="calc-aside__result-label">
                                    ${item.options[item.selectedIndex].dataset.name}
                                </div>
                                <div class="calc-aside__result-price">
                                    ${currency_code == "UAH" ? (price * (item.options[item.selectedIndex].dataset.percent / 100)).toFixed(2) + " " + currency_symbol : currency_symbol + " " + (price * (item.options[item.selectedIndex].dataset.percent / 100)).toFixed(2)}
                                </div>
                            `;
                        optionsMain.appendChild(temp);
                    }
                });
            }
        });
    });

    document.querySelectorAll(".options").forEach(function (element) {
        if (document.querySelector("#boost_slug").value == "decency") {
            calculatorDecency();
        } else {
            calculatorBoostMmr();
        }
        let optionsMain = document.querySelector("#options");
        if (optionsMain) {
            let price = +document.querySelector(".calc-aside__result-price.total").textContent;
            optionsMain.innerHTML = "";
            let optionSelected = document.querySelectorAll(".options");
            let currency_symbol = document.querySelector("#currency_symbol").value;
            let currency_code = document.querySelector("#currency_code").value;
            optionSelected.forEach((item) => {
                if (item.value) {
                    let temp = document.createElement("div");
                    temp.classList.add("calc-aside__result-item");
                    temp.innerHTML = `
                            <div class="calc-aside__result-label">
                                ${item.options[item.selectedIndex].dataset.name}
                            </div>
                            <div class="calc-aside__result-price">
                                ${currency_code == "UAH" ? (price * (item.options[item.selectedIndex].dataset.percent / 100)).toFixed(2) + " " + currency_symbol : currency_symbol + " " + (price * (item.options[item.selectedIndex].dataset.percent / 100)).toFixed(2)}
                            </div>
                        `;
                    optionsMain.appendChild(temp);
                }
            });
        }
    });

    document.querySelectorAll(".additions").forEach(function (element) {
        element.addEventListener("change", function () {
            if (document.querySelector("#boost_slug").value == "decency") {
                calculatorDecency();
            } else {
                calculatorBoostMmr();
            }
        });
    });

    document.querySelectorAll(".additions-calibration").forEach(function (element) {
        element.addEventListener("change", function () {
            if (document.querySelector("#boost_slug").value == "lp") {
                calculatorLp();
            } else {
                calculatorCalibration();
            }
        });
    });

    document.querySelectorAll(".options").forEach(function (element) {
        element.addEventListener("change", function () {
            if (document.querySelector("#boost_slug").value == "decency") {
                calculatorDecency();
            } else {
                calculatorBoostMmr();
            }
        });
    });

    const fileInputArray = document.querySelectorAll(".file-input");

    if (fileInputArray.length) {
        fileInputArray.forEach((fileInput) => {
            const fileInputItem = fileInput.querySelector(".file-input__item"),
                fileInputLabel = fileInput.querySelector(".file-input__label");

            fileInputItem.addEventListener("change", (e) => {
                const fileName = e.target.files[0].name;

                fileInputLabel.textContent = fileName;
            });
        });
    }

    document.getElementById("open-chat")?.addEventListener("click", function (e) {
        e.target.parentNode.classList.toggle("active");
    });

    document.addEventListener("DOMContentLoaded", function () {
        let lastScrollTop = window.scrollY;
        const arrowBtn = document.querySelector(".btn.arrow.mob__hide");
        window.addEventListener("scroll", function () {
            let scrollTop = window.scrollY;
            if (scrollTop > lastScrollTop) {
                arrowBtn?.classList.add("show");
            } else {
                arrowBtn?.classList.remove("show");
            }
            lastScrollTop = scrollTop;
        });
        arrowBtn?.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    });

    selectInit2();
    spollers();
})();
