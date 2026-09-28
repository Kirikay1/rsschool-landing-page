document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.Favourites-Coffee');

    if (!slider) return;

    const viewport = slider.querySelector('.row-slider');
    const track = slider.querySelector('.slider-track');
    const previousButton = slider.querySelector('.Favourites-Coffee-svg-left');
    const nextButton = slider.querySelector('.Favourites-Coffee-svg-right');
    const indicators = [...slider.querySelectorAll('.Favourites-Coffee-radio')];

    if (!viewport || !track || !previousButton || !nextButton) return;

    const slides = [...track.children];

    if (slides.length < 2) return;

    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides.at(-1).cloneNode(true);

    firstClone.setAttribute('aria-hidden', 'true');
    lastClone.setAttribute('aria-hidden', 'true');
    firstClone.inert = true;
    lastClone.inert = true;
    track.prepend(lastClone);
    track.append(firstClone);

    let trackIndex = 1;
    let isAnimating = false;
    let pointerStartX = null;

    const realIndex = () => (trackIndex - 1 + slides.length) % slides.length;

    const updateState = () => {
        const activeIndex = realIndex();

        slides.forEach((slide, index) => {
            slide.setAttribute('aria-hidden', String(index !== activeIndex));
        });

        indicators.forEach((indicator, index) => {
            const isActive = index === activeIndex;
            indicator.classList.toggle('is-active', isActive);
            indicator.setAttribute('aria-current', String(isActive));
        });
    };

    const setTrackPosition = () => {
        track.style.transform = `translateX(-${trackIndex * 100}%)`;
    };

    const normalizeTrackIndex = () => {
        if (trackIndex === 0) {
            trackIndex = slides.length;
        } else if (trackIndex === slides.length + 1) {
            trackIndex = 1;
        }
    };

    const moveTo = (nextTrackIndex) => {
        if (isAnimating) return;

        isAnimating = true;
        trackIndex = nextTrackIndex;
        setTrackPosition();
        updateState();
    };

    const moveBy = (direction) => moveTo(trackIndex + direction);

    previousButton.addEventListener('click', () => moveBy(-1));
    nextButton.addEventListener('click', () => moveBy(1));

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            if (index === realIndex()) return;
            moveTo(index + 1);
        });
    });

    track.addEventListener('transitionend', (event) => {
        if (event.propertyName !== 'transform') return;

        normalizeTrackIndex();

        track.classList.add('no-transition');
        setTrackPosition();
        void track.offsetWidth;
        track.classList.remove('no-transition');
        isAnimating = false;
        updateState();
    });

    viewport.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            moveBy(-1);
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            moveBy(1);
        }
    });

    viewport.addEventListener('pointerdown', (event) => {
        if (event.pointerType === 'mouse') return;

        pointerStartX = event.clientX;
        viewport.setPointerCapture(event.pointerId);
    });

    viewport.addEventListener('pointerup', (event) => {
        if (pointerStartX === null) return;

        const distance = event.clientX - pointerStartX;
        pointerStartX = null;

        if (Math.abs(distance) < 50) return;
        moveBy(distance < 0 ? 1 : -1);
    });

    viewport.addEventListener('pointercancel', () => {
        pointerStartX = null;
    });

    const resizeObserver = new ResizeObserver(() => {
        normalizeTrackIndex();
        isAnimating = false;
        track.classList.add('no-transition');
        setTrackPosition();
        updateState();
        requestAnimationFrame(() => track.classList.remove('no-transition'));
    });

    resizeObserver.observe(viewport);
    setTrackPosition();
    updateState();
});
