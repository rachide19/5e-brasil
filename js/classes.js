document.addEventListener('DOMContentLoaded', () => {

    const classListEl = document.getElementById('class-list');
    const classNameTitleEl = document.getElementById('class-name-title');
    const classTableContainerEl = document.getElementById('class-table-container');
    const coreTraitsEl = document.getElementById('core-traits');
    const multiclassingInfoEl = document.getElementById('multiclassing-info');
    const classFeaturesContainerEl = document.getElementById('class-features-container');

    let all_classes = [];

    async function loadClassData() {
        try {
            const response = await fetch('/data/classes.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            all_classes = await response.json();
            
            renderClassList();
            // Por defeito, carrega a primeira classe da lista (Paladino)
            if (all_classes.length > 0) {
                renderClassDetails(all_classes[0]);
            }
        } catch (error) {
            console.error("Falha ao carregar dados das classes:", error);
        }
    }

    function renderClassList() {
        classListEl.innerHTML = '';
        all_classes.forEach(cls => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'list-group-item list-group-item-action';
            button.textContent = cls.name;
            button.onclick = () => renderClassDetails(cls);
            classListEl.appendChild(button);
        });
    }

    function renderClassDetails(cls) {
        classNameTitleEl.textContent = cls.name;
        renderClassTable(cls.classTable);
        renderCoreTraits(cls);
        renderMulticlassing(cls.multiclassing);
        renderClassFeatures(cls.classFeatures);
    }

    function renderClassTable(tableData) {
        const tableHeaders = `
            <thead>
                <tr>
                    <th>Nível</th>
                    <th>Bônus de Prof.</th>
                    <th>Características</th>
                    <th colspan="5">Espaços de Magia por Nível</th>
                </tr>
                <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th>1º</th><th>2º</th><th>3º</th><th>4º</th><th>5º</th>
                </tr>
            </thead>
        `;
        
        const tableRows = tableData.map(row => `
            <tr>
                <td>${row.level}</td>
                <td>+${row.profBonus}</td>
                <td>${row.features}</td>
                <td>${row.spellSlots['1'] || '—'}</td>
                <td>${row.spellSlots['2'] || '—'}</td>
                <td>${row.spellSlots['3'] || '—'}</td>
                <td>${row.spellSlots['4'] || '—'}</td>
                <td>${row.spellSlots['5'] || '—'}</td>
            </tr>
        `).join('');

        classTableContainerEl.innerHTML = `<table class="table table-striped table-bordered class-table">${tableHeaders}<tbody>${tableRows}</tbody></table>`;
    }

    function renderCoreTraits(cls) {
        const skills = cls.startingProficiencies.skills[0];
        coreTraitsEl.innerHTML = `
            <div class="card-body">
                <h4 class="card-title">Características Principais</h4>
                <ul class="list-unstyled">
                    <li><strong>Dado de Vida:</strong> d${cls.hitDie}</li>
                    <li><strong>Prof. em Resistências:</strong> ${cls.proficiency.join(', ')}</li>
                    <li><strong>Proficiências em Armaduras:</strong> ${cls.startingProficiencies.armor.join(', ')}</li>
                    <li><strong>Proficiências em Armas:</strong> ${cls.startingProficiencies.weapons.join(', ')}</li>
                    <li><strong>Perícias:</strong> Escolha ${skills.count} de ${skills.choose.join(', ')}</li>
                </ul>
            </div>
        `;
    }

    function renderMulticlassing(multiData) {
        multiclassingInfoEl.innerHTML = `
             <div class="card-body">
                <h4 class="card-title">Multiclasse</h4>
                <p><strong>Requisitos:</strong> Força ${multiData.requires.strength} e Carisma ${multiData.requires.charisma}</p>
                <p><strong>Proficiências Ganhas:</strong> ${multiData.proficienciesGained.armor.join(', ')}</p>
            </div>
        `;
    }

    function renderClassFeatures(features) {
        classFeaturesContainerEl.innerHTML = '';
        features.forEach(feature => {
            const featureEl = document.createElement('div');
            featureEl.innerHTML = `
                <h4 class="mt-4">Nível ${feature.level}: ${feature.name}</h4>
                <p>${feature.description}</p>
            `;
            classFeaturesContainerEl.appendChild(featureEl);
        });
    }

    loadClassData();
});
