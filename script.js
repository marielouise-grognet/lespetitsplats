
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
// ...Méthode d'extraction spéciale pour la liste ustensiles.
function extractUstensils(recipe, set) {
  recipe.ustensils.forEach(item => {
    set.add(item.toLowerCase())
  })
}
// Définition de fonction d'affichage des sets 
function displayDropdownsLists(listElement, set, selectedSet = new Set()) {
  listElement.innerHTML = ''
  const sortedItems = Array.from(set).sort() // Je transforme mon set en tableau et je trie les items par ordre alphabétique
  selectedSet.forEach(item => {
    const li = document.createElement('li')
    li.textContent = item
    li.classList.add('selected-item')
    listElement.appendChild(li)
  })
  sortedItems.forEach(item => {
    if (!selectedSet.has(item)) {
      const li = document.createElement('li')
      li.textContent = item
      listElement.appendChild(li)
    }
  })
}

// Définition d'une fonction qui va permettre de faire jouer la fonction displayDropdownsLists directement avec le contenu adapté au dropdown en question
function createDropdownById(dropdownListId, extractorFn) {
  const listElement = document.getElementById(dropdownListId)
  const set = generateDropdownsSets(extractorFn)
  displayDropdownsLists(listElement, set, selectedSet = new Set())
}

// Définition d'une fonction qui retourne un tableau avec les données correspondantes à l'input
function filterDropdownListAccordingToInput(value, extractorFn) {
  const set = generateDropdownsSets(extractorFn); // Génère un Set depuis les recettes
  const array = Array.from(set)                  // Convertit le Set en tableau
  return array.filter(item => item.includes(value.toLowerCase())); // Garde uniquement les items qui commencent par les lettres tapées
}
// Définition d'une fonction qui affiche les éléments du tableau précédemment créé à partir de 3 lettres rentrées dans l'input.
function displayDropdownCorrespondingToInput(inputId, listId, extractorFn) {
  const input = document.getElementById(inputId)
  const listElement = document.getElementById(listId)
  const fullSet = generateDropdownsSets(extractorFn)
  input.addEventListener('input', () => {
    const value = input.value.trim()
    const selectedSet = selectedItems[listId]; // sélection en cours
    if (value.length >= 1) {
      const filteredItems = filterDropdownListAccordingToInput(value, extractorFn);
      const filteredWithoutSelected = filteredItems.filter(item => !selectedSet.has(item));  // Supprime les éléments déjà sélectionnés
      displayDropdownsLists( // Affiche les éléments sélectionnés en haut + ceux filtrés en dessous
        listElement,
        new Set(filteredWithoutSelected),
        selectedSet
      )
    } else {
      displayDropdownsLists(listElement, fullSet, selectedSet); // Réaffiche tout avec sélection en haut
    }
  });
}


const selectedItems = {
  firstDropdownList: new Set(),
  secondDropdownList: new Set(),
  thirdDropdownList: new Set()
}

function highlightInYellowItemSelected(listId) {
  const listElement = document.getElementById(listId)
  listElement.addEventListener('click', (e) => {
    const itemSelected = e.target
    if (itemSelected.tagName === 'LI') {
      const itemValue = itemSelected.textContent.toLowerCase()
      if (selectedItems[listId].has(itemValue)) return
      else selectedItems[listId].add(itemValue)
      itemSelected.classList.add('selected-item')
      listElement.prepend(itemSelected)
    }
  })
}

function manageClearCrossInDropdownSearchBar(inputId, listId, extractorFn) {
  const dropdownInput = document.getElementById(inputId)
  const dropdownClearBtn = dropdownInput.parentElement.querySelector('.clearInput-btn')
  const fullSet = generateDropdownsSets(extractorFn)
  dropdownInput.addEventListener('input', () => {
    if (dropdownInput.value.length > 0) {
      dropdownClearBtn.style.display = 'block'
    } else {
      dropdownClearBtn.style.display = 'none'
    }
  })
  dropdownClearBtn.addEventListener('click', () => {
    dropdownInput.value = ''
    dropdownClearBtn.style.display = 'none'
    dropdownInput.focus()
    displayDropdownsLists(
      document.getElementById(listId),
      fullSet,
      selectedItems[listId] // conserve les éléments sélectionnés
    )
  })
}

// Définition d'une fonction qui englobe nos différentes fonctions allouées aux dropdowns
function manageDropdowns() {
  openCloseDropdowns()
  createDropdownById('firstDropdownList', extractIngredients)
  createDropdownById('secondDropdownList', extractAppliances)
  createDropdownById('thirdDropdownList', extractUstensils)
  displayDropdownCorrespondingToInput('searchIngredientsInput', 'firstDropdownList', extractIngredients)
  displayDropdownCorrespondingToInput('searchAppliancesInput', 'secondDropdownList', extractAppliances)
  displayDropdownCorrespondingToInput('searchUstensilsInput', 'thirdDropdownList', extractUstensils)
  manageClearCrossInDropdownSearchBar('searchIngredientsInput', 'firstDropdownList', extractIngredients)
  manageClearCrossInDropdownSearchBar('searchAppliancesInput', 'secondDropdownList', extractAppliances)
  manageClearCrossInDropdownSearchBar('searchUstensilsInput', 'thirdDropdownList', extractUstensils)
  highlightInYellowItemSelected('firstDropdownList')
  highlightInYellowItemSelected('secondDropdownList')
  highlightInYellowItemSelected('thirdDropdownList')
}
manageDropdowns()













