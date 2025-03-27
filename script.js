let allRecipes = []; // Armazena todas as receitas carregadas da API
document.getElementById("random-button").addEventListener("click", showRandomRecipe);

// Carrega todas as receitas da API
async function loadAllRecipes() {
    try {
        const response = await fetch("https://api-receitas-pi.vercel.app/receitas/todas");
        if (!response.ok) {
            throw new Error("Erro na requisição: " + response.statusText);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
            allRecipes = data;
            console.log("Receitas carregadas:", allRecipes);
        } else {
            console.error("A resposta da API não é um array:", data);
        }
    } catch (error) {
        console.error("Erro ao carregar receitas:", error);
    }
}

// Função para buscar receitas pelo nome
function searchRecipe() {
    const searchTerm = document.getElementById("search-input").value.trim().toLowerCase();
    const resultsContainer = document.getElementById("search-results");
    resultsContainer.innerHTML = "";

    if (searchTerm === "") {
        resultsContainer.innerHTML = "<p>Digite o nome de uma receita para buscar.</p>";
        return;
    }

    const filteredRecipes = allRecipes.filter(recipe => 
        recipe.receita.toLowerCase().includes(searchTerm)
    );

    if (filteredRecipes.length === 0) {
        resultsContainer.innerHTML = "<p>Nenhuma receita encontrada com esse nome.</p>";
        return;
    }

    filteredRecipes.forEach(recipe => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");
        recipeCard.innerHTML = `
            <img src="${recipe.link_imagem}" alt="${recipe.receita}" onclick="openRecipeDetailsModal(${JSON.stringify(recipe).replace(/"/g, '&quot;')})">
            <h3>${recipe.receita}</h3>
        `;
        resultsContainer.appendChild(recipeCard);
    });
}

// Abre o modal com as imagens das receitas da categoria selecionada
function openCategoryModal(tipo) {
    const modal = document.getElementById("category-modal");
    const modalTitle = document.getElementById("modal-category-title");
    const modalImages = document.getElementById("modal-recipe-images");

    const filteredRecipes = allRecipes.filter(recipe => recipe.tipo === tipo);
    modalTitle.textContent = tipo.toUpperCase();
    modalImages.innerHTML = "";

    filteredRecipes.forEach(recipe => {
        const img = document.createElement("img");
        img.src = recipe.link_imagem;
        img.alt = recipe.receita;
        img.classList.add("recipe-image");
        img.addEventListener("click", () => openRecipeDetailsModal(recipe));
        modalImages.appendChild(img);
    });

    modal.style.display = "block";
}

// Fecha o modal das categorias
function closeCategoryModal() {
    document.getElementById("category-modal").style.display = "none";
}

// Abre o modal com os detalhes da receita
// Abre o modal com os detalhes da receita
function openRecipeDetailsModal(recipe) {
    const modal = document.getElementById("recipe-details-modal");
    const recipeDetails = document.getElementById("recipe-details");

    recipeDetails.innerHTML = `
        <img src="${recipe.link_imagem}" alt="${recipe.receita}">
        <h2>${recipe.receita}</h2>
        <div class="recipe-content">
            <p><strong>Ingredientes:</strong></p>
            <p>${formatRecipeText(recipe.ingredientes)}</p>
            <p><strong>Modo de Preparo:</strong></p>
            <p>${formatRecipeText(recipe.modo_preparo)}</p>
        </div>
    `;

    modal.style.display = "flex";
}

// Função para formatar o texto da receita (quebras de linha)
function formatRecipeText(text) {
    return text.replace(/\n/g, '<br>');
}

// Fecha o modal dos detalhes da receita
function closeRecipeDetailsModal() {
    document.getElementById("recipe-details-modal").style.display = "none";
}
// Função para mostrar uma receita aleatória
function showRandomRecipe() {
    if (allRecipes.length === 0) {
        alert("As receitas ainda estão carregando. Tente novamente em alguns segundos.");
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * allRecipes.length);
    const randomRecipe = allRecipes[randomIndex];
    openRecipeDetailsModal(randomRecipe);
}

// Inicializa a aplicação
document.addEventListener("DOMContentLoaded", () => {
    loadAllRecipes();

    // Event listeners
    document.getElementById("search-button").addEventListener("click", searchRecipe);
    
    document.getElementById("search-input").addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            searchRecipe();
        }
    });

    // Event listeners para os botões de categoria
    document.querySelectorAll(".category-btn").forEach(button => {
        button.addEventListener("click", function() {
            openCategoryModal(this.dataset.category);
        });
    });

    // Event listeners para fechar os modais
    document.querySelectorAll(".modal .close").forEach(closeBtn => {
        closeBtn.addEventListener("click", function() {
            this.closest(".modal").style.display = "none";
        });
    });
});