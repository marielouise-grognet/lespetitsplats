function recipeTemplate(data) {
  const { id, name, image, time, description, ingredients } = data;
  const picture = `JSON-recipes/${image}`;

  function getUserCardDOM() {
    const article = document.createElement('article');
    article.classList.add('card'); 

    article.style.width = '380px';
    article.style.height = '731px';

//Réglages de l'images pour ajouter la vignette en position absolute...
// Création du container 
    const imageWrapper = document.createElement('div');
    imageWrapper.style.position='relative';
//Nommer l'image
    const img = document.createElement('img');
    img.setAttribute("src", picture);
    img.setAttribute("alt", `Recette de ${name}`);
//Nommer la vignette
    const badge =document.createElement('div')
    badge.classList.add('time-badge')
    badge.textContent=`${time} min`
//Association de l'image et de la vignette en enfant du container
    imageWrapper.appendChild(img);
    imageWrapper.appendChild(badge);

    const h2 = document.createElement('h2');
    h2.textContent = name;

    const h3 = document.createElement('h3');
    h3.classList.add('recette');
    h3.textContent = `RECETTE`;

    const descriptionText = document.createElement('p');
    descriptionText.textContent = description;

    const h4 = document.createElement('h4');
    h4.textContent = `INGRÉDIENTS`;

    // Découper les ingrédients en deux colonnes
    const half = Math.ceil(ingredients.length / 2);
    const firstCol = ingredients.slice(0, half);
    const secondCol = ingredients.slice(half);

    const row = document.createElement('div');
    row.classList.add('row');

    const col1 = document.createElement('div');
    col1.classList.add('col');
    firstCol.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `${item.ingredient}<br><span class="quantity">${item.quantity ? item.quantity : ''}${item.unit ? ` ${item.unit}` : ''}</span>`;

      col1.appendChild(li);
    });

    const col2 = document.createElement('div');
    col2.classList.add('col');
    secondCol.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `${item.ingredient}<br><span class="quantity">${item.quantity ? item.quantity : ''}${item.unit ? ` ${item.unit}` : ''}</span>`;
      col2.appendChild(li);
    });

    row.appendChild(col1);
    row.appendChild(col2);

    // Structure finale
    article.appendChild(imageWrapper);
    article.appendChild(h2);
    article.appendChild(h3);
    article.appendChild(descriptionText);
    article.appendChild(h4);
    article.appendChild(row);

    return article;
  }

  return { getUserCardDOM };
}
