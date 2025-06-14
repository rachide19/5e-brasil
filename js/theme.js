document.addEventListener('DOMContentLoaded', () => {

    // Atraso para garantir que o menu foi injetado pelo nav.js
    setTimeout(() => {
        const themeToggle = document.getElementById('theme-toggle-switch');
        const sunIcon = document.getElementById('sun-icon');
        const moonIcon = document.getElementById('moon-icon');
        const htmlElement = document.documentElement;

        if (!themeToggle || !sunIcon || !moonIcon) {
            console.error('Elementos do interruptor de tema não encontrados!');
            return;
        }

        // Função para definir o tema e atualizar o estado visual
        const setTheme = (theme) => {
            if (theme === 'light') {
                htmlElement.setAttribute('data-bs-theme', 'light');
                themeToggle.checked = false;
                sunIcon.classList.add('active');
                moonIcon.classList.remove('active');
            } else {
                htmlElement.setAttribute('data-bs-theme', 'dark');
                themeToggle.checked = true;
                sunIcon.classList.remove('active');
                moonIcon.classList.add('active');
            }
            // Guarda a escolha do utilizador
            localStorage.setItem('theme', theme);
        };

        // Função para carregar o tema guardado
        const loadTheme = () => {
            const savedTheme = localStorage.getItem('theme') || 'dark'; // Padrão para 'dark'
            setTheme(savedTheme);
        };

        // Adiciona o evento de 'change' ao interruptor
        themeToggle.addEventListener('change', () => {
            const newTheme = themeToggle.checked ? 'dark' : 'light';
            setTheme(newTheme);
        });

        // Carrega o tema assim que a página é aberta
        loadTheme();

    }, 100); // Um pequeno atraso para garantir que o DOM do nav.js foi carregado
});
