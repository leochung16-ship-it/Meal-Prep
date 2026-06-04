
// Load stored data
let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
let lastWeek = localStorage.getItem("lastWeek") || "";

// Add recipe
function addRecipe() {
    const name = document.getElementById("recipeName").value;
    const ingredients = document.getElementById("recipeIngredients")
        .value.toLowerCase().split(",").map(i => i.trim());
    const type = document.getElementById("cookingType").value;

    if (!name) return alert("Enter recipe name");

    recipes.push({ name, ingredients, type });
    localStorage.setItem("recipes", JSON.stringify(recipes));

    alert("✅ Recipe added");
}

// Generate meal prep choices
function generateChoices() {
    const ingredients = document.getElementById("ingredients")
        .value.toLowerCase().split(",").map(i => i.trim());

    let pool = [...recipes];

    // Remove last week's chosen recipe
    pool = pool.filter(r => r.name !== lastWeek);

    let choices = [];

    // 1. Pick existing recipes
    while (choices.length < 2 && pool.length > 0) {
        const randomIndex = Math.floor(Math.random() * pool.length);
        choices.push(pool[randomIndex]);
        pool.splice(randomIndex, 1);
    }

    // 2. Generate ideas from ingredients
    while (choices.length < 4) {
        choices.push(generateIdea(ingredients));
    }

    displayChoices(choices);
}

// Generate simple idea
function generateIdea(ingredients) {
    const type = Math.random() > 0.5 ? "oven" : "induction";

    const base = ingredients.slice(0, 3).join(" & ");

    return {
        name: type === "oven"
            ? "Oven baked " + base
            : "Pan cooked " + base,
        type
    };
}

// Display choices
function displayChoices(choices) {
    let html = "<h3>Choose your meal prep</h3>";

    choices.forEach(choice => {
        html += `
            <div class="card">
                <strong>${choice.name}</strong> (${choice.type})<br>
                <button onclick="acceptChoice('${choice.name}')">✅ Accept</button>
            </div>
        `;
    });

    html += `<button onclick="generateChoices()">🔄 Reroll</button>`;

    document.getElementById("choices").innerHTML = html;
    document.getElementById("final").innerHTML = "";
}

// Accept selection
function acceptChoice(name) {
    lastWeek = name;
    localStorage.setItem("lastWeek", name);

    document.getElementById("final").innerHTML = `
        <h3>✅ Selected for this week:</h3>
        <p><strong>${name}</strong></p>
    `;

    document.getElementById("choices").innerHTML = "";
}
