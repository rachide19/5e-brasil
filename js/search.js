document.addEventListener('DOMContentLoaded', () => {
    const formBusca = document.getElementById('form-busca');
    const inputBusca = document.getElementById('input-busca');

    if (formBusca) {
        formBusca.addEventListener('submit', (evento) => {
            // Impede o formulário de recarregar a página
            evento.preventDefault();

            const termo = inputBusca.value.trim().toLowerCase();

            if (!termo) return; // Não faz nada se a busca estiver vazia

            console.log(`Buscando por: ${termo}`);

            // Lógica de busca simples
            // Por enquanto, só entende a palavra "talentos"
            if (termo === 'talentos' || termo === 'talento' || termo === 'feat' || termo === 'feats') {
                // Redireciona o usuário para a página de talentos
                window.location.href = '/feats.html';
            } else {
                // Se não encontrar, exibe um alerta simples
                alert(`Busca por "${termo}" não encontrou resultados.`);
            }
        });
    }
});
