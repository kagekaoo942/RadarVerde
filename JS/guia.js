document.addEventListener('DOMContentLoaded', () => {
    const guideToggle = document.querySelector('#guide-toggle');
    const guideReveal = document.querySelector('#guide-reveal');
    const speciesGrid = document.querySelector('.species-grid');

    const smoothScrollToGuide = () => {
        const startPosition = window.scrollY;
        const targetPosition = guideReveal.getBoundingClientRect().top + startPosition - 18;
        const distance = targetPosition - startPosition;
        const duration = 1100;
        const startTime = performance.now();

        const animateScroll = currentTime => {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easedProgress = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            window.scrollTo({
                top: startPosition + (distance * easedProgress),
                behavior: 'auto'
            });

            if (progress < 1) requestAnimationFrame(animateScroll);
        };

        requestAnimationFrame(animateScroll);
    };

    if (guideToggle && guideReveal) {
        guideToggle.addEventListener('click', event => {
            event.preventDefault();
            const isOpen = guideReveal.classList.toggle('is-open');
            guideToggle.setAttribute('aria-expanded', String(isOpen));
            guideToggle.innerHTML = isOpen
                ? 'Ocultar la guía <i class="bi bi-arrow-up" aria-hidden="true"></i>'
                : 'Ver los pasos <i class="bi bi-arrow-down" aria-hidden="true"></i>';

            if (isOpen) {
                window.setTimeout(() => {
                    if (!guideReveal.classList.contains('is-open')) return;
                    smoothScrollToGuide();
                }, 80);
            }
        });
    }

    if (!speciesGrid) return;

    const setActiveCard = card => {
        speciesGrid.querySelectorAll('.species-card').forEach(item => {
            item.classList.toggle('is-hovered', item === card);
        });
    };

    speciesGrid.addEventListener('pointerover', event => {
        const card = event.target.closest('.species-card');
        if (card) setActiveCard(card);
    });

    speciesGrid.addEventListener('pointerout', event => {
        if (!event.relatedTarget || !speciesGrid.contains(event.relatedTarget)) {
            setActiveCard(null);
        }
    });

    speciesGrid.addEventListener('focusin', event => {
        const card = event.target.closest('.species-card');
        if (card) setActiveCard(card);
    });

    speciesGrid.addEventListener('focusout', event => {
        if (!event.relatedTarget || !event.relatedTarget.closest('.species-card')) {
            setActiveCard(null);
        }
    });
});
