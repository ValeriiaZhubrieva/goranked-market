if (document.querySelector('.chatblock__back')) {
    document.querySelector('.chatblock__back').addEventListener("click", function () {
        if (document.querySelector('.chatblock').classList.contains('open-blockchat'))
            document.querySelector('.chatblock').classList.remove('open-blockchat');
        else {
            document.querySelector('.chatblock').classList.add('open-blockchat');
        }
    });
}