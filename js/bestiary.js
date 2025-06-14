document.addEventListener('DOMContentLoaded', () => {
    const listEl = document.getElementById('bestiary-list');
    const detailsEl = document.getElementById('bestiary-details');

    async function loadBestiary() {
        try {
            const response = await fetch('/data/bestiary.json');
            const bestiary = await response.json();
            renderList(bestiary);
            if (bestiary.length > 0) {
                renderDetails(bestiary[0]);
            }
        } catch (error) {
            console.error("Falha ao carregar bestiário:", error);
        }
    }

    function renderList(creatures) {
        const listGroup = document.createElement('div');
        listGroup.className = 'list-group';
        creatures.forEach(creature => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'list-group-item list-group-item-action';
            button.innerHTML = `${creature.name} <small class="text-muted d-block">CR ${creature.cr}</small>`;
            button.onclick = (event) => {
                 document.querySelectorAll('#bestiary-list .list-group-item').forEach(btn => btn.classList.remove('active'));
                 event.currentTarget.classList.add('active');
                 renderDetails(creature);
            };
            listGroup.appendChild(button);
        });
        listEl.innerHTML = '';
        listEl.appendChild(listGroup);
        if (listGroup.firstChild) {
            listGroup.firstChild.classList.add('active');
        }
    }

    function renderDetails(creature) {
        const getModifier = (score) => {
            const mod = Math.floor((score - 10) / 2);
            return mod >= 0 ? `+${mod}` : mod;
        };
        
        const statsHtml = `
            <div class="row text-center my-3">
                <div class="col"><strong>FOR</strong><br>${creature.stats.str} (${getModifier(creature.stats.str)})</div>
                <div class="col"><strong>DES</strong><br>${creature.stats.dex} (${getModifier(creature.stats.dex)})</div>
                <div class="col"><strong>CON</strong><br>${creature.stats.con} (${getModifier(creature.stats.con)})</div>
                <div class="col"><strong>INT</strong><br>${creature.stats.int} (${getModifier(creature.stats.int)})</div>
                <div class="col"><strong>SAB</strong><br>${creature.stats.wis} (${getModifier(creature.stats.wis)})</div>
                <div class="col"><strong>CAR</strong><br>${creature.stats.cha} (${getModifier(creature.stats.cha)})</div>
            </div>
        `;

        const traitsHtml = creature.traits.map(trait => `
            <p><strong><em>${trait.name}.</em></strong> ${trait.description}</p>
        `).join('');

        const actionsHtml = creature.actions.map(action => `
            <p><strong><em>${action.name}.</em></strong> <em>${action.type}:</em> ${action.details}</p>
        `).join('');

        detailsEl.innerHTML = `
            <div class="stat-block">
                <div class="creature-heading">
                    <h1>${creature.name}</h1>
                    <em>${creature.size} ${creature.type}, ${creature.alignment}</em>
                </div>
                <div class="red-bar"></div>
                <div class="p-3">
                    <p><strong>Classe de Armadura</strong> ${creature.ac} ${creature.ac_desc || ''}</p>
                    <p><strong>Pontos de Vida</strong> ${creature.hp} ${creature.hp_formula || ''}</p>
                    <p><strong>Velocidade</strong> ${creature.speed}</p>
                </div>
                <div class="red-bar"></div>
                ${statsHtml}
                <div class="red-bar"></div>
                <div class="p-3">
                    ${creature.skills ? `<p><strong>Perícias</strong> ${Object.entries(creature.skills).map(([skill, value]) => `${skill} +${value}`).join(', ')}</p>` : ''}
                    <p><strong>Sentidos</strong> ${creature.senses}</p>
                    <p><strong>Idiomas</strong> ${creature.languages}</p>
                    <p><strong>Nível de Desafio</strong> ${creature.cr} (${creature.xp} XP)</p>
                </div>
                ${traitsHtml ? `<div class="p-3">${traitsHtml}</div>` : ''}
                <h3>Ações</h3>
                <div class="red-bar"></div>
                <div class="p-3">
                    ${actionsHtml}
                </div>
            </div>
        `;
    }

    loadBestiary();
});
