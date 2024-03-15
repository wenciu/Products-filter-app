document.addEventListener("DOMContentLoaded", function () {
  const cardContainer = document.querySelector(".cards-container");
  fetch("https://json.extendsclass.com/bin/33c955123b3f")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      let singleCard = "";

      data.forEach((item) => {
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
            <div class="tag">${item.tags[0]}</div>
            <div class="tag">${item.tags[1]}</div>
            <div class="tag">${item.tags[2]}</div>
          </div>
        </div>
      </article>`;
      });

      cardContainer.innerHTML = singleCard;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      dataContainer.textContent = "Failed to fetch data";
    });
});
