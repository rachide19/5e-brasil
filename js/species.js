document.addEventListener('DOMContentLoaded', () => {
    // Assumindo que seu species.html tem uma estrutura similar a feats.html
    const speciesListEl = document.getElementById('species-list');
    const speciesDetailsEl = document.getElementById('species-details');

    if (!speciesListEl || !speciesDetailsEl) {
        console.error("Elementos 'species-list' ou 'species-details' não encontrados.");
        return;
    }

    async function loadSpeciesData() {
        const officialSource = '/data/species.json';
        const barbaBrewSource = '/data/homebrew/barbabrew_species.json';
        const localHomebrewKey = 'd5e-homebrew-species';

        try {
            // Carrega dados oficiais e do BarbaBrew em paralelo
            const fetchPromises = [
                fetch(officialSource).then(res => res.ok ? res.json() : []),
                fetch(barbaBrewSource).then(res => res.ok ? res.json() : [])
            ];
            
            const [officialSpecies, barbaBrewSpecies] = await Promise.all(fetchPromises);
            
            // Carrega dados do localStorage
            const localSpecies = JSON.parse(localStorage.getItem(localHomebrewKey) || '[]');

            // Combina todas as fontes, ordena e renderiza
            const allSpecies = [...officialSpecies, ...barbaBrewSpecies, ...localSpecies]
                .sort((a, b) => a.name.localeCompare(b.name));

            renderSpeciesList(allSpecies);

            if (allSpecies.length > 0) {
                renderSpeciesDetails(allSpecies[0]);
                // ... lógica para ativar o primeiro item ...
            }

        } catch (error) {
            console.error('Falha ao carregar as espécies:', error);
            speciesListEl.innerHTML = '<div class="list-group-item text-danger">Erro ao carregar espécies.</div>';
        }
    }
    
    function renderSpeciesList(species) {
        // ... Lógica para renderizar a lista, similar à de feats.js
        // Adicione tags visuais para 'BarbaBrew' e 'Homebrew Pessoal'
    }

    function renderSpeciesDetails(specie) {
        // ... Lógica para renderizar os detalhes, similar à de feats.js
    }

    loadSpeciesData();
});
