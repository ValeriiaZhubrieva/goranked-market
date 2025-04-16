$(document).ready(function () {
  scrollToBottom();

  const maxSize = 50 * 1024 * 1024;
  let selectedFiles = [];

  $('#fileInput').on('change', function (e) {
    const files = e.target.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const type = file.type;
      const size = file.size;

      if (!type.match('image.*') && !type.match('video.*')) {
        alert(`Файл "${file.name}" не є зображенням або відео.`);
        continue;
      }

      if (size > maxSize) {
        alert(`Файл "${file.name}" перевищує 50MB.`);
        continue;
      }

      // Зберігаємо у тимчасовий масив
      selectedFiles.push(file);

      // Вивід у preview
      const reader = new FileReader();
      reader.onload = function (event) {
        const wrapper = $('<div class="img-item">');
        const closeBtn = $('<button class="close">X</button>');

        let content;
        if (type.match('image.*')) {
          content = $('<img>', {
            src: event.target.result,
            alt: file.name
          });
        } else if (type.match('video.*')) {
          content = $('<video>', {
            src: event.target.result,
            controls: true,
            style: 'max-width: 100%; max-height: 200px;'
          });
        }

        closeBtn.on('click', function () {
          wrapper.remove();
          // Видаляємо файл з масиву
          selectedFiles = selectedFiles.filter(f => f !== file);
        });

        wrapper.append(closeBtn).append(content);
        $('#preview').append(wrapper);
      };
      reader.readAsDataURL(file);
    }

    // Скидаємо input, щоб можна було повторно вибрати ті ж файли
    $(this).val('');
  });

  $.ajaxSetup({
    headers: { 'X-CSRF-Token': $('meta[name=csrf-token]').attr('content') }
  });
  // Отправить сообщение
  $('#chat').submit(function (e) {
    e.preventDefault();
    let data = new FormData($(this).get(0));
    let form = $(this);

    selectedFiles.forEach(file => {
      data.append('files[]', file);
    });

    if (data.get('body') == '' && data.get('files[]') == '') {
      return;
    }

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
          $('.chatblock__messages').append(data.message);
          scrollToBottom();
          form.find('input[name="body"]').val('');
          $('#warning-alert').hide();
          $('#preview').html('');
          selectedFiles = [];
          $('#fileInput').val('');
        } else {
          $('#warning-alert').show();
          $('#warning-alert').find('.title').text(data.message);
          scrollToBottom();
          setTimeout(function () {
            $('#warning-alert').hide();
          }, 7500);
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
var auth_id = $('meta[name="auth_id"]').attr('content');
const messagesContainer = $(".chatblock__messages");
channel.bind("messaging", function (data) {
  let order_id = $("input[name='order_id']").val();
  if (data.from_id != auth_id && order_id == data.order_id) {
    $('.chatblock__messages').append(data.message);
    scrollToBottom();
  }
  if (data.order && data.order.id == order_id) {
    $('#chat').find('input[name="to_id"]').val(data.order.user_id == auth_id ? data.order.booster_id : data.order.user_id);
    $('#order-status').html(data.status);
    if (data.order.status_id == 3) {
      $('#chat').find('button').removeAttr('disabled');
      $('#chat').find('input').removeAttr('disabled');
    } else {
      $('#chat').find('button').attr('disabled', 'disabled');
      $('#chat').find('input').attr('disabled', 'disabled');
    }
  }
});

function makeSeen() {
  let order_id = $('input[name="order_id"]').val();
  if (!order_id) {
    return;
  }
  $.ajax({
    url: '/chat/ajax/makeSeen/' + order_id,
    method: "POST",
    data: {
      _token: $('meta[name=csrf-token]').attr('content')
    },
    success: data => {
      $('#order-' + order_id + ' .count').html(0);
      if ($('#count-new-messages')) {
        $('#count-new-messages').text(data.notSeen)
        if (data.countNewMessages > 0) {
          $('#count-new-messages').parent().addClass('new-message');
        } else {
          $('#count-new-messages').parent().removeClass('new-message');
        }
      }
      if (data.countNewMessages > 0) {
        $('.new-messages').show()
        $('.new-messages').find('span').text(data.countNewMessages)
      } else {
        $('.new-messages').hide()
      }
    }
  });
}

/**
 *-------------------------------------------------------------
 * Set Active status
 *-------------------------------------------------------------
 */
function setActiveStatus(status, user_id) {
  $.ajax({
    url: "/chat/ajax/setActiveStatus",
    method: "POST",
    data: { user_id: user_id, status: status },
    dataType: "JSON",
    success: (data) => {
      // Nothing to do
    },
    error: () => {
      console.error("Server error, check your response");
    },
  });
}

// Скролл в низ по умолчанию
messagesContainer.scrollTop(messagesContainer.prop('scrollHeight'));

// Ajax функция подгрузки
function loadMore(page, order) {
  let block = $(".chatblock__messages");
  block.addClass('load');
  block.removeClass('end');

  $.ajax({
    type: 'get',
    url: '/chat/ajax/getMessage/' + order,
    data: {
      page: page
    },
    success: function (data) {
      if (data == '' || !data.messages) return block.addClass('end');
      block.prepend(data.messages);
      block.data('page', +page + 1);
      block.removeClass('load');
    },
    error: function (xhr) {
      if (xhr.responseJSON.errors) {
        let errors = '';
        for (var key in xhr.responseJSON.errors) {
          errors += xhr.responseJSON.errors[key];
        }
        alert(errors);
        // notify_('error', errors);
      }
      console.log(xhr.responseJSON.errors);
    }
  });
}

function scrollToBottom() {
  makeSeen();
  $('.chatblock__messages').animate({ scrollTop: $('.chatblock__messages').prop("scrollHeight") }, 10);
}