const selectedItems = {
  ingredientsDropdownList: new Set(),
  appliancesDropdownList: new Set(),
  ustensilsDropdownList: new Set()
}

// Ecriture d'une fonction qui actualise le contenu des dropdown selon ce qui a été rentré dans la searchbar principale 
function updateDropdownsAccordingToRecipes(filteredRecipes) {
  // Génère des Sets selon les recettes filtrées
  const ingredientsSet = new Set();
  const appliancesSet = new Set();
  const ustensilsSet = new Set();
  filteredRecipes.forEach(recipe => {
    recipe.ingredients.forEach(ing => ingredientsSet.add(ing.ingredient.toLowerCase()));
    appliancesSet.add(recipe.appliance.toLowerCase());
    recipe.ustensils.forEach(ust => ustensilsSet.add(ust.toLowerCase()));
  });
  // Mets à jour les dropdowns en gardant la sélection en cours
  displayDropdownsLists(document.getElementById('ingredientsDropdownList'), ingredientsSet, selectedItems.ingredientsDropdownList);
  displayDropdownsLists(document.getElementById('appliancesDropdownList'), appliancesSet, selectedItems.appliancesDropdownList);
  displayDropdownsLists(document.getElementById('ustensilsDropdownList'), ustensilsSet, selectedItems.ustensilsDropdownList);
}


// Ecriture de l'algorithme avec boucles natives 
function searchKeywordsWithNative(keyword) {
  const results = []
  const lowerKeyword = keyword.toLowerCase()
  for (recipe of recipes) {
    let found = false
    // Vérif dans le nom 
    if (recipe.name.toLocaleLowerCase().includes(lowerKeyword)) {
      found = true
    }
    // Vérif dans les ingrédients 
    if (!found) {
      for (const ing of recipe.ingredients) {
        if (ing.ingredient.toLocaleLowerCase().includes(lowerKeyword)) {
          found = true
          console.log(lowerKeyword)
          break // stoppe recherche dans les ingrédients 
        }
      }
    }
    // Vérif dans la description 
    if (!found && recipe.description.toLocaleLowerCase().includes(lowerKeyword)) {
      found = true
    }
    if (found) {
      results.push(recipe)
    }
  }
  return results
}

function inputKeywordInSearchBar () {
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', () => {
    const value = searchInput.value.trim();
    if (value.length >= 3) {
      const results = searchKeywordsWithNative(value);
      displayRecipes(results);
      updateDropdownsAccordingToRecipes(results);
    } else {
      displayRecipes(recipes); // remet toutes les recettes
    }
  });
}
inputKeywordInSearchBar()







// Affichage des recettes sur la page d'accueil
function displayRecipes(recipes) {
  const recipesSection = document.querySelector(".recipes-container")
  recipesSection.innerHTML =''
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
// Définition de fonction d'affichage des items (itemsSelected et sortedItems)
function displayDropdownsLists(listElement, set, selectedSet = new Set()) {
  listElement.innerHTML = '';
  const sortedItems = Array.from(set).sort();
  selectedSet.forEach(item => {
    const li = document.createElement('li');
    li.classList.add('selected-item');
    li.dataset.value = item;
    li.innerHTML = `
      <div class="d-flex justify-content-between itemSelected-container">
        ${item}
        <i class="fa-solid fa-circle-xmark close-selectedItem" style="cursor:pointer;"></i>
      </div>
    `;
    listElement.appendChild(li);
    closeSelectedItem(listElement.id, li, item);     // Branchement de l'événement de fermeture sur les croix de fermeture 
  });
  sortedItems.forEach(item => {
    if (!selectedSet.has(item)) {
      const li = document.createElement('li');
      li.textContent = item;
      listElement.appendChild(li);
    }
  });
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

// Fonction qui permet de créer le selectedSet
function selectItem(listId) {
  const listElement = document.getElementById(listId);
  listElement.addEventListener('click', (e) => {
    // Si clic sur la croix → on ne fait rien ici
    const itemSelected = e.target.closest('li');
    if (!itemSelected) return;
    const itemValue = itemSelected.dataset.value || itemSelected.textContent.trim().toLowerCase();
    // Si déjà sélectionné → stop
    if (selectedItems[listId].has(itemValue)) {
      return;
    }
    // Ajouter dans le Set
    selectedItems[listId].add(itemValue);
    // Marquer comme sélectionné
    itemSelected.classList.add('selected-item');
    itemSelected.dataset.value = itemValue; // on garde la vraie valeur
    // Ajout du HTML avec la croix
    const label = itemSelected.textContent.trim();
    itemSelected.innerHTML = `
      <div class="d-flex justify-content-between itemSelected-container">
        ${label}
        <i class="fa-solid fa-circle-xmark close-selectedItem" style="cursor:pointer;"></i>
      </div>
    `;
    // Déplacer en haut
    listElement.prepend(itemSelected);
    // Créer le tag
    createYellowTag(listId, itemSelected, itemValue);
    // Gérer suppression
    closeSelectedItem(listId, itemSelected, itemValue);
  });
}

// Fonction qui permet de faire jouer la fonction closeTag lorsque clique sur la croix de l'itemSelected 
function closeSelectedItem(listId, itemSelected, itemValue) {
  const closeBtnFromDropdown = itemSelected.querySelector('.close-selectedItem');
  closeBtnFromDropdown.addEventListener('click', (event) => {
    event.stopPropagation();
    closeTag(listId, itemValue);
  });
}

// Fonction qui permet de créer le tag 
function createYellowTag(listId, itemSelected, itemValue) {
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
  // 1. Supprimer du Set de sélection
  selectedItems[listId].delete(itemValue.toLowerCase());
  // 2. Supprimer le tag visuel
  const tags = document.querySelectorAll('#selected-tags-container .selected-tag');
  tags.forEach(tag => {
    const span = tag.querySelector('span');
    if (span && span.textContent.trim().toLowerCase() === itemValue.toLowerCase()) {
      tag.remove();
    }
  });
  // 3. Régénérer la liste dropdown pour que l’item redevienne un "sortedItem"
  let extractorFn;
  if (listId === 'ingredientsDropdownList') extractorFn = extractIngredients;
  if (listId === 'appliancesDropdownList') extractorFn = extractAppliances;
  if (listId === 'ustensilsDropdownList') extractorFn = extractUstensils;

  const fullSet = generateDropdownsSets(extractorFn);
  displayDropdownsLists(
    document.getElementById(listId),
    fullSet,
    selectedItems[listId] // Set mis à jour
  );
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
















