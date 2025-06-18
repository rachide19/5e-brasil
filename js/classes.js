document.addEventListener('DOMContentLoaded', () => {

    const classListEl = document.getElementById('class-list');
    const classNameTitleEl = document.getElementById('class-name-title');
    const classTableContainerEl = document.getElementById('class-table-container');
    const subclassContainerEl = document.getElementById('subclass-container');
    const coreTraitsEl = document.getElementById('core-traits');
    const classFeaturesContainerEl = document.getElementById('class-features-container');

    let all_classes = [];
    let currentClass = null;
    let selectedSubclass = null; 

    /**
     * CORRIGIDO: Cria um ID único para cada habilidade, usando o nome e o nível.
     * Isso previne IDs duplicados para habilidades como "Aumento no Valor de Habilidade".
     * @param {string} name - O nome da habilidade.
     * @param {number} level - O nível da habilidade.
     * @returns {string} O ID formatado.
     */
    const createFeatureId = (name, level) => {
        const normalizedName = name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
        return `${normalizedName}-level-${level}`;
    };

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
        if (!currentClass || !currentClass.subclasses || currentClass.subclasses.length === 0) return;
        
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

    function renderClassDetails() {
        if (!currentClass) return;
        classNameTitleEl.textContent = currentClass.name;
        const combinedFeatures = getCombinedFeatures();
        renderSubclasses();
        renderClassTable(currentClass, combinedFeatures);
        renderCoreTraits(currentClass);
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
    
    /**
     * CORRIGIDO: As habilidades na tabela agora são links que apontam para os IDs únicos.
     */
    function renderClassTable(cls, features) {
        const tableData = cls.classTable;
        const tableHead = `<thead>...</thead>`; // O seu código de cabeçalho aqui...

        const tableRows = tableData.map(row => {
            const levelFeaturesHtml = features
                .filter(f => f.level === row.level)
                .map(f => `<a href="#${createFeatureId(f.name, f.level)}" class="feature-link">${f.name}</a>`)
                .join(', ');

            let featuresContent = levelFeaturesHtml || row.features || '—';

            let rowHtml = `<tr>
                <td>${row.level}</td>
                <td>+${row.profBonus}</td>
                <td>${featuresContent}</td>`;

            // Adiciona colunas extras dinamicamente (Fúrias, Magias, etc.)
            if (row.rages !== undefined) rowHtml += `<td>${row.rages}</td>`;
            if (row.rageDamage !== undefined) rowHtml += `<td>+${row.rageDamage}</td>`;
            if (row.cantrips !== undefined) rowHtml += `<td>${row.cantrips}</td>`;
            if (cls.classTable.some(r => r.spellSlots)) {
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
        let content = `...`; // Seu código para os traits aqui...
        coreTraitsEl.innerHTML = content;
    }

    /**
     * CORRIGIDO: Cada bloco de descrição de habilidade agora tem um ID único.
     */
    function renderClassFeatures(features) {
        classFeaturesContainerEl.innerHTML = '';
        features.forEach(feature => {
            const featureEl = document.createElement('div');
            featureEl.id = createFeatureId(feature.name, feature.level);
            
            featureEl.innerHTML = `
                <h4 class="mt-4">${feature.name} <span class="text-muted fs-6">(Nível ${feature.level})</span></h4>
                <p>${feature.description.replace(/\n/g, '<br>')}</p>
            `;
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
