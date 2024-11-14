// ----API URL
const pokemonAPI = "https://pokeapi-proxy.freecodecamp.rocks/api/pokemon";

// ----search elements
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");

// ----basic info elements
const pokemonName = document.getElementById("pokemon-name");
const pokemonId = document.getElementById("pokemon-id");
const pokemonWeight = document.getElementById("weight");
const pokemonHeight = document.getElementById("height");

// ----stats elements
const hp = document.getElementById("hp");
const attack = document.getElementById("attack");
const defense = document.getElementById("defense");
const specialAttack = document.getElementById("special-attack");
const specialDefense = document.getElementById("special-defense");
const speed = document.getElementById("speed");

// ----type and sprite elements
const typesContainer = document.getElementById("types");
const pokemonSprite = document.getElementById("sprite");

// ----normalize the input to meet API requirements
const normalizeInput = (input) => {
    return input
        .toLowerCase()
        .replace(/♀/g, '-f')  // Replace female symbol with -f
        .replace(/♂/g, '-m')  // Replace male symbol with -m
        .replace(/[^a-z0-9-]/g, '-');  // Replace special characters with dash
};

// ----fetch the pokemon data
const fetchData = async (pokemonNameOrId) => {
    const normalizedInput = normalizeInput(pokemonNameOrId);

    try {
        const res = await fetch(`${pokemonAPI}/${normalizedInput}`);
        if (!res.ok) {
            alert('Pokémon not found');
            return; // Exit function if fetch failed
        }
        const data = await res.json();
        displayPokemon(data);
    } catch (err) {
        console.error('Network error:', err);
        alert('Something went wrong while fetching the Pokémon data');
    }
}

// ----check user input and fetch data
const checkPokemonInput = () => {
    const searchValue = searchInput.value.trim();

    if (searchValue === "") {
        alert("Please enter a Pokémon name or ID");
        return;
    }

    fetchData(searchValue);
}

// ----display the Pokémon info
const displayPokemon = (data) => {
    // Destructure the data object
    const {
        name,
        id,
        weight,
        height,
        types: pokemonTypes,
        stats,
        sprites
    } = data;

    // Update basic info
    pokemonName.textContent = name.toUpperCase();
    pokemonId.textContent = `#${id}`;
    pokemonWeight.textContent = `Weight: ${weight}`; // Do not convert, keep as is
    pokemonHeight.textContent = `Height: ${height}`; // Do not convert, keep as is

    // Clear previous types
    typesContainer.innerHTML = '';

    // Update types
    pokemonTypes.forEach(({ type }) => {
        const typeElement = document.createElement('span');
        typeElement.classList.add('type', type.name);
        typeElement.textContent = type.name.toUpperCase();
        typesContainer.appendChild(typeElement);
    });

    // Update sprite
    pokemonSprite.src = sprites.front_default;
    pokemonSprite.alt = `${name} sprite`;

    // Update stats
    const statElements = { hp, attack, defense, 'special-attack': specialAttack, 'special-defense': specialDefense, speed };
    stats.forEach(stat => {
        const statName = stat.stat.name;
        if (statName in statElements) {
            statElements[statName].textContent = stat.base_stat;
        }
    });
};

// Event listeners
searchBtn.addEventListener('click', checkPokemonInput);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkPokemonInput();
    }
});
