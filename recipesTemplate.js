function recipeTemplate(data) {
  const { id, name, image, time, description, ingredients } = data;
  const picture = `JSON recipes/${image}`;

  function getUserCardDOM() {
    const article = document.createElement('article');
    article.classList.add('card');
    article.style.width = '380px';
    article.style.height = '731px';

    const img = document.createElement('img');
    img.setAttribute("src", picture);
    img.setAttribute("alt", `Recette de ${name}`);

    const h2 = document.createElement('h2');
    h2.textContent = name;

    const h3 = document.createElement('h3');
    h3.classList.add('recette');
    h3.textContent = `Temps : ${time} min`;

    const descriptionText = document.createElement('p');
    descriptionText.textContent = description;

    const h4 = document.createElement('h4');
    h4.textContent = "Ingrédients :";

    const ingredientsList = document.createElement('ul');
    ingredients.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.ingredient}${item.quantity ? `: ${item.quantity}` : ''}${item.unit ? ` ${item.unit}` : ''}`;
      ingredientsList.appendChild(li);
    });

    article.appendChild(img);
    article.appendChild(h2);
    article.appendChild(h3);
    article.appendChild(descriptionText);
    article.appendChild(h4);
    article.appendChild(ingredientsList);

    return article;
  }

  return { getUserCardDOM };
}
