const API_BASE = "https://dummyjson.com";

const view = () => {
  const url = window.location.href.split("/");
  const file = url[url.length - 1];
  const fileName = file.split(".")[0];
  if (!fileName) {
    return "index";
  }
  return fileName;
};

const createProductCards = (products) => {
  const main = document.getElementById("main");

  products.forEach((product) => {
    const { id, title, description, price, rating, thumbnail } = product;
    const card = document.createElement("div");
    card.classList.add("card");

    const textContainer = document.createElement("div");
    textContainer.classList.add("card-container");

    const titleElement = document.createElement("h2");
    const titleText = document.createTextNode(title);
    titleElement.appendChild(titleText);

    const img = document.createElement("img");
    img.setAttribute("src", thumbnail);

    const priceEl = document.createElement("p");
    const priceText = document.createTextNode(`Price: ${price}$`);
    priceEl.appendChild(priceText);

    const ratingEl = document.createElement("p");
    const ratingText = document.createTextNode(`Rating: ${rating} ⭐`);
    ratingEl.appendChild(ratingText);

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");
    const button = document.createElement("button");
    button.setAttribute("id", `${id}`);
    button.classList.add("add-to-cart-button");
    const buttonText = document.createTextNode("Add To Cart");
    button.appendChild(buttonText);
    buttonContainer.appendChild(button);

    card.appendChild(img);
    card.appendChild(textContainer);
    textContainer.appendChild(titleElement);
    textContainer.appendChild(priceEl);
    textContainer.appendChild(ratingEl);
    textContainer.appendChild(buttonContainer);

    main.appendChild(card);
  });
};

const renderCart = (cart, products) => {
  console.log("render cart", cart);
  const main = document.getElementById("main");
  main.innerHTML = "";

  const cartContainer = document.createElement("div");
  cartContainer.classList.add("cart-container");

  cart.forEach((cartItem) => {
    const item = products.find(
      (product) => product.id === parseInt(cartItem.id)
    );

    const itemContainer = document.createElement("div");
    itemContainer.classList.add("item-container");

    const titleEl = document.createElement("p");
    const titleText = document.createTextNode(item.title);
    titleEl.appendChild(titleText);

    const amountEl = document.createElement("p");
    const amonutText = document.createTextNode(cartItem.amount);
    amountEl.appendChild(amonutText);

    const increaseButton = document.createElement("button");
    const increaseButtonText = document.createTextNode("+");
    increaseButton.classList.add("increase-button");
    increaseButton.setAttribute("id", item.id);
    increaseButton.appendChild(increaseButtonText);

    const decreaseButton = document.createElement("button");
    const decreaseButtonText = document.createTextNode("-");
    decreaseButton.classList.add("decrease-button");
    decreaseButton.setAttribute("id", item.id);
    decreaseButton.appendChild(decreaseButtonText);

    main.appendChild(cartContainer);
    cartContainer.appendChild(itemContainer);
    itemContainer.append(titleEl, increaseButton, amountEl, decreaseButton);
  });
};

let cart = [];

// to add a new item to cart

const addItemToCart = (e) => {
  const { id } = e.target;

  // check if item already in cart
  const item = cart.find((item) => item.id === id);

  // if no item, push a new one
  if (!item) {
    cart.push({
      id,
      amount: 1,
    });
    return;
  }

  // if in cart, increase number of items
  item.amount++;

  console.log("cart", cart);

  localStorage.setItem("cart", JSON.stringify(cart));
};

const rerenderCart = (cart) => {
  renderCart(cart, JSON.parse(localStorage.getItem("products")));
  localStorage.setItem("cart", JSON.stringify(cart));
  addEventListenerToCartButton();
};

// increase number of items
const increaseItems = (e) => {
  console.log("increase items");

  const { id } = e.target;
  const item = cart.find((item) => {
    return item.id === id;
  });
  item.amount++;

  rerenderCart(cart);
};

// decrease number of items
const decreaseItems = (e) => {
  console.log("decrease items");
  const { id } = e.target;
  let itemIndex;
  const item = cart.find((item, index) => {
    itemIndex = index;
    return item.id === id;
  });

  item.amount--;

  // falsy => "", 0, false, undefined, null
  if (item.amount === 0) {
    // cart = cart.filter((cartItem) => cartItem.id !== item.id);
    cart.splice(itemIndex, 1);
  }

  rerenderCart(cart);
};

// delete items

// show total

// render only cart products

// enter cart view

// create an event listener enterCartView and connect with cart button in navbar

// exit cart view

const addEventListenerToCartButton = () => {
  const increaseButtons = document.getElementsByClassName("increase-button");
  [...increaseButtons].forEach((button) => {
    button.addEventListener("click", increaseItems);
  });

  const decreaseButtons = document.getElementsByClassName("decrease-button");
  [...decreaseButtons].forEach((button) => {
    button.addEventListener("click", decreaseItems);
  });
};

(async () => {
  const response = await fetch(`${API_BASE}/products?limit=100`);
  const { products } = await response.json();

  localStorage.setItem("products", JSON.stringify(products));

  // Init
  const pageName = view();
  if (pageName === "index") {
    createProductCards(products);

    // connect add to cart function to add-to-cart button
    const addToCartButtonsCollection =
      document.getElementsByClassName("add-to-cart-button");

    [...addToCartButtonsCollection].forEach((button) => {
      button.addEventListener("click", addItemToCart);
    });
  }

  if (pageName === "cart") {
    renderCart(JSON.parse(localStorage.getItem("cart")), products);

    cart = JSON.parse(localStorage.getItem("cart"));

    addEventListenerToCartButton();
  }
})();
