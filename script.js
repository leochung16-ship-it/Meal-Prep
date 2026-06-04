
let ingredients = [];
let recipes = [];
let lastWeekChoices = [];

// ✅ INGREDIENTS
function addIngredient() {
    const input = document.getElementById("ingredientInput").value.trim();
    if (!input) return;

    ingredients.push(input);
    document.getElementById("ingredientInput").value = "";
    renderIngredients();
}

function renderIngredients() {
    const list = document.getElementById("ingredientList");
    list.innerHTML = "";

    ingredients.forEach((ing, i) => {
        list.innerHTML += `
            <li>
                ${ing}
                <span class="delete" onclick="deleteIngredient(${i})">❌</span>
            </li>
        `;
    });
}

function deleteIngredient(i) {
    ingredients.splice(i, 1);
    renderIngredients();
}

// ✅ RECIPES
function addRecipe() {
    const name = document.getElementById("recipeName").value;
    const ing = document.getElementById("recipeIngredients").value
        .toLowerCase().split(",").map(i => i.trim());
    const type = document.getElementById("cookingType").value;

    if (!name) return;

    recipes.push({ name, ingredients: ing, type });

    document.getElementById("recipeName").value = "";
    document.getElementById("recipeIngredients").value = "";

    renderRecipes();
}

function renderRecipes() {
    const list = document.getElementById("recipeList");
    list.innerHTML = "";

    recipes.forEach((r, i) => {
        list.innerHTML += `
            <li>
                ${r.name}
                <span class="delete" onclick="deleteRecipe(${i})">❌</span>
            </li>
        `;
    });
}

function deleteRecipe(i) {
    recipes.splice(i, 1);
    renderRecipes();
}

// ✅ MEAL GENERATION
function generateMealPrep() {
    let pool = [];

    // 1. recipes from memory (excluding last week)
    const available = recipes.filter(r =>
        !lastWeekChoices.includes(r.name)
    );

    pool = [...available];

    // 2. generated ideas
    while (pool.length < 4 && ingredients.length > 0) {
        pool.push(createIdea());
    }

    pool = shuffle(pool).slice(0, 4);

    showChoices(pool);
}

function showChoices(choices) {
    const container = document.getElementById("mealChoices");
    const actions = document.getElementById("actions");

    container.innerHTML = "<h2>Choose your meal prep</h2>";

    choices.forEach((c, i) => {
        container.innerHTML += `
            <div class="choice" onclick="selectChoice(${i})">
                <strong>${c.name}</strong><br>
                (${c.type})
            </div>
        `;
    });

    window.currentChoices = choices;

    actions.innerHTML = `
        <button onclick="generateMealPrep()">🔄 Regenerate</button>
    `;
}

function selectChoice(i) {
    const selected = window.currentChoices[i];

    lastWeekChoices = [selected.name];

    document.getElementById("mealChoices").innerHTML = `
        <h2>✅ Selected</h2>
        <p>${selected.name} (${selected.type})</p>
    `;

    document.getElementById("actions").innerHTML = `
        <button onclick="generateMealPrep()">New Plan</button>
    `;
}

// ✅ IDEA CREATION
function createIdea() {
    const type = Math.random() > 0.5 ? "oven" : "induction";

    const ing = shuffle(ingredients).slice(0, 3);

    return {
        name: type === "oven"
            ? "Oven baked " + ing.join(", ")
            : "Pan mix " + ing.join(", "),
        ingredients: ing,
        type
    };
}

// ✅ helper
function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}
