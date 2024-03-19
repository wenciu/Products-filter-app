// VARIABLES
const cardContainer = document.querySelector(".cards-container");
const loadingMsg = document.querySelector(".loading-container");
const overlayError = document.querySelector(".overlay-container");
const searchInput = document.querySelector(".search-field");
const filterBtns = document.querySelectorAll(".filter-btn");
let data = JSON.parse(localStorage.getItem("storedData")) || [];
let currentFilterOption = localStorage.getItem("filterOption") || "all";
const sortOrder = document.querySelector(".sort-order");
let currentSortOption = localStorage.getItem("sortOption");

// FETCH DATA
const fetchData = async () => {
  try {
    loadingMsg.style.display = "flex";
    const res = await fetch("https://json.extendsclass.com/bin/54972968bc6f");
    data = await res.json();
    renderCards(data);

    if (currentSortOption) {
      sortOrder.value = currentSortOption;
      sortData(currentSortOption);
    }
    filterByCategory(currentFilterOption);
  } catch (error) {
    console.error("Error fetching data:", error);
    overlayError.style.display = "flex";
    loadingMsg.style.display = "none";
  }
};

//FUNCTION RENDER CARDS
const renderCards = (data) => {
  let singleCard = "";
  data.forEach((item) => {
    // TAGS
    const itemTags = item.tags
      .map(
        (tag) =>
          `<div class="tag" onClick="filterByCategory('${tag}')">${tag}</div>`
      )
      .join("");
    // SINGLE CARD LAYOUT
    singleCard += `
        <article class="single-card">
        <div class="card-left">
          <img src=${item.img} alt="${item.name}">
        </div>
        <div class="card-right">
        <div class="name-container">
          <h3 class="name">${item.name}</h3>
          <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"/>
</svg>

                </div>
          <p class="price">$${item.price}</p>
          <p class="description">${item.desc}
          </p>
          <div class="tags-container">
          ${itemTags}
          </div>
        </div>
      </article>`;
  });
  cardContainer.innerHTML = singleCard;
};

/// FILTER INPUT DATA
searchInput.addEventListener("keyup", (e) => {
  const searchInput = e.target.value.toLowerCase();
  const filteredItems = data.filter((item) => {
    // Name check
    if (item.name.toLowerCase().includes(searchInput)) {
      return true;
    }
    // Tag(category) check
    else {
      return item.tags.some((tag) => tag.toLowerCase().includes(searchInput));
    }
  });
  renderCards(filteredItems);
});

/// FILTER BTNS
const filterByCategory = (category) => {
  currentFilterOption = category;
  const productCategory = data.filter((item) => {
    return category === "all" ? true : item.tags.includes(category);
  });
  renderCards(productCategory);
  localStorage.setItem("filterOption", category);
};

filterBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const categoryBtn = e.currentTarget.dataset.id;
    filterByCategory(categoryBtn);
  });
});

/// SORT OPTION
const sortByNameAsc = (a, b) => a.name.localeCompare(b.name);
const sortByNameDesc = (a, b) => b.name.localeCompare(a.name);
const sortByPriceAsc = (a, b) => a.price - b.price;
const sortByPriceDesc = (a, b) => b.price - a.price;

const sortData = (sortOption) => {
  let sortingFunction;

  if (sortOption === "default") {
    renderCards(data);
    localStorage.removeItem("sortOption");
    return;
  } else {
    localStorage.setItem("sortOption", sortOption);
  }

  if (sortOption === "name-asc") {
    sortingFunction = sortByNameAsc;
  } else if (sortOption === "name-desc") {
    sortingFunction = sortByNameDesc;
  } else if (sortOption === "price-asc") {
    sortingFunction = sortByPriceAsc;
  } else if (sortOption === "price-desc") {
    sortingFunction = sortByPriceDesc;
  } else {
    console.error("Invalid sorting option:", sortOption);
    return;
  }

  const sortedData = data.slice().sort(sortingFunction);
  renderCards(sortedData);
};

sortOrder.addEventListener("change", (event) => {
  sortData(event.target.value);
});

/// ADD FAVOURITE

const icon = document.querySelector(".icon");
console.log(icon);

// icon.addEventListener("click", function () {
//   // Change the SVG path data to another icon
//   icon.innerHTML =
//     '<path d="M7 10h10v4H7z"/><path fill="none" d="M0 0h24v24H0z"/>';
// });

// Now you can work with the regularIcons NodeList
// regularIcons.forEach((icon) => {
//   // Perform actions on each icon
//   console.log(icon);
// });

document.addEventListener("DOMContentLoaded", fetchData);
