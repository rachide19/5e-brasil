(() => {
    'use strict';

    const THEME_STORAGE_KEY = 'theme';

    const getStoredTheme = () => localStorage.getItem(THEME_STORAGE_KEY);
    const setStoredTheme = theme => localStorage.setItem(THEME_STORAGE_KEY, theme);

    const getPreferredTheme = () => {
        const storedTheme = getStoredTheme();
        if (storedTheme) {
            return storedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    /**
     * Aplica o tema ao documento e atualiza o estado visual do seletor.
     * @param {string} theme - O tema a ser aplicado ('light' ou 'dark').
     */
    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-bs-theme', theme);

        const themeToggleSwitch = document.getElementById('theme-toggle-switch');
        const sunIcon = document.getElementById('sun-icon');
        const moonIcon = document.getElementById('moon-icon');

        if (themeToggleSwitch && sunIcon && moonIcon) {
            themeToggleSwitch.checked = (theme === 'dark');
            if (theme === 'dark') {
                moonIcon.classList.add('active');
                sunIcon.classList.remove('active');
            } else {
                sunIcon.classList.add('active');
                moonIcon.classList.remove('active');
            }
        }
    };

    // Aplica o tema imediatamente no carregamento da página para evitar "flash" de conteúdo
    applyTheme(getPreferredTheme());

    /**
     * Configura os event listeners para o seletor de tema.
     * Esta função é chamada quando o evento 'nav-ready' é disparado.
     */
    const setupThemeToggler = () => {
        const themeToggleSwitch = document.getElementById('theme-toggle-switch');
        if (themeToggleSwitch) {
            // Garante que o estado visual esteja correto assim que o botão for encontrado
            applyTheme(getPreferredTheme());

            themeToggleSwitch.addEventListener('click', () => {
                const newTheme = themeToggleSwitch.checked ? 'dark' : 'light';
                setStoredTheme(newTheme);
                applyTheme(newTheme);
            });
        }
    };

    // Fica "ouvindo" pelo evento que o nav.js dispara quando o menu está pronto.
    document.addEventListener('nav-ready', setupThemeToggler);

})();
