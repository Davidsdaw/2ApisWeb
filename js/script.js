const recipesContainer = document.getElementById('recipes-container');
const loading = document.getElementById('loading');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const favoritesSection = document.getElementById('favorites-section');
const favoritesContainer = document.getElementById('favorites-container');
const viewFavoritesButton = document.getElementById('view-favorites');

// Función para obtener la lista de ingredientes de una receta
const getIngredients = (meal) => {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure} ${ingredient}`.trim());
    }
  }
  return ingredients;
};

// Función para manejar favoritos
const handleFavorite = (meal) => {
  let favorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
  if (favorites.some(fav => fav.idMeal === meal.idMeal)) {
    favorites = favorites.filter(fav => fav.idMeal !== meal.idMeal);
  } else {
    favorites.push(meal);
  }
  localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
};

// Referencias al modal y su botón de cierre
const favoritesModal = document.getElementById('favorites-modal');
const closeFavoritesModalButton = document.getElementById('close-favorites-modal');

// Mostrar el modal de favoritos
viewFavoritesButton.addEventListener('click', () => {
  displayFavorites(); // Muestra las recetas favoritas en el modal
  favoritesModal.classList.remove('hidden'); // Muestra el modal
});

// Cerrar el modal de favoritos
closeFavoritesModalButton.addEventListener('click', () => {
  favoritesModal.classList.add('hidden'); // Oculta el modal
});

// Función para mostrar recetas favoritas
const displayFavorites = () => {
  const favorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
  favoritesContainer.innerHTML = '';

  if (favorites.length === 0) {
    favoritesContainer.innerHTML = '<p class="text-gray-600 text-center">No tienes recetas favoritas.</p>';
    return;
  }

  favorites.forEach((meal) => {
    const ingredients = getIngredients(meal);
    const ingredientsList = ingredients.slice(0, 3).map(ing => `<li>${ing}</li>`).join('');

    const recipeCard = document.createElement('div');
    recipeCard.classList.add('bg-white', 'rounded-lg', 'shadow-lg', 'p-6', 'flex', 'flex-col', 'items-center', 'relative');

    recipeCard.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-40 h-40 object-cover rounded-full mb-4">
      <h3 class="font-bold text-xl mb-2">${meal.strMeal}</h3>
      <p class="text-sm text-gray-500 mb-4">${meal.strCategory}</p>
      <ul class="text-left text-sm text-gray-700 list-disc pl-6 mb-2">
        ${ingredientsList}
      </ul>
      <p class="text-sm text-blue-500">...y más ingredientes</p>
      <button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 favorite-btn">
        Eliminar de Favoritos
      </button>
    `;

    recipeCard.querySelector('.favorite-btn').addEventListener('click', () => {
      handleFavorite(meal);
      displayFavorites();
    });

    favoritesContainer.appendChild(recipeCard);
  });
};

// Función para guardar ingredientes en el sessionStorage
const saveIngredientsToSessionStorage = (ingredients) => {
  let storedIngredients = JSON.parse(sessionStorage.getItem('selectedIngredients')) || [];
  storedIngredients = ingredients;
  sessionStorage.setItem('selectedIngredients', JSON.stringify(storedIngredients));
};

// Función para obtener recetas desde The Meal DB
const fetchRecipes = async (query = '') => {
  try {
    loading.style.display = 'block';
    recipesContainer.innerHTML = '';

    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await response.json();
    const recipes = data.meals;

    loading.style.display = 'none';

    if (!recipes) {
      recipesContainer.innerHTML = '<p class="text-gray-600 text-center">No se encontraron recetas.</p>';
      return;
    }

    recipes.forEach((meal) => {
      const ingredients = getIngredients(meal);
      const ingredientsList = ingredients.slice(0, 3).map(ing => `<li>${ing}</li>`).join('');

      const recipeCard = document.createElement('div');
      recipeCard.classList.add('bg-white', 'rounded-lg', 'shadow-lg', 'p-6', 'flex', 'flex-col', 'items-center', 'relative', 'bounce-in', 'hover-grow');

      recipeCard.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-40 h-40 object-cover rounded-full mb-4">
      <h3 class="font-bold text-xl text-red-600 mb-2">${meal.strMeal}</h3>
      <p class="text-sm text-yellow-600 mb-4">${meal.strCategory}</p>
      <ul class="text-left text-sm text-gray-700 list-disc pl-6 mb-2">
        ${ingredientsList}
      </ul>
      <p class="text-sm text-red-500">...y más ingredientes</p>
      <div class="flex gap-4 w-full mt-4">
        <button class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-1/2 nutritional-info-btn">
          Ver Información
        </button>
        <button class="bg-yellow-400 text-red-800 px-4 py-2 rounded hover:bg-yellow-500 w-1/2 favorite-btn">
          Añadir a Favoritos
        </button>
      </div>
    `;

      // Evento para guardar ingredientes y redirigir al hacer clic en "Ver Información Nutricional"
      recipeCard.querySelector('.nutritional-info-btn').addEventListener('click', (e) => {
        e.stopPropagation(); 
        saveIngredientsToSessionStorage(ingredients); 
        window.location.href = './pages/details.html';
      });

      // Evento para manejar favoritos
      recipeCard.querySelector('.favorite-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        handleFavorite(meal);
      });

      recipesContainer.appendChild(recipeCard);
    });

  } catch (error) {
    console.error('Error al cargar recetas:', error);
    recipesContainer.innerHTML = '<p class="text-red-500">Ocurrió un error al cargar las recetas.</p>';
  }
};

// Cargar recetas populares al inicio
fetchRecipes();

// Manejar el formulario de búsqueda
searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    fetchRecipes(query);
  } else {
    fetchRecipes();
  }
});

// Ver favoritos
viewFavoritesButton.addEventListener('click', () => {
  favoritesSection.classList.toggle('hidden');
  displayFavorites();
});



