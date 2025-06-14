document.addEventListener('DOMContentLoaded', () => {

    const speciesListEl = document.getElementById('species-list');
    const speciesDetailsEl = document.getElementById('species-details');

    let all_species = [];

    async function loadSpeciesData() {
        try {
            const response = await fetch('/data/species.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            all_species = await response.json();
            
            renderSpeciesList();
            // Por defeito, carrega a primeira espécie da lista
            if (all_species.length > 0) {
                renderSpeciesDetails(all_species[0]);
            }
        } catch (error) {
            console.error("Falha ao carregar dados das espécies:", error);
            speciesListEl.innerHTML = '<div class="p-3 text-danger">Erro ao carregar.</div>';
        }
    }

    function renderSpeciesList() {
        speciesListEl.innerHTML = '';
        const listGroup = document.createElement('div');
        listGroup.className = 'list-group';

        all_species.forEach(species => {
            // Adiciona a espécie principal
            const mainButton = createSpeciesButton(species, species.name);
            listGroup.appendChild(mainButton);

            // Adiciona as sub-raças, se existirem
            if (species.subraces && species.subraces.length > 0) {
                species.subraces.forEach(subrace => {
                    // Combina os dados da espécie principal com a sub-raça
                    const fullSubraceData = { ...species, ...subrace, name: subrace.name, originalName: species.name };
                    const subraceButton = createSpeciesButton(fullSubraceData, `${species.name} (${subrace.name})`, true);
                    listGroup.appendChild(subraceButton);
                });
            }
        });
        speciesListEl.appendChild(listGroup);
    }

    function createSpeciesButton(speciesData, displayName, isSubrace = false) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `list-group-item list-group-item-action ${isSubrace ? 'subrace-item' : ''}`;
        button.textContent = displayName;
        button.onclick = (event) => {
            document.querySelectorAll('#species-list .list-group-item').forEach(btn => btn.classList.remove('active'));
            event.currentTarget.classList.add('active');
            renderSpeciesDetails(speciesData);
        };
        return button;
    }

    function renderSpeciesDetails(data) {
        let traitsHtml = '';
        
        // Renderiza os traços da espécie principal
        data.traits.forEach(trait => {
            traitsHtml += `<h5>${trait.name}</h5><p>${trait.description}</p>`;
        });

        // Se for uma sub-raça, renderiza também os seus traços únicos
        if (data.originalName) {
            // A lógica aqui assume que os traços da sub-raça estão no nível superior do objeto 'data'
            // após a fusão. Vamos ajustar a estrutura de dados para simplificar.
            // Para a estrutura atual, a lógica de renderização dos traços da sub-raça
            // já está incluída no array 'traits' da espécie principal.
            // A estrutura de dados de exemplo foi simplificada. Para uma estrutura mais complexa,
            // seria necessário combinar os arrays `traits` da espécie e da sub-raça.
        }

        speciesDetailsEl.innerHTML = `
            <div class="p-4">
                <h2>${data.name} ${data.originalName ? `(${data.originalName})` : ''}</h2>
                <hr>
                <p><strong>Aumento de Valor de Atributo:</strong> ${data.abilityScoreIncrease}</p>
                <p><strong>Idade:</strong> ${data.age}</p>
                <p><strong>Alinhamento:</strong> ${data.alignment}</p>
                <p><strong>Tamanho:</strong> ${data.size}</p>
                <p><strong>Velocidade:</strong> ${data.speed}</p>
                <p><strong>Visão:</strong> ${data.vision}</p>
                <hr>
                ${traitsHtml}
                <hr>
                <p><strong>Idiomas:</strong> ${data.languages}</p>
            </div>
        `;
    }

    loadSpeciesData();
});
