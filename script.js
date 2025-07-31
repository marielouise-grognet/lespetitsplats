const selectedItems = {
  ingredientsDropdownList: new Set(),
  appliancesDropdownList: new Set(),
  ustensilsDropdownList: new Set()
}

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
// Définition d'une fonction qui affiche les éléments du tableau précédemment créé à partir d'une lettre rentrées dans l'input.
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


function selectItem(listId) {
  const listElement = document.getElementById(listId)
  listElement.addEventListener('click', (e) => {
    const itemSelected = e.target
    const itemValue = itemSelected.textContent.toLowerCase()
    if (selectedItems[listId].has(itemValue)) return
    else selectedItems[listId].add(itemValue)
    itemSelected.classList.add('selected-item')
    itemSelected.innerHTML = `
      <div class="d-flex justify-content-between itemSelected-container">
        ${itemSelected.textContent}
        <i class="fa-solid fa-circle-xmark close-selectedItem"; cursor: pointer;"></i>
      </div>
    `
    listElement.prepend(itemSelected)
    createYellowTag(listId, itemSelected, itemValue)
    closeSelectedItem (listId, itemSelected, itemValue)
  })
}


function unselectItem(listId, itemValue) {
  // 1. Supprimer du Set de sélection
  selectedItems[listId].delete(itemValue.toLowerCase());
  // 2. Trouver et mettre à jour l'élément dans la dropdown
  const listElement = document.getElementById(listId);
  const listItems = listElement.querySelectorAll('li');
  listItems.forEach(li => {
    if (li.textContent.trim().toLowerCase() === itemValue.toLowerCase()) {
      li.classList.remove('selected-item');
      li.innerHTML = li.textContent.trim(); // remet juste le texte
    }
  });
  // 3. Supprimer le tag correspondant
  const tags = document.querySelectorAll('#selected-tags-container .selected-tag');
  tags.forEach(tag => {
    const span = tag.querySelector('span');
    if (span && span.textContent.trim().toLowerCase() === itemValue.toLowerCase()) {
      tag.remove();
    }
  });
}


  function closeSelectedItem(listId, itemSelected, itemValue) {
  const closeIcon = itemSelected.querySelector('.close-selectedItem')
  closeIcon.addEventListener('click', (event) => {
    event.stopPropagation() // Évite de relancer le click sur le LI
    itemSelected.classList.remove('selected-item')
    unselectItem(listId, itemValue)
  })
}

function removeYellowTag(listId, itemSelected, itemValue) {
  const tags = document.querySelectorAll('#selected-tags-container .selected-tag')
  tags.forEach(tag => {
    const span = tag.querySelector('span')
    if (span && span.textContent.trim().toLowerCase() === itemValue.trim().toLowerCase()) {
      tag.remove()
      itemSelected.classList.remove('selected-item')
      selectedItems[listId].delete(itemValue)
    }
  })
}

  function createYellowTag(listId, itemSelected, itemValue) {
    const tagContainer = document.getElementById('selected-tags-container')
    const tag = document.createElement('div')
    tag.classList.add('selected-tag')
    const span = document.createElement('span')
    span.textContent = itemSelected.textContent
    const closeBtn = document.createElement('button')
    closeBtn.classList.add('close-tag')
    closeBtn.textContent = '✕'
    closeBtn.addEventListener('click', () => {
      unselectItem(listId, itemValue)
    })
    tag.appendChild(span)
    tag.appendChild(closeBtn)
    tagContainer.appendChild(tag)
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
  createDropdownById('ingredientsDropdownList', extractIngredients)
  createDropdownById('appliancesDropdownList', extractAppliances)
  createDropdownById('ustensilsDropdownList', extractUstensils)
  displayDropdownCorrespondingToInput('searchIngredientsInput', 'ingredientsDropdownList', extractIngredients)
  displayDropdownCorrespondingToInput('searchAppliancesInput', 'appliancesDropdownList', extractAppliances)
  displayDropdownCorrespondingToInput('searchUstensilsInput', 'ustensilsDropdownList', extractUstensils)
  manageClearCrossInDropdownSearchBar('searchIngredientsInput', 'ingredientsDropdownList', extractIngredients)
  manageClearCrossInDropdownSearchBar('searchAppliancesInput', 'appliancesDropdownList', extractAppliances)
  manageClearCrossInDropdownSearchBar('searchUstensilsInput', 'ustensilsDropdownList', extractUstensils)
  selectItem('ingredientsDropdownList')
  selectItem('appliancesDropdownList')
  selectItem('ustensilsDropdownList')
}
manageDropdowns()
















