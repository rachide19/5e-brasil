document.addEventListener('DOMContentLoaded', () => {
    const listEl = document.getElementById('spells-list');
    const detailsEl = document.getElementById('spells-details');
    const searchBox = document.getElementById('spell-search-box');
    const levelFilter = document.getElementById('spell-level-filter');
    const classFilter = document.getElementById('spell-class-filter');

    let all_spells = [];

    async function loadSpells() {
        try {
            const response = await fetch('/data/spells.json');
            all_spells = await response.json();
            populateFilters();
            applyFilters();
        } catch (error) {
            console.error("Falha ao carregar magias:", error);
        }
    }

    function populateFilters() {
        const levels = [...new Set(all_spells.map(s => s.level))].sort((a,b) => a-b);
        const classes = [...new Set(all_spells.flatMap(s => s.classes))].sort();

        levels.forEach(level => {
            const option = document.createElement('option');
            option.value = level;
            option.textContent = level === 0 ? 'Truque' : `Nível ${level}`;
            levelFilter.appendChild(option);
        });

        classes.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls;
            option.textContent = cls;
            classFilter.appendChild(option);
        });
    }
    
    function applyFilters() {
        const searchTerm = searchBox.value.toLowerCase();
        const selectedLevel = levelFilter.value;
        const selectedClass = classFilter.value;

        const filteredSpells = all_spells.filter(spell => {
            const nameMatch = spell.name.toLowerCase().includes(searchTerm);
            const levelMatch = selectedLevel === 'all' || spell.level == selectedLevel;
            const classMatch = selectedClass === 'all' || spell.classes.includes(selectedClass);
            return nameMatch && levelMatch && classMatch;
        });
        
        renderList(filteredSpells);
        if(filteredSpells.length > 0){
            renderDetails(filteredSpells[0]);
        } else {
            detailsEl.innerHTML = '<div class="p-4 text-center">Nenhuma magia encontrada.</div>';
        }
    }

    function renderList(spells) {
        const listGroup = document.createElement('div');
        listGroup.className = 'list-group';
        spells.forEach(spell => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'list-group-item list-group-item-action';
            button.innerHTML = `${spell.name} <small class="text-muted d-block">${spell.school} de Nível ${spell.level}</small>`;
            button.onclick = () => renderDetails(spell);
            listGroup.appendChild(button);
        });
        listEl.innerHTML = '';
        listEl.appendChild(listGroup);
    }

    function renderDetails(spell) {
        detailsEl.innerHTML = `
            <div class="p-4">
                <h2>${spell.name}</h2>
                <p><em>${spell.school} de ${spell.level === 0 ? 'Truque' : `Nível ${spell.level}`}</em></p>
                <hr>
                <p><strong>Tempo de Conjuração:</strong> ${spell.casting_time}</p>
                <p><strong>Alcance:</strong> ${spell.range}</p>
                <p><strong>Componentes:</strong> ${spell.components.join(', ')}</p>
                <p><strong>Duração:</strong> ${spell.duration}</p>
                <hr>
                <p>${spell.description}</p>
                <hr>
                <p><strong>Classes:</strong> ${spell.classes.join(', ')}</p>
            </div>
        `;
    }

    searchBox.addEventListener('input', applyFilters);
    levelFilter.addEventListener('change', applyFilters);
    classFilter.addEventListener('change', applyFilters);

    loadSpells();
});
