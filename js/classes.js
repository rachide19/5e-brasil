document.addEventListener('DOMContentLoaded', () => {

    // --- Seletores de Elementos ---
    const classListEl = document.getElementById('class-list');
    const classNameTitleEl = document.getElementById('class-name-title');
    const classTableContainerEl = document.getElementById('class-table-container');
    const subclassContainerEl = document.getElementById('subclass-container');
    const coreTraitsEl = document.getElementById('core-traits');
    // A constante para multiclassing foi removida, pois o elemento não existe mais.
    const classFeaturesContainerEl = document.getElementById('class-features-container');

    // --- Variáveis de Estado ---
    let all_classes = [];
    let currentClass = null;
    let selectedSubclass = null; 

    function getCombinedFeatures() {
        if (!currentClass) return [];
        const subclassFeatures = selectedSubclass ? selectedSubclass.features : [];
        const subclassFeatureLevels = subclassFeatures.map(f => f.level);
        const baseFeatures = currentClass.classFeatures.filter(feature => !subclassFeatureLevels.includes(feature.level));
        const combined = [...baseFeatures, ...subclassFeatures];
        return combined.sort((a, b) => a.level - b.level);
    }

    function renderSubclasses() {
        subclassContainerEl.innerHTML = '';
        if (!currentClass || !currentClass.subclasses || currentClass.subclasses.length === 0) {
            return;
        }
        const title = document.createElement('h4');
        title.textContent = "Subclasses";
        title.className = "mb-3";
        subclassContainerEl.appendChild(title);
        currentClass.subclasses.forEach(subclass => {
            const button = document.createElement('button');
            button.className = 'btn btn-outline-primary me-2 mb-2';
            button.textContent = subclass.name;
            if (selectedSubclass && selectedSubclass.name === subclass.name) {
                button.classList.add('active');
            }
            button.onclick = () => {
                selectedSubclass = (selectedSubclass && selectedSubclass.name === subclass.name) ? null : subclass;
                renderClassDetails();
            };
            subclassContainerEl.appendChild(button);
        });
    }

    // ALTERADO: A chamada para renderMulticlassing foi removida.
    function renderClassDetails() {
        if (!currentClass) return;
        classNameTitleEl.textContent = currentClass.name;
        const combinedFeatures = getCombinedFeatures();
        renderSubclasses();
        renderClassTable(currentClass, combinedFeatures);
        renderCoreTraits(currentClass); // Esta função agora lida com multiclasse também.
        renderClassFeatures(combinedFeatures);
    }

    function renderClassList() {
        classListEl.innerHTML = '';
        all_classes.forEach((cls, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `list-group-item list-group-item-action ${index === 0 ? 'active' : ''}`;
            button.textContent = cls.name;
            button.onclick = (event) => {
                document.querySelectorAll('#class-list .list-group-item').forEach(btn => btn.classList.remove('active'));
                event.currentTarget.classList.add('active');
                currentClass = cls;
                selectedSubclass = null; 
                renderClassDetails();
            };
            classListEl.appendChild(button);
        });
    }
    
    function renderClassTable(cls, features) {
        const tableData = cls.classTable;
        let headers = ["Nível", "Bônus de Prof.", "Características"];
        if (tableData[0].rages !== undefined) headers.push("Fúrias");
        if (tableData[0].rageDamage !== undefined) headers.push("Dano de Fúria");
        if (tableData[0].cantrips !== undefined) headers.push("Truques");
        const hasSpells = tableData.some(row => row.spellSlots);
        let spellSlotHeaders = [];
        if (hasSpells) {
            spellSlotHeaders = Array.from({length: 9}, (_, i) => `${i + 1}º`);
        }
        const mainHeaders = `<tr><th rowspan="2">Nível</th><th rowspan="2">Bônus de Prof.</th><th rowspan="2">Características</th>${tableData[0].rages !== undefined ? '<th rowspan="2">Fúrias</th>' : ''}${tableData[0].rageDamage !== undefined ? '<th rowspan="2">Dano de Fúria</th>' : ''}${tableData[0].cantrips !== undefined ? '<th rowspan="2">Truques</th>' : ''}${hasSpells ? `<th colspan="${spellSlotHeaders.length}">Espaços de Magia por Nível</th>` : ''}</tr>`;
        const subHeaders = hasSpells ? `<tr>${spellSlotHeaders.map(h => `<th>${h}</th>`).join('')}</tr>` : '';
        const tableHead = `<thead>${mainHeaders}${subHeaders}</thead>`;
        const tableRows = tableData.map(row => {
            const levelFeatures = features.filter(f => f.level === row.level).map(f => f.name).join(', ');
            let rowHtml = `<tr>
                <td>${row.level}</td>
                <td>+${row.profBonus}</td>
                <td>${levelFeatures || row.features || '—'}</td>`;
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

    /**
     * ALTERADO: Esta função agora também renderiza as informações de Multiclasse.
     * @param {object} cls O objeto da classe atual.
     */
    function renderCoreTraits(cls) {
        const skills = cls.startingProficiencies.skills[0];
        let content = `
            <div class="card-body">
                <h4 class="card-title">Características Principais</h4>
                <ul class="list-unstyled">
                    <li><strong>Dado de Vida:</strong> d${cls.hitDie}</li>
                    <li><strong>Prof. em Resistências:</strong> ${cls.proficiency.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}</li>
                    <li><strong>Proficiências em Armaduras:</strong> ${cls.startingProficiencies.armor.join(', ') || 'Nenhuma'}</li>
                    <li><strong>Proficiências em Armas:</strong> ${cls.startingProficiencies.weapons.join(', ')}</li>
                    <li><strong>Perícias:</strong> Escolha ${skills.count} de ${skills.choose.join(', ')}</li>
                </ul>
        `;
        if (cls.multiclassing) {
            const multiData = cls.multiclassing;
            const reqs = Object.entries(multiData.requires).map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)} ${value}`).join(' e ');
            content += `
                <hr>
                <h5 class="card-title" style="font-size: 1.1rem;">Multiclasse</h5>
                <p class="mb-1" style="font-size: 0.9rem;"><strong>Requisitos:</strong> ${reqs}</p>
                <p class="mb-0" style="font-size: 0.9rem;"><strong>Proficiências Ganhas:</strong> ${multiData.proficienciesGained.armor?.join(', ') || 'Nenhuma'}</p>
            `;
        }
        content += `</div>`;
        coreTraitsEl.innerHTML = content;
    }

    // A função renderMulticlassing foi removida pois sua lógica foi incorporada acima.

    function renderClassFeatures(features) {
        classFeaturesContainerEl.innerHTML = '';
        features.forEach(feature => {
            const featureEl = document.createElement('div');
            featureEl.innerHTML = `<h4 class="mt-4">${feature.name} <span class="text-muted fs-6">(Nível ${feature.level})</span></h4><p>${feature.description.replace(/\n/g, '<br>')}</p>`;
            classFeaturesContainerEl.appendChild(featureEl);
        });
    }

    async function loadClassData() {
        try {
            const response = await fetch('/data/classes.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            all_classes = await response.json();
            renderClassList();
            if (all_classes.length > 0) {
                currentClass = all_classes[0];
                selectedSubclass = null; 
                renderClassDetails();
            }
        } catch (error) {
            console.error("Falha ao carregar dados das classes:", error);
        }
    }

    loadClassData();
});
