function createRecipeCard(recipe) {
  const { name, image, time, description, ingredients } = recipe;
  const picture = `JSON-recipes/${image}`;

  // On crée le container principal de la card 
  const article = document.createElement('article');
  article.classList.add('card');
  article.style.width = '380px';
  article.style.height = '731px';

  // On crée et organise le container qui accueille l'image et la vignette "durée"
  const imageWrapper = document.createElement('div');
  imageWrapper.style.position = 'relative';
  const img = document.createElement('img');
  img.setAttribute("src", picture);
  img.setAttribute("alt", `Recette de ${name}`);
  const badge = document.createElement('div');
  badge.classList.add('time-badge');
  badge.textContent = `${time} min`;
  imageWrapper.appendChild(img);
  imageWrapper.appendChild(badge);

  // On affiche le titre de la recette
  const h2 = document.createElement('h2');
  h2.textContent = name;
  // On affiche le titre "recette"
  const h3 = document.createElement('h3');
  h3.classList.add('recette');
  h3.textContent = `RECETTE`;

  // On affiche la description de la recette
  const descriptionText = document.createElement('p');
  descriptionText.textContent = description;

  // On affiche le titre "ingrédients"
  const h4 = document.createElement('h4');
  h4.textContent = `INGRÉDIENTS`;

  //On organise les ingrédient sur une ligne et deux colonnes
  const half = Math.ceil(ingredients.length / 2);
  const firstCol = ingredients.slice(0, half);
  const secondCol = ingredients.slice(half);
  const row = document.createElement('div');
  row.classList.add('row');
    // colonne 1
  const col1 = document.createElement('div');
  col1.classList.add('col');
  firstCol.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `${item.ingredient}<br><span class="quantity">${item.quantity ? item.quantity : ''}${item.unit ? ` ${item.unit}` : ''}</span>`;
    col1.appendChild(li);
  });
    // colonne 2
  const col2 = document.createElement('div');
  col2.classList.add('col');
  secondCol.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `${item.ingredient}<br><span class="quantity">${item.quantity ? item.quantity : ''}${item.unit ? ` ${item.unit}` : ''}</span>`;
    col2.appendChild(li);
  });
    // on intègre les colonnes à la ligne 
  row.appendChild(col1);
  row.appendChild(col2);

// On organise la structure de l'article / card
  article.appendChild(imageWrapper);
  article.appendChild(h2);
  article.appendChild(h3);
  article.appendChild(descriptionText);
  article.appendChild(h4);
  article.appendChild(row);

  return article;
}
