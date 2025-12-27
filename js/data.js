const addonsData = [
    {
    id: "Craftsman-one-nv",
    title: "Craftsman ONE NV",
    description: "Craftsman ONE ahora con mejor shader, texturas navideñas y mucho más",
    cover_image: "./img/min/onenavidad.jpg",
    version: "1.1.5",
    download_link: "https://www.mediafire.com/file/qufm5g32s95ihtj/gen_signed.apk/file",
    last_updated: "2025-12-27",
    file_size: "175 MB",
    isNew: true,
    tags: ["Craftsman ONE", "Nueva", "2025"],
    screenshots: [
        "./img/min/secre (1).jpg",
        "./img/min/secre (3).jpg",
        "./img/min/secre (2).jpg",
        ".img/min/secre (4).jpg"
    ]
},
    {
        id: "craftsman-one-android14",
        title: "Craftsman ONE Android 14-15",
        description: "Versión especial de Craftsman ONE totalmente compatible con Android 14 y 15. ¡Funciona perfecto en los móviles más nuevos!",
        cover_image: "./img/craftsman-one.jpg",
        version: "1.1.5",
        download_link: "https://www.mediafire.com/file/5w2bbb09dsm5jpt/CRAFTSMAN_ONE_14-15_%25F0%259F%2591%25BE%25F0%259F%258E%2581.apk/file",
        last_updated: "2024-12-01",
        file_size: "85 MB",
        isNew: true,
        tags: ["Minecraft", "Android 14", "Android 15"],
        screenshots: [
            "./img/min/secre (1).jpg"
        ]
    },
    {
        id: "opticraft-one",
        title: "Craftsman ONE - OPTICRAFT ONE",
        description: "La versión MÁS OPTIMIZADA de Craftsman ONE. Funciona perfecto en cualquier móvil.",
        cover_image: "./img/craftsman-one.jpg",
        version: "1.1.5 Optimizado",
        download_link: "https://www.mediafire.com/file/2jkfza0klfxe0c9/OPTICRAFT_ONE_%25F0%259F%25A5%2594%25E2%259B%2584.apk/file",
        last_updated: "2025-12-03",
        file_size: "148 MB",
        isNew: true,
        tags: ["Minecraft", "Optimizado", "Performance"],
        screenshots: [
            "./img/min/secre (3).jpg"
        ]
    },
    {
        id: "craftsman-one-oficial",
        title: "Craftsman ONE OFICIAL",
        description: "La versión oficial más reciente y estable de Craftsman ONE.",
        cover_image: "./img/craftsman-one.jpg",
        version: "OFICIAL",
        download_link: "https://www.mediafire.com/file/v32npfacwwl168i/CRAFTSMAN_ONE_%25F0%259F%258E%2584%25E2%259C%25A8.apk/file",
        last_updated: "2024-12-12",
        file_size: "87 MB",
        isNew: false,
        tags: ["Minecraft", "Oficial", "Estable"],
        screenshots: [
        "./img/min/secre (4).jpg"
        ]
    }
];

const videosData = {
    videos: [
        {
            id: "v-1",
            title: "Cómo jugar con tus amigos en Craftsman one",
            url: "https://youtu.be/iC5tvABQy0s?si=ViDEm0N4F4qfagQS",
            thumbnail: "./img/miniatura1.jpg",
            description: "Así puede jugar en Craftsman ONE con sus amigos"
        }
    ]
};

const reviewsDB = {};

function getYouTubeEmbedUrl(url) {
    const videoId = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^&\n?#]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

function getAddonById(id) {
    return addonsData.find(addon => addon.id === id);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;
    return `Hace ${Math.floor(diffDays / 365)} años`;
}

function getUserId() {
    let userId = localStorage.getItem('craftsman_user_id');
    if (!userId) {
        userId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('craftsman_user_id', userId);
    }
    return userId;
}

async function getReviewsForAddon(addonId) {
    const storageKey = `reviews_${addonId}`;
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
}

async function getUserReviewForAddon(addonId) {
    const reviews = await getReviewsForAddon(addonId);
    const userId = getUserId();
    return reviews.find(r => r.userId === userId);
}

async function addOrUpdateReview(addonId, rating, comment) {
    const reviews = await getReviewsForAddon(addonId);
    const userId = getUserId();
    const existingIndex = reviews.findIndex(r => r.userId === userId);
    
    const review = {
        userId,
        rating,
        comment,
        timestamp: new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
        reviews[existingIndex] = review;
    } else {
        reviews.push(review);
    }
    
    localStorage.setItem(`reviews_${addonId}`, JSON.stringify(reviews));
    return review;
}

async function deleteReview(addonId) {
    const reviews = await getReviewsForAddon(addonId);
    const userId = getUserId();
    const filtered = reviews.filter(r => r.userId !== userId);
    localStorage.setItem(`reviews_${addonId}`, JSON.stringify(filtered));
}

function calculateAverageRating(reviews) {
    if (!reviews || reviews.length === 0) return '4.5';
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
}