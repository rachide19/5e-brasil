document.addEventListener('DOMContentLoaded', () => {
    const listEl = document.getElementById('items-list');
    const detailsEl = document.getElementById('items-details');

    async function loadItems() {
        try {
            const response = await fetch('/data/items.json');
            const items = await response.json();
            renderList(items);
            if (items.length > 0) {
                renderDetails(items[0]);
            }
        } catch (error) {
            console.error("Falha ao carregar itens:", error);
        }
    }

    function renderList(items) {
        const listGroup = document.createElement('div');
        listGroup.className = 'list-group';
        items.forEach(item => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'list-group-item list-group-item-action';
            button.textContent = item.name;
            button.onclick = () => renderDetails(item);
            listGroup.appendChild(button);
        });
        listEl.innerHTML = '';
        listEl.appendChild(listGroup);
    }

    function renderDetails(item) {
        detailsEl.innerHTML = `
            <div class="p-4">
                <h2>${item.name}</h2>
                <p class="text-muted">Fonte: ${item.source}</p>
                <hr>
                <p><strong>Tipo:</strong> ${item.type}</p>
                <p><strong>Raridade:</strong> ${item.rarity}</p>
                <hr>
                <p>${item.description}</p>
            </div>
        `;
    }

    loadItems();
});
