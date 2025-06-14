document.addEventListener('DOMContentLoaded', () => {
    const listEl = document.getElementById('options-list');
    const detailsEl = document.getElementById('options-details');

    async function loadOptions() {
        try {
            const response = await fetch('/data/options.json');
            const options = await response.json();
            renderList(options);
            if (options.length > 0) {
                renderDetails(options[0]);
            }
        } catch (error) {
            console.error("Falha ao carregar opções:", error);
        }
    }

    function renderList(options) {
        const listGroup = document.createElement('div');
        listGroup.className = 'list-group';
        options.forEach(opt => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'list-group-item list-group-item-action';
            button.textContent = opt.name;
            button.onclick = () => renderDetails(opt);
            listGroup.appendChild(button);
        });
        listEl.innerHTML = '';
        listEl.appendChild(listGroup);
    }

    function renderDetails(opt) {
        detailsEl.innerHTML = `
            <div class="p-4">
                <h2>${opt.name}</h2>
                <p class="text-muted">Fonte: ${opt.source}</p>
                <hr>
                <p><strong>Tipo:</strong> ${opt.type}</p>
                <p><strong>Pré-requisito:</strong> ${opt.prerequisite}</p>
                <hr>
                <p>${opt.description}</p>
            </div>
        `;
    }

    loadOptions();
});
