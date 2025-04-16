$(document).ready(function () {
  $.ajaxSetup({
    headers: { 'X-CSRF-Token': $('meta[name=csrf-token]').attr('content') }
  });
  // Уведомления
  // var notify_ = function (type, msg) {
  // 	let modal = $('.m__wrapper[data-modal="'+ type +'"]');
  // 	modal.find('.text').text(msg);
  // 	modal.addClass('active');
  // };

  // Отправить сообщение
  $('#chat_manager').submit(function (e) {
    e.preventDefault();
    var data = new FormData($(this).get(0)),
      form = $(this);

    $.ajax({
      type: $(this).attr('method'),
      url: $(this).attr('action'),
      contentType: false,
      processData: false,
      data: data,
      beforeSend: function (xhr) {
        form.find('button[type="submit"]').attr('disabled', 'disabled');
      },
      success: function (data) {
        form.find('button[type="submit"]').removeAttr('disabled');
        if (data.type === 'success') {
          form.find('.chat-track').append(data.message);
          scrollToBottom();
          form.find('input, textarea').each(function (i, e) {
            $(this).val('');
          });

        } else {
          alert(data.msg);

          if (data.route) {
            setTimeout(function () {
              return window.location.href = data.route;
            }, 1500);
          }
        }

      },
      error: function (xhr) {
        form.find('button[type="submit"]').removeAttr('disabled');
        if (xhr.responseJSON.errors) {
          let errors = '';
          for (var key in xhr.responseJSON.errors) {
            errors += xhr.responseJSON.errors[key];
          }
          alert(errors);
        }
        console.log(xhr.responseJSON.errors);
      }

    });
  });


});

// subscribe to the channel
var channel = pusher.subscribe("private-chatify");
const messagesContainer = $(".chat-manager .chat-track");
var auth_id = $('meta[name="auth_id"]').attr('content');
channel.bind("messaging-manager", function (data) {
  if (data.user_id == auth_id) {
    $('.chat-manager .chat-track').append(data.message);
    scrollToBottom();
    if (!$('.chat-manager .chat-open').hasClass('chat--active')) {
      $('.chat-manager #chat__count').text(data.seen).removeClass('hidden');
      $('.chat-manager .chat__close').removeClass('chat__close_gray');
    }
  }
});

// listen to seen event
channel.bind("client-seen", function (data) {
  if (data.from_id == getMessengerId() && data.to_id == auth_id) {
    if (data.seen == true) {
      $(".message-time")
        .append(`<svg
              width="11"
              height="9"
              viewBox="0 0 11 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3.43573 7.19363L9.63521 0.768778C9.82405 0.573063 10.1405 0.563124 10.3419 0.746578C10.521 0.909647 10.549 1.17063 10.4204 1.36407L10.3648 1.43312L3.80333 8.23312C3.62866 8.41414 3.34667 8.43523 3.14702 8.2957L3.07639 8.23585L0.137853 5.23717C-0.0525441 5.04288 -0.0447525 4.73543 0.155256 4.55047C0.333042 4.38607 0.602859 4.37378 0.794346 4.50954L0.862149 4.56738L3.43573 7.19363L9.63521 0.768778L3.43573 7.19363Z"
                fill="#141619" />
            </svg>`);

      console.info("[seen] triggered!");
    } else {
      console.error("[seen] event not triggered!");
    }
  }
});

// function makeSeen(status, order) {
//   if (document?.hidden) {
//     return;
//   }

//   // remove unseen counter for the user from the contacts list
//   // $(".messenger-list-item[data-contact=" + getMessengerId() + "]")
//   //   .find("tr>td>b")
//   //   .remove();
//   // seen
//   $.ajax({
//     url: '/chat/ajax/makeSeen/'+order,
//     method: "POST",
//     data: { 
//       _token: $('meta[name=csrf-token]').attr('content'),
//       order: order
//     },
//     dataType: "JSON",
//     success: data => {
//         $('#chat_'+order+'_count').addClass('hidden').text(0);
//         $('.chat__close[data-order="'+order+'"]').addClass('chat__close_gray');
//         console.log("[seen] Messages seen - " + order);
//     }
//   });
//   return channel.trigger("client-seen", {
//     from_id: auth_id, // Me
//     order_id: order,
//     // to_id: getMessengerId(), // Messenger
//     seen: status,
//   });
// }


// /**
//  *-------------------------------------------------------------
//  * Set Active status
//  *-------------------------------------------------------------
//  */
// function setActiveStatus(status, user_id) {
//   $.ajax({
//     url: "/chat/ajax/setActiveStatus",
//     method: "POST",
//     data: { user_id: user_id, status: status },
//     dataType: "JSON",
//     success: (data) => {
//       // Nothing to do
//     },
//     error: () => {
//       console.error("Server error, check your response");
//     },
//   });
// }

// Скролл в низ по умолчанию
messagesContainer.scrollTop(messagesContainer.prop('scrollHeight'));

messagesContainer.scroll(function () {
  let position = $(this).offset().top,
    position_user = $(this).scrollTop();

  if (position_user >= (position - 200)) {
    if ($(this).hasClass('load')) return false;
    else {
      loadMore(button.data('page'), $(this).data('order'));
      makeSeen(true, $(this).data('order'));
    }
  }
});




// Ajax функция подгрузки
// function loadMore(page, order) {
// 	let block = $(".chat-track");
// 	block.addClass('load');
// 	block.removeClass('end');

// 	$.ajax({
// 		type: 'get',
//         url: '/chat/ajax/getMessage/'+order,
//         data: {
//         	page: page
//         },
// 		success: function(data) {			
// 			if(data == '' || !data.messages) return block.addClass('end');
// 			block.prepend(data.messages);
// 			block.data('page', +page + 1);
// 			block.removeClass('load');
// 		},
// 		error: function(xhr){
// 			if(xhr.responseJSON.errors) {	
// 				let errors = '';
// 				for (var key in xhr.responseJSON.errors) {
// 					errors += xhr.responseJSON.errors[key];
// 				}
//         alert(errors);
// 				// notify_('error', errors);
// 			}
// 			console.log(xhr.responseJSON.errors);
// 		}
// 	});
// }


function scrollToBottom() {
  $('.chat-manager .chat-track').animate({ scrollTop: $('.chat-manager .chat-track').prop("scrollHeight") }, 10);
}