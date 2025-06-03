var articles = [];
var newsContainer = document.getElementById("newsContainer");
var sortSelect = document.getElementById("sortSelect");
var mostPopular = document.getElementById("mostPopular");
var themeToggle = document.getElementById("themeToggle");

var currentTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", currentTheme);

themeToggle.addEventListener("click", function () {
    currentTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("theme", currentTheme);
});

fetch("article.json")
    .then(function (res) {
        return res.json();
    })
    .then(function (data) {
        articles = data.articles;
        for (var i = 0; i < articles.length; i++) {
            articles[i].image = "img/" + articles[i].id + ".jpg";
        }
        renderArticles(articles);
        updateMostPopular();
        activateCatForce();
    });

sortSelect.addEventListener("change", function () {
    var sorted = articles.slice();
    if (sortSelect.value === "views") {
        sorted.sort(function (a, b) {
            return b.views - a.views;
        });
    } else {
        sorted.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
        });
    }
    renderArticles(sorted);
});

function renderArticles(list) {
    newsContainer.innerHTML = "";

    for (var i = 0; i < list.length; i++) {
        var article = list[i];
        var readTime = Math.ceil(article.wordCount / 200);
        var expanded = article._expanded;

        var card = document.createElement("div");
        card.className = expanded ? "col-12 mb-4" : "col-md-6 mb-4";

        card.innerHTML = `
      <div class="card ${expanded ? "expanded-card" : "normal-card"}">
        <img src="${article.image}" class="${expanded ? "expanded-img" : "thumbnail-img"}" alt="Image">
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

        (function (a) {
            card.querySelector(".card").addEventListener("click", function () {
                if (a.category === "Finance") {
                    alert("F has the hat");
                }
                if (a._expanded) {
                    a._expanded = false;
                    a.views++;
                    updateMostPopular();
                } else {
                    for (var j = 0; j < articles.length; j++) {
                        articles[j]._expanded = false;
                    }
                    a._expanded = true;
                }

                var sortedList = sortSelect.value === "views"
                    ? articles.slice().sort(function (x, y) {
                        return y.views - x.views;
                    })
                    : articles;
                renderArticles(sortedList);
            });
        })(article);

        newsContainer.appendChild(card);
    }
}

function updateMostPopular() {
    var top = articles[0];
    for (var i = 1; i < articles.length; i++) {
        if (articles[i].views > top.views) {
            top = articles[i];
        }
    }
    var time = Math.ceil(top.wordCount / 200);
    mostPopular.innerHTML = `
    <h5>${top.title}</h5>
    <p class="text-muted">${top.date} | ${top.category}</p>
    <p><strong>👁️ ${top.views}</strong> views | ⏱️ ${time} min read</p>
  `;
}

function activateCatForce() {
    for (var i = 0; i < articles.length; i++) {
        if (articles[i].title === "Climate Change and the Future of Renewable Energy") {
            var btn = document.createElement("button");
            btn.textContent = "Activate CATFORCE";
            btn.className = "btn btn-outline-primary mt-4";
            btn.onclick = function () {
                var overlay = document.createElement("div");
                overlay.className = "catforce-overlay";

                var gif = document.createElement("img");
                gif.src = "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif";
                gif.className = "catforce-gif";

                overlay.appendChild(gif);

                var content = document.body.children;
                for (var k = 0; k < content.length; k++) {
                    if (content[k] !== overlay) {
                        content[k].style.display = "none";
                    }
                }

                document.body.appendChild(overlay);

                setTimeout(function () {
                    overlay.remove();
                    for (var k = 0; k < content.length; k++) {
                        content[k].style.display = "";
                    }
                }, 5000);
            };
            document.querySelector(".container").appendChild(btn);
            break;
        }
    }
}
