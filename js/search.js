document.addEventListener('DOMContentLoaded', () => {
    const formBusca = document.getElementById('form-busca');
    const inputBusca = document.getElementById('input-busca');
    const dropdownTalentos = document.getElementById('dropdown-talentos');

    // Função da busca da barra de navegação
    function inicializarBusca() {
        if (formBusca) {
            formBusca.addEventListener('submit', (evento) => {
                evento.preventDefault();
                const termo = inputBusca.value.trim().toLowerCase();
                if (!termo) return;
                
                if (termo === 'talentos' || termo === 'talento' || termo === 'feat' || termo === 'feats') {
                    window.location.href = '/feats.html';
                } else {
                    alert(`Busca por "${termo}" não encontrou resultados.`);
                }
            });
        }
    }

    // NOVA FUNÇÃO: Carrega os talentos e os insere no dropdown
    async function carregarTalentosDropdown() {
        // Verifica se o elemento do dropdown existe na página
        if (!dropdownTalentos) return;

        try {
            const resposta = await fetch('/data/feats.json');
            if (!resposta.ok) throw new Error('Falha ao buscar talentos');
            
            const talentos = await resposta.json();

            // Limpa o conteúdo inicial do dropdown ("Carregando...")
            dropdownTalentos.innerHTML = `<li><a class="dropdown-item" href="/feats.html">Ver Todos os Talentos</a></li><li><hr class="dropdown-divider"></li>`;

            // Para cada talento, cria um item de link e o adiciona ao menu
            talentos.forEach(talento => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.className = 'dropdown-item';
                // O link agora inclui um "#" com o nome do talento. Isso é crucial para o próximo passo.
                a.href = `/feats.html#${encodeURIComponent(talento.name)}`;
                a.textContent = talento.name;
                li.appendChild(a);
                dropdownTalentos.appendChild(li);
            });

        } catch (erro) {
            console.error("Erro ao carregar talentos no dropdown:", erro);
            // Se falhar, exibe uma mensagem de erro no dropdown
            dropdownTalentos.innerHTML += '<li><span class="dropdown-item-text text-danger">Erro ao carregar</span></li>';
        }
    }

    // Inicializa ambas as funcionalidades
    inicializarBusca();
    carregarTalentosDropdown();
});
