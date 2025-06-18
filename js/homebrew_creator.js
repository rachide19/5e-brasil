document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos do formulário
    const form = document.getElementById('species-creator-form');
    const abilityScoresContainer = document.getElementById('ability-scores-container');
    const addTraitBtn = document.getElementById('add-trait-btn');
    const traitsContainer = document.getElementById('species-traits-container');
    const lineageToggle = document.getElementById('lineage-toggle');
    const lineageContainer = document.getElementById('lineage-container');
    const darkvisionCustomInput = document.getElementById('dv-custom-input');
    const darkvisionRadios = document.querySelectorAll('input[name="darkvision-type"]');
    const saveFeedbackEl = document.getElementById('save-feedback');

    // Limita a seleção de atributos a 2
    abilityScoresContainer.addEventListener('change', (e) => {
        const checkedBoxes = abilityScoresContainer.querySelectorAll('input[type="checkbox"]:checked');
        if (checkedBoxes.length > 2) {
            e.target.checked = false;
        }
    });

    // Mostra/esconde a caixa de texto da visão no escuro personalizada
    darkvisionRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            darkvisionCustomInput.style.display = document.getElementById('dv-custom').checked ? 'block' : 'none';
        });
    });

    // Adiciona um novo campo de texto para características
    addTraitBtn.addEventListener('click', () => {
        const newTextArea = document.createElement('textarea');
        newTextArea.className = 'form-control mb-2';
        newTextArea.rows = 2;
        traitsContainer.appendChild(newTextArea);
    });

    // Mostra/esconde a caixa de texto da linhagem
    lineageToggle.addEventListener('change', () => {
        lineageContainer.style.display = lineageToggle.checked ? 'block' : 'none';
    });

    // Lida com o envio do formulário
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Previne o recarregamento da página

        // 1. Coletar todos os dados do formulário
        const speciesData = {
            name: document.getElementById('species-name').value,
            source: 'Homebrew Pessoal', // Identificador especial
            abilityScoreIncrease: Array.from(abilityScoresContainer.querySelectorAll('input:checked')).map(cb => cb.value),
            age: document.getElementById('species-age').value,
            alignment: document.getElementById('species-alignment').value,
            size: document.getElementById('species-size').value,
            speed: document.getElementById('species-speed').value,
            darkvision: {
                type: document.querySelector('input[name="darkvision-type"]:checked').value,
                customText: darkvisionCustomInput.value
            },
            traits: Array.from(traitsContainer.querySelectorAll('textarea')).map(ta => ta.value).filter(t => t),
            languages: document.getElementById('species-languages').value,
            hasLineage: lineageToggle.checked,
            lineageTraits: document.getElementById('lineage-traits').value
        };
        
        // Validação simples
        if (!speciesData.name) {
            alert('O nome da espécie é obrigatório!');
            return;
        }

        // 2. Salvar no localStorage
        try {
            const key = 'd5e-homebrew-species';
            const existingSpecies = JSON.parse(localStorage.getItem(key) || '[]');
            existingSpecies.push(speciesData);
            localStorage.setItem(key, JSON.stringify(existingSpecies));

            // 3. Dar feedback ao utilizador
            saveFeedbackEl.innerHTML = `
                <div class="alert alert-success" role="alert">
                    Espécie "<strong>${speciesData.name}</strong>" salva com sucesso no seu navegador!
                    <a href="/species.html" class="alert-link">Ver na lista de espécies</a>.
                </div>
            `;
            form.reset(); // Limpa o formulário

        } catch (error) {
            console.error('Falha ao salvar a espécie:', error);
            saveFeedbackEl.innerHTML = `<div class="alert alert-danger">Ocorreu um erro ao salvar.</div>`;
        }
    });
});
