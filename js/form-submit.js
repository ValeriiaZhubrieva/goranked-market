document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector(".form")) {
        const csrfToken = document.querySelector("meta[name=csrf-token]")?.getAttribute("content");
        document.querySelectorAll(".form").forEach(form => {
            form.addEventListener("submit", function (e) {
                e.preventDefault();

                let form = e.target;
                let formData = new FormData(form);
                let data = new URLSearchParams([...formData]).toString();
                let paymentIndex = data.indexOf("&payment=");
                let windowReference;
                let payment = -1;
                let showQuantity = document.getElementById("show_quantity") ? +document.getElementById("show_quantity").value : null;

                if (paymentIndex !== -1) {
                    payment = parseInt(data.substr(paymentIndex + 9, 1));
                }

                if (payment === 5) {
                    windowReference = window.open();
                }

                document.querySelectorAll(".form-input").forEach(input => {
                    input.classList.remove("form-input--error");
                    input.removeAttribute("data-error");
                });

                if (document.querySelector(".calculator-mmr-end") && document.querySelector(".calculator-mmr-start")) {
                    let mmr =
                        +document.querySelector(".calculator-mmr-end").value -
                        +document.querySelector(".calculator-mmr-start").value;
                    let minMmrOrder = +document.getElementById("min_mmr_order").value;

                    if (showQuantity === 1 && mmr < minMmrOrder) {
                        let warning = document.getElementById("calculator_min_mmr_order");
                        warning.style.display = "block";
                        setTimeout(() => warning.style.display = "none", 10000);
                        return;
                    }
                }

                if (document.getElementById("min_sum_order")) {
                    let minSumOrder = +document.getElementById("min_sum_order").value;
                    let resultPriceElement = document.querySelector(".result-price");
                    if (resultPriceElement && +resultPriceElement.textContent < minSumOrder) {
                        let warning = document.getElementById("calculator_min_sum_order");
                        warning.style.display = "block";
                        setTimeout(() => warning.style.display = "none", 10000);
                        return;
                    }
                }

                fetch(form.action, {
                    method: form.method,
                    headers: {
                        "X-CSRF-Token": csrfToken
                    },
                    body: formData
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.type === "success") {
                            if (data.route) {
                                if (payment === 5) {
                                    windowReference.location = data.route;
                                    windowReference.focus();
                                } else {
                                    if (data.timeout) {
                                        setTimeout(() => window.location.href = data.route, data.timeout);
                                        return;
                                    }
                                    window.location.href = data.route;
                                }
                            }
                        }
                        if (payment === 5 && (data.type !== "success" || !data.route)) {
                            windowReference.close();
                        }
                        form.querySelector('button[type="submit"]').removeAttribute("disabled");
                    })
                    .catch(error => {
                        if (payment === 5) {
                            windowReference.close();
                        }
                        console.error("Error:", error);
                        form.querySelector('button[type="submit"]').removeAttribute("disabled");
                    });
            });
        })
    }
});