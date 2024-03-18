const cardContainer = document.querySelector(".cards-container");
const overlayError = document.querySelector(".overlay-container");
const searchInput = document.querySelector(".search-field");
const filterBtns = document.querySelectorAll(".filter-btn");
let data = [];

//FETCHING DATA
const fetchData = async () => {
  try {
    const res = await fetch("https://json.extendsclass.com/bin/54972968bc6f");
    data = await res.json();
    renderCards(data);
    // console.log(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    overlayError.style.display = "flex";
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
          <h3 class="name">${item.name}</h3>
          <h3 class="price">$${item.price}</h3>
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
  const productCategory = data.filter((item) => {
    return category === "all" ? true : item.tags.includes(category);
  });
  renderCards(productCategory);
};

// Attach the filtering function to each button onClick
filterBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const categoryBtn = e.currentTarget.dataset.id;
    filterByCategory(categoryBtn);
  });
});

document.addEventListener("DOMContentLoaded", fetchData());

//BACKUP
/// FILTER BTNS
// filterBtns.forEach((btn) => {
//   btn.addEventListener("click", (e) => {
//     const categoryBtn = e.currentTarget.dataset.id;
//     const productCategory = data.filter((item) => {
//       return item.tags.includes(categoryBtn);
//     });
//     if (categoryBtn === "all") {
//       renderCards(data);
//     } else {
//       renderCards(productCategory);
//     }
//   });
// });
