const recipesContainer = document.getElementById('recipes-container');
    const loading = document.getElementById('loading');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

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

        // Renderiza las recetas obtenidas
        recipes.forEach(meal => {
          const ingredients = getIngredients(meal).map(ing => `<li>${ing}</li>`).join('');
          recipesContainer.innerHTML += `
            <div class="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-32 h-32 object-cover rounded-full mb-4">
              <h3 class="font-bold text-lg">${meal.strMeal}</h3>
              <p class="text-sm text-gray-600 mb-4">${meal.strCategory}</p>
              <ul class="text-left text-sm text-gray-700 list-disc pl-4 mb-4">
                ${ingredients}
              </ul>
              <a href="./pages/details.html" 
                 class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                 Ver Información Nutricional
              </a>
            </div>
          `;
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