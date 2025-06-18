document.addEventListener('DOMContentLoaded', () => {
    // CORRIGIDO: Seleciona apenas os IDs que realmente existem no seu feats.html
    const featsListEl = document.getElementById('feats-list');
    const featsDetailsEl = document.getElementById('feats-details');

    // Validação simplificada. Removida a verificação da caixa de busca.
    if (!featsListEl || !featsDetailsEl) {
        console.error("Erro Crítico: O elemento 'feats-list' ou 'feats-details' não foi encontrado no HTML.");
        return;
    }

    let allFeats = []; // Armazena todos os talentos carregados

    /**
     * Carrega os dados dos talentos a partir do arquivo JSON.
     */
    async function loadFeatsData() {
        try {
            const response = await fetch('/data/feats.json');
            if (!response.ok) {
                throw new Error(`Erro de rede: ${response.status}`);
            }
            allFeats = await response.json();
            renderFeatsList(allFeats); // Exibe a lista completa

            // MELHORIA: Exibe o primeiro talento da lista por padrão
            if (allFeats.length > 0) {
                renderFeatDetails(allFeats[0]);
                // Ativa o primeiro item da lista visualmente
                setTimeout(() => {
                    const firstItem = document.querySelector('#feats-list .list-group-item');
                    if(firstItem) firstItem.classList.add('active');
                }, 0);
            }

        } catch (error) {
            console.error('Falha ao carregar os talentos:', error);
            featsListEl.innerHTML = '<div class="list-group"><div class="list-group-item text-danger">Erro ao carregar talentos.</div></div>';
        }
    }

    /**
     * Renderiza a lista de talentos no painel lateral.
     * @param {Array} feats - A lista de talentos a ser exibida.
     */
    function renderFeatsList(feats) {
        featsListEl.innerHTML = ''; // Limpa a mensagem "Carregando..."
        if (feats.length === 0) {
            featsListEl.innerHTML = '<div class="list-group"><div class="list-group-item">Nenhum talento encontrado.</div></div>';
            return;
        }

        const listGroup = document.createElement('div');
        listGroup.className = 'list-group';

        feats.forEach(feat => {
            const itemEl = document.createElement('a');
            itemEl.className = 'list-group-item list-group-item-action';
            itemEl.textContent = feat.name;
            itemEl.href = '#'; // Usado para comportamento de link
            itemEl.addEventListener('click', (e) => {
                e.preventDefault();
                renderFeatDetails(feat);
                
                // Adiciona a classe 'active' ao item clicado
                document.querySelectorAll('#feats-list .list-group-item').forEach(btn => btn.classList.remove('active'));
                itemEl.classList.add('active');
            });
            listGroup.appendChild(itemEl);
        });
        featsListEl.appendChild(listGroup);
    }

    /**
     * Renderiza os detalhes de um talento específico no painel de conteúdo.
     * @param {object} feat - O objeto do talento a ser exibido.
     */
    function renderFeatDetails(feat) {
        const prerequisites = feat.prerequisite 
            ? `<p class="card-text"><strong>Pré-requisito:</strong> ${feat.prerequisite}</p>` 
            : ''; // Não mostra nada se não houver pré-requisito

        const descriptionsHtml = feat.entries.map(entry => {
            if (typeof entry === 'string') {
                return `<p>${entry}</p>`;
            } else if (entry.type === 'list') {
                const listItems = entry.items.map(item => `<li>${item}</li>`).join('');
                return `<ul>${listItems}</ul>`;
            }
            return '';
        }).join('');

        featsDetailsEl.innerHTML = `
            <div class="p-4">
                <h3>${feat.name}</h3>
                <h6 class="card-subtitle mb-2 text-muted">Fonte: ${feat.source}</h6>
                ${prerequisites}
                <hr>
                ${descriptionsHtml}
            </div>
        `;
    }
    loadFeatsData();
});
