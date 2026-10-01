(() => {
    const storageKey = 'coffee-house-theme';
    const root = document.documentElement;

    try {
        root.dataset.theme = localStorage.getItem(storageKey) === 'dark' ? 'dark' : 'light';
    } catch (error) {
        root.dataset.theme = 'light';
        console.warn('The saved theme could not be loaded; using the light theme.', error);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const toggle = document.querySelector('.theme-toggle');
        if (!toggle) return;

        const updateToggle = () => {
            const isDark = root.dataset.theme === 'dark';
            toggle.setAttribute('aria-pressed', String(isDark));
            toggle.setAttribute(
                'aria-label',
                isDark ? 'Switch to light theme' : 'Switch to dark theme',
            );
        };

        updateToggle();

        toggle.addEventListener('click', () => {
            const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
            root.dataset.theme = nextTheme;

            try {
                localStorage.setItem(storageKey, nextTheme);
            } catch (error) {
                console.warn('The selected theme could not be saved and may reset after reload.', error);
            }

            updateToggle();
        });
    });
})();
