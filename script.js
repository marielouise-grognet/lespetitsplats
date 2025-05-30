async function getRecipes () {
  try {
    const data = await response.json()
    return {
      recipes : data.recipes
    }
  } catch (error) {
    console.error("Erreur lors du chargement des recettes:", error)
    return {recipes :[] }
  }
}

async function displayData (recipes) {
  const recipesSection = document.querySelector(".recipes-container")
  recipes.forEach((recipe) => {
    const recipeModel = recipeTemplate(recipe)
    const card = recipeModel.getUserCardDOM();
    recipesSection.appendChild(card);


  })
}

async function init() {
  displayData(recipes)
}

init()
  
  
  
  
  const input = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearButton');

  input.addEventListener('input', () => {
    clearBtn.style.display = input.value.length > 0 ? 'block' : 'none';
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.style.display = 'none';
    input.focus();
  });


document.querySelectorAll('.dropdown').forEach(dropdown => {
  const button = dropdown.querySelector('button');
  const menu = dropdown.querySelector('.dropdown-menu');

  button.addEventListener('click', () => {
    const isVisible = menu.style.display === 'block';
    
    // Ferme tous les autres menus
    document.querySelectorAll('.dropdown-menu').forEach(m => m.style.display = 'none');

    // Ouvre/ferme le menu cliqué
    menu.style.display = isVisible ? 'none' : 'block';
  });

  // Ferme le menu si on clique ailleurs
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      menu.style.display = 'none';
    }
  });
  init()
});


