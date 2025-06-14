document.addEventListener('DOMContentLoaded', () => {
    const formBusca = document.getElementById('form-busca');
    const inputBusca = document.getElementById('input-busca');
    // ATUALIZADO: Agora o nosso alvo é o container com a barra de rolagem
    const dropdownContainer = document.getElementById('dropdown-talentos-container');

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

    async function carregarTalentosDropdown() {
        if (!dropdownContainer) return;

        try {
            const resposta = await fetch('/data/feats.json');
            if (!resposta.ok) throw new Error('Falha ao buscar talentos');
            
            const talentos = await resposta.json();

            // Limpa o conteúdo inicial ("Carregando...")
            dropdownContainer.innerHTML = '';

            // Para cada talento, cria um link e o adiciona diretamente ao container
            talentos.forEach(talento => {
                const a = document.createElement('a');
                a.className = 'dropdown-item';
                a.href = `/feats.html#${encodeURIComponent(talento.name)}`;
                a.textContent = talento.name;
                dropdownContainer.appendChild(a);
            });

        } catch (erro) {
            console.error("Erro ao carregar talentos no dropdown:", erro);
            dropdownContainer.innerHTML = '<span class="dropdown-item-text text-danger">Erro ao carregar</span>';
        }
    }

    inicializarBusca();
    carregarTalentosDropdown();
});
