
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
function copyLink(elementId) {
    const countryKey = elementId.replace('count-', '');

    // 3. Создаем элемент и копируем (ваш рабочий код)
    const el = document.createElement('textarea');
    el.value = configUrls[countryKey];; // Передаем сюда готовую склеенную ссылку
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