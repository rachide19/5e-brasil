document.addEventListener('DOMContentLoaded', () => {

    const backgroundListEl = document.getElementById('background-list');
    const backgroundDetailsEl = document.getElementById('background-details');

    let all_backgrounds = [];

    async function loadBackgroundData() {
        try {
            const response = await fetch('/data/backgrounds.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            all_backgrounds = await response.json();
            
            renderBackgroundList();
            // Por defeito, carrega o primeiro antecedente da lista
            if (all_backgrounds.length > 0) {
                renderBackgroundDetails(all_backgrounds[0]);
            }
        } catch (error) {
            console.error("Falha ao carregar dados dos antecedentes:", error);
            backgroundListEl.innerHTML = '<div class="p-3 text-danger">Erro ao carregar.</div>';
        }
    }

    function renderBackgroundList() {
        backgroundListEl.innerHTML = '';
        const listGroup = document.createElement('div');
        listGroup.className = 'list-group';

        all_backgrounds.forEach(bg => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'list-group-item list-group-item-action';
            button.textContent = bg.name;
            button.onclick = (event) => {
                document.querySelectorAll('#background-list .list-group-item').forEach(btn => btn.classList.remove('active'));
                event.currentTarget.classList.add('active');
                renderBackgroundDetails(bg);
            };
            listGroup.appendChild(button);
        });
        backgroundListEl.appendChild(listGroup);
        // Ativa o primeiro item da lista por defeito
        if (listGroup.firstChild) {
            listGroup.firstChild.classList.add('active');
        }
    }

    function renderBackgroundDetails(bg) {
        backgroundDetailsEl.innerHTML = `
            <div class="p-4">
                <h2>${bg.name}</h2>
                <p class="text-muted">Fonte: ${bg.source}</p>
                <hr>
                <p><strong>Proficiência em Perícias:</strong> ${bg.skillProficiencies.join(', ')}</p>
                <p><strong>Idiomas:</strong> ${bg.languages}</p>
                <p><strong>Equipamento:</strong> ${bg.equipment}</p>
                <hr>
                <h4>${bg.feature.name}</h4>
                <p>${bg.feature.description}</p>
                <hr>
                <h5>Características Sugeridas</h5>
                <p>${bg.suggestedCharacteristics}</p>
            </div>
        `;
    }

    loadBackgroundData();
});
