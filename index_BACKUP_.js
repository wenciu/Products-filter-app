document.addEventListener("DOMContentLoaded", function () {
  const cardContainer = document.querySelector(".cards-container");
  const overlayError = document.querySelector(".overlay-container");

  fetch("https://json.extendsclass.com/bin/54972968bc6f")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      let singleCard = "";

      data.forEach((item) => {
        // TAGS
        const itemTags = item.tags
          .map((tag) => `<div class="tag">${tag}</div>`)
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
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      overlayError.style.display = "flex";
    });
});
