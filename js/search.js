// Este objeto gerencia toda a lógica de busca do site.
const SiteSearch = {
    searchIndex: [],
    isInitialized: false,

    normalize: function(text) {
        if (!text) return "";
        return text.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    },

    initialize: async function() {
        if (this.isInitialized) return;

        const dataSources = [
            { type: 'Antecedente', url: '/data/backgrounds.json', page: '/backgrounds.html' },
            { type: 'Monstro', url: '/data/bestiary.json', page: '/bestiary.html' },
            { type: 'Classe', url: '/data/classes.json', page: '/classes.html' },
            { type: 'Espécie', url: '/data/species.json', page: '/species.html' },
            { type: 'Item', url: '/data/items.json', page: '/items.html' },
            { type: 'Magia', url: '/data/spells.json', page: '/spells.html' },
            { type: 'Opções & Características', url: '/data/options.json', page: '/options.html' },
            { type: 'Talento', url: '/data/feats.json', page: '/feats.html' },            
        ];

        try {
            const allPromises = dataSources.map(source =>
                fetch(source.url)
                    .then(response => {
                        if (!response.ok) throw new Error(`Falha ao carregar ${source.url}`);
                        return response.json();
                    })
                    .then(data => {
                        data.forEach(item => {
                            this.searchIndex.push({
                                name: item.name,
                                normalizedName: this.normalize(item.name),
                                type: source.type,
                                url: `${source.page}#${this.normalize(item.name).replace(/\s+/g, '-')}`
                            });

                            if (item.subclasses) {
                                item.subclasses.forEach(sub => {
                                    this.searchIndex.push({
                                        name: `${sub.name} (${item.name})`,
                                        normalizedName: this.normalize(sub.name),
                                        type: 'Subclasse',
                                        url: `${source.page}#${this.normalize(item.name).replace(/\s+/g, '-')}`
                                    });
                                });
                            }
                        });
                    }).catch(error => console.error(`Erro processando ${source.url}:`, error))
            );

            await Promise.all(allPromises);
            this.isInitialized = true;
            document.dispatchEvent(new Event('search-ready'));

        } catch (error) {
            console.error("Erro ao inicializar índice de busca:", error);
        }
    },

    // 🔧 AQUI ESTÁ A FUNÇÃO FALTANDO
    search: function(query) {
        const normalizedQuery = this.normalize(query);
        return this.searchIndex.filter(entry =>
            entry.normalizedName.includes(normalizedQuery)
        );
    }
};


// Inicia o processo de carregamento dos dados assim que o DOM estiver pronto.
document.addEventListener('DOMContentLoaded', () => {
    SiteSearch.initialize();
});
