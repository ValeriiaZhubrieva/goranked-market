$(document).ready(function () {

  if ($('.calculator-result__button')) {
    $('.calculator-result__button').removeAttr('disabled')
  }

  if ($('.submit-btn')) {
    $('.submit-btn').removeAttr('disabled')
  }

  if ($('.total-price-fixed__btn')) {
    $('.total-price-fixed__btn').removeAttr('disabled')
  }

  // Alert
  function notify(type, msg) {
    // Error = 1
    // Success = 2
    // Warning = 3
    $(".popup").removeClass("popup--active");
    $(".text-alert").removeClass("text-show");

    if (type == 1) type = ".title-error";
    else if (3) type = ".title-success";
    else type = ".title-warning";

    $(type).addClass("text-show");
    $("#popup-alert-text").text(msg);

    $(".popup-alert").addClass("popup--active");

    return false;
  }
  // Конец alert

  // Подтверждение
  const confirmation = {
    confirm: async (message) => createConfirm(message),
  };

  const createConfirm = (message) => {
    return new Promise((complete, failed) => {
      $(".btn-success").off("click");
      $(".btn-danger").off("click");

      $(".btn-success").on("click", () => {
        $(".popup-confirm").removeClass("popup--active");
        complete(true);
      });
      $(".btn-danger").on("click", () => {
        $(".popup-confirm").removeClass("popup--active");
        complete(false);
      });

      $(".popup-confirm").addClass("popup--active");
      $(".confirm-text").html(message);
    });
  };

  $(document).on("click", ".confirm-popup-close", function (e) {
    e.preventDefault();
    $(this).closest(".popup").removeClass("popup--active");
  });
  // Конец подтверждения

  $(document).on("click", ".popup-close", function (e) {
    e.preventDefault();
    $(this).closest(".popup").removeClass("popup--active");
  });

  // if($('.select--search').length != 0) {
  // 	$('.select--search .select__content').prepend('<div class="select__item select__item--search"><input type="text" class="select__item-search" placeholder="Поиск"></div>');
  // }

  // $(document).on('click', '.select__item-search', function(e){
  // 	e.preventDefault();
  // });

  // Добавить CSRF токен ко всем запросам
  $.ajaxSetup({
    headers: { "X-CSRF-Token": $("meta[name=csrf-token]").attr("content") },
  });

  $(document).on("change", "#select_boost", function () {
    location.href = $(this).val();
  });

  $(document).on("click", ".open-sendpuls", function (e) {
    e.preventDefault();
  });

  // Добавить таймер
  $(document).on("click", ".time-block-button", function () {
    let count = $(".time-block").length,
      html = `<div class="time-block">
                       <div class="time-block__wrapper">
                           <input class="time-block__input" placeholder="00:00" type="time" name="times[${count}]">
                           <input class="time-block__input" placeholder="00:00" type="time" name="times[${count}]">
                       </div>
                   </div>`;
    $(".time-block-wrapper").prepend(html);
  });

  $(document).on("click", "#promocode_use", function () {
    let promocode = $("#promocode"),
      btn = $(this);

    btn.closest(".fast-form").removeClass("error");
    btn.closest(".fast-form").removeAttr("data-error");

    if (btn.hasClass("fast-form__input_active")) return false;

    if (promocode.val() == "") return false;

    $.ajax({
      type: "post",
      url: "/promocode/use",
      data: {
        code: promocode.val(),
      },
      success: function (data) {
        if (data.type == "success") location.reload();
        else {
          btn.closest(".fast-form").addClass("error");
          btn.closest(".fast-form").attr("data-error", data.msg);
        }

        promocode.val("");
      },
      error: function (xhr) {
        btn.closest(".fast-form").addClass("fast-form--error");
        btn.closest(".fast-form").data("error", "Error 500");
        console.log(xhr.responseJSON.errors);
      },
    });
  });

  $(document).on("click", ".order-ready", function () {
    let order = $(this).data("order");

    $.ajax({
      type: "post",
      url: "/order/ready",
      data: {
        order_id: order,
      },
      success: function (data) { },
      error: function (xhr) {
        console.log(xhr.responseJSON.errors);
      },
    });
  });

  $(document).on("click", ".tabs-nav__item", function () {
    $(".tabs-nav__item").removeClass("tabs-nav__item--active");

    $(this).addClass("tabs-nav__item--active");

    $(".stats-mouth, .stats-week").hide();
    $(".stats-" + $(this).data("date")).show();
  });

  // Wiki
  $(document).on("click", ".wiki-link", function (e) {
    e.preventDefault();

    let wiki_id = $(this).data("block");

    $(".wiki-link").removeClass("nav-item--active");

    $(this).addClass("nav-item--active");

    $(".main-content__hidden").removeClass("active");

    $("#wiki_" + wiki_id).addClass("active");
  });

  // Взять заказ
  $(document).on("click", ".take-order", async function () {
    let href = $(this).data("href"),
      btn = $(this),
      id = btn.data("id");

    $(".popup__title-take").show();
    $(".popup__title-confirm").hide();
    if (
      (await confirmation.confirm(
        btn.closest(".order-table__row").find(".order-item__description").html()
      )) == false
    )
      return false;

    // if(!confirm('Вы действительно хотите взять в работу заказ №'+id))
    // 	return false;

    if (btn.hasClass("load")) return false;

    $.ajax({
      type: "post",
      url: href,
      // data: data,
      beforeSend: function (xhr) {
        btn.addClass("load");
      },
      success: function (data) {
        if (data.type == "success") {
          // alert(data.msg);
          notify(2, data.msg);
          if (data.route) {
            if (data.timeout) {
              setTimeout(function () {
                return (window.location.href = data.route);
              }, data.timeout);
              return true;
            }
            return (window.location.href = data.route);
          }
        } else {
          if (data.remove) btn.remove();
          notify(1, data.msg);

          // alert(data.msg);
        }
        btn.removeClass("load");
      },
      error: function (xhr) {
        if (xhr.responseJSON.errors) {
          for (var key in xhr.responseJSON.errors) {
            $('input[name="' + key + '"]').after(
              '<p class="form-part-msg">' +
              xhr.responseJSON.errors[key] +
              "</p>"
            );
          }
        }
        btn.removeClass("load");
        console.log(xhr.responseJSON.errors);
      },
    });
  });

  // Куки
  $(document).on("click", ".cookie-close", function () {
    document.cookie = "cookie_modal=1; max-age=604800";
  });

  // Postpayment

  $(document).on("submit", ".form-postpayment", function (e) {
    e.preventDefault();

    $(".form-input").removeClass("form-input--error");
    $(".form-input").removeAttr("data-error");

    $(".personages-inps").remove();

    let form = $(this);

    if ($('.heroes-grid__wrapper[data-state="pick"]').length != 0) {
      $('.heroes-grid__wrapper[data-state="pick"]')
        .find(".heroes-grid__item")
        .each(function (i, e) {
          form.append(
            '<input type="hidden" name="allowed[]" class="personages-inps" value="' +
            $(this).data("heroe-name") +
            '">'
          );
        });
    }

    if ($('.heroes-grid__wrapper[data-state="ban"]').length != 0) {
      $('.heroes-grid__wrapper[data-state="ban"]')
        .find(".heroes-grid__item")
        .each(function (i, e) {
          form.append(
            '<input type="hidden" name="bans[]" class="personages-inps" value="' +
            $(this).data("heroe-name") +
            '">'
          );
        });
    }

    let data = $(this).serialize();

    $.ajax({
      type: $(this).attr("method"),
      url: $(this).attr("action"),
      data: data,
      beforeSend: function (xhr) {
        form.find('button[type="submit"]').attr("disabled", "disabled");
      },
      success: function (data) {
        console.log(data);
        if (data.type == "success") {
          if (data.route) {
            if (data.timeout) {
              setTimeout(function () {
                return (window.location.href = data.route);
              }, data.timeout);
              return true;
            }
            return (window.location.href = data.route);
          }
        } else {
          // alert(data.msg);
          notify(1, data.msg);
        }
        form.find('button[type="submit"]').removeAttr("disabled");
      },
      error: function (xhr) {
        console.log(xhr);

        if (xhr.responseJSON.errors) {
          let scroll = false;

          for (var key in xhr.responseJSON.errors) {
            $('input[name="' + key + '"], textarea[name="' + key + '"]')
              .closest(".form-input")
              .addClass("form-input--error");
            $('input[name="' + key + '"], textarea[name="' + key + '"]')
              .closest(".form-input")
              .data("error", xhr.responseJSON.errors[key]);

            if (!scroll) {
              $("html, body").animate(
                {
                  scrollTop: $(
                    'input[name="' + key + '"], textarea[name="' + key + '"]'
                  ).offset().top,
                },
                1000
              );
            }

            scroll = true;

            // $('input[name="'+key+'"]').after('<p class="form-part-msg">'+xhr.responseJSON.errors[key]+'</p>');
          }
        }
        form.find('button[type="submit"]').removeAttr("disabled");
        console.log(xhr.responseJSON.errors);
      },
    });
  });

  //
  $(document).on("click", ".btn_close_order", function (e) {
    // e.preventDefault();
    // let btn = $(this),
    // 	href = btn.data('href');
    // btn.removeClass('load');
    // $.ajax({
    // 	type: 'post',
    //           url: href,
    //           // data: data,
    //           beforeSend : function( xhr ) {
    //           	btn.addClass('load');
    // 	},
    // 	success: function(data) {
    // 		if (data.type == 'success') {
    // 			if(data.route) {
    // 				alert('Заказ закрыт');
    // 				// if(data.timeout) {
    // 				// 	setTimeout(function(){
    // 				// 		return window.location.href = data.route;
    // 				// 	}, data.timeout);
    // 				// 	return true;
    // 				// }
    // 				return window.location.href = data.route;
    // 			}
    // 		} else {
    // 			alert(data.msg);
    // 		}
    // 		btn.removeClass('load');
    // 	},
    // 	error: function(xhr){
    // 		alert('Возникли проблемы');
    // 		// if(xhr.responseJSON.errors) {
    // 		// 	for (var key in xhr.responseJSON.errors) {
    // 		// 		$('input[name="'+key+'"]').after('<p class="form-part-msg">'+xhr.responseJSON.errors[key]+'</p>');
    // 		// 	}
    // 		// }
    // 		btn.removeClass('load');
    // 		console.log(xhr.responseJSON.errors);
    // 	}
    // });
  });

  /**************Калькуляторы*************/
  // Калькулятор отмыва порядочности
  $(document).on(
    "change",
    ".additions-decency, .calculator-decency-start, .calculator-decency-end, .calculator-decency-communication-start, .calculator-decency-communication-end, #rank_user",
    function () {
      calculatorDecency();
    }
  );

  if ($(".calculator-decency-start").length > 0) calculatorDecency();

  function calculatorDecency() {
    let decency_start = $(".calculator-decency-start").val(), //Текущая вежливость
      decency_end = $(".calculator-decency-end").val(), // Желаемая вежливость
      decency_communication_start = $(
        ".calculator-decency-communication-start"
      ).val(), // Текущая порядочность
      decency_communication_end = $(
        ".calculator-decency-communication-end"
      ).val(), // Желаемая порядочность
      price_rank = RANKS_PERC[$("#rank_user").val()],
      price = 0,
      count_step = 0;

    count_step =
      Math.max(decency_end, decency_communication_end) -
      Math.min(decency_start, decency_communication_start);

    price += (+count_step / +STEP) * +STEP_PRICE * (1 + +price_rank);

    $('#price_clear').val(price);

    // Считаем доп опции
    if ($(".additions-decency:checked").length != 0) {
      $('.additions-decency[data-prefix="1"]:checked').each(function (i, e) {
        price += +$(this).data("price");
      });

      price_no_perc = +price; // Цена без процентов

      $('.additions-decency[data-prefix="0"]:checked').each(function (i, e) {
        price += +(+price_no_perc * (+$(this).data("price") / 100));
      });
    }

    let currency_rate = $('#currency_usdt').val();

    // Promocode
    if (+price >= +promocode_sum) {
      $(".calculator-sale").text(Number(price / +currency_rate).toFixed(2));

      if (promocode_perc == 1) price -= +price * (+promocode / 100);
      else price -= promocode;
    }
    // endpromocode

    let result_price = Number(price / +currency_rate).toFixed(2);

    if (currency_rate == 1) result_price = Math.trunc(result_price);

    $(".calculator-price").text(result_price);

    $('#price2').val(result_price);
  }

  // Калькулятор LP
  $(document).on("change", ".additions-lp, #calculator-lp-games", function () {
    calculatorLp();
  });

  if ($("#calculator-lp-games").length > 0) calculatorLp();

  function calculatorLp() {
    let games = $("#calculator-lp-games").val(),
      price = 0;

    price += +games * +gamesArray[games];

    $('#price_clear').val(price);

    // Считаем доп опции
    if ($(".additions-lp:checked").length != 0) {
      $('.additions-lp[data-prefix="1"]:checked').each(function (i, e) {
        price += +$(this).data("price");
      });

      price_no_perc = +price; // Цена без процентов

      $('.additions-lp[data-prefix="0"]:checked').each(function (i, e) {
        price += +(+price_no_perc * (+$(this).data("price") / 100));
      });
    }

    let currency_rate = $('#currency_usdt').val();

    // Promocode
    if (+price >= +promocode_sum) {
      $(".calculator-sale").text(Number(price / +currency_rate).toFixed(2));

      if (promocode_perc == 1) price -= +price * (+promocode / 100);
      else price -= promocode;
    }
    // endpromocode

    let result_price = Number(price / +currency_rate).toFixed(2);

    if (currency_rate == 1) result_price = Math.trunc(result_price);

    $(".calculator-price").text(result_price);

    $('#price2').val(result_price);
    // $('.calculator-price').text(Math.trunc(Number(price / +CURRENCY_RATE).toFixed(2)));
  }

  // Калькулятор калибровка
  $(document).on(
    "change",
    ".additions-calibration, .calculator-calibration-slider, #calculator-calibration-rank",
    function () {
      calculatorCalibration();
    }
  );

  if ($(".calculator-calibration-slider").length > 0) calculatorCalibration();

  function calculatorCalibration() {
    let mmr = $(".calculator-calibration-slider").val(),
      rank = $("#calculator-calibration-rank").val(),
      price = 0,
      result = +mmr * +mmr_game,
      id;

    for (var key in rankArray) {
      if (rankArray[key].id == rank) {
        price = rankArray[key].price;
        result = rankArray[key].value;
        id = rankArray[key].id;
        break;
      }
    }

    for (var key in rankArray) {
      if (id == 36) {
        result = {
          name: "immortal-1",
          icon: "/storage/upload/icons/dHcKpn7E0SkWSGjqfdwUJMg9Lbh5YwyYcYIFkeQv.png",
        };
        break;
      }

      if (rankArray[key].value > result) {
        result = {
          name: key,
          icon: rankArray[key].icon,
        };
        break;
      }
    }

    price *= +mmr;

    $('#price_clear').val(price);

    // Считаем доп опции
    if ($(".additions-calibration:checked").length != 0) {
      $('.additions-calibration[data-prefix="1"]:checked').each(function (
        i,
        e
      ) {
        price += +$(this).data("price");
      });

      price_no_perc = +price; // Цена без процентов

      $('.additions-calibration[data-prefix="0"]:checked').each(function (
        i,
        e
      ) {
        price += +(+price_no_perc * (+$(this).data("price") / 100));
      });
    }

    $(".calculator-calibration-result .rank-item__name").text(result.name);
    $(".calculator-calibration-result").css(
      "--bg-name",
      "url('" + result.icon + "')"
    );

    let currency_rate = $('#currency_usdt').val();

    // Promocode
    if (+price >= +promocode_sum) {
      $(".calculator-sale").text(Number(price / +currency_rate).toFixed(2));

      if (promocode_perc == 1) price -= +price * (+promocode / 100);
      else price -= promocode;
    }
    // endpromocode

    let result_price = Number(price / +currency_rate).toFixed(2);

    if (currency_rate == 1) result_price = Math.trunc(result_price);

    $(".calculator-price").text(result_price);

    $('#price2').val(result_price);

    // $('.calculator-price').text(Math.trunc(Number(price / +CURRENCY_RATE).toFixed(2)));
  }

  $(document).on(
    "change",
    ".additions, .calculator-mmr-start, .calculator-mmr-end",
    function () {
      calculatorBoostMmr();
    }
  );

  if ($(".calculator-mmr-start").length > 0) calculatorBoostMmr();

  // Калькуляор бустов ммр
  function calculatorBoostMmr() {
    let start_mmr = $(".calculator-mmr-start").val(),
      end_mmr = $(".calculator-mmr-end").val(),
      min = parseInt(start_mmr),
      max = parseInt(end_mmr),
      price = 0;

    $("#diapason_price").val(start_mmr + "-" + end_mmr);

    // Считаем диапазон
    price = +updateCustomPrice(
      min,
      max,
      price,
      parseRangeLimits($("#diapason_price").data("range"))
    ).toFixed(2);

    $('#price_clear').val(price);

    // Считаем доп опции
    if ($(".additions:checked").length != 0) {
      $('.additions[data-prefix="1"]:checked').each(function (i, e) {
        price += +$(this).data("price");
      });

      price_no_perc = +price; // Цена без процентов

      $('.additions[data-prefix="0"]:checked').each(function (i, e) {
        price += +(+price_no_perc * (+$(this).data("price") / 100));
      });
    }

    let currency_rate = $('#currency_usdt').val();

    // Promocode
    if (+price >= +promocode_sum) {
      $(".calculator-sale").text(Number(price / +currency_rate).toFixed(2));

      if (promocode_perc == 1) price -= +price * (+promocode / 100);
      else price -= promocode;
    }
    // endpromocode

    let result_price = Number(price / +currency_rate).toFixed(2);

    if (currency_rate == 1) result_price = Math.trunc(result_price);

    $(".calculator-price").text(result_price);

    $('#price2').val(result_price);

    // $('.calculator-price').text(Math.trunc(Number(price / +CURRENCY_RATE).toFixed(2)));
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
        min = range_data[i + 1].min;
      } else {
        rangePrice += (max - min) * range_data[i].price;
        break;
      }
    }
    return rangePrice;
  }

  // Отправка кода на почту
  $(document).on("click", "#checkout_email", function () {
    let email = $("#email").val(),
      btn = $(this);

    $(".form-input").removeClass("form-input--error");
    $(".form-input").removeAttr("data-error");

    if (btn.hasClass("load")) return false;

    $.ajax({
      type: "post",
      url: "/send-code",
      data: {
        email: email,
        _token: $('input[name="_token"]').val(),
      },
      beforeSend: function (xhr) {
        btn.addClass("load");
      },
      success: function (data) {
        window.location.reload();
      },
      error: function (xhr) {
        if (xhr.responseJSON.errors) {
          for (var key in xhr.responseJSON.errors) {
            $('input[name="' + key + '"]')
              .closest(".form-input")
              .addClass("form-input--error");
            $('input[name="' + key + '"]')
              .closest(".form-input")
              .attr("data-error", xhr.responseJSON.errors[key]);
          }
        }
        btn.removeClass("load");
        console.log(xhr.responseJSON.errors);
      },
    });
  });

  $(document).on("keyup", ".code-1, .code-2, .code-3, .code-4", function (e) {
    let error = false;
    if (
      $(".code-1").val() == "" ||
      $(".code-2").val() == "" ||
      $(".code-3").val() == "" ||
      $(".code-4").val() == ""
    )
      error = true;

    if (!error) {
      $.ajax({
        type: "post",
        url: "/verification-code",
        data: {
          code:
            $(".code-1").val() +
            $(".code-2").val() +
            $(".code-3").val() +
            $(".code-4").val(),
          _token: $('input[name="_token"]').val(),
        },
        success: function (data) {
          if (data.type == "success") {
            if (data.route) {
              if (data.timeout) {
                setTimeout(function () {
                  return (window.location.href = data.route);
                }, data.timeout);
                return true;
              }
              return (window.location.href = data.route);
            }
          } else {
            $(".code-1, .code-2, .code-3, .code-4")
              .closest(".form-input")
              .addClass("form-input--error");
            $(".code-1, .code-2, .code-3, .code-4")
              .closest(".form-input")
              .attr("data-error", data.msg);
            // alert();
          }
        },
        error: function (xhr) {
          if (xhr.responseJSON.errors) {
            for (var key in xhr.responseJSON.errors) {
              $('input[name="' + key + '"]').after(
                '<p class="form-part-msg">' +
                xhr.responseJSON.errors[key] +
                "</p>"
              );
            }
          }
          console.log(xhr.responseJSON.errors);
        },
      });
    }
  });

  /**************Калькуляторы конец*************/

  // Отправка форм AJAX
  // $(".form").submit(function (e) {
  //   e.preventDefault();
  //   let form = $(this);
  //   let data = form.serialize();
  //   let payment = data.indexOf("&payment=");
  //   let windowReference;
  //   if (payment !== -1) {
  //     payment = parseInt(data.substr(payment + 9, 1));
  //   }
  //   if (payment === 5) {
  //     windowReference = window.open();
  //   }

  //   $(".form-input").removeClass("form-input--error");
  //   $(".form-input").removeAttr("data-error");
  //   // $(document).find('.form-part-msg').remove();

  //   let mmr =
  //     +$(".calculator-mmr-end").val() - +$(".calculator-mmr-start").val();

  //   let minSumOrder = +$("#min_sum_order").val();
  //   let minMmrOrder = +$("#min_mmr_order").val();
  //   let showQuantity = +$("#show_quantity").val();
  //   let currencyUsdt = +$("#currency_usdt").val();

  //   if (showQuantity == 1) {
  //     if (mmr < minMmrOrder) {
  //       $("#calculator_min_mmr_order").show();
  //       setTimeout(function () {
  //         $("#calculator_min_mmr_order").hide();
  //       }, 10000);
  //       return;
  //     } else {
  //       $("#calculator_min_mmr_order").hide();
  //     }
  //   }

  //   if (document.querySelector('html').getAttribute('lang') == 'en') {
  //     minSumOrder = minSumOrder / currencyUsdt;
  //   }

  //   if (document.querySelector('.result-price')) {
  //     if (+document.querySelector('.result-price').textContent < minSumOrder) {
  //       $("#calculator_min_sum_order").show();
  //       setTimeout(function () {
  //         $("#calculator_min_sum_order").hide();
  //       }, 10000);
  //       return;
  //     } else {
  //       $("#calculator_min_sum_order").hide();
  //     }
  //   }

  //   $.ajax({
  //     type: $(this).attr("method"),
  //     url: $(this).attr("action"),
  //     data: data,
  //     beforeSend: function (xhr) {
  //       form.find('button[type="submit"]').attr("disabled", "disabled");
  //     },
  //     success: function (data) {
  //       if (data.type == "success") {
  //         if (data.route) {
  //           if (payment === 5) {
  //             windowReference.location = data.route;
  //             windowReference.focus();
  //             /*setTimeout(() => {
  //                     window.open(data.route, '_blank').focus();
  //                           });*/
  //           } else {
  //             if (data.timeout) {
  //               setTimeout(function () {
  //                 return (window.location.href = data.route);
  //               }, data.timeout);
  //               return true;
  //             }
  //             return (window.location.href = data.route);
  //           }
  //         }
  //       }
  //       if (payment === 5 && (data.type != "success" || !data.route)) {
  //         windowReference.close();
  //       }
  //       form.find('button[type="submit"]').removeAttr("disabled");
  //     },
  //     error: function (xhr) {
  //       if (payment === 5) {
  //         windowReference.close();
  //       }
  //       if (xhr.responseJSON.errors) {
  //         for (var key in xhr.responseJSON.errors) {
  //           $('input[name="' + key + '"]')
  //             .closest(".form-input")
  //             .addClass("form-input--error");
  //           $('input[name="' + key + '"]')
  //             .closest(".form-input")
  //             .data("error", xhr.responseJSON.errors[key]);

  //           // $('input[name="'+key+'"]').after('<p class="form-part-msg">'+xhr.responseJSON.errors[key]+'</p>');
  //         }
  //       }
  //       form.find('button[type="submit"]').removeAttr("disabled");
  //       console.log(xhr.responseJSON.errors);
  //     },
  //   });
  // });

  $(".form-has-file").submit(async function (e) {
    e.preventDefault();
    var data = new FormData($(this).get(0)),
      form = $(this);

    $(".form-input").removeClass("form-input--error");
    $(".form-input").removeClass("form-file--error");
    $(".form-input").removeAttr("data-error");

    if (form.hasClass("form-confirm")) {
      $(".popup__title-take").hide();
      $(".popup__title-confirm").show();
      if ((await confirmation.confirm(form.data("confirm"))) == false)
        return false;
    }

    form
      .find('button[type="submit"], input[type="submit"]')
      .attr("disabled", "disabled");
    $.ajax({
      type: $(this).attr("method"),
      url: $(this).attr("action"),
      contentType: false,
      processData: false,
      data: data,
      beforeSend: function (xhr) {
        form
          .find('button[type="submit"], input[type="submit"]')
          .attr("disabled", "disabled");
      },
      success: function (data) {
        form.find('button[type="submit"]').removeAttr("disabled");
        if (data.type == "success") {
          if (data.route) return (window.location.href = data.route);
          // notify_(data.type, data.msg);
          // alert(data.msg);
          notify(2, data.msg);

          form.find("input").each(function (i, e) {
            $(this).val("");
          });

          // $('.popup').removeClass('popup--active');
        } else {
          // notify_(data.type, data.msg);
          // alert(data.msg);
          notify(1, data.msg);
        }
        // $('.popup').removeClass('popup--active')

        $('.popup-success').addClass('popup--active');

        form
          .find('button[type="submit"], input[type="submit"]')
          .removeAttr("disabled");
      },
      error: function (xhr) {
        form.find('button[type="submit"]').removeAttr("disabled");
        for (var key in xhr.responseJSON.errors) {
          if (form.find('input[name="' + key + '"]').attr("type") != "file") {
            form
              .find('input[name="' + key + '"]')
              .closest(".form-input")
              .addClass("form-input--error");
            form
              .find('input[name="' + key + '"]')
              .closest(".form-input")
              .attr("data-error", xhr.responseJSON.errors[key]);
          } else {
            form
              .find('input[name="' + key + '"]')
              .closest(".form-input")
              .addClass("form-file--error");
            form
              .find('input[name="' + key + '"]')
              .closest(".form-input")
              .attr("data-error", xhr.responseJSON.errors[key]);
          }

          // $('input[name="'+key+'"]').after('<p class="form-part-msg">'+xhr.responseJSON.errors[key]+'</p>');
        }
        // if(xhr.responseJSON.errors) {
        // 	$('.m__wrapper ').removeClass('active');
        // 	let errors = '';
        // 	for (var key in xhr.responseJSON.errors) {
        // 		errors += xhr.responseJSON.errors[key];
        // 	}
        // 	alert(errors);
        // 	// notify_('error', errors);
        // }

        form
          .find('button[type="submit"], input[type="submit"]')
          .removeAttr("disabled");
      },
    });
  });

  $(document).on("change", "#avatar", function () {
    var file = $(this),
      data = new FormData();

    if (file.prop("files").length == 0) return false;

    data.append("avatar", file.prop("files")[0]);

    $.ajax({
      type: "post",
      url: "/profile/update/avatar",
      contentType: false,
      processData: false,
      data: data,
      beforeSend: function (xhr) {
        console.log("Отправляем");
      },
      success: function (data) {
        if (data.type == "success") {
          if (data.route) return (window.location.href = data.route);
          // notify_(data.type, data.msg);
          // alert(data.msg);
          notify(2, data.msg);
        } else {
          // notify_(data.type, data.msg);
          // alert(data.msg);
          notify(1, data.msg);
        }
      },
      error: function (xhr) {
        if (xhr.responseJSON.errors) {
          $(".m__wrapper ").removeClass("active");
          let errors = "";
          for (var key in xhr.responseJSON.errors) {
            errors += xhr.responseJSON.errors[key];
          }
          // alert(errors);
          notify(1, errors);

          // notify_('error', errors);
        }

        console.log(xhr.responseJSON.errors);
      },
    });
  });

  // Копировать в буфер
  $(document).on("click", ".copy-link", function (e) {
    e.preventDefault();
    let btn = $(this),
      btn_text = btn.text(),
      tmp = $("<textarea>");

    $("body").append(tmp);
    tmp.val(btn.data("text")).select();
    document.execCommand("copy");
    tmp.remove();

    btn.text("Скопійовано");

    if (btn.hasClass("copy-code")) usedSteam_Code(btn.data("order"));

    setTimeout(function () {
      btn.text(btn_text);
    }, 400);
  });

  // if($('#card').length > 0)
  // $('#card').mask('9999-9999-9999-9999');

  function copytext(text) {
    var $tmp = $("<textarea>");
    $("body").append($tmp);
    $tmp.val(text).select();
    document.execCommand("copy");
    $tmp.remove();
  }

  function usedSteam_Code(order) {
    $.ajax({
      type: "post",
      url: "/order/steam-code/use",
      data: {
        order_id: order,
        _token: $('input[name="_token"]').val(),
      },
      success: function (data) { },
      error: function (xhr) { },
    });
  }

  function closeTimeChat(obj) {
    setTimeout(function () {
      obj.removeClass("chat--active");
    }, 300000);

    return true;
  }

  $(document).on("click", ".open-chat", function (e) {
    e.preventDefault();
    let order_id = $(this).data("order");
    $('.chat-open[data-order="' + order_id + '"]')
      .closest(".chat__header")
      .click();

    closeTimeChat(
      $('.chat-open[data-order="' + order_id + '"]').closest(".chat")
    );
  });

  $(document).on("click", ".chat-open-manager", function () {
    $(".chat-manager .chat__header").click();

    closeTimeChat($(".chat-manager"));
  });

  // $(document).on('click', '.chat-open', function(){
  // 	let chat = $(this).closest('.chat');
  // 	$('.chat').removeClass('chat--active');
  // 	$('.chats-wrapper').prepend(chat);
  // });

  // Открыть чат клиент менеджер
  //   $(document).on('click', '.open-chat-manager', function(e){
  // // e.preventDefault();
  // // console.log('OPEN MANAGER CHAT');
  // // $('.popup').removeClass('popup--active');
  // // $('.chat-manager .chat__header').click();
  //   });

  $(".chat__header").click(function () {
    let chat = $(this).closest(".chat");

    $(".chat-menu")
      .not($(this).closest(".chat-menu"))
      .removeClass("chat--active");
    $(this).closest(".chat-menu").toggleClass("chat--active");

    if (!$(this).hasClass("chat__header--mob"))
      $(".chats-wrapper").append(chat);

    closeTimeChat(chat);

    // let mob = $(this).closest('.chat-menu').find('.chat-open');
    // if(mob.length > 0) {
    // 	$('.chat-track[data-order="'+mob.data('order')+'"]').closest('.chat-menu').toggleClass('chat--active');
    // }
  });

  // $(document).on('click', '.chat-mobile-open', function(){
  // 	let order_id = $(this).data('order');
  // 	$('.chat-open[data-order="'+order_id+'"]').closest('.chat__header').click();
  // });

  $(document).on("change", ".file-input__item", function (e) {
    let name = e.target.files[0].name,
      order = $(this).data("order");
    $(this)
      .closest("label")
      .find('.file-input__label[data-order="' + order + '"]')
      .text(name);
    // $(this).closest('.file-input').find('.file-input__label').text(name);
  });

  // if($('.range-slider__range').length > 0)
  // $('.js-range-from-input').val($('.js-range-from-input').val()).change();

  if (!Push.Permission.has()) {
    Push.Permission.request(
      function () {
        return false;
      },
      function () {
        return false;
      }
    );
  }

  ion.sound({
    sounds: [
      {
        name: "button_tiny",
        // preload: false
        volume: 0.6,
      },
    ],

    // main config
    path: "/assets/audio/sounds/",
    preload: true,
    multiplay: true,
  });

  // Пуш уведомления
  function pushNotify(title, msg) {
    if (!Push.Permission.has()) return false;

    ion.sound.play("button_tiny");
    Push.create(title, {
      body: msg,
      icon: LOGO_IMG,
      timeout: 4000,
      onClick: function () {
        window.focus();
        this.close();
      },
    });
  }

  if (typeof pusher !== 'undefined') {
    var channelNotify = pusher.subscribe("notify");
    channelNotify.bind("send", function (data) {
      if (data.user) {
        if (
          $('meta[name="auth_id"]').length > 0 &&
          $('meta[name="auth_id"]').attr("content") == data.user
        ) {
          pushNotify(data.title, data.msg);
        }
      } else {
        pushNotify(data.title, data.msg);
      }
    });
  }
  // Конец пуш уведомлений

  // Якорь
  $(".anchor").on("click", function (e) {
    e.preventDefault();
    var el = $(this);
    var dest = el.attr("href"); // получаем направление
    if (dest !== undefined && dest !== "") {
      // проверяем существование
      $("html").animate(
        {
          scrollTop: $(dest).offset().top, // прокручиваем страницу к требуемому элементу
        },
        500 // скорость прокрутки
      );
    }
    return false;
  });

  // Мониторинг
  $(document).on("click", "#monitoring_btn, .monitoring_filter", function () {
    let search = $("#monitoring_search").val(),
      status = $(".monitoring_filter.tabs-nav__item--active").data("status"),
      btn = $("#monitoring_btn");

    if ($(this).hasClass("monitoring_filter"))
      monitoring(null, status, btn, true);
    else monitoring(search, null, btn);
  });

  function monitoring(search = null, status = null, btn, filter = false) {
    if (btn.hasClass("load")) return false;
    let data = {};

    if (filter) {
      data["status"] = status;
    } else {
      data["search"] = search;
    }

    btn.addClass("load");

    $.ajax({
      type: "post",
      url: btn.data("url"),
      data: data,
      success: function (data) {
        console.log(data);
        if (data.type == "success") {
          $("#monitoring_order_list").html(data.orders);
          $("#monitoring_list").html(data.matches);
        } else {
          notify(1, data.msg);
        }
        btn.removeClass("load");
      },
      error: function (xhr) {
        if (xhr.responseJSON.errors) {
          $(".m__wrapper ").removeClass("active");
          let errors = "";
          for (var key in xhr.responseJSON.errors) {
            errors += xhr.responseJSON.errors[key];
          }
          // alert(errors);
          notify(1, errors);

          // notify_('error', errors);
        }
        btn.removeClass("load");
      },
    });
  }

  // Ajax функция подгрузки
  function loadMore(page) {
    let button = $("#loadmore");
    button.addClass("load");
    button.removeClass("end").show();

    $.ajax({
      type: "post",
      url: button.data("url"),
      data: {
        page: page,
      },
      success: function (data) {
        if (data == "") return button.addClass("end").hide();

        button.before(data);
        // $('.list-paginate').append(data);
        button.data("page", +page + 1);
        button.removeClass("load");
      },
      error: function (xhr) {
        console.log(xhr);
      },
    });
  }

  // Бесконечная прокрутка
  $("#loadmore").on("click", function () {
    loadMore($(this).data("page"));
  });

  $(window).scroll(function () {
    let button = $("#loadmore");
    if (button.length) {
      if (button.hasClass("end")) return false;
      let position = button.offset().top,
        position_user = $(window).scrollTop();

      if (position_user >= position - 200) {
        if (button.hasClass("load")) return false;
        else loadMore(button.data("page"));
      }
    }
  });

  $(document).on("change", "#contact", function () {
    $("#contact_value").attr(
      "placeholder",
      $(this).val() === "phone" ? "+380" : "@goranked"
    );
  });
});

$(".btn.toggle").click(function () {
  $(".btn.social").toggleClass("active");
});

$(".btn.arrow").click(function () {
  $("html, body").animate({
    scrollTop: $("html, body").offset().top,
  });
});

$(window).on("scroll", function () {
  if ($(window).scrollTop() >= 500) {
    $(".btn.arrow").addClass("show");
  } else {
    $(".btn.arrow").removeClass("show");
  }
});

$(".confirm-search-booster").click(function () {
  let id = $(this).data("order");
  $(".popup-confirm-search-" + id).addClass("popup--active");
});

$(".reject-search-booster").click(function () {
  let id = $(this).data("order");
  $(".popup-reject-search-" + id).addClass("popup--active");
});

$(document).ready(function () {

  $("#matchStore").on("click", function (event) {
    $(".mmr_double_bet").hide();
    event.preventDefault();
    let el = $(this);
    let form = $(this).parents("form:first");
    let data = $(form)
      .serializeArray()
      .reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
      }, {});
  
    if (
      Math.abs(+data.mmr_end - +data.mmr_start) < +data.mmr_double_bet &&
      data.double_game == 1
    ) {
      $(".mmr_double_bet").show();
      setTimeout(function () {
        $(".mmr_double_bet").hide();
      }, 10000);
      return;
    }
  
    if (data.limit_count_mmr != null && Math.abs(+data.mmr_end - +data.mmr_start) > +data.limit_count_mmr) {
      $(".limit_count_mmr").show();
      setTimeout(function () {
        $(".limit_count_mmr").hide();
      }, 10000);
      return;
    }
  
    if (data.game_id != 1 && !data.win) {
      return;
    }
  
    el.prop("disabled", true);
    form.submit();
  });

  $('.form-switch__item').on("click", function () {
    $(this).parent('.form__win').find('input[type="radio"]').removeAttr('checked')
    $(this).find('input[type="radio"]').attr('checked', 'checked')
  })

  $("#withdrawalOrder").on("click", function (event) {
    $(".minimal_withdrawal").hide();
    event.preventDefault();
    let el = $(this);
    let form = $(this).parents("form:first");
    let data = $(form)
      .serializeArray()
      .reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
      }, {});

    if (data.pay_type == "card") {
      data.sum = +data.sum_card;
      if (+data.sum < data.minimal_withdrawal) {
        $(".minimal_withdrawal").show();
        setTimeout(function () {
          $(".minimal_withdrawal").hide();
        }, 10000);
        return;
      }
    }
    if (data.pay_type == "cripto") {
      data.sum = +data.sum_cripto;
      if (+data.sum * data.currency_usdt < data.minimal_withdrawal) {
        $(".minimal_withdrawal").show();
        setTimeout(function () {
          $(".minimal_withdrawal").hide();
        }, 10000);
        return;
      }
    }
    el.prop("disabled", true);
    form.submit();
  });

  $(".ready-slider .next").click(function () {
    let img = $(".ready-slider .ready-slide-img.active");

    img.removeClass("active");
    img.next().addClass("active");

    if (img.hasClass("zoom")) {
      img.removeClass("zoom");
      img.addClass("zoom-in");
    }

    let text = $(".ready-slider .ready-slide-text.active");
    text.removeClass("active");
    text.next().addClass("active");

    let paginate = $(".ready-slider .paginate-item.active");
    paginate.removeClass("active");
    paginate.next().addClass("active");
  });

  $(".ready-slider .back").click(function () {
    let img = $(".ready-slider .ready-slide-img.active");

    img.removeClass("active");
    img.prev().addClass("active");

    if (img.hasClass("zoom-in")) {
      img.removeClass("zoom-in");
      img.addClass("zoom");
    }

    let text = $(".ready-slider .ready-slide-text.active");
    text.removeClass("active");
    text.prev().addClass("active");

    let paginate = $(".ready-slider .paginate-item.active");
    paginate.removeClass("active");
    paginate.prev().addClass("active");
  });

  $(".ready-slider .close").click(function () {
    localStorage.setItem("popup_ready", true);
    $(".popup-ready").removeClass("popup--active");
  });

  $(".confirm-search").click(function () {
    let id = $(this).parents("form:first").find('input[name="id"]').val();
    $.ajax({
      type: "post",
      url: "/order/confirm-search-booster/" + id,
      success: function () {
        window.location.reload();
      },
      error: function (xhr) {
        console.log(xhr);
      },
    });
  });
  $(".reject-search").click(function () {
    let id = $(this).parents("form:first").find('input[name="id"]').val();
    $.ajax({
      type: "post",
      url: "/order/reject-search-booster/" + id,
      success: function () {
        window.location.reload();
      },
      error: function (xhr) {
        console.log(xhr);
      },
    });
  });

  $(".pay-type .type-button").click(function () {
    let type = $(this).data("type");
    $('input[name="pay_type"]').val(type);
    $(".pay-type .type-button").removeClass("active");
    $(this).addClass("active");
    $(".pay-type-form").removeClass("active");
    $(".exchange__block").removeClass("active");
    $("#pay-" + type).addClass("active");
    $("#exchange-" + type).addClass("active");
  });

  $("input[name=sum]").on("change paste keyup", function () {
    let commissionCardWithdrawal = +$(
      "input[name=commission_card_withdrawal]"
    ).val();
    let commissionCriptoWithdrawal = +$(
      "input[name=commission_cripto_withdrawal]"
    ).val();
    let currencyUsd = +$("input[name=currency_usdt]").val();
    let sum = +$("input[name=sum]").val();

    if (sum) {
      $("#exchange-card .send .exchange-value").text(sum + " Грн");
      $("#exchange-cripto .send .exchange-value").text(sum + " Грн");
      let resCard = (sum - (sum / 100) * commissionCardWithdrawal).toFixed(2);
      let resCripto = (
        sum / currencyUsd -
        (sum / currencyUsd / 100) * commissionCriptoWithdrawal
      ).toFixed(2);
      $("#exchange-card .get .exchange-value").text(resCard + " Грн");
      $("#exchange-cripto .get .exchange-value").text(resCripto + " USDT");
      $("input[name=sum_card]").val(resCard);
      $("input[name=sum_cripto]").val(resCripto);
    } else {
      $("#exchange-card .send .exchange-value").text("0 Грн");
      $("#exchange-cripto .send .exchange-value").text("0 Грн");
      $("#exchange-card .get .exchange-value").text("0 Грн");
      $("#exchange-cripto .get .exchange-value").text("0 USDT");
    }
  });
});

const marquee = document.querySelector('.header__promo-title');
if (marquee) {
  function updateMarqueeSpeed() {
    const textWidth = marquee.offsetWidth;
    const speed = textWidth / 50;
    marquee.style.animation = `marquee ${speed}s linear infinite`;
    marquee.style.visibility = 'visible';
  }
  updateMarqueeSpeed();
  window.addEventListener('resize', updateMarqueeSpeed);
}
