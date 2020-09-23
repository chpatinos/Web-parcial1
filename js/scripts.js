let contentParent = document.querySelector(".loaded-content");
let resetBtn = document.querySelector("#btn-reset-shopping");
let cartCounter = document.querySelector("#btn-shoping");
let navLinks = document.querySelectorAll(".nav-link");
let tittle = document.querySelector(".tittle");
let shopping = [];
let menu;

document.querySelector("#btn-burger").addEventListener("click", () => loadContent("Burguers", "#btn-burger"));
document.querySelector("#btn-tacos").addEventListener("click", () => loadContent("Tacos", "#btn-tacos"));
document.querySelector("#btn-salads").addEventListener("click", () => loadContent("Salads", "#btn-salads"));
document.querySelector("#btn-dessers").addEventListener("click", () => loadContent("Desserts", "#btn-dessers"));
document.querySelector("#btn-drinks").addEventListener("click", () => loadContent("Drinks and Sides", "#btn-drinks"));
document.querySelector("#btn-shoping").addEventListener("click", () => showCart());
document.querySelector("#btn-reset-shopping").addEventListener("click", () => resetShopping());

loadContent("Burguers", "#btn-burger");

function resetShopping() {
  shopping = [];
  showCart();
  cartCounter.innerHTML = `<img class="btn-image" src="./assets/img/shopping.png" alt="" /> ${calcQuantityProducts()}  items`;
}

function confirmOrder() {
  let result = [];
  shopping.forEach((element, index) => {
    let curItem = {item: index+1, quantity: element.quantity, description: element.name, unitPrice: element.price};
    result.push(curItem)
  })
  console.log(result);
}

function addCart(id) {
  let element = menu.filter((el) => el.name == id.split("-")[0])[0].products[id.split("-")[1]];
  let index = shopping.findIndex((el) => el.name == element.name);
  if (index < 0) {
    element.quantity = 1;
    shopping.push(element);
  }
  else {
    shopping[index].quantity = shopping[index].quantity + 1;
  }
  cartCounter.innerHTML = `<img class="btn-image" src="./assets/img/shopping.png" alt="" /> ${calcQuantityProducts()}  items`;
}

function calcQuantityProducts () {
  let total = 0;
  shopping.forEach(el => total += el.quantity)
  return total;
}

function loadContent(content, el) {
  navLinks.forEach((el) => el.classList.remove("active"));
  document.querySelector(el).classList.add("active");
  if (!menu)
    fetch("https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json").then((resp) => {
      resp.json().then((data) => {
        menu = data;
        showContent(content);
      });
    });
  else showContent(content);
}

function buildCart(trs, total) {
  if (!trs || total == 0)
    return `<table class="table table-striped"> <thead> <tr> <th scope="col">Item</th> <th scope="col">Qty.</th> <th scope="col">Description</th> <th scope="col">Unit price</th> <th scope="col">Amount</th> </tr> </thead> <tbody> ${trs} </tbody> </table><div class="col-6 text-center"> <img src="https://i.ytimg.com/vi/Xw1C5T-fH2Y/maxresdefault.jpg" class="img-fluid" alt=""> <h3 class="my-3">Aún no tienes productos en el carrito :(</h3> </div>`;
  else {
    return `<table class="table table-striped"> <thead> <tr> <th scope="col">Item</th> <th scope="col">Qty.</th> <th scope="col">Description</th> <th scope="col">Unit price</th> <th scope="col">Amount</th> </tr> </thead> <tbody> ${trs} </tbody> </table> <div class="col-12 d-flex justify-content-around mt-2 mb-5"> <div class="h6 m-0">Total: $${total.toFixed(2)}</div> <div class="botones"><button class="btn action-btn cancel-btn" data-toggle="modal" data-target="#cancelModal">Cancel</button> <button id="btn-confirm-order" class="btn action-btn confirm-btn">Confirm order</button></div> </div>`;
  }
}

function showCart() {
  navLinks.forEach((el) => el.classList.remove("active"));
  let total = 0;
  let trs = "";
  shopping.forEach((item, index) => {
    total += item.quantity * item.price;
    trs += `<tr> <th scope="row">${index + 1}</th> <td>${item.quantity}</td> <td>${item.name}</td> <td>${item.price}</td> <td>${(item.quantity * item.price).toFixed(2)}</td> </tr>`;
  });
  contentParent.innerHTML = buildCart(trs, total);
  if (shopping.length > 0) document.querySelector("#btn-confirm-order").addEventListener("click", () => confirmOrder());
  tittle.innerHTML = "Order detail";
}

function showContent(content) {
  let html = "";
  menu
    .filter((el) => el.name == content)[0]
    .products.forEach((product, index) => {
      let newProduct = `<div class="container-card text-left col-sm-4 col-md-3">
        <div class="card">
          <img src="${product.image}" class="product-image img-fluid" alt="">
          <div class="card-body">
            <h5 class="card-title"><strong>${product.name}</strong></h5>
            <p class="card-text">${product.description}</p>
            <h5 class="card-title"><strong>$${product.price}</strong></h5>
            <button id="${content}-${index}" class="btn btn-primary btn-add-cart">Add to car</button>
          </div>
        </div>
      </div>`;
      html += newProduct;
    });
  contentParent.innerHTML = html;
  tittle.innerHTML = content;
  document.querySelectorAll(".btn-add-cart").forEach((el) => el.addEventListener("click", () => addCart(el.id)));
}
