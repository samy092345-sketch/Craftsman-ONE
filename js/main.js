let currentView = 'home';
let searchTimeout;

function renderFeaturedBanner() {
    const container = document.getElementById('featuredBanner');
    if (!container) return;
    
    const featuredApps = addonsData.filter(a => a.isNew);
    if (featuredApps.length === 0) featuredApps.push(addonsData[0]);
    
    let currentIndex = 0;
    
    function showBanner(index) {
        const featured = featuredApps[index];
        container.innerHTML = `
            <img src="${featured.cover_image}" alt="${featured.title}" class="featured-banner-img">
            <div class="featured-overlay">
                <div class="featured-badge">DESTACADO</div>
                <div class="featured-title">${featured.title}</div>
                <div class="featured-subtitle">${featured.description.substring(0, 80)}...</div>
                <button class="featured-button" onclick="viewAddon('${featured.id}')">
                    Ver detalles
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="m9 18 6-6-6-6"/>
                    </svg>
                </button>
            </div>
            ${featuredApps.length > 1 ? `
                <div class="banner-dots">
                    ${featuredApps.map((_, i) => `
                        <div class="banner-dot ${i === index ? 'active' : ''}" onclick="changeBanner(${i})"></div>
                    `).join('')}
                </div>
            ` : ''}
        `;
    }
    
    showBanner(currentIndex);
    
    if (featuredApps.length > 1) {
        setInterval(() => {
            currentIndex = (currentIndex + 1) % featuredApps.length;
            showBanner(currentIndex);
        }, 5000);
    }
    
    window.changeBanner = function(index) {
        currentIndex = index;
        showBanner(index);
    };
}

function renderStarsSimple(rating) {
    return Array(5).fill(0).map((_, i) => 
        `<span class="rating-star" style="color: ${i < rating ? '#FFC107' : '#2C2C2C'}">★</span>`
    ).join('');
}

function renderAppCardSlider(addon) {
    return `
        <div class="app-card-playstore" onclick="viewAddon('${addon.id}')">
            <div class="app-card-image-wrapper">
                <img src="${addon.cover_image}" alt="${addon.title}" class="app-card-cover" loading="lazy">
                ${addon.isNew ? '<div class="new-badge">NUEVO</div>' : ''}
            </div>
            <div class="app-card-title">${addon.title}</div>
            <div class="app-card-rating">
                <div class="rating-stars">${renderStarsSimple(5)}</div>
                <span class="rating-value">4.5</span>
            </div>
        </div>
    `;
}

function renderAppCardGrid(addon) {
    return `
        <div class="grid-card-playstore" onclick="viewAddon('${addon.id}')">
            <div class="grid-card-image-wrapper">
                <img src="${addon.cover_image}" alt="${addon.title}" class="grid-card-cover" loading="lazy">
                ${addon.isNew ? '<div class="new-badge-small">NUEVO</div>' : ''}
            </div>
            <div class="grid-card-title">${addon.title}</div>
        </div>
    `;
}

function renderVideoCardSlider(video) {
    return `
        <div class="video-card-playstore" onclick="openVideoModal('${video.id}')">
            <div class="video-thumbnail-wrapper">
                <img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail" loading="lazy">
                <div class="video-play-overlay">
                    <svg class="play-icon-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                </div>
                <div class="video-duration">Tutorial</div>
            </div>
            <div class="video-card-title">${video.title}</div>
        </div>
    `;
}

function renderVideoCardGrid(video) {
    return `
        <div class="video-card-playstore" onclick="openVideoModal('${video.id}')">
            <div class="video-thumbnail-wrapper">
                <img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail" loading="lazy">
                <div class="video-play-overlay">
                    <svg class="play-icon-svg" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="white">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                </div>
            </div>
            <div class="video-card-title">${video.title}</div>
        </div>
    `;
}

function initializeSliders() {
    const recentAppsSlider = document.getElementById('recentAppsSlider');
    if (recentAppsSlider) {
        const recentApps = addonsData.slice(0, 6);
        const duplicatedApps = [...recentApps, ...recentApps];
        recentAppsSlider.innerHTML = duplicatedApps.map(renderAppCardSlider).join('');
        
        recentAppsSlider.addEventListener('mouseenter', () => {
            recentAppsSlider.style.animationPlayState = 'paused';
        });
        recentAppsSlider.addEventListener('mouseleave', () => {
            recentAppsSlider.style.animationPlayState = 'running';
        });
    }
    
    const topAppsSlider = document.getElementById('topAppsSlider');
    if (topAppsSlider) {
        topAppsSlider.innerHTML = addonsData.map(renderAppCardSlider).join('');
        enableSliderNavigation(topAppsSlider);
    }
    
    const recentVideosSlider = document.getElementById('recentVideosSlider');
    if (recentVideosSlider && videosData?.videos) {
        recentVideosSlider.innerHTML = videosData.videos.map(renderVideoCardSlider).join('');
        enableSliderNavigation(recentVideosSlider);
    }
    
    const allAppsGrid = document.getElementById('allAppsGrid');
    if (allAppsGrid) {
        allAppsGrid.innerHTML = addonsData.map(renderAppCardGrid).join('');
    }
    
    const allVideosGrid = document.getElementById('allVideosGrid');
    if (allVideosGrid && videosData?.videos) {
        allVideosGrid.innerHTML = videosData.videos.map(renderVideoCardGrid).join('');
    }
}

function enableSliderNavigation(slider) {
    let isDown = false;
    let startX;
    let scrollLeft;
    
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.style.cursor = 'grabbing';
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    
    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });
    
    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });
    
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });
}

function switchView(viewName) {
    currentView = viewName;
    
    document.querySelectorAll('.view-content').forEach(view => {
        view.classList.remove('active');
    });
    
    const targetView = document.getElementById(`${viewName}View`);
    if (targetView) {
        targetView.classList.add('active');
    }
    
    document.querySelectorAll('.nav-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeButton = document.querySelector(`[data-view="${viewName}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function viewAddon(id) {
    sessionStorage.setItem('addonData', JSON.stringify(getAddonById(id)));
    window.location.href = `view.html?id=${id}`;
}

function openVideoModal(videoId) {
    const video = videosData.videos.find(v => v.id === videoId);
    if (!video) return;
    
    const embedUrl = getYouTubeEmbedUrl(video.url);
    
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="video-modal-content">
            <button class="video-modal-close" onclick="closeVideoModal()">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <h2 class="video-modal-title">${video.title}</h2>
            <div class="video-wrapper">
                <iframe 
                    src="${embedUrl}?autoplay=1" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>
            <p class="video-modal-description">${video.description}</p>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeVideoModal();
    });
    
    setTimeout(() => modal.style.opacity = '1', 10);
}

function closeVideoModal() {
    const modal = document.querySelector('.video-modal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        
        searchTimeout = setTimeout(() => {
            const query = e.target.value.trim().toLowerCase();
            
            if (query.length < 2) {
                initializeSliders();
                return;
            }
            
            const filteredAddons = addonsData.filter(addon => 
                addon.title.toLowerCase().includes(query) ||
                addon.description.toLowerCase().includes(query) ||
                (addon.tags && addon.tags.some(tag => tag.toLowerCase().includes(query)))
            );
            
            if (filteredAddons.length > 0) {
                switchView('apps');
                const allAppsGrid = document.getElementById('allAppsGrid');
                if (allAppsGrid) {
                    allAppsGrid.innerHTML = filteredAddons.map(renderAppCardGrid).join('');
                }
            } else {
                const allAppsGrid = document.getElementById('allAppsGrid');
                if (allAppsGrid) {
                    allAppsGrid.innerHTML = `
                        <div class="no-results">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity: 0.3; margin-bottom: 16px;">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.35-4.35"></path>
                            </svg>
                            <p style="color: #B0B0B0; font-size: 18px; margin-bottom: 8px;">No se encontraron resultados</p>
                            <p style="color: #666; font-size: 14px;">Intenta con otras palabras clave</p>
                        </div>
                    `;
                }
            }
        }, 300);
    });
}

function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-button');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const view = button.getAttribute('data-view');
            switchView(view);
            
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        });
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${type === 'success' ? 
                '<polyline points="20 6 9 17 4 12"></polyline>' : 
                '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
            }
        </svg>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    renderFeaturedBanner();
    initializeSliders();
    setupSearch();
    setupNavigation();
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeVideoModal();
    });
    
    document.querySelectorAll('.horizontal-slider').forEach(slider => {
        slider.style.cursor = 'grab';
    });
    
    console.log('%c🎮 Craftsman ONE Store cargada correctamente', 'color: #FFC107; font-size: 16px; font-weight: bold;');
    console.log('%c© 2024 NEOMC11', 'color: #1E88E5; font-size: 12px;');
});