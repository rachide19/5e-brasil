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
            if (all_classes.length > 0) {
                renderClassDetails(all_classes[0]);
            }
        } catch (error) {
            console.error("Falha ao carregar dados das classes:", error);
        }
    }

    function renderClassList() {
        classListEl.innerHTML = '';
        all_classes.forEach((cls, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            // Adiciona a classe 'active' ao primeiro botão da lista
            button.className = `list-group-item list-group-item-action ${index === 0 ? 'active' : ''}`;
            button.textContent = cls.name;
            button.onclick = (event) => {
                // Remove a classe 'active' de todos os botões e adiciona ao clicado
                document.querySelectorAll('#class-list .list-group-item').forEach(btn => btn.classList.remove('active'));
                event.currentTarget.classList.add('active');
                renderClassDetails(cls);
            };
            classListEl.appendChild(button);
        });
    }

    function renderClassDetails(cls) {
        classNameTitleEl.textContent = cls.name;
        renderClassTable(cls); // Passa a classe inteira para a função da tabela
        renderCoreTraits(cls);
        renderMulticlassing(cls.multiclassing);
        renderClassFeatures(cls.classFeatures);
    }
    
    // FUNÇÃO DA TABELA COMPLETAMENTE REFEITA PARA SER DINÂMICA
    function renderClassTable(cls) {
        const tableData = cls.classTable;
        let headers = ["Nível", "Bônus de Prof.", "Características"];
        
        // Verifica se a classe tem colunas especiais (ex: Fúrias do Bárbaro)
        if (tableData[0].rages !== undefined) headers.push("Fúrias");
        if (tableData[0].rageDamage !== undefined) headers.push("Dano de Fúria");
        if (tableData[0].cantrips !== undefined) headers.push("Truques");

        const hasSpells = tableData.some(row => row.spellSlots);
        let spellSlotHeaders = [];
        if (hasSpells) {
            // Cria um array com os níveis de magia de 1 a 9
            spellSlotHeaders = Array.from({length: 9}, (_, i) => `${i + 1}º`);
        }

        const mainHeaders = `
            <tr>
                <th rowspan="2">Nível</th>
                <th rowspan="2">Bônus de Prof.</th>
                <th rowspan="2">Características</th>
                ${tableData[0].rages !== undefined ? '<th rowspan="2">Fúrias</th>' : ''}
                ${tableData[0].rageDamage !== undefined ? '<th rowspan="2">Dano de Fúria</th>' : ''}
                ${tableData[0].cantrips !== undefined ? '<th rowspan="2">Truques</th>' : ''}
                ${hasSpells ? `<th colspan="${spellSlotHeaders.length}">Espaços de Magia por Nível</th>` : ''}
            </tr>
        `;
        
        const subHeaders = hasSpells ? `<tr>${spellSlotHeaders.map(h => `<th>${h}</th>`).join('')}</tr>` : '';

        const tableHead = `<thead>${mainHeaders}${subHeaders}</thead>`;

        const tableRows = tableData.map(row => {
            let rowHtml = `
                <tr>
                    <td>${row.level}</td>
                    <td>+${row.profBonus}</td>
                    <td>${row.features}</td>
            `;
            if (row.rages !== undefined) rowHtml += `<td>${row.rages}</td>`;
            if (row.rageDamage !== undefined) rowHtml += `<td>+${row.rageDamage}</td>`;
            if (row.cantrips !== undefined) rowHtml += `<td>${row.cantrips}</td>`;
            
            if (hasSpells) {
                for(let i = 1; i <= 9; i++) {
                    rowHtml += `<td>${row.spellSlots?.[i] || '—'}</td>`;
                }
            }
            
            rowHtml += `</tr>`;
            return rowHtml;
        }).join('');

        classTableContainerEl.innerHTML = `<table class="table table-striped table-bordered class-table">${tableHead}<tbody>${tableRows}</tbody></table>`;
    }

    function renderCoreTraits(cls) {
        const skills = cls.startingProficiencies.skills[0];
        coreTraitsEl.innerHTML = `
            <div class="card-body">
                <h4 class="card-title">Características Principais</h4>
                <ul class="list-unstyled">
                    <li><strong>Dado de Vida:</strong> d${cls.hitDie}</li>
                    <li><strong>Prof. em Resistências:</strong> ${cls.proficiency.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}</li>
                    <li><strong>Proficiências em Armaduras:</strong> ${cls.startingProficiencies.armor.join(', ') || 'Nenhuma'}</li>
                    <li><strong>Proficiências em Armas:</strong> ${cls.startingProficiencies.weapons.join(', ')}</li>
                    <li><strong>Perícias:</strong> Escolha ${skills.count} de ${skills.choose.join(', ')}</li>
                </ul>
            </div>
        `;
    }

    function renderMulticlassing(multiData) {
        const reqs = Object.entries(multiData.requires).map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)} ${value}`).join(' e ');
        multiclassingInfoEl.innerHTML = `
             <div class="card-body">
                <h4 class="card-title">Multiclasse</h4>
                <p><strong>Requisitos:</strong> ${reqs}</p>
                <p><strong>Proficiências Ganhas:</strong> ${multiData.proficienciesGained.armor?.join(', ') || 'Nenhuma'}</p>
            </div>
        `;
    }

    function renderClassFeatures(features) {
        classFeaturesContainerEl.innerHTML = '';
        features.forEach(feature => {
            const featureEl = document.createElement('div');
            featureEl.innerHTML = `
                <h4 class="mt-4">${feature.name} <span class="text-muted fs-6">(Nível ${feature.level})</span></h4>
                <p>${feature.description}</p>
            `;
            classFeaturesContainerEl.appendChild(featureEl);
        });
    }

    loadClassData();
});
