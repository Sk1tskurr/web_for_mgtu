// Функция для отображения анимации загрузки на 0,5 секунды
function showLoading() {
    const loadingDiv = document.getElementById('loading');
    loadingDiv.style.display = 'flex';
    setTimeout(function() {
        loadingDiv.style.display = 'none';
    }, 500); // Показываем анимацию 0,5 секунды
}

// Показываем анимацию при загрузке страницы
window.addEventListener('load', showLoading);

// Показываем анимацию при клике на любую кнопку
document.querySelectorAll('button').forEach(function(button) {
    button.addEventListener('click', function(event) {
        showLoading();
    });
});

// Показываем анимацию при переходе на новую страницу
document.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function(event) {
        event.preventDefault(); // Предотвращаем мгновенный переход
        showLoading();
        const href = this.href;
        setTimeout(function() {
            window.location.href = href; // Выполняем переход после отображения анимации
        }, 100); // Ждем окончания анимации
    });
});