
   // СКРИПТ СЧЕТЧИКА СТРОК И КОПИРОВАНИЯ
// Пути к вашим файлам на GitHub
    const qrurl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data="
    const siteUrl = "https://raw.githubusercontent.com/kwazers/config/refs/heads/main/";
    const configUrls = {
        finland: `${siteUrl}finland-config.txt`,
        russia: `${siteUrl}russia-config.txt`,
        netherlands: `${siteUrl}netherlands-config.txt`,
        germany: `${siteUrl}germany-config.txt`,
        poland: `${siteUrl}poland-config.txt`,
        tiktok: `${siteUrl}tiktok-config.txt`
};
const countryNames = {
    finland: "🇫🇮 Финляндия",
    russia: "🇷🇺 Россия",
    netherlands: "🇳🇱 Нидерланды",
    germany: "🇩🇪 Германия",
    poland: "🇵🇱 Польша",
    tiktok: "🎵 TikTok"
};

    async function countConfigs(url, elementId) {
        try {
            // Генерируем обычный хвост-штамп времени (например, ?update=1719830400123)
            // GitHub разрешает такие параметры, и они на 100% сбивают кэш без CORS-ошибок
            const noCacheUrl = url + '?update=' + new Date().getTime();

    // Запрашиваем файл без жестких No-Store заголовков, чтобы сервер не ругался
    const response = await fetch(noCacheUrl);
    if (!response.ok) throw new Error();
    const text = await response.text();

    // Разбиваем текст файла на массив строк
    const lines = text.split('\n');

            // Считаем вообще любые строки, которые не пустые и не начинаются с #
            const count = lines.filter(line => {
                const trimmed = line.trim();
                return trimmed.length > 0 && !trimmed.startsWith('#');
            }).length;

    document.getElementById(elementId).innerText = `Конфигов: ${count}`;
        } catch (error) {
        document.getElementById(elementId).innerText = "Ошибка";
        }
    }

    // Запускаем автоподсчет при открытии или обновлении сайта
    window.onload = function() {
        countConfigs(configUrls.finland, 'count-finland');
    countConfigs(configUrls.russia, 'count-russia');
    countConfigs(configUrls.netherlands, 'count-netherlands');
    };

    // Функция копирования ссылки в буфер обмена
function copyLink(buttonElement) {
    const card = buttonElement.closest('.card');
    const countryKey = card.id;
    const finalUrl = configUrls[countryKey];
    const el = document.createElement('textarea');
    el.value = finalUrl;// Передаем сюда готовую склеенную ссылку
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    // 4. Показываем ваш toast-уведомление
    const toast = document.getElementById('toast');
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}
function updateLinkOnPage(countryKey) {
    // 1. Находим нужный span по его id (например, 'finland' или 'poland')
    const linkSpan = document.getElementById(`${countryKey}`);

    if (linkSpan) {
        // 2. Получаем полный адрес файла для конкретной страны
        const fullUrl = configUrls[countryKey];

        // 3. Безопасно кодируем ссылку, чтобы сервис QR-кодов её прочитал
        const encodedUrl = encodeURIComponent(fullUrl);

        // 4. Вставляем готовую картинку. Путь и описание (alt) формируются автоматически!
        linkSpan.innerHTML = `<img src="${qrurl}${encodedUrl}" alt="QR ${countryKey}" />`;
    }
}

// Запускаем автоматическое создание QR-кодов при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    updateLinkOnPage('finland');      // Создаст QR для Финляндии внутри <span id="finland">
    updateLinkOnPage('poland');       // Создаст QR для Польши внутри <span id="poland">
    updateLinkOnPage('netherlands');  // Создаст QR для Нидерландов внутри <span id="netherlands">
    updateLinkOnPage('germany');
    updateLinkOnPage('russia');
    
});



document.addEventListener("DOMContentLoaded", () => {
    // Ищем абсолютно все карточки на странице
    const allCards = document.querySelectorAll('.card');

    allCards.forEach(card => {
        const countryKey = card.id; // Получае
        const nameSpan = card.querySelector('.card-name');
        nameSpan.innerText = countryNames[countryKey];
    });
}); 