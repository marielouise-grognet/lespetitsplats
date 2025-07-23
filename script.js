
// Affichage des recettes sur la page d'accueil
function displayRecipes(recipes) {
  const recipesSection = document.querySelector(".recipes-container")
  recipes.forEach(recipe => {
    const card = createRecipeCard(recipe)
    recipesSection.appendChild(card)
  })
}
// Gestion de la croix d'effacement dans la barre de recherche
function manageClearCrossInSearchBar() {
  const input = document.getElementById('searchInput')
  const clearBtn = document.getElementById('clearButton')
  input.addEventListener('input', () => {   //***** Affichage de la croix pour effacer le contenu préalablement entré */
    if (input.value.length > 0) {
      clearBtn.style.display = 'block'
    }
    else {
      clearBtn.style.display = 'none'
    }
  });
  clearBtn.addEventListener('click', () => {  //***** Efface le contenu entré lorsque click sur la croix, puis retire la croix et remet le focus dans la barre */
    input.value = ''
    clearBtn.style.display = 'none'
    input.focus()
  });
}
// Appel des fonctions à l'ouvert de la page
async function init() {
  displayRecipes(recipes)
  manageClearCrossInSearchBar()
}
init()


// Ouverture et fermeture des dropdowns
function openCloseDropdowns() {
  const listDropdowns = document.querySelectorAll('.dropdown')
  listDropdowns.forEach(dropdown => {
    const button = dropdown.querySelector('button')
    const menu = dropdown.querySelector('.dropdown-menu')
    button.addEventListener('click', () => {  //***** au click sur le bouton, fermeture des autres menus le cas échéant, l'ouvre si fermé et le ferme si ouvert */
      const isVisible = menu.style.display === 'block'
      document.querySelectorAll('.dropdown-menu').forEach(m => m.style.display = 'none')
      if (isVisible) {
        menu.style.display = 'none'
      }
      else {
        menu.style.display = "block"
      }
    })
    document.addEventListener('click', (e) => { //***** si click ailleurs sur la page que le menu déroulant, ferme le menu déroulant */
      if (!dropdown.contains(e.target)) {
        menu.style.display = 'none'
      }
    })
  })
}

// Définition de fonction de génération des Sets, qui va faire appel à une méthode d'extration spéciale selon les dropdowns (voir ci après)
function generateDropdownsSets(extractorFn) {
  const set = new Set()
  recipes.forEach(recipe => {
    extractorFn(recipe, set)
  })
  return set
}

// ...Méthode d'extraction spéciale pour la liste ingrédients...
function extractIngredients(recipe, set) {
  recipe.ingredients.forEach(item => {
    set.add(item.ingredient.toLowerCase())
  })
}
// ...Méthode d'extraction spéciale pour la liste appareils...
function extractAppliances(recipe, set) {
  set.add(recipe.appliance.toLowerCase())
}
// ...Méthode d'extraction spéciale pour la liste ustensiles...
function extractUstensils(recipe, set) {
  recipe.ustensils.forEach(item => {
    set.add(item.toLowerCase())
  })
}
// Définition de fonction d'affichage des sets 
function displayDropdownsLists(listElement, set) {
  listElement.innerHTML = ''
  set.forEach(item => {
    const li = document.createElement('li')
    li.textContent = item
    listElement.appendChild(li)
  })
}

// Définition d'une fonction qui va permettre de faire jouer la fonction displayDropdownsLists directement avec le contenu adapté au dropdown en question
function createDropdownById(dropdownListId, extractorFn) {
  const listElement = document.getElementById(dropdownListId)
  const set = generateDropdownsSets(extractorFn)
  displayDropdownsLists(listElement, set)
}

// Définition d'une fonction qui englobe nos différentes fonctions allouées à la gestion des dropdowns
function manageDropdowns() {
  openCloseDropdowns()
  createDropdownById('firstDropdownList', extractIngredients)
  createDropdownById('secondDropdownList', extractAppliances)
  createDropdownById('thirdDropdownList', extractUstensils)
}
manageDropdowns()












