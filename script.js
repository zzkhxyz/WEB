let articles = [];
const newsContainer = document.getElementById("newsContainer");
const sortSelect = document.getElementById("sortSelect");
const mostPopular = document.getElementById("mostPopular");
const themeToggle = document.getElementById("themeToggle");

let currentTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", currentTheme);

themeToggle.addEventListener("click", () => {
    currentTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("theme", currentTheme);
});

fetch("article.json")
    .then(res => res.json())
    .then(data => {
        articles = data.articles;
        articles.forEach(article => {
            article.image = `img/${article.id}.jpg`;
        });

        renderArticles(articles);
        updateMostPopular();
        activateCatForce();
    });

sortSelect.addEventListener("change", () => {
    const sorted = [...articles];
    if (sortSelect.value === "views") {
        sorted.sort((a, b) => b.views - a.views);
    } else {
        sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    renderArticles(sorted);
});

function renderArticles(list) {
    newsContainer.innerHTML = "";

    list.forEach(article => {
        const readTime = Math.ceil(article.wordCount / 200);
        const isExpanded = article._expanded;

        const card = document.createElement("div");
        card.className = isExpanded ? "col-12 mb-4" : "col-md-6 mb-4";

        card.innerHTML = `
      <div class="card h-100 ${isExpanded ? "p-4 border border-warning shadow-lg" : ""}" style="cursor:pointer">
        <img src="${article.image}" class="card-img-top" alt="Image"
          style="${isExpanded
            ? 'width:100%;height:auto;object-fit:contain;'
            : 'max-height:250px;width:100%;object-fit:cover;'}">
        <div class="card-body">
          <h5 class="card-title">${article.title}</h5>
          <h6 class="card-subtitle mb-2">${article.date} | ${article.category}</h6>
          <p class="card-text">${article.content}</p>
        </div>
        <div class="card-footer">
          <small>👁️ ${article.views} views | ⏱️ ${readTime} min read</small>
        </div>
      </div>
    `;

        card.querySelector(".card").addEventListener("click", () => {
            if (isExpanded) {
                article._expanded = false;
                article.views++;
                updateMostPopular();
            } else {
                articles.forEach(a => a._expanded = false);
                article._expanded = true;
            }

            const sortedList = sortSelect.value === "views"
                ? [...articles].sort((a, b) => b.views - a.views)
                : articles;

            renderArticles(sortedList);
        });

        newsContainer.appendChild(card);
    });
}

function updateMostPopular() {
    const top = [...articles].sort((a, b) => b.views - a.views)[0];
    const readTime = Math.ceil(top.wordCount / 200);
    mostPopular.innerHTML = `
    <h5>${top.title}</h5>
    <p class="text-muted">${top.date} | ${top.category}</p>
    <p><strong>👁️ ${top.views}</strong> views | ⏱️ ${readTime} min read</p>
  `;
}

function activateCatForce() {
    const article = articles.find(a => a.title === "Climate Change and the Future of Renewable Energy");
    if (article) {
        const btn = document.createElement("button");
        btn.textContent = " Activate CATFORCE";
        btn.className = "btn btn-outline-primary mt-4";
        btn.onclick = () => {
            alert(" EASTER EGG ACTIVATED!");
            document.body.style.backgroundImage = "url('https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif')";
            document.body.style.backgroundRepeat = "no-repeat";
            document.body.style.backgroundPosition = "center";
            document.body.style.backgroundSize = "contain";
            setTimeout(() => {
                document.body.style.backgroundImage = "none";
            }, 5000);
        };
        document.querySelector(".container").appendChild(btn);
    }
}
