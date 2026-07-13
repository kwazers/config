const qrurl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=";
const siteUrl = "https://raw.githubusercontent.com/kwazers/config/refs/heads/main/";

const configUrls = {
    finland: `${siteUrl}finland-config.txt`,
    russia: `${siteUrl}russia-config.txt`,
    netherlands: `${siteUrl}netherlands-config.txt`,
    germany: `${siteUrl}germany-config.txt`,
    poland: `${siteUrl}poland-config.txt`,
    tiktok: `${siteUrl}tiktok-config.txt`,
    mobile-night-none-frag: `${siteUrl}mobile-night-none-frag-config.txt`
};

const countryNames = {
    finland: "🇫🇮 Финляндия",
    russia: "🇷🇺 Россия",
    netherlands: "🇳🇱 Нидерланды",
    germany: "🇩🇪 Германия",
    poland: "🇵🇱 Польша",
    tiktok: "🎵 TikTok",
    mobile-night-none-frag: `Белые списки`
};

// 1. УНИВЕРСАЛЬНАЯ ФУНКЦИЯ КОПИРОВАНИЯ
function copyLink(buttonElement) {
    // Находим главную карточку .card, в которой лежит НАЖАТАЯ кнопка
    const card = buttonElement.closest('.card');

    // Автоматически узнаем ID этой карточки (например, "finland")
    const countryKey = card.id;

    // Берем ссылку из объекта configUrls по полученному ID
    const finalUrl = configUrls[countryKey];

    if (!finalUrl) {
        console.error(`Ссылка для ID "${countryKey}" не найдена!`);
        return;
    }

    // Создаем временный элемент и копируем текст в буфер
    const el = document.createElement('textarea');
    el.value = finalUrl;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    // Показываем всплывающий тост
    const toast = document.getElementById('toast');
    if (toast) {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }
}

// 2. АСИНХРОННЫЙ СЧЕТЧИК СТРОК
async function countConfigs(url, cardElement) {
    // Ищем поле задержки/счетчика именно внутри ЭТОЙ карточки
    const delaySpan = cardElement.querySelector('.delay');
    if (!delaySpan) return;

    try {
        const noCacheUrl = url + '?update=' + new Date().getTime();
        const response = await fetch(noCacheUrl);
        if (!response.ok) throw new Error();
        const text = await response.text();

        const lines = text.split('\n');
        const count = lines.filter(line => {
            const trimmed = line.trim();
            return trimmed.length > 0 && !trimmed.startsWith('#');
        }).length;

        delaySpan.innerText = `Конфигов: ${count}`;
    } catch (error) {
        delaySpan.innerText = "Ошибка";
    }
}

// 3. АВТОМАТИЧЕСКАЯ НАСТРОЙКА ВСЕХ КАРТОЧЕК ПРИ ЗАГРУЗКЕ
document.addEventListener("DOMContentLoaded", () => {
    // Находим абсолютно все блоки с классом .card
    const allCards = document.querySelectorAll('.card');

    allCards.forEach(card => {
        const countryKey = card.id; // Читаем ID карточки ("finland", "poland" и т.д.)
        if (!countryKey) return;

        // А) Ставим красивое текстовое имя страны
        const nameSpan = card.querySelector('.card-name');
        if (nameSpan && countryNames[countryKey]) {
            nameSpan.innerText = countryNames[countryKey];
        }

        // Б) Генерируем QR-код внутрь .qr-container .qr-code
        const qrSpan = card.querySelector('.qr-container .qr-code');
        if (qrSpan && configUrls[countryKey]) {
            const encodedUrl = encodeURIComponent(configUrls[countryKey]);
            qrSpan.innerHTML = `<img src="${qrurl}${encodedUrl}" alt="QR ${countryKey}" />`;
        }

        // В) Запускаем подсчет строк с GitHub
        if (configUrls[countryKey]) {
            countConfigs(configUrls[countryKey], card);
        }
    });
});