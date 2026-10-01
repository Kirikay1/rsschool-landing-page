document.addEventListener('DOMContentLoaded', () => {
    const burgerButton = document.querySelector('.coffee-burger-menu');
    const navigation = document.querySelector('.header-navigation');

    if (!burgerButton || !navigation) return;

    const mobileMedia = window.matchMedia('(max-width: 768px)');

    const setMenuState = (isOpen, restoreFocus = false) => {
        const shouldOpen = isOpen && mobileMedia.matches;

        burgerButton.classList.toggle('is-open', shouldOpen);
        navigation.classList.toggle('is-open', shouldOpen);
        document.body.classList.toggle('menu-open', shouldOpen);
        burgerButton.setAttribute('aria-expanded', String(shouldOpen));
        burgerButton.setAttribute('aria-label', shouldOpen ? 'Close menu' : 'Open menu');

        if (mobileMedia.matches) {
            navigation.inert = !shouldOpen;
            navigation.setAttribute('aria-hidden', String(!shouldOpen));
        } else {
            navigation.inert = false;
            navigation.removeAttribute('aria-hidden');
        }

        if (shouldOpen) {
            navigation.querySelector('a')?.focus();
        } else if (restoreFocus && mobileMedia.matches) {
            burgerButton.focus();
        }
    };

    burgerButton.addEventListener('click', () => {
        navigation.classList.add('is-animated');
        const isOpen = burgerButton.getAttribute('aria-expanded') === 'true';
        setMenuState(!isOpen);
    });

    navigation.addEventListener('click', (event) => {
        const clickedLink = event.target.closest('a');
        const clickedEmptySpace =
            event.target === navigation ||
            event.target === navigation.querySelector('.nav') ||
            event.target === navigation.querySelector('.nav-list');

        if (clickedLink || clickedEmptySpace) {
            setMenuState(false);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && burgerButton.getAttribute('aria-expanded') === 'true') {
            setMenuState(false, true);
        }
    });

    mobileMedia.addEventListener('change', () => {
        navigation.classList.remove('is-animated');
        setMenuState(false);
    });
    setMenuState(false);
});
