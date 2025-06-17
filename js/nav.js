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
                    </ul>

                    <div class="theme-switcher-container ms-lg-auto me-lg-3 d-flex align-items-center">
                        <i class="fas fa-sun theme-icon" id="sun-icon"></i>
                        <div class="form-check form-switch mx-2">
                            <input class="form-check-input" type="checkbox" role="switch" id="theme-toggle-switch" title="Alterar tema">
                        </div>
                        <i class="fas fa-moon theme-icon" id="moon-icon"></i>
                    </div>

                    <form class="d-flex" role="search">
                        <input class="form-control me-2" type="search" placeholder="Buscar no site..." aria-label="Search">
                        <button class="btn btn-outline-info" type="submit"><i class="fa-solid fa-magnifying-glass"></i></button>
                    </form>
                </div>
            </div>
        </nav>
    `;

    navbarPlaceholder.innerHTML = navbarHTML;

    // Dispara um evento personalizado para dizer "O menu está pronto!"
    // O theme.js vai ouvir esse evento para poder configurar o botão de tema.
    const navReadyEvent = new Event('nav-ready');
    document.dispatchEvent(navReadyEvent);
});
