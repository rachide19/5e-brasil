document.addEventListener('DOMContentLoaded', () => {
    const listEl = document.getElementById('adventures-list');
    const detailsEl = document.getElementById('adventures-details');

    async function loadAdventures() {
        try {
            const response = await fetch('/data/adventures.json');
            const adventures = await response.json();
            renderList(adventures);
            if (adventures.length > 0) {
                renderDetails(adventures[0]);
                // Ativa o primeiro item da lista por defeito
                listEl.querySelector('.list-group-item')?.classList.add('active');
            }
        } catch (error) {
            console.error("Falha ao carregar aventuras:", error);
            listEl.innerHTML = '<div class="p-3 text-danger">Erro ao carregar.</div>';
        }
    }

    function renderList(adventures) {
        const listGroup = document.createElement('div');
        listGroup.className = 'list-group';
        adventures.forEach(adv => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'list-group-item list-group-item-action';
            button.textContent = adv.name;
            button.onclick = (event) => {
                 document.querySelectorAll('#adventures-list .list-group-item').forEach(btn => btn.classList.remove('active'));
                 event.currentTarget.classList.add('active');
                 renderDetails(adv);
            };
            listGroup.appendChild(button);
        });
        listEl.innerHTML = '';
        listEl.appendChild(listGroup);
    }

    function renderDetails(adv) {
        detailsEl.innerHTML = `
            <div class="p-4">
                <h2>${adv.name}</h2>
                <p class="text-muted">Fonte: ${adv.source}</p>
                <hr>
                <p><strong>Nível:</strong> ${adv.level}</p>
                <hr>
                <p>${adv.description}</p>
                <h5>Sinopse</h5>
                <p>${adv.synopsis}</p>
            </div>
        `;
    }

    loadAdventures();
});
