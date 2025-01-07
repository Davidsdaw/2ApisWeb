const storedIngredients = JSON.parse(sessionStorage.getItem('selectedIngredients'));
const storedPhoto = JSON.parse(sessionStorage.getItem('selectedPhoto')) || null;
const storedZone = JSON.parse(sessionStorage.getItem('selectedZone')) || 'Zona desconocida';
const storedInstructions = JSON.parse(sessionStorage.getItem('selectedInstructions')) || 'No hay instrucciones disponibles.';
const storedVideo = JSON.parse(sessionStorage.getItem('selectedVideo')) || null;
const summaryContainer = document.getElementById('recipe-summary');

const renderSummary = () => {
    const fragment = document.createDocumentFragment();

    // Crear contenedor principal
    const mainDiv = document.createElement('div');

    // Sección de encabezado
    const headerSection = document.createElement('div');
    headerSection.classList.add('grid', 'grid-cols-1', 'sm:grid-cols-3', 'gap-6', 'items-center', 'mb-8');

    // Foto de la receta
    const photoDiv = document.createElement('div');
    photoDiv.classList.add('flex', 'justify-center');

    if (storedPhoto) {
        const photoImg = document.createElement('img');
        photoImg.src = storedPhoto;
        photoImg.alt = 'Foto de la receta';
        photoImg.classList.add('w-32', 'h-32', 'object-cover', 'rounded-full', 'shadow-lg');
        photoDiv.appendChild(photoImg);
    } else {
        const noPhotoText = document.createElement('p');
        noPhotoText.textContent = 'No hay foto disponible.';
        noPhotoText.classList.add('text-gray-500');
        photoDiv.appendChild(noPhotoText);
    }

    // Información de la receta
    const infoDiv = document.createElement('div');
    infoDiv.classList.add('sm:col-span-2');

    const title = document.createElement('h2');
    title.textContent = 'Resumen de la Receta';
    title.classList.add('text-3xl', 'font-bold', 'text-blue-600', 'mb-4', 'text-center', 'sm:text-left');

    const zoneParagraph = document.createElement('p');
    zoneParagraph.classList.add('text-lg', 'text-gray-800', 'mb-2');
    zoneParagraph.innerHTML = `<span class="font-bold text-blue-700">Zona:</span> ${storedZone}`;

    const instructionsDiv = document.createElement('div');
    instructionsDiv.classList.add('bg-blue-50', 'p-4', 'rounded-lg', 'shadow-inner');

    const instructionsTitle = document.createElement('h3');
    instructionsTitle.textContent = 'Instrucciones';
    instructionsTitle.classList.add('text-2xl', 'font-bold', 'text-blue-700', 'mb-3');

    const instructionsText = document.createElement('p');
    instructionsText.textContent = storedInstructions;
    instructionsText.classList.add('text-gray-800');

    instructionsDiv.appendChild(instructionsTitle);
    instructionsDiv.appendChild(instructionsText);

    infoDiv.appendChild(title);
    infoDiv.appendChild(zoneParagraph);
    infoDiv.appendChild(instructionsDiv);

    headerSection.appendChild(photoDiv);
    headerSection.appendChild(infoDiv);

    // Video relacionado
    const videoTitle = document.createElement('h3');
    videoTitle.textContent = 'Video Relacionado';
    videoTitle.classList.add('text-2xl', 'font-bold', 'text-center', 'text-blue-600', 'mb-4');

    let videoSection;
    if (storedVideo) {
        videoSection = document.createElement('div');
        videoSection.classList.add('flex', 'justify-center');

        const iframe = document.createElement('iframe');
        iframe.src = storedVideo;
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;

        videoSection.appendChild(iframe);
    } else {
        videoSection = document.createElement('p');
        videoSection.textContent = 'No hay video disponible.';
        videoSection.classList.add('text-gray-500', 'text-center');
    }

    // Ensamblar el contenedor principal
    mainDiv.appendChild(headerSection);
    mainDiv.appendChild(videoTitle);
    mainDiv.appendChild(videoSection);

    fragment.appendChild(mainDiv);

    // Renderizar el contenido
    summaryContainer.innerHTML = ''; // Limpiar contenido existente
    summaryContainer.appendChild(fragment);
};

// Llamar al renderizado del resumen
renderSummary();

if (!storedIngredients || storedIngredients.length === 0) {
    // Si no hay ingredientes, muestra un mensaje de error
    document.getElementById('ingredient-name').textContent = 'No se encontraron ingredientes.';
    document.getElementById('nutrition-data').textContent = 'Por favor, selecciona al menos un ingrediente.';
} else {
    document.getElementById('ingredient-name').textContent = 'Información Nutricional de los Ingredientes';
    document.getElementById('ingredient-name').classList.add("text-2xl", "font-bold", "text-center", "text-blue-600", "mb-4");  

    // Función para obtener datos nutricionales de Edamam
    const fetchNutrition = async (ingredient) => {
        const appId = 'd5fa2a1c';
        const appKey = '425b660b802084a2023c7823449297fd';

        try {
            const response = await fetch(`https://api.edamam.com/api/food-database/v2/parser?ingr=${ingredient}&app_id=${appId}&app_key=${appKey}`);
            const data = await response.json();

            if (data.parsed && data.parsed.length > 0) {
                const nutrients = data.parsed[0].food.nutrients;

                return {
                    html: `
                <div class="text-left bg-gray-100 rounded-lg p-4 mb-4 shadow">
                  <p class="font-bold text-lg">${ingredient}</p>
                  <p><strong>Calorías:</strong> ${nutrients.ENERC_KCAL || 'N/A'} kcal</p>
                  <p><strong>Proteínas:</strong> ${nutrients.PROCNT || 'N/A'} g</p>
                  <p><strong>Grasas:</strong> ${nutrients.FAT || 'N/A'} g</p>
                  <p><strong>Carbohidratos:</strong> ${nutrients.CHOCDF || 'N/A'} g</p>
                </div>
              `,
                    calories: nutrients.ENERC_KCAL || 0,
                };
            } else {
                return {
                    html: `<p class="text-red-500">No se encontraron datos nutricionales para ${ingredient}.</p>`,
                    calories: 0,
                };
            }
        } catch (error) {
            console.error('Error al cargar información nutricional:', error);
            return {
                html: `<p class="text-red-500">Error al cargar datos de ${ingredient}.</p>`,
                calories: 0,
            };
        }
    };

    // Itera sobre los ingredientes y muestra los datos nutricionales
    const loadNutritionData = async () => {
        const nutritionContainer = document.getElementById('nutrition-data');
        const totalCaloriesContainer = document.getElementById('total-calories');
        nutritionContainer.innerHTML = ''; // Limpia el contenido anterior

        let totalCalories = 0;

        for (const ingredient of storedIngredients) {
            const nutritionInfo = await fetchNutrition(ingredient);
            nutritionContainer.innerHTML += nutritionInfo.html;
            totalCalories += nutritionInfo.calories;
        }

        // Muestra el total de calorías
        totalCaloriesContainer.textContent = `Calorías Totales: ${totalCalories.toFixed(2)} kcal`;
    };

    // Llama a la función para cargar los datos
    loadNutritionData();
}