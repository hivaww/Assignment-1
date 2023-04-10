// HTML-component + SPA/routing example in Vanilla JS
// © ironboy, Node Hill AB, 2023

// import the main scss file: the scss will compile to css
// and hot reload on changes thanks to Vite

// import bootstrap JS part
import getBooks from "./getBooks.js";
// helper: grab a DOM element

// initialize books
let books = [];
let shopping = [];
const homeButton = document.querySelector("#homeIcon");
const total = document.getElementById("total");

homeButton.addEventListener("click", () => {
  render();
});

async function render() {
  total.style.display = "none";
  books = await getBooks("./json/books.json");
  console.log("books", books);
  shoppingPage();
  const mainTag = document.querySelector("main");
  let mainHtml = `<div class="row" id="my-row">
  
  </div>`;
  mainTag.innerHTML = mainHtml;
  let rowHtml = ``;
  const rowTag = document.querySelector("#my-row");
  books.map((book, index) => {
    rowHtml += `
      <div class="col-6 col-sm-4 col-lg-3 col-xxl-2 p-2">
        <div class="card w-30 p-3 h-100">
          <img src="${book.img}" class="card-img-top" id="book-img" alt=".." />
          <div class="card-body h-200">
            <a href="#" class="card-title" id="book-title" data-bs-toggle="modal" data-bs-target="#exampleModal-${index}">
              ${book.Title}
             
            </a>
            <p class="card-text" id="book-price">
              ${book.Price}
            </p>
            <p class="card-text" id="book-cat">
              ${book.Category}
            </p>
            <button type="button" class="btn btn-primary" id="buy-button" data-arg1='${book.id}'>
              Buy
            </button>
          </div>
        </div>
      </div>
      <div class="modal fade" id="exampleModal-${index}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5"  id="exampleModalLabel">${book.Title}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
          <img src="${book.img}" class="card-img-top" id="book-img" alt=".." />
            <h5>Author: ${book.Author}</h5>
            <h5>Price: ${book.Price}</h5>
            <h5>Category: ${book.Category}</h5>
            ${book.Descryption}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" id="buy-button" data-arg1='${book.id}'>Buy</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
          </div>
        </div>
      </div>
    
    `;
  });
  rowTag.innerHTML = rowHtml;
  shoppingCart();
}

function shoppingCart() {
  let buyButtons = document.querySelectorAll("#buy-button");
  buyButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      // Buy button only works in main not in detail
      console.log("buy button clicked");
      // data-arg1 is the book id, with this id we will find the book in the books
      let bookId = event.target.getAttribute("data-arg1");
      console.log({ bookId });
      // find book being purchased in the book list
      const purchaseBook = books.filter((book) => bookId.includes(book.id));
      console.log(purchaseBook);
      //when clicked, you add this book to the shopping cart
      // push purchaseBook to shopping list, but if this purchaseBook is already added
      // dont push it, if is not available, then push it, else, increment the count
      // shopping = [{"count": 1}]
      const isBookInShopping = shopping.filter((book) => {
        return book.id === purchaseBook[0].id;
      });
      if (isBookInShopping.length === 0) {
        purchaseBook[0].count = 1;
        shopping.push(purchaseBook[0]);
      } else {
        isBookInShopping[0].count += 1;
      }
      console.log("shopping", shopping);
    });
  });
}

function shoppingPage() {
  const mainTag = document.querySelector("main");
  let shoppingButton = document.querySelector("#shoppingIcon");
  // build shoppingHtml
  console.log("purchased books", shopping);
  shoppingButton.addEventListener("click", (event) => {
    // check if shopping list is empty, if is empty, render empty page
    // if it has elements, render these elements
    mainTag.innerHTML = `

      <div
        class="row d-flex justify-content-center align-items-center h-100"
      >
        <div class="col" id="cols">
        </div>
      </div>
   `;
    let colsHtml = ``;
    let colsElement = document.querySelector("#cols");
    // filter shopping array, if elements repeat, count the number
    // also get that element
    // shopping = [[{"title": "dsa", "price": 123, "author": "whoever"}], [{}], [{}]]
    // compare the lists, if they are the same
    // for the total price, get the element.price * count number
    // for the final price, count all the books price and sum them

    let finalPrice = 0;
    // shopping list should be the filtered list
    shopping.map((book) => {
      // shopping.map is mapping arrays of objects, we need to use another map to map
      // each object's title, price

      console.log("book", book);
      colsHtml += `
          <div class="card mb-4">
            <div class="card-body p-4">
              <div class="row align-items-center">
                <div class="col-md-2">
                  <img
                    src="${book.img}"
                    class="img-fluid"
                    alt="Generic placeholder image"
                  />
                </div>
                <div class="col-md-2 d-flex justify-content-center">
                  <div>
                    <p class="small text-muted mb-4 pb-2">Name</p>
                    <p class="lead fw-normal mb-0">${book.Title}</p>
                  </div>
                </div>
                <div class="col-md-2 d-flex justify-content-center">
                  <div>
                    <p class="small text-muted mb-4 pb-2">Quantity</p>
                    <p class="lead fw-normal mb-0">${book.count}</p>
                  </div>
                </div>
                <div class="col-md-2 d-flex justify-content-center">
                  <div>
                    <p class="small text-muted mb-4 pb-2">Price</p>
                    <p class="lead fw-normal mb-0">${
                      Number(book.Price.split("kr")[0]) * book.count
                    } kr</p>
                  </div>
                </div>
                
              </div>
            </div>
          </div>`;
      finalPrice += Number(book.Price.split("kr")[0]) * book.count;
    });
    colsElement.innerHTML = colsHtml;
    if (finalPrice > 0) {
      total.style.display = "flex";
      total.innerHTML = `Total: ${finalPrice} kr`;
    }
    // console.log(findDuplicateObjects(shopping));
  });
  // function findDuplicateObjects(arr) {
  //   const hashTable = {};

  //   return arr.reduce((duplicates, obj) => {
  //     const key = JSON.stringify(obj);

  //     if (hashTable[key]) {
  //       duplicates.push(obj);
  //     } else {
  //       hashTable[key] = true;
  //     }

  //     return duplicates;
  //   }, []);
  // }
}

render();
