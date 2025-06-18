// Este script cria e insere a barra de navegação principal em qualquer página que o chame.
document.addEventListener('DOMContentLoaded', function() {
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (!navbarPlaceholder) {
        console.error('Placeholder da barra de navegação não encontrado!');
        return;
    }

    // ALTERADO: As classes "navbar-dark" e "bg-dark-nav" foram removidas da tag <nav>.
    // Agora, a aparência será controlada pelo seu style.css usando as variáveis de tema.
    

    const navbarHTML = `

        <header class="page-header">

            <div class="container d-flex flex-wrap align-items-center mb-3">

                <h1 class="page-title my-0">5e tools Brasil 🇧🇷</h1>

                <p class="page-subtitle my-0 ms-3">Um conjunto de ferramentas para jogadores e Mestres de Dungeons & Dragons 5ª Edição.</p>

            </div>

        </header>

        <nav class="navbar navbar-expand-lg border-bottom sticky-top">

            <div class="container-fluid">

                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#main-navbar" aria-controls="main-navbar" aria-expanded="false" aria-label="Toggle navigation">

                    <span class="navbar-toggler-icon"></span>

                </button>

                <div class="collapse navbar-collapse" id="main-navbar">

                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">

                        <li class="nav-item"><a class="nav-link" href="/index.html">Home</a></li>

                        <li class="nav-item dropdown">

                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Regras</a>

                            <ul class="dropdown-menu">

                                <li><a class="dropdown-item" href="/adventures.html">Aventuras</a></li>

                            </ul>

                        </li>

                        <li class="nav-item dropdown">

                           <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Jogador</a>

                            <ul class="dropdown-menu">

                                <li><a class="dropdown-item" href="/classes.html">Classes</a></li>

                                <li><a class="dropdown-item" href="/species.html">Espécies</a></li>

                                <li><a class="dropdown-item" href="/backgrounds.html">Antecedentes</a></li>

                                <li><a class="dropdown-item" href="/feats.html">Talentos</a></li>

                                <li><a class="dropdown-item" href="/spells.html">Magias</a></li>

                                <li><a class="dropdown-item" href="/items.html">Itens</a></li>

                                <li><a class="dropdown-item" href="/options.html">Opções & Features</a></li>

                                <li><hr class="dropdown-divider"></li>

                                <li><a class="dropdown-item" href="/statgen.html">Gerador de Status</a></li>

                            </ul>

                        </li>

                         <li class="nav-item dropdown">

                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Mestre</a>

                            <ul class="dropdown-menu">

                                <li><a class="dropdown-item" href="/bestiary.html">Bestiário</a></li>

                            </ul>

                        </li>

                        <li class="nav-item dropdown">

                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Utilitários</a>

                            <ul class="dropdown-menu">

                                <li><a class="dropdown-item" href="/bestiary.html">Política de Privacidade</a></li>

                            </ul>

                        </li>

                    </ul>



                    <div class="theme-switcher-container ms-lg-auto me-lg-3 d-flex align-items-center">

                        <i class="fas fa-sun theme-icon" id="sun-icon"></i>

                        <div class="form-check form-switch mx-2">

                            <input class="form-check-input" type="checkbox" role="switch" id="theme-toggle-switch" title="Alterar tema">

                        </div>

                        <i class="fas fa-moon theme-icon" id="moon-icon"></i>

                    </div>



                    <!-- FORMULÁRIO DE BUSCA -->

                    <div class="d-flex position-relative">

                        <input class="form-control me-2" type="search" id="site-search-input" placeholder="Buscar no site..." aria-label="Search" autocomplete="off">

                        <button class="btn btn-outline-info" type="button" id="site-search-button"><i class="fa-solid fa-magnifying-glass"></i></button>

                        <div id="search-results-container" class="position-absolute top-100 start-0 mt-2 w-100 list-group" style="display: none; z-index: 1050;"></div>

                    </div>

                </div>

            </div>

        </nav>

    `;

    document.dispatchEvent(new Event('nav-ready'));

    navbarPlaceholder.innerHTML = navbarHTML;

    // Dispara um evento personalizado para dizer "O menu está pronto!"
    // O theme.js vai ouvir esse evento para poder configurar o botão de tema.
    const navReadyEvent = new Event('nav-ready');
    document.dispatchEvent(navReadyEvent);

    document.addEventListener('search-ready', () => {
    setupSearchListeners();
    });
});

/**

 * Configura os event listeners para a barra de busca.

 */

function setupSearchListeners() {

    const searchInput = document.getElementById('site-search-input');

    const searchResultsContainer = document.getElementById('search-results-container');



    if (!searchInput || !searchResultsContainer) return;



    // Evento disparado a cada tecla pressionada

    searchInput.addEventListener('input', () => {

        const query = searchInput.value;

        if (query.length < 2) { // Reduzido para 2 caracteres para melhor usabilidade

            searchResultsContainer.innerHTML = '';

            searchResultsContainer.style.display = 'none';

            return;

        }



        const results = SiteSearch.search(query);

        displaySearchResults(results);

    });

    
    // Mantém os resultados visíveis ao clicar neles

    searchResultsContainer.addEventListener('mousedown', (e) => {

        e.stopPropagation();

    });


    // Esconde os resultados se o usuário clicar fora da busca

    document.addEventListener('click', (e) => {

        if (!searchInput.contains(e.target)) {

            searchResultsContainer.style.display = 'none';

        }

    });

    
     // Mostra os resultados ao focar no input

    searchInput.addEventListener('focus', () => {

        if(searchInput.value.length >= 2) {

             const results = SiteSearch.search(searchInput.value);

             displaySearchResults(results);

        }

    });

}
/**

 * Exibe os resultados da busca no container.

 * @param {Array} results - A lista de resultados retornada pelo SiteSearch.

 */

function displaySearchResults(results) {

    const searchResultsContainer = document.getElementById('search-results-container');

    searchResultsContainer.innerHTML = '';



    if (results.length === 0) {

        searchResultsContainer.style.display = 'none';

        return;

    }



    results.forEach(result => {

        const link = document.createElement('a');

        link.href = result.url;

        link.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';

        link.innerHTML = `

            <span>${result.name}</span>

            <small class="badge bg-secondary rounded-pill">${result.type}</small>

        `;

        searchResultsContainer.appendChild(link);

    });

    searchResultsContainer.style.display = 'block';

}
