// VARIABLES
const mobileMenu = document.querySelector(".nav-mobile");
const hamburger = document.querySelector(".hamburger-btn");
const cardContainer = document.querySelector(".cards-container");
const loadingMsg = document.querySelector(".loading-container");
const overlayError = document.querySelector(".overlay-container");
const searchInput = document.querySelector(".search-field");
const filterBtns = document.querySelectorAll(".filter-btn");
let data = JSON.parse(localStorage.getItem("storedData")) || [];
let currentFilterOption = localStorage.getItem("filterOption") || "all";
const sortOrder = document.querySelector(".sort-order");
let currentSortOption = localStorage.getItem("sortOption");
const singleFavIcon = '<i class="fa-regular fa-star"></i>';

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
          <img src="${item.img}" alt="${item.name}" loading="lazy">
          <picture>
          <!-- Small image for mobile -->
          <source media="(max-width: 600px)" srcset="small.jpg">
      
          <!-- Large image for larger screens -->
          <source srcset="large.jpg">
      
          <!-- Default fallback image -->
          <img src="large.jpg" alt="Description">
        </picture>

        </div>
        <div class="card-right">
          <div class="name-container">
          <h2 class="name">${item.name}</h2>
          ${singleFavIcon}
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

  //   <picture>
  //   <!-- Small image for mobile -->
  //   <source media="(max-width: 600px)" srcset="small.jpg">

  //   <!-- Large image for larger screens -->
  //   <source srcset="large.jpg">

  //   <!-- Default fallback image -->
  //   <img src="large.jpg" alt="Description">
  // </picture>

  cardContainer.innerHTML = singleCard;

  /// ADD FAVOURITE
  const favIcons = document.querySelectorAll(".fa-regular.fa-star");
  favIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      icon.classList.toggle("fa-solid");
      icon.classList.toggle("fa-regular");
    });
  });
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

// MOBILE MENU
const toggleMobileMenu = () => {
  mobileMenu.classList.toggle("active");
};
hamburger.addEventListener("click", toggleMobileMenu);

document.addEventListener("DOMContentLoaded", fetchData);
