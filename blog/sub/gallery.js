export class Gallery {
  constructor(blog, gallery, archive) {
    this.blog = blog;
    this.gallery = gallery;
    this.archive = archive;
    this.init();
  }

  init() {
    this.createDiv();
    this.createButton();
  }

  async createDiv() {
    this.archive[this.blog.currentArchiveNumber].forEach((item, i) => {
      const card = document.createElement("div");
      card.className = "card mt-4";

      const row = document.createElement("div");
      row.className = "row g-0";

      const colImage = document.createElement("div");
      colImage.className = "col-4 col-md-4";

      const img = document.createElement("img");
      img.src = `./images/${item.year}/${i + 1}/${item.thumb}`;
      img.className = "img-fluid";
      img.alt = item.title;
      img.style.cursor = "pointer";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";

      img.onload = () => {
        const width = colImage.offsetWidth;
        colImage.style.height = `${width * 1.5}px`;
      };

      img.addEventListener("click", () => {
        this.blog.changePost(i);
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });

      const colBody = document.createElement("div");
      colBody.className = "col-8 col-md-8";

      const cardBody = document.createElement("div");
      cardBody.className = "card-body";

      const cardTitle = document.createElement("h5");
      cardTitle.className = "card-title";
      cardTitle.textContent = item.title;

      const itemDate = new Date(item.date);
      const options = { year: "numeric", month: "long", day: "numeric" };
      const formattedDate = itemDate.toLocaleDateString("en-US", options);

      const cardText = document.createElement("p");
      cardText.className = "card-text date";
      cardText.textContent = formattedDate;

      colImage.appendChild(img);
      cardBody.appendChild(cardTitle);
      cardBody.appendChild(cardText);
      colBody.appendChild(cardBody);
      row.appendChild(colImage);
      row.appendChild(colBody);
      card.appendChild(row);

      this.gallery.appendChild(card);
    });
  }

  createButton() {
    const dropdown = document.createElement("div");
    dropdown.className = "dropdown";

    const button = document.createElement("button");
    button.className = "btn btn-secondary dropdown-toggle rounded-0";
    button.type = "button";
    button.setAttribute("data-bs-toggle", "dropdown");
    button.setAttribute("aria-expanded", "false");
    button.textContent = "ARCHIVE";

    const menu = document.createElement("ul");
    menu.className = "dropdown-menu";

    const actions = [];

    this.archive.forEach((item, i) => {
      const count = this.archive[i].length;
      const text = `${item[i].year}(${count})`;
      const action = {
        text,
      };

      actions.push(action);
    });

    actions.forEach((action, i) => {
      const item = document.createElement("li");
      const link = document.createElement("span");
      link.className = "dropdown-item";
      link.textContent = action.text;

      link.addEventListener("click", (event) => {
        event.preventDefault();
        this.blog.changeArchive(i, 0);
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });

      item.appendChild(link);
      menu.appendChild(item);
    });

    dropdown.appendChild(button);
    dropdown.appendChild(menu);

    this.gallery.appendChild(dropdown);
  }

  createSearchInput() {
    const searchForm = document.createElement("form");
    searchForm.className = "d-flex border p-2";
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      this.filterResults(searchForm.searchInput.value);
    });

    const searchInput = document.createElement("input");
    searchInput.className = "form-control me-2";
    searchInput.type = "search";
    searchInput.placeholder = "Search";
    searchInput.ariaLabel = "Search";
    searchInput.name = "searchInput";
    searchInput.id = "searchInput";

    const searchButton = document.createElement("button");
    searchButton.className = "btn";
    searchButton.type = "submit";
    searchButton.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';

    searchForm.appendChild(searchButton);
    searchForm.appendChild(searchInput);
    this.gallery.appendChild(searchForm);
  }

  filterResults(query) {
    const filteredItems = this.archive[this.blog.currentArchiveNumber].filter(
      (item) => item.title.toLowerCase().includes(query.toLowerCase())
    );

    this.showSearchResults(filteredItems);
  }

  showSearchResults(items) {
    // 기존 검색 결과를 제거
    const existingResults = document.querySelectorAll(".search-result");
    existingResults.forEach((result) => result.remove());

    if (items.length > 0) {
      const resultsDropdown = document.createElement("ul");
      resultsDropdown.className = "dropdown-menu search-result";

      items.forEach((item) => {
        const resultItem = document.createElement("li");
        const link = document.createElement("span");
        link.className = "dropdown-item";
        link.textContent = item.title;
        link.addEventListener("click", () => {
          this.blog.changePost(item.id); // item.id는 해당 포스트의 ID로 가정
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        });

        resultItem.appendChild(link);
        resultsDropdown.appendChild(resultItem);
      });

      this.gallery.appendChild(resultsDropdown);
    }
  }
}
