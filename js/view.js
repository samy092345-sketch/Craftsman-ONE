let cachedAddon = null;
let selectedRating = 0;

function renderAppHeader(addon) {
    const container = document.getElementById('appHeaderSection');
    if (!container) return;
    
    const avgRating = 4.5;
    const downloads = "10k+";
    
    container.innerHTML = `
        <img src="${addon.cover_image}" alt="${addon.title}" class="app-icon-large">
        <div class="app-header-info">
            <h1 class="app-title-large">${addon.title}</h1>
            <div class="app-developer-name">NEOMC11</div>
            <div class="app-rating-info">
                <div class="rating-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    ${avgRating}
                </div>
                <div class="downloads-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    ${downloads}
                </div>
            </div>
            <div class="action-buttons-container">
                <button class="install-button" onclick="downloadAddon('${addon.id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Instalar
                </button>
                <button class="copy-link-button" onclick="copyAddonLink('${addon.id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                    Copiar link
                </button>
            </div>
        </div>
    `;
}

function renderScreenshots(addon) {
    const slider = document.getElementById('screenshotsSlider');
    if (!slider) return;
    
    const screenshots = addon.screenshots || [
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=900&fit=crop",
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=900&fit=crop",
        "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=900&fit=crop"
    ];
    
    slider.innerHTML = screenshots.map(img => `
        <img src="${img}" alt="Screenshot" class="screenshot-img" loading="lazy">
    `).join('');
    
    const leftBtn = document.getElementById('screenshotsLeft');
    const rightBtn = document.getElementById('screenshotsRight');
    
    if (leftBtn) leftBtn.onclick = () => slider.scrollBy({ left: -300, behavior: 'smooth' });
    if (rightBtn) rightBtn.onclick = () => slider.scrollBy({ left: 300, behavior: 'smooth' });
}

function renderDescription(addon) {
    const descContainer = document.getElementById('appDescription');
    if (descContainer) descContainer.textContent = addon.description;
}

function renderAdditionalInfo(addon) {
    const container = document.getElementById('infoSection');
    if (!container) return;
    
    container.innerHTML = `
        <h2 class="section-title-view">Información adicional</h2>
        <div class="info-grid">
            <div class="info-card">
                <div class="info-label">Versión</div>
                <div class="info-value">${addon.version}</div>
            </div>
            <div class="info-card">
                <div class="info-label">Tamaño</div>
                <div class="info-value">${addon.file_size}</div>
            </div>
            <div class="info-card">
                <div class="info-label">Actualizado</div>
                <div class="info-value">${formatDate(addon.last_updated)}</div>
            </div>
            <div class="info-card">
                <div class="info-label">Categoría</div>
                <div class="info-value">${addon.tags[0] || 'App'}</div>
            </div>
        </div>
    `;
}

async function renderReviews(addonId) {
    const container = document.getElementById('reviewsContent');
    if (!container) return;
    
    try {
        const reviews = await getReviewsForAddon(addonId);
        const avgRating = calculateAverageRating(reviews);
        const userReview = await getUserReviewForAddon(addonId);
        
        const overallRating = document.getElementById('overallRating');
        if (overallRating) {
            overallRating.innerHTML = `
                <div class="rating-score-large">${avgRating}</div>
                <div class="rating-stars-large">${renderStarsLarge(Math.round(parseFloat(avgRating)))}</div>
                <div class="reviews-count-text">${reviews.length} reseñas</div>
            `;
        }
        
        if (!userReview) {
            container.innerHTML = `
                <div class="review-form-container">
                    <h3 class="review-form-title">Califica esta aplicación</h3>
                    <div class="rating-selector" id="ratingSelector">
                        ${[1, 2, 3, 4, 5].map(i => `<button class="star-btn" data-rating="${i}">★</button>`).join('')}
                    </div>
                    <textarea class="review-textarea" id="reviewComment" placeholder="Comparte tu experiencia con esta aplicación..."></textarea>
                    <button class="submit-review-btn" onclick="submitReview('${addonId}')">Enviar reseña</button>
                </div>
            `;
            setupRatingSelector();
        } else {
            container.innerHTML = `
                <div class="review-form-container">
                    <h3 class="review-form-title">Tu reseña</h3>
                    <div class="rating-stars-large">${renderStarsLarge(userReview.rating)}</div>
                    <p class="review-comment">${userReview.comment}</p>
                    <button class="submit-review-btn" onclick="deleteUserReview('${addonId}')">Eliminar reseña</button>
                </div>
            `;
        }
        
        const otherReviews = reviews.filter(r => !userReview || r.userId !== userReview.userId);
        
        if (otherReviews.length > 0) {
            container.innerHTML += `
                <div class="reviews-list">
                    ${otherReviews.map(review => `
                        <div class="review-item">
                            <div class="review-header">
                                <div class="reviewer-info">
                                    <div class="reviewer-avatar">U</div>
                                    <div>
                                        <div class="reviewer-name">Usuario</div>
                                        <div class="review-date">${formatDate(review.timestamp)}</div>
                                    </div>
                                </div>
                                <div class="review-rating-small">${renderStarsSmall(review.rating)}</div>
                            </div>
                            <p class="review-comment">${review.comment}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    } catch (error) {
        console.error('Error cargando reseñas:', error);
        container.innerHTML = '<p>Error al cargar las reseñas</p>';
    }
}

function renderStarsLarge(rating) {
    return Array(5).fill(0).map((_, i) => 
        `<span class="star-large" style="color: ${i < rating ? '#FFEB3B' : '#1e3a8a'}">★</span>`
    ).join('');
}

function renderStarsSmall(rating) {
    return Array(5).fill(0).map((_, i) => 
        `<span class="star-small" style="color: ${i < rating ? '#FFEB3B' : '#1e3a8a'}">★</span>`
    ).join('');
}

function setupRatingSelector() {
    const selector = document.getElementById('ratingSelector');
    if (!selector) return;
    
    const starBtns = selector.querySelectorAll('.star-btn');
    
    starBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            selectedRating = index + 1;
            starBtns.forEach((b, i) => {
                b.classList.toggle('selected', i < selectedRating);
            });
        });
    });
}

async function submitReview(addonId) {
    const comment = document.getElementById('reviewComment').value.trim();
    
    if (selectedRating === 0) {
        alert('Por favor selecciona una calificación');
        return;
    }
    
    if (!comment) {
        alert('Por favor escribe un comentario');
        return;
    }
    
    try {
        await addOrUpdateReview(addonId, selectedRating, comment);
        showNotification('¡Reseña publicada!', 'Tu reseña ha sido enviada correctamente', 'success');
        setTimeout(() => location.reload(), 1500);
    } catch (error) {
        showNotification('Error', 'No se pudo enviar la reseña', 'error');
    }
}

async function deleteUserReview(addonId) {
    if (confirm('¿Estás seguro de que quieres eliminar tu reseña?')) {
        try {
            await deleteReview(addonId);
            showNotification('Eliminada', 'Tu reseña ha sido eliminada', 'success');
            setTimeout(() => location.reload(), 1500);
        } catch (error) {
            showNotification('Error', 'No se pudo eliminar la reseña', 'error');
        }
    }
}

function downloadAddon(addonId) {
    const addon = cachedAddon || getAddonById(addonId);
    if (addon?.download_link) {
        window.open(addon.download_link, '_blank');
        showNotification('Descargando', 'Se abrió el enlace de descarga', 'success');
    }
}

function copyAddonLink(addonId) {
    const addonUrl = `${window.location.origin}/view.html?id=${addonId}`;
    
    navigator.clipboard.writeText(addonUrl).then(() => {
        showNotification('¡Link copiado!', 'El enlace se copió al portapapeles', 'success');
    }).catch(() => {
        prompt('Copia este link:', addonUrl);
    });
}

function showNotification(title, message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    notification.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 4px;">${title}</div>
        <div style="font-size: 14px; opacity: 0.9;">${message}</div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const addonId = urlParams.get('id');
    
    if (!addonId) {
        alert('No se encontró la aplicación');
        history.back();
        return;
    }
    
    const cached = sessionStorage.getItem('addonData');
    cachedAddon = cached ? JSON.parse(cached) : getAddonById(addonId);
    
    if (!cachedAddon) {
        alert('Aplicación no encontrada');
        history.back();
        return;
    }
    
    document.getElementById('pageTitle').textContent = `${cachedAddon.title} - GameStore`;
    
    renderAppHeader(cachedAddon);
    renderScreenshots(cachedAddon);
    renderDescription(cachedAddon);
    renderAdditionalInfo(cachedAddon);
    await renderReviews(addonId);
});

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);