const checkTargetOrKey = event => {
    if (
        event.target.classList.contains('popup__wrapper') ||
        event.key === 'Escape' ||
        event.target.closest('.popup-close')
    ) {
        hideAllPopups();
    }
};
const showPopup = popupId => {
    const popup = document.querySelector(popupId);
    if (!popup) return

    const pageWrapper = document.querySelector('.page-wrapper');

    hideAllPopups();

    popup.classList.add('popup--active');
    pageWrapper.classList.add('no-scroll');

    document.addEventListener('click', checkTargetOrKey);
    document.addEventListener('keyup', checkTargetOrKey);
};

const hideAllPopups = () => {
    const popups = document.querySelectorAll('.popup'),
        pageWrapper = document.querySelector('.page-wrapper');

    popups.forEach(popup => {
        popup.classList.remove('popup--active');
    });
    pageWrapper.classList.remove('no-scroll');

    document.removeEventListener('click', checkTargetOrKey);
    document.removeEventListener('keyup', checkTargetOrKey);
};

// const rankArray= {
//     "herald-1": {
//         value: 0,
//     },
//     "herald-2": {
//         value: 300,
//     },
//     "herald-3": {
//         value: 450,
//     },
//     "herald-4": {
//         value: 600,
//     },
//     "herald-5": {
//         value: 750,
//     },
//     "guardian-1": {
//         value: 900,
//     },
//     "guardian-2": {
//         value: 1050,
//     },
//     "guardian-3": {
//         value: 1200,
//     },
//     "guardian-4": {
//         value: 1350,
//     },
//     "guardian-5": {
//         value: 1500,
//     },
//     "crusader-1": {
//         value: 1750,
//     },
//     "crusader-2": {
//         value: 1900,
//     },
//     "crusader-3": {
//         value: 2050,
//     },
//     "crusader-4": {
//         value: 2200,
//     },
//     "crusader-5": {
//         value: 2400,
//     },
//     "archon-1": {
//         value: 2650,
//     },
//     "archon-2": {
//         value: 2800,
//     },
//     "archon-3": {
//         value: 2950,
//     },
//     "archon-4": {
//         value: 3050,
//     },
//     "archon-5": {
//         value: 3200,
//     },
//     "legend-1": {
//         value: 3350,
//     },
//     "legend-2": {
//         value: 3550,
//     },
//     "legend-3": {
//         value: 3750,
//     },
//     "legend-4": {
//         value: 3900,
//     },
//     "legend-5": {
//         value: 4050,
//     },
//     "ancient-1": {
//         value: 4250,
//     },
//     "ancient-2": {
//         value: 4400,
//     },
//     "ancient-3": {
//         value: 4650,
//     },
//     "ancient-4": {
//         value: 4800,
//     },
//     "ancient-5": {
//         value: 4950,
//     },
//     "divine-1": {
//         value: 5100,
//     },
//     "divine-2": {
//         value: 5350,
//     },
//     "divine-3": {
//         value: 5500,
//     },
//     "divine-4": {
//         value: 5650,
//     },
//     "divine-5": {
//         value: 5780,
//     },
//     "immortal-1": {
//         value: 6000,
//     },
// }

// const heroesArray = {
//     strength: ['alchemist','axe','bristleback','centaur','chaos_knight','doom_bringer','dragon_knight','earth_spirit','earthshaker','elder_titan','huskar','kunkka','legion_commander','life_stealer','night_stalker','ogre_magi','omniknight','pudge','slardar','spirit_breaker','sven','tidehunter','tiny','treant','tusk','underlord','undying','skeleton_king'],
//     agility:['antimage','arc_warden','bloodseeker','bounty_hunter','clinkz','drow_ranger','ember_spirit','faceless_void','gyrocopter','juggernaut','luna','medusa','meepo','monkey_king','morphling','naga_siren','phantom_assassin','phantom_lancer','razor','riki','nevermore','slark','sniper','spectre','templar_assassin','terrorblade','troll_warlord','ursa','viper','weaver'],
//     intelligence:['ancient_apparition','crystal_maiden','death_prophet','disruptor','enchantress','grimstroke','invoker','jakiro','keeper_of_the_light','leshrac','lich','lina','lion','furion','necrolyte','oracle','obsidian_destroyer','puck','pugna','queenofpain','rubick','shadow_demon','shadow_shaman','silencer','skywrath_mage','storm_spirit','tinker','warlock','witch_doctor','zuus'],
//     versatility:['abaddon','bane','batrider','beastmaster','brewmaster','broodmother','chen','rattletrap','dark_seer','dark_willow','dazzle','enigma','wisp','lone_druid','lycan','magnataur','mirana','nyx_assassin','pangolier','phoenix','sand_king','techies','shredder','vengefulspirit','venomancer','viper','visage','windrunner','winter_wyvern'],
// }

class Animations {
    constructor() {
        this.animationWrapperArray = document.querySelectorAll('.animation-wrapper');
    }

    toggleAnimation(animationWrapperElement) {
        const animationItemArray = animationWrapperElement.querySelectorAll('.animation-item');
        animationItemArray.forEach((animationItemElement, animationItemIndex) => {
            animationItemElement.style.animationDelay = `${animationItemIndex * 0.2}s`;
            animationItemElement.classList.add('animation-item--animated');
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.toggleAnimation(entry.target);
            }
        });
    }

    init() {
        if (!this.animationWrapperArray.length) return;

        const observer = new IntersectionObserver(this.handleIntersection.bind(this));
        this.animationWrapperArray.forEach(animationWrapper => {
            observer.observe(animationWrapper);
        });
    }
}

const selectInit = () => {
    const selectArray = document.querySelectorAll('.dota .custom-select');

    if (selectArray.length > 0) {
        selectArray.forEach((element, index) => {
            const selectTag = element.querySelector('select'),
                selectOption = selectTag.querySelectorAll('option');
            const selectWrapper = document.createElement('div'),
                selectLabel = document.createElement('div'),
                selectItemList = document.createElement('div'),
                selectLabelSpan = document.createElement('span'),
                selectLabelArea = document.createElement('span');

            selectWrapper.classList.add('select__wrapper');

            selectLabel.classList.add('select__label');
            selectLabelSpan.classList.add('select__name');
            selectLabelArea.classList.add('select__area');

            selectLabelSpan.textContent = selectTag[selectTag.selectedIndex].textContent;
            if (selectTag[selectTag.selectedIndex].dataset.icon)
                element.style.setProperty('--bg-name', `url('${selectTag[selectTag.selectedIndex].dataset.icon}')`);

            selectLabel.append(selectLabelSpan);

            selectItemList.classList.add('select__content', 'select__content--hidden')

            selectWrapper.append(selectLabel);
            element.append(selectLabelArea);
            element.append(selectWrapper);

            selectOption.forEach((element, index) => {
                const selectItem = document.createElement('div');

                selectItem.classList.add('select__item');
                selectItem.textContent = element.textContent;

                // Check if the delegated event is triggered properly
                selectItem.addEventListener('click', (e) => {
                    const selectItemTag = e.target.closest('.select').querySelector('select'),
                        selectItemOptions = selectItemTag.querySelectorAll('option');

                    selectItemOptions.forEach((element, index) => {
                        if (element.textContent === selectItem.textContent) {
                            selectItemTag.selectedIndex = index;
                            selectLabelSpan.textContent = element.textContent;

                            // Trigger change event when selectIndex is changed
                            const event = new Event('change', { bubbles: true });
                            selectItemTag.dispatchEvent(event);
                        }
                    });

                    selectLabel.click();
                });

                selectItemList.append(selectItem);
            });

            selectWrapper.append(selectItemList);

            if (selectOption.length < 2) {
                element.classList.add('non-active');
                return false
            }

            // Check if the click event is properly handled
            selectLabelArea.addEventListener('click', (e) => {
                e.stopPropagation();

                closeAllSelect(selectLabel);
                window.innerHeight - selectItemList.getBoundingClientRect().bottom < 100 ? (selectItemList.classList.add('select__content--top'), selectLabel.classList.add('select__label--top')) : (selectItemList.classList.remove('select__content--top'), selectLabel.classList.remove('select__label--top'))

                selectItemList.classList.toggle('select__content--hidden');
                selectLabel.classList.toggle('select__label--active');
                element.classList.toggle('active');
            });

            selectTag.addEventListener('change', () => {
                const selectItemOptions = selectTag.options,
                    selectedItem = selectItemOptions[selectTag.selectedIndex];

                selectLabelSpan.textContent = selectedItem.textContent;
                element.style.setProperty('--bg-name', `url('${selectedItem.dataset.icon}')`);
            })
        });

        document.addEventListener('click', closeAllSelect);
    }
}

const closeAllSelect = (select) => {
    const selectContentArray = document.querySelectorAll('.select__content'),
        selectLabelArray = document.querySelectorAll('.select__label');
    const customSelect = document.querySelectorAll('.dota .custom-select');

    selectLabelArray.forEach((element, index) => {
        element !== select ? (element.classList.remove('select__label--active'), selectContentArray[index].classList.add('select__content--hidden'), customSelect[index].classList.remove('active')) : null;
    });
}


const findRank = (value) => {
    let hero = [];//null;
    for (const h in rankArray) {
        if (value >= rankArray[h].value) {
            hero['id'] = rankArray[h].id;
            hero['name'] = rankArray[h].name;
            hero['icon'] = rankArray[h].icon;
        } else {
            break;
        }
    }

    return hero;
}


document.addEventListener("DOMContentLoaded", () => {
    const heroesBlock = document.querySelector('.heroes');
    if (heroesBlock) {
        const heroesGridArray = heroesBlock.querySelectorAll('[data-attribute]');
        const heroesBanBlock = heroesBlock.querySelector('[data-state="ban"]'),
            heroesPickBlock = heroesBlock.querySelector('[data-state="pick"]');
        if (heroesGridArray.length) {
            const createBlock = (heroName) => {
                const heroesBlock = document.createElement('div'),
                    heroesImg = document.createElement('img');

                heroesBlock.classList.add('heroes-grid__item');
                heroesImg.classList.add('heroes-grid__img');

                heroesBlock.dataset.heroeName = heroName;
                // heroesImg.setAttribute('src', `${__path}/${heroName}.png`);
                heroesImg.setAttribute('src', '/storage/' + imgArray.get(heroName) + '?v=' + Math.floor(Math.random() * 100));

                heroesBlock.append(heroesImg);

                return heroesBlock
            }
            const drawBanPickList = () => {
                heroesBanBlock.innerHTML = '';
                heroesPickBlock.innerHTML = '';

                picArray.forEach(element => {
                    const newBlock = createBlock(element);
                    heroesPickBlock.append(newBlock);
                });
                banArray.forEach(element => {
                    const newBlock = createBlock(element);
                    heroesBanBlock.append(newBlock);
                });
            }

            const __path = '/storage/uploads/personages';
            let picArray = [],
                banArray = [];
            heroesGridArray.forEach(heroesGrid => {
                const heroesAttr = heroesGrid.dataset.attribute;
                const heroesNameArray = heroesArray[heroesAttr];
                heroesNameArray.forEach(heroName => {
                    const newBlock = createBlock(heroName);
                    let clickCounter = 0;
                    newBlock.addEventListener('click', (e) => {
                        e.preventDefault();

                        clickCounter += 1;

                        if (picArray.length > 5 && banArray.length > 5) {
                            clickCounter = 0;
                        }

                        if (clickCounter === 1) {
                            if (picArray.length < 5) {
                                newBlock.classList.add('heroes-grid__item--pick');
                                picArray.push(heroName);
                            }
                        } else if (clickCounter === 2) {
                            newBlock.classList.remove('heroes-grid__item--pick');
                            picArray = picArray.filter((element) => element !== heroName);

                            if (banArray.length < 5) {
                                newBlock.classList.add('heroes-grid__item--ban');
                                banArray.push(heroName);
                            }
                        }

                        if (clickCounter === 3) {
                            newBlock.classList.remove('heroes-grid__item--pick');
                            newBlock.classList.remove('heroes-grid__item--ban');
                            clickCounter = 0;

                            banArray = banArray.filter((element) => element !== heroName);
                        }

                        drawBanPickList();
                    });
                    heroesGrid.append(newBlock);
                });
            });
        }
    }

    // const timeBlockWrapper = document.querySelector('.time-block-wrapper');
    // if(timeBlockWrapper){
    //     const timeButton = timeBlockWrapper.querySelector('.time-block-button');
    //     timeButton.addEventListener('click',(e)=>{
    //        e.preventDefault();

    //        const timeBlockArray = [...timeBlockWrapper.querySelectorAll('.time-block')];
    //        if(timeBlockArray.length + 1 === 4) {
    //            timeButton.remove();
    //        }
    //        const lastBlock = timeBlockArray[timeBlockArray.length - 1];
    //        const clonedBlock = lastBlock.cloneNode(true);
    //        const clonedInputArray = clonedBlock.querySelectorAll('input');

    //        clonedInputArray.forEach((element,index)=>{
    //            element.name = `times[${$('.time-block').length}]`;
    //            // element.name = `times[${timeBlockArray.length * 2 + (index + 1)}]`;
    //        });

    //        lastBlock.after(clonedBlock);
    //     });
    // }

    const profileCardLink = document.querySelector('.profile-card-link');

    if (profileCardLink) {
        const profileCardList = document.querySelector('.profile-card-list');
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.profile-card')) {
                profileCardList.classList.remove('profile-card-list--active');
            }
        });

        profileCardLink.addEventListener('click', (e) => {
            e.preventDefault();
            profileCardList.classList.toggle('profile-card-list--active');
        });
    }

    const gameSelectCurrent = document.querySelector('.game-select__current');

    if (gameSelectCurrent) {
        const gameSelectList = document.querySelector('.game-select');
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.game-select')) {
                gameSelectList.classList.remove('game-select--active');
            }
        });

        gameSelectCurrent.addEventListener('click', (e) => {
            e.preventDefault();
            gameSelectList.classList.toggle('game-select--active');
        });
    }
    //animation init
    const animation = new Animations();
    animation.init();

    let marqueeLeft = new Swiper('.marquee-left', {
        spaceBetween: 16,
        centeredSlides: true,
        speed: 5000,
        autoplay: {
            delay: 1,
        },
        loop: true,
        slidesPerView: 'auto',
        allowTouchMove: false,
        disableOnInteraction: true,
        breakpoints: {
            600: {
                spaceBetween: 15
            }
        }
    });
    let marqueeRight = new Swiper('.marquee-right', {
        spaceBetween: 16,
        centeredSlides: true,
        speed: 5000,
        autoplay: {
            delay: 1,
            reverseDirection: true
        },
        loop: true,
        loopedSlides: 6,
        slidesPerView: 'auto',
        allowTouchMove: false,
        disableOnInteraction: true,
        breakpoints: {
            600: {
                spaceBetween: 15
            }
        }
    });

    const paymentSlider = new Swiper('.payment-slider', {
        spaceBetween: 16,
        slidesPerView: 1,
        autoHeight: true,
        effect: 'fade',
        speed: 500,
        navigation: {
            nextEl: '.payment-slider__button--next',
            prevEl: '.payment-slider__button--prev',
            disabledClass: 'payment-slider__button--disabled',
        }
    });

    var swiper2 = new Swiper(".hero-slider", {
        slidesPerView: 'auto',
        speed: 500,
        allowTouchMove: false,
        pagination: {
            el: '.swiper-pagination',
        },
        breakpoints: {
            1440: {
                allowTouchMove: true,
            }
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        on: {
            click: function (swiper, event) {
                const clickedSlide = swiper.target.closest('.swiper-slide');
                const activeSlide = clickedSlide.closest('.swiper').querySelector('.swiper-slide-active');
                if (clickedSlide !== activeSlide) {
                    activeSlide.classList.remove('swiper-slide-active');
                    clickedSlide.classList.add('swiper-slide-active');
                }
                const swiperSlides = document.querySelectorAll('.hero-slide');

                swiperSlides.forEach(element => {
                    element.style.transition = `0.3s width`;
                })
            },
            slideChange: function (event) {
                const currentSlideColor = swiper2.slides[swiper2.activeIndex].dataset.color;
                swiper2.navigation.nextEl.dataset.color = currentSlideColor;
                swiper2.navigation.prevEl.dataset.color = currentSlideColor;
            },
            init: function (swiper, event) {

            }
        }
    });

    // faq
    const faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length) {
        faqItems.forEach(faqItem => {
            const faqItemHeader = faqItem.querySelector('.faq-item__header');

            faqItemHeader.addEventListener("click", (e) => {
                e.preventDefault();

                faqItem.classList.toggle('faq-item--active');
            });
        });
    }

    // menu

    // const burger = document.querySelector('.burger'),
    //     mobileMenu = document.querySelector('.mobile-menu'),
    //     headerSupport = document.querySelector('.header__support');

    // burger.addEventListener('click', (e) => {
    //     e.preventDefault();

    //     mobileMenu.classList.toggle('mobile-menu--active');
    //     headerSupport.classList.toggle('header__support--active')
    //     burger.classList.toggle('burger--active');
    // });

    const navCatalogLink = document.querySelector('.nav-catalog-link');

    if (navCatalogLink) {
        const navCatalogBlock = document.querySelector('.nav-catalog-block');
        navCatalogLink.addEventListener('click', (e) => {
            e.preventDefault();

            navCatalogLink.classList.toggle('nav-catalog-link--active');
            navCatalogBlock.classList.toggle('nav-catalog-block--active');
        });
    }

    // без него ломается отображение вики
    const navListItemArray = document.querySelectorAll('.nav-list__item');

    navListItemArray.forEach(navListItem=>{
        const navSubList = navListItem.querySelector('.nav__sublist');

        if(navSubList){
            const asideBlock = document.querySelector('.aside__block');
            const navLink = navListItem.querySelector('.nav-item');
            const navBurger = asideBlock.querySelector('.nav-list__item--burger');
            navLink.classList.add('nav-item--sublist');

            document.addEventListener('click',(e)=>{
                if(!e.target.closest('.aside__block')){
                    asideBlock.classList.remove('aside__block--active');
                    navSubList.classList.remove('nav__sublist--active');
                }
            });

            navBurger.addEventListener('click',(e)=>{
                e.preventDefault();
                asideBlock.classList.toggle('aside__block--active');
            });

            navLink.addEventListener('click',(e)=>{
                e.preventDefault();
                asideBlock.classList.add('aside__block--active')
                navLink.classList.toggle('nav-item--sublist--active');
                navSubList.classList.toggle('nav__sublist--active');
            });
        }
    });

    // без этого не показывает условия по заказу для бустера
    const orderItemLinkArray = document.querySelectorAll('.order-item-link');

    orderItemLinkArray.forEach(orderItemLink=>{
        const  orderItemContent = orderItemLink.closest('.order-item').querySelector('.order-item-toggle');
        if(orderItemContent){
            orderItemLink.addEventListener('click',(e)=>{
                e.preventDefault();

                orderItemLink.classList.toggle('order-item-link--active');
                orderItemContent.classList.toggle('order-item-toggle--active');
            })
        }
    });

    // без єтого не ботает кнопка навигации в мобильной версии для бустера
    const nav = document.querySelector('.aside'),
        navBurger = document.querySelector('.nav-item--burger');
    if(nav && navBurger){
        navBurger.addEventListener('click',(e)=>{
        e.preventDefault();

        nav.classList.toggle('aside--active');
        navBurger.classList.toggle('nav-item--burger--active');

        });
    }


    const jsRankSelectArray = document.querySelectorAll('.js-rank-select');

    if (jsRankSelectArray.length) {
        jsRankSelectArray.forEach(select => {
            select.innerHTML = '';

            for (let rankArrayKey in rankArray) {
                const option = document.createElement('option');

                option.value = rankArray[rankArrayKey]['id'];//rankArrayKey;
                option.dataset.icon = rankArray[rankArrayKey]['icon'];
                option.text = rankArrayKey;

                select.append(option)
            }

            selectInit();
        });
    } else {
        selectInit();
    }


    const rangeControl = document.querySelectorAll('.range-control');

    if (rangeControl.length) {
        rangeControl.forEach(element => {
            const rangeButtonMinus = element.querySelector('.range-control__button--minus'),
                rangeButtonPlus = element.querySelector('.range-control__button--plus'),
                rangeControlValue = element.querySelector('.range-control__input');



            rangeButtonMinus.addEventListener('click', (e) => {
                e.preventDefault();

                if (rangeControlValue.value - 25 < 0) return
                rangeControlValue.value -= 25;

                const event = new Event('change', { bubbles: true });
                rangeControlValue.dispatchEvent(event);
            });
            rangeButtonPlus.addEventListener('click', (e) => {
                e.preventDefault();

                // console.log(+rangeControlValue.value, +rangeControlValue.max)
                if (+rangeControlValue.value + 25 > +rangeControlValue.max) return
                rangeControlValue.value = +rangeControlValue.value + 25;

                const event = new Event('change', { bubbles: true });
                rangeControlValue.dispatchEvent(event);
            });
        });
    }

    const rankItemArray = document.querySelectorAll('.rank-wrapper');

    if (rankItemArray.length) {
        rankItemArray.forEach(rankItem => {
            const rankItemInput = rankItem.querySelector('.rank-value'),
                rankItemLabel = rankItem.querySelector('.rank-item'),
                rankItemName = rankItem.querySelector('.rank-item__name');

            const inputValue = parseInt(rankItemInput.value);
            const newRank = findRank(inputValue);

            rankItemName.textContent = newRank['name'];
            rankItemLabel.style.setProperty('--bg-name', `url('${newRank['icon']}')`);

            rankItemInput.addEventListener('change', () => {
                const inputValue = parseInt(rankItemInput.value);
                const newRank = findRank(inputValue);
                rankItemName.textContent = newRank['name'];

                rankItemLabel.style.setProperty('--bg-name', `url('${newRank['icon']}')`);
            });
        });
    }

    const gamesItemArray = document.querySelectorAll('.game-item');

    if (gamesItemArray.length) {
        gamesItemArray.forEach(item => {
            const gameItemHeader = item.querySelector('.game-item-toggler'),
                gameItemContent = item.querySelector('.game-item__content');

            gameItemHeader.addEventListener('click', (e) => {
                e.preventDefault();

                gameItemContent.classList.toggle('game-item__content--active');
                gameItemHeader.classList.toggle('game-item-toggler--active');
            });
        });
    }

    const fileInputArray = document.querySelectorAll('.file-input');

    if (fileInputArray.length) {
        fileInputArray.forEach(fileInput => {
            const fileInputItem = fileInput.querySelector('.file-input__item'),
                fileInputLabel = fileInput.querySelector('.file-input__label');

            fileInputItem.addEventListener('change', (e) => {
                const fileName = e.target.files[0].name;

                fileInputLabel.textContent = fileName;
            });
        });
    }

    const popupButtons = document.querySelectorAll('[data-popup]');
    const popups = document.querySelectorAll('.popup');

    if (popups.length) {
        popupButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();

                const popupId = button.dataset.popup
                showPopup(popupId);
            });
        });
    }

    // const calculatorArray = document.querySelectorAll('.calculator-content');

    // if (calculatorArray.length) {
    //     calculatorArray.forEach(calculator => {
    //         calculator.addEventListener('submit', (e) => {
    //             e.preventDefault();

    //             showPopup(".popup-calculator");
    //         });
    //     });
    // }

    const rangeArray = document.querySelectorAll('.js-range');

    if (rangeArray.length > 0) {
        rangeArray.forEach(range => {
            const rangeElement = range.querySelector('.range-slider'),
                rangeMax = rangeElement.dataset.max,
                rangeMin = rangeElement.dataset.min,
                rangeInputMin = range.querySelector('.js-range-from-input'),
                rangeInputMax = range.querySelector('.js-range-to-input');
            const newEvent = new Event('change', { bubbles: true });
            if (rangeInputMin && rangeInputMax) {
                const rangeSliderElement = rangeSlider(rangeElement, {
                    min: rangeMin,
                    max: rangeMax,
                    step: 1,
                    // value: [rangeMin,rangeMax],
                    value: [rangeInputMin.value, rangeInputMax.value],
                    disabled: false,
                    rangeSlideDisabled: false,
                    thumbsDisabled: [false, false],
                    orientation: 'horizontal',
                    onInput: function (valueSet) {
                        rangeInputMin.value = valueSet[0];
                        rangeInputMax.value = valueSet[1];

                        rangeInputMin.dispatchEvent(newEvent);
                        rangeInputMax.dispatchEvent(newEvent);
                    },
                });

                rangeInputMin.addEventListener('change', () => {
                    rangeSliderElement.value([rangeInputMin.value, rangeInputMax.value])
                });
                rangeInputMax.addEventListener('change', () => {
                    rangeSliderElement.value([rangeInputMin.value, rangeInputMax.value])
                });

                // rangeInputMax.dispatchEvent(newEvent);
                // rangeInputMin.dispatchEvent(newEvent);
            } else {
                const rangeSliderElement = rangeSlider(rangeElement, {
                    min: rangeMin,
                    max: rangeMax,
                    step: 1,
                    value: [0, rangeInputMax.value],
                    // value: rangeMin,
                    disabled: false,
                    rangeSlideDisabled: false,
                    thumbsDisabled: [true, false],
                    orientation: 'horizontal',
                    onInput: function (valueSet) {
                        rangeInputMax.value = valueSet[1];

                        rangeInputMax.dispatchEvent(newEvent);
                    },
                });

                rangeInputMax.addEventListener('change', () => {
                    rangeSliderElement.value([0, rangeInputMax.value])
                });

                rangeInputMax.dispatchEvent(newEvent);
            }
        });
    }

    const monitoringBlock = document.querySelectorAll('.js-monitoring');

    if (monitoringBlock.length) {
        monitoringBlock.forEach(element => {
            const monitoringButton = element.querySelector('.js-monitoring-button'),
                monitoringWrapper = element.querySelector('.js-monitoring-wrapper');

            if (monitoringButton && monitoringWrapper) {
                monitoringButton.addEventListener('click', (e) => {
                    e.preventDefault();

                    monitoringWrapper.classList.toggle('js-monitoring-wrapper--active');
                });
            }

        })
    }

    const languageSelect = document.querySelectorAll('.language-select');

    if (languageSelect.length) {
        languageSelect.forEach(element => {
            const languageSelectLink = element.querySelector('.language-select__current'),
                languageSelectList = element.querySelector('.language-select__list');

            languageSelectLink.addEventListener('click', (e) => {
                e.preventDefault();
                languageSelectList.classList.toggle('language-select__list--active');
            });
        });
    }

    const tipArray = document.querySelectorAll('.tip')

    tipArray.forEach(tip => {
        const tipLabel = tip.querySelector('.tip-content');
        const tipLabelContent = tip.querySelector('.calculator-checkbox__label');

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        let tipOffset = tip.getBoundingClientRect().left;

        if (tipLabelContent) {
            tipOffset = tipLabelContent.getBoundingClientRect().left - 8;
        }

        tip.style.setProperty('--left-offset', `${-(tipOffset)}px`);
    });

    const cookie = document.querySelector('.cookie');

    if (cookie) {
        const cookieClose = cookie.querySelectorAll('.cookie-close');

        cookieClose.forEach(close => {
            close.addEventListener('click', (e) => {
                e.preventDefault();

                cookie.classList.add('cookie--hidden');
            });
        });
    }


    const inputElements = [...document.querySelectorAll('input.code-input')]

    inputElements.forEach((ele, index) => {
        ele.addEventListener('keydown', (e) => {

            if (e.keyCode === 8 && e.target.value === '') inputElements[Math.max(0, index - 1)].focus()
        })
        ele.addEventListener('input', (e) => {

            const [first, ...rest] = e.target.value
            e.target.value = first ?? '';
            const lastInputBox = index === inputElements.length - 1
            const didInsertContent = first !== undefined
            if (didInsertContent && !lastInputBox) {
                inputElements[index + 1].focus()
                inputElements[index + 1].value = rest.join('')
                inputElements[index + 1].dispatchEvent(new Event('input'))
            }
        })
    })
});

function initSliders() {
    const resizableSwiper = (
        breakpoint,
        swiperClass,
        swiperSettings,
        callback
    ) => {
        if (document.querySelector(swiperClass)) {
            let swiper;
            breakpoint = window.matchMedia(breakpoint);
            const enableSwiper = function (className, settings) {
                swiper = new Swiper(className, settings);
            };
            const checker = function () {
                if (breakpoint.matches)
                    return enableSwiper(swiperClass, swiperSettings);
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
        modules: [Navigation],
        observer: true,
        observeParents: true,
        slidesPerView: 2.5,
        spaceBetween: 16,
        speed: 800,
        navigation: {
            prevEl: ".increase-rating__arrows .swiper-button-prev",
            nextEl: ".increase-rating__arrows .swiper-button-next",
        },
        breakpoints: {
            649.98: {
                slidesPerView: 1,
                spaceBetween: 10,
            },
            767.98: {
                slidesPerView: 1.4,
                spaceBetween: 10,
            },
            991.98: {
                slidesPerView: 2,
                spaceBetween: 10,
            },
            1267.98: {
                slidesPerView: 2.5,
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
    if (targetElement.closest(".header__support-btn")) {
        bodyUnlock();
        document.documentElement.classList.remove("menu-open");
        document.documentElement.classList.toggle("open-support");
    }
    if (!targetElement.closest(".header__support-btn"))
        document.documentElement.classList.remove("open-support");
});
