// Espera que o HTML da página seja completamente carregado antes de executar o script.
// Esta é a melhor prática para evitar erros de "elemento não encontrado".
document.addEventListener('DOMContentLoaded', () => {

    // 1. Obter referências aos elementos do HTML com que vamos interagir.
    const listaTalentosEl = document.getElementById('lista-talentos');
    const conteudoTalentoEl = document.getElementById('conteudo-talento');
    const caixaBuscaEl = document.getElementById('caixa-busca');

    // Verifica se todos os elementos necessários existem. Se não, exibe um erro e para.
    if (!listaTalentosEl || !conteudoTalentoEl || !caixaBuscaEl) {
        console.error("Erro Crítico: Não foi possível encontrar um ou mais elementos essenciais no HTML. Verifique os IDs: 'lista-talentos', 'conteudo-talento', 'caixa-busca'.");
        return;
    }

    // 2. Criar uma variável para armazenar todos os talentos depois de serem carregados.
    let todosOsTalentos = [];

    // 3. Função para carregar os dados do ficheiro JSON.
    // Usamos 'async/await' para um código mais limpo e fácil de ler.
    async function carregarDados() {
        try {
            // O caminho absoluto '/data/feats.json' garante que ele procura o ficheiro a partir da raiz do site.
            const resposta = await fetch('/data/feats.json');

            // Se a resposta do servidor não for bem-sucedida (ex: erro 404), lança um erro.
            if (!resposta.ok) {
                throw new Error(`Erro ao buscar dados. Status: ${resposta.status}`);
            }

            // Converte a resposta em formato JSON para um objeto JavaScript.
            const dados = await resposta.json();
            todosOsTalentos = dados; // Armazena os dados na nossa variável.
            
            // Uma vez que os dados estão carregados, exibe a lista completa.
            renderizarLista(todosOsTalentos);

        } catch (erro) {
            console.error('Falha ao carregar os talentos:', erro);
            listaTalentosEl.innerHTML = `<li class="list-group-item text-danger">Erro ao carregar os talentos. Verifique o console (F12).</li>`;
        }
    }

    // 4. Função que "desenha" a lista de talentos na coluna da esquerda.
    function renderizarLista(listaParaRenderizar) {
        // Limpa a lista de qualquer item anterior (como o "Carregando...").
        listaTalentosEl.innerHTML = '';

        // Se a lista (depois de filtrar) estiver vazia, mostra uma mensagem.
        if (listaParaRenderizar.length === 0) {
            listaTalentosEl.innerHTML = `<li class="list-group-item">Nenhum talento encontrado.</li>`;
            return;
        }

        // Para cada talento na lista, cria um elemento <li> e o adiciona à lista no HTML.
        listaParaRenderizar.forEach(talento => {
            const itemEl = document.createElement('a');
            itemEl.className = 'list-group-item list-group-item-action';
            itemEl.textContent = talento.name;
            itemEl.href = '#';

            // Adiciona um evento de clique para exibir os detalhes do talento.
            itemEl.addEventListener('click', (evento) => {
                evento.preventDefault();
                renderizarDetalhes(talento);
            });

            listaTalentosEl.appendChild(itemEl);
        });
    }

    // 5. Função que "desenha" os detalhes de um talento específico na coluna da direita.
    function renderizarDetalhes(talento) {
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
    
    // 6. Adiciona o evento para a caixa de busca.
    // O evento 'input' é acionado a cada vez que o utilizador digita ou apaga algo.
    caixaBuscaEl.addEventListener('input', () => {
        const termoBusca = caixaBuscaEl.value.toLowerCase();

        // Filtra o array 'todosOsTalentos' original.
        const talentosFiltrados = todosOsTalentos.filter(talento =>
            talento.name.toLowerCase().includes(termoBusca)
        );

        // Renderiza a lista novamente, mas desta vez apenas com os itens filtrados.
        renderizarLista(talentosFiltrados);
    });

    // 7. Ponto de partida: chama a função para carregar os dados.
    carregarDados();
});
