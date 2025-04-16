var channel = pusher.subscribe("private-notification");
var auth_id = $('meta[name="auth_id"]').attr('content');

const sound = new Howl({
    src: ['/assets/audio/notification.wav'],
    volume: 1.0
});

channel.bind("notification", function (data) {
    if (data.to_id != auth_id) {
        return;
    }
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
        if (data.from_id != auth_id) {
            sound.play();
        }
    } else {
        $('.new-messages').hide()
    }
    if (data.order_id) {
        $('#order-' + data.order_id + ' .count').html(data.notSeenOrder);
        if (data.notSeenOrder > 0) {
            $('#order-' + data.order_id + ' .chatblock__item').addClass('new-message');
        } else {
            $('#order-' + data.order_id + ' .chatblock__item').removeClass('new-message');
        }
    }
});

document.addEventListener('click', unlockAudio, { once: true });
document.addEventListener('keydown', unlockAudio, { once: true });
document.addEventListener('touchstart', unlockAudio, { once: true });
document.addEventListener('scroll', unlockAudio, { once: true });

function unlockAudio() {
    if (Howler.ctx.state === 'suspended') {
        Howler.ctx.resume().then(() => {
        }).catch(error => console.log("Ошибка разблокировки:", error));
    }
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('keydown', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
    document.removeEventListener('scroll', unlockAudio);
}