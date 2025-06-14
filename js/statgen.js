document.addEventListener('DOMContentLoaded', () => {
    const rollButton = document.getElementById('roll-button');
    const rollResultsContainer = document.getElementById('roll-results');

    rollButton.addEventListener('click', () => {
        rollResultsContainer.innerHTML = ''; // Limpa os resultados anteriores
        
        for (let i = 0; i < 6; i++) {
            const rolls = [];
            // Rola 4 dados de 6 faces
            for (let j = 0; j < 4; j++) {
                rolls.push(Math.floor(Math.random() * 6) + 1);
            }
            
            // Ordena os resultados e remove o menor
            rolls.sort((a, b) => a - b);
            rolls.shift(); // Remove o primeiro elemento (o menor)
            
            // Soma os 3 restantes
            const sum = rolls.reduce((total, current) => total + current, 0);
            
            // Cria e exibe a caixa com o resultado
            const resultBox = document.createElement('div');
            resultBox.className = 'stat-box';
            resultBox.textContent = sum;
            rollResultsContainer.appendChild(resultBox);
        }
    });
});
