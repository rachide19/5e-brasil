document.addEventListener('DOMContentLoaded', () => {

    const listaTalentosEl = document.getElementById('lista-talentos');
    const conteudoTalentoEl = document.getElementById('conteudo-talento');
    const caixaBuscaEl = document.getElementById('caixa-busca');
    // NOVO: Referência para o container de resultados da busca
    const searchResultsContainer = document.getElementById('search-results-container');

    if (!listaTalentosEl || !conteudoTalentoEl || !caixaBuscaEl || !searchResultsContainer) {
        console.error("Erro Crítico: Um ou mais elementos do HTML não foram encontrados.");
        return;
    }

    let todosOsTalentos = [];

    async function carregarDados() {
        try {
            const resposta = await fetch('/data/feats.json');
            if (!resposta.ok) throw new Error(`Erro de rede: ${resposta.status}`);
            
            const dados = await resposta.json();
            todosOsTalentos = dados;
            
            renderizarLista(todosOsTalentos);
            // NOVO: Popula o nosso novo dropdown de busca
            popularDropdownDeBusca(todosOsTalentos);

        } catch (erro) {
            console.error('Falha ao carregar os talentos:', erro);
            listaTalentosEl.innerHTML = `<li class="list-group-item text-danger">Erro ao carregar talentos.</li>`;
        }
    }

    // NOVO: Função para preencher o dropdown de resultados da busca
    function popularDropdownDeBusca(talentos) {
        searchResultsContainer.innerHTML = ''; // Limpa antes de adicionar
        talentos.forEach(talento => {
            const linkEl = document.createElement('a');
            linkEl.href = '#';
            linkEl.textContent = talento.name;
            
            // Adiciona um evento de clique a cada item do dropdown
            linkEl.addEventListener('click', (e) => {
                e.preventDefault(); // Previne o link de recarregar a página
                caixaBuscaEl.value = talento.name; // Preenche a caixa de busca
                renderizarDetalhes(talento); // Mostra os detalhes
                renderizarLista([talento]); // Filtra a lista principal para mostrar apenas o selecionado
                searchResultsContainer.classList.add('hidden'); // Esconde o dropdown
            });
            searchResultsContainer.appendChild(linkEl);
        });
    }

    // --- LÓGICA DE EVENTOS (MOSTRAR/ESCONDER DROPDOWN) ---

    // NOVO: Mostra o dropdown quando a caixa de busca é focada (clicada)
    caixaBuscaEl.addEventListener('focus', () => {
        searchResultsContainer.classList.remove('hidden');
    });

    // NOVO: Esconde o dropdown se o usuário clicar em qualquer lugar fora da área de busca
    document.addEventListener('click', (e) => {
        // Verifica se o clique foi fora do .search-wrapper
        if (!e.target.closest('.search-wrapper')) {
            searchResultsContainer.classList.add('hidden');
        }
    });

    // --- LÓGICA DE FILTRAGEM (JÁ EXISTENTE, MAS AINDA IMPORTANTE) ---
    
    caixaBuscaEl.addEventListener('input', () => {
        const termoBusca = caixaBuscaEl.value.toLowerCase();
        const talentosFiltrados = todosOsTalentos.filter(t => t.name.toLowerCase().includes(termoBusca));
        
        // Filtra tanto a lista principal da esquerda quanto o dropdown de busca
        renderizarLista(talentosFiltrados);
        popularDropdownDeBusca(talentosFiltrados);
    });

    // --- FUNÇÕES DE RENDERIZAÇÃO (SEM GRANDES MUDANÇAS) ---

    function renderizarLista(lista) {
        listaTalentosEl.innerHTML = '';
        if (lista.length === 0) {
            listaTalentosEl.innerHTML = `<li class="list-group-item">Nenhum talento encontrado.</li>`;
            return;
        }
        lista.forEach(talento => {
            const itemEl = document.createElement('a');
            itemEl.className = 'list-group-item list-group-item-action';
            itemEl.textContent = talento.name;
            itemEl.href = '#';
            itemEl.addEventListener('click', (e) => {
                e.preventDefault();
                renderizarDetalhes(talento);
            });
            listaTalentosEl.appendChild(itemEl);
        });
    }

    function renderizarDetalhes(talento) {
        // ... (código para renderizar detalhes permanece o mesmo)
        const descricoesHtml = talento.entries.map(entry => {
            if (typeof entry === 'string') {
                return `<p>${entry}</p>`;
            } else if (entry.type === 'list') {
                const listItems = entry.items.map(item => `<li>${item}</li>`).join('');
                return `<ul>${listItems}</ul>`;
            }
            return '';
        }).join('');
        conteudoTalentoEl.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${talento.name}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">Fonte: ${talento.source}</h6>
                    <p class="card-text"><strong>Pré-requisito:</strong> ${talento.prerequisite}</p>
                    <hr>
                    ${descricoesHtml}
                </div>
            </div>
        `;
    }

    // Ponto de partida
    carregarDados();
});
