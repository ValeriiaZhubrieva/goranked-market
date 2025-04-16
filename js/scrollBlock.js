let addWindowScrollEvent = false;
function headerScroll() {
    addWindowScrollEvent = true;
    const scrollBlocks = document.querySelectorAll("[data-scroll-block]");
    if (scrollBlocks)
        scrollBlocks.forEach((header) => {
            const headerShow = header.hasAttribute("data-scroll-show");
            const startPoint = header.dataset.scroll ? header.dataset.scroll : 1;
            let scrollDirection = 0;
            let timer;
            document.addEventListener("windowScroll", function (e) {
                const scrollTop = window.scrollY;
                clearTimeout(timer);
                if (scrollTop >= startPoint) {
                    !header.classList.contains("_header-scroll") ? header.classList.add("_header-scroll") : null;
                    if (headerShow)
                        if (scrollTop > scrollDirection)
                            header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null;
                        else !header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
                } else {
                    header.classList.contains("_header-scroll") ? header.classList.remove("_header-scroll") : null;
                    if (headerShow)
                        header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null;
                }
                scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
            });
        });
}
headerScroll();
setTimeout(() => {
    if (addWindowScrollEvent) {
        let windowScroll = new Event("windowScroll");
        window.addEventListener("scroll", function (e) {
            document.dispatchEvent(windowScroll);
        });
    }
}, 0);
//====================================================================================================
document.addEventListener("DOMContentLoaded", () => {
    const totalElement = document.querySelector(".calc-aside__total");
    const fixedElement = document.querySelector(".total-price-fixed");
    if (!totalElement || !fixedElement) return;
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) fixedElement.classList.add("visible");
                else fixedElement.classList.remove("visible");
            });
        },
        {
            threshold: 0.1,
        }
    );
    observer.observe(totalElement);
    //====================================================================================================
    const totalPriceElement = document.querySelector(".animated-number");
    let totalPrice = 0; // Начальная цена

    // Функция анимации изменения числа
    const watchAndAnimateNumber = (element, from, to, duration = 500) => {
        let startTime = null;

        const step = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const currentValue = Math.floor(from + (to - from) * progress);
            element.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    };
    // watchAndAnimateNumber(totalPriceElement, previousPrice, totalPrice);
});
//====================================================================================================

