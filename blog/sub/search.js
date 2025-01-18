export class Search {
  constructor(blog, archive) {
    this.blog = blog;
    this.archive = archive;
    this.input = document.getElementById("search");
    this.galleryDiv = document.getElementById("gallery_dropdown");
    this.init();
  }

  init() {
    this.input.addEventListener("input", (event) => {
      this.handleInput(event.target.value);
    });
  }

  handleInput(query) {
    if (query.trim() === "") {
      this.galleryDiv.innerHTML = "";
      return;
    }

    let found = false;
    const gallery = [];

    this.archive.forEach((dataList, i) => {
      dataList.forEach((data, j) => {
        if (data.title.toLowerCase().includes(query.toLowerCase())) {
          found = true;

          const content = { archiveIndex: i, dataIndex: j, title: data.title };
          gallery.push(content);
        }
      });
    });

    if (found) {
      this.galleryDiv.innerHTML = "";
      const dropdown = document.createElement("ul");
      dropdown.className = "dropdown-menu show";
      dropdown.style.borderRadius = "0";

      gallery.forEach((data, i) => {
        const resultItem = document.createElement("li");
        const link = document.createElement("a");
        link.className = "dropdown-item";
        link.href = "#";
        link.textContent = data.title;

        link.addEventListener("click", (event) => {
          event.preventDefault();
          this.inputClear();
          this.blog.changeArchive(data.archiveIndex, data.dataIndex);
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        });

        resultItem.appendChild(link);
        dropdown.appendChild(resultItem);
        this.galleryDiv.appendChild(dropdown);
      });
    } else {
      this.galleryDiv.innerHTML = "";
    }
  }

  inputClear() {
    this.input.value = "";
    this.galleryDiv.innerHTML = "";
  }
}
