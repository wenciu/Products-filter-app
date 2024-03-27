// VARIABLES
const mobileMenu = document.querySelector(".nav-mobile");
const hamburger = document.querySelector(".hamburger-btn");
const cardContainer = document.querySelector(".cards-container");
const loadingMsg = document.querySelector(".loading-container");
const overlayError = document.querySelector(".overlay-container");
const searchInput = document.querySelector(".search-field");
const filterBtns = document.querySelectorAll(".filter-btn");
let data = [];
let originalData = [];
let currentFilterOption = localStorage.getItem("filterOption") || "all";
const sortOrder = document.querySelector(".sort-order");
let currentSortOption = localStorage.getItem("sortOption");
const singleFavIcon = '<i class="fa-regular fa-star"></i>';
const paginationBtnsContainer = document.querySelector(".pagination-btns");
let itemsPerPage = 6;
let currentPage = 1;

// FETCH DATA
const fetchData = async () => {
  try {
    loadingMsg.style.display = "flex";
    const res = await fetch("https://api.npoint.io/dcd214a91ce5758197d2");
    data = await res.json();
    originalData = [...data];
    renderCards();

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

// CATEGORY BTNS (FILTER)
const filterByCategory = (category) => {
  currentFilterOption = category;
  const productCategory = data.filter((item) => {
    return category === "all" ? true : item.tags.includes(category);
  });
  renderCards(productCategory);
  localStorage.setItem("filterOption", category);
};

function changeItemsPerPage() {
  itemsPerPage = parseInt(document.querySelector(".itemsPerPage").value);
  currentPage = 1;
  renderCards();
}

// PAGINATION BTNS
const paginationBtns = () => {
  const totalPages = Math.ceil(data.length / itemsPerPage);
  paginationBtnsContainer.innerHTML = "";

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Prev";
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderCards();
    }
  });
  paginationBtnsContainer.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.addEventListener("click", () => {
      currentPage = i;
      renderCards();
    });
    paginationBtnsContainer.appendChild(button);
  }

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderCards();
    }
  });
  paginationBtnsContainer.appendChild(nextBtn);
};

// RENDER CARDS
const renderCards = (filteredData = data) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const slicedData = filteredData.slice(startIndex, endIndex);
  let singleCard = "";
  slicedData.forEach((item) => {
    const itemTags = item.tags
      .map(
        (tag) =>
          `<button class="tag" onClick="filterByCategory('${tag}')">${tag}</button>`
      )
      .join("");
    // SINGLE CARD LAYOUT
    singleCard += `
          <article class="single-card">
          <div class="card-left">
            <picture>
            <source media="(max-width: 768px)" srcset="${item.img.mobile}">
            <source srcset="${item.img.desktop}">
            <img loading="lazy" src="${item.img.desktop}" alt="${item.name}">
          </picture>
          </div>
          <div class="card-right">
            <div class="name-container">
            <h3 class="name">${item.name}</h3>
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

  cardContainer.innerHTML = singleCard;
  paginationBtns();

  /// ADD FAVOURITE
  const favIcons = document.querySelectorAll(".fa-regular.fa-star");
  favIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      icon.classList.toggle("fa-solid");
      icon.classList.toggle("fa-regular");
    });
  });
};

/// SORT OPTION
const sortByNameAsc = (a, b) => a.name.localeCompare(b.name);
const sortByNameDesc = (a, b) => b.name.localeCompare(a.name);
const sortByPriceAsc = (a, b) => a.price - b.price;
const sortByPriceDesc = (a, b) => b.price - a.price;

const sortData = (sortOption) => {
  let sortingFunction;

  if (sortOption === "default") {
    data = [...originalData];
    renderCards();
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

  data.sort(sortingFunction);
  renderCards();
};

// EVENT LISTENERS

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

// CATEGORY BTNS (FILTER)
filterBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const categoryBtn = e.currentTarget.dataset.id;
    filterByCategory(categoryBtn);
  });
});

// SORT ORDER
sortOrder.addEventListener("change", (event) => {
  sortData(event.target.value);
});

// MOBILE MENU
const toggleMobileMenu = () => {
  mobileMenu.classList.toggle("active");
};
hamburger.addEventListener("click", toggleMobileMenu);

// INITIALIZE
document.addEventListener("DOMContentLoaded", fetchData);
