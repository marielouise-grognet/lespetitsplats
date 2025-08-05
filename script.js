

const selectedItems = {
  ingredientsDropdownList: new Set(),
  appliancesDropdownList: new Set(),
  ustensilsDropdownList: new Set()
}




// Fonction qui actualise le contenu des dropdown selon ce qui a été rentré dans la searchbar principale 
function updateDropdownsAccordingToRecipes(filteredRecipes) {
  // Génère des Sets selon les recettes filtrées
  const ingredientsSet = new Set()
  const appliancesSet = new Set()
  const ustensilsSet = new Set()
  filteredRecipes.forEach(recipe => {
    recipe.ingredients.forEach(ing => ingredientsSet.add(ing.ingredient.toLowerCase()))
    appliancesSet.add(recipe.appliance.toLowerCase())
    recipe.ustensils.forEach(ust => ustensilsSet.add(ust.toLowerCase()))
  })
  // Mets à jour les dropdowns en gardant la sélection en cours
  displayDropdownsLists(document.getElementById('ingredientsDropdownList'), ingredientsSet, selectedItems.ingredientsDropdownList)
  displayDropdownsLists(document.getElementById('appliancesDropdownList'), appliancesSet, selectedItems.appliancesDropdownList)
  displayDropdownsLists(document.getElementById('ustensilsDropdownList'), ustensilsSet, selectedItems.ustensilsDropdownList)
}


// Fonction qui filtre les recettes selon mots clefs entrés ds la searchBar ->>>> VERSION BOUCLES NATIVES 
function updateRecipesAccordingToSearchBar(keyword) {
  const results = []
  const lowerKeyword = keyword.toLowerCase()
  for (recipe of recipes) {
    let found = false
    if (recipe.name.toLocaleLowerCase().includes(lowerKeyword)) {         // Vérif dans le nom 
      found = true
    }
    if (!found) {                                                         // Si pas de correspondance avec le nom...
      for (const ing of recipe.ingredients) {                             // ...Vérif dans les ingrédients 
        if (ing.ingredient.toLocaleLowerCase().includes(lowerKeyword)) {
          found = true
          break // stoppe recherche dans les ingrédients 
        }
      }
    }
    if (!found && recipe.description.toLocaleLowerCase().includes(lowerKeyword)) {  // Si toujours pas de correspondance...Vérif dans la description 
      found = true
    }
    if (found) {
      results.push(recipe)
    }
    console.log(lowerKeyword)
  }
  return results
}

// Définition d'une fonction qui affiche le message d'erreur si aucune recette reconnue dans la searchbar 
function displayErrorMessage(value) {
  const container = document.querySelector('.recipes-container')
  const errorMessage = document.createElement('div')
  errorMessage.classList.add('error-message') // classe CSS si tu veux styliser
  errorMessage.innerHTML = `Aucune recette ne contient "<strong>${value}</strong>", vous pouvez chercher "tarte aux pommes", "poisson", etc"`
  container.appendChild(errorMessage)
}



// Fonction qui affiche les recettes correspondantes et actualise les dropdowns dès trois lettres entrée dans l'input de la searchbar
function inputKeywordInSearchBar() {
  const searchInput = document.getElementById('searchInput')
  searchInput.addEventListener('input', () => {
    const value = searchInput.value.trim()
    const container = document.querySelector('.recipes-container')
    container.innerHTML = ''
    if (value.length >= 3) {
      const results = updateRecipesAccordingToSearchBar(value)
      if (results.length > 0) {
        displayRecipes(results)
        updateDropdownsAccordingToRecipes(results)
      } else {
        displayErrorMessage(value)
      }
    } else {
      displayRecipes(recipes) // remet toutes les recettes
    }
  })
}
inputKeywordInSearchBar()


// FONCTION CENTRALE DE FILTRE (selon searchBar + selectedItems)
function updateRecipes() {
  const keyword = document.getElementById('searchInput').value.trim().toLowerCase();
  let filtered = [];
  recipesLoop:
  for (const recipe of recipes) {
    if (keyword.length >= 3) {                                                                           // 1. Filtre par mot-clé (>= 3 caractères)
      const matchKeyword = updateRecipesAccordingToSearchBar(keyword).some(r => r.id === recipe.id);
      if (!matchKeyword) continue; // passe à la recette suivante si condition pas ok
    }
    if (selectedItems.ingredientsDropdownList.size > 0) {                                                // 2. Filtre par tags ingrédients                          
      for (const ing of selectedItems.ingredientsDropdownList) {
        let foundIng = false;
        for (const i of recipe.ingredients) {
          if (i.ingredient.toLowerCase().includes(ing)) {
            foundIng = true;
            break;
          }
        }
        if (!foundIng) continue recipesLoop;
      }
    }
    if (selectedItems.appliancesDropdownList.size > 0) {                                                // 3. Filtre par tag appareil
      if (!selectedItems.appliancesDropdownList.has(recipe.appliance.toLowerCase())) {
        continue;
      }
    }
    if (selectedItems.ustensilsDropdownList.size > 0) {                                                // 4. Filtre par tags ustensiles
      for (const ust of selectedItems.ustensilsDropdownList) {
        let foundUst = false;
        for (const u of recipe.ustensils) {
          if (u.toLowerCase() === ust) {
            foundUst = true;
            break;
          }
        }
        if (!foundUst) continue recipesLoop;
      }
    }
    filtered.push(recipe);        // Recettes qui ne passent pas les "continue" sont conservées
  }
  displayRecipes(filtered);
  updateDropdownsAccordingToRecipes(filtered);

}

function displayTotalNumberRecipes(total) {
  const counterElement = document.getElementById('recipeCount'); // élément HTML prévu
  if (counterElement) {
    counterElement.textContent = `${total} recette${total > 1 ? 's' : ''}`;
  }
}




// Fonction d'affichage des recettes sur la page d'accueil
function displayRecipes(recipes) {
  const recipesSection = document.querySelector(".recipes-container")
  recipesSection.innerHTML = ''
  recipes.forEach(recipe => {
    const card = createRecipeCard(recipe)
    recipesSection.appendChild(card)
    displayTotalNumberRecipes(recipes.length)
  })
  
}
// Gestion de la croix d'effacement dans la barre de recherche
function manageClearCrossInSearchBar() {
  const input = document.getElementById('searchInput')
  const clearBtn = document.getElementById('clearButton')
  input.addEventListener('input', () => {   // Affichage de la croix pour effacer le contenu préalablement entré 
    if (input.value.length > 0) {
      clearBtn.style.display = 'block'
    }
    else {
      clearBtn.style.display = 'none'
    }
  })
  clearBtn.addEventListener('click', () => {  // Efface le contenu entré lorsque click sur la croix, puis retire la croix et remet le focus dans la barre */
    input.value = ''
    clearBtn.style.display = 'none'
    input.focus()
    updateRecipes()
  })
}




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
// Définition de fonction d'affichage des items (itemsSelected et sortedItems)
function displayDropdownsLists(listElement, set, selectedSet = new Set()) {
  listElement.innerHTML = ''
  const sortedItems = Array.from(set).sort()
  selectedSet.forEach(item => {
    const li = document.createElement('li')
    li.classList.add('selected-item')
    li.dataset.value = item
    li.innerHTML = `
      <div class="d-flex justify-content-between itemSelected-container">
        ${item}
        <i class="fa-solid fa-circle-xmark close-selectedItem" style="cursor:pointer;"></i>
      </div>
    `
    listElement.appendChild(li)
    closeSelectedItem(listElement.id, li, item)     // Branchement de l'événement de fermeture sur les croix de fermeture 
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
  const set = generateDropdownsSets(extractorFn) // Génère un Set depuis les recettes
  const array = Array.from(set)                  // Convertit le Set en tableau
  return array.filter(item => item.includes(value.toLowerCase())) // Garde uniquement les items qui commencent par les lettres tapées
}
// Définition d'une fonction qui affiche les éléments du tableau précédemment créé à partir d'une lettre rentrées dans l'input.
function displayDropdownCorrespondingToInput(inputId, listId, extractorFn) {
  const input = document.getElementById(inputId)
  const listElement = document.getElementById(listId)
  const fullSet = generateDropdownsSets(extractorFn)
  input.addEventListener('input', () => {
    const value = input.value.trim()
    const selectedSet = selectedItems[listId] // sélection en cours
    if (value.length >= 1) {
      const filteredItems = filterDropdownListAccordingToInput(value, extractorFn)
      const filteredWithoutSelected = filteredItems.filter(item => !selectedSet.has(item))  // Supprime les éléments déjà sélectionnés
      displayDropdownsLists( // Affiche les éléments sélectionnés en haut + ceux filtrés en dessous
        listElement,
        new Set(filteredWithoutSelected),
        selectedSet
      )
    } else {
      displayDropdownsLists(listElement, fullSet, selectedSet) // Réaffiche tout avec sélection en haut
    }
  })
}

// Fonction qui permet de générer le selectedSet
function selectItem(listId) {
  const listElement = document.getElementById(listId)
  listElement.addEventListener('click', (e) => {
    // Si clic sur la croix → on ne fait rien ici
    const itemSelected = e.target.closest('li')
    if (!itemSelected) return
    const itemValue = itemSelected.dataset.value || itemSelected.textContent.trim().toLowerCase()
    // Si déjà sélectionné → stop
    if (selectedItems[listId].has(itemValue)) {
      return
    }
    // Ajouter dans le Set
    selectedItems[listId].add(itemValue)
    // Marquer comme sélectionné
    itemSelected.classList.add('selected-item')
    itemSelected.dataset.value = itemValue // on garde la vraie valeur
    // Ajout du HTML avec la croix
    const label = itemSelected.textContent.trim()
    itemSelected.innerHTML = `
      <div class="d-flex justify-content-between itemSelected-container">
        ${label}
        <i class="fa-solid fa-circle-xmark close-selectedItem" style="cursor:pointer;"></i>
      </div>
    `
    // Déplacer en haut
    listElement.prepend(itemSelected)
    // Créer le tag
    createTag(listId, itemSelected, itemValue)
    // Gérer suppression
    closeSelectedItem(listId, itemSelected, itemValue)
    updateRecipes()
  })
}

// Fonction qui permet de faire jouer la fonction closeTag lorsque clique sur la croix de l'itemSelected 
function closeSelectedItem(listId, itemSelected, itemValue) {
  const closeBtnFromDropdown = itemSelected.querySelector('.close-selectedItem')
  closeBtnFromDropdown.addEventListener('click', (event) => {
    event.stopPropagation()
    closeTag(listId, itemValue)
  })
}

// Fonction qui permet de créer le tag 
function createTag(listId, itemSelected, itemValue) {
  const tagContainer = document.getElementById('selected-tags-container')
  const tag = document.createElement('div')
  tag.classList.add('selected-tag')
  const span = document.createElement('span')
  span.textContent = itemSelected.textContent
  const closeBtnFromTag = document.createElement('button')
  closeBtnFromTag.classList.add('close-tag')
  closeBtnFromTag.textContent = '✕'
  closeBtnFromTag.addEventListener('click', () => {
    closeTag(listId, itemValue)
  })
  tag.appendChild(span)
  tag.appendChild(closeBtnFromTag)
  tagContainer.appendChild(tag)
}

// Fonction de "centralisation" de la fermeture des itemSelected 
function closeTag(listId, itemValue) {
  selectedItems[listId].delete(itemValue.toLowerCase())                                // Supprime du Set de sélection
  const tags = document.querySelectorAll('#selected-tags-container .selected-tag')     // Supprime le tag visuel
  tags.forEach(tag => {
    const span = tag.querySelector('span')
    if (span && span.textContent.trim().toLowerCase() === itemValue.toLowerCase()) {
      tag.remove()
    }
  })
  let extractorFn                                                                    // Régénère la liste dropdown pour que l’item redevienne un "sortedItem"
  if (listId === 'ingredientsDropdownList') extractorFn = extractIngredients
  if (listId === 'appliancesDropdownList') extractorFn = extractAppliances
  if (listId === 'ustensilsDropdownList') extractorFn = extractUstensils

  const fullSet = generateDropdownsSets(extractorFn)
  displayDropdownsLists(
    document.getElementById(listId),
    fullSet,
    selectedItems[listId] // Set mis à jour
  )
  updateRecipes()
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

async function init() {         // Appel des fonctions à l'ouverture de la page
  displayRecipes(recipes)
  manageClearCrossInSearchBar()
  updateRecipes()
}
init()