export class Post {
  constructor(blog, post, archive) {
    this.blog = blog;
    this.post = post;
    this.archive = archive;
    this.init();
  }

  init() {
    this.createDivs();
  }

  async createDivs() {
    const details = this.archive[this.blog.currentArchiveNumber];
    const detail = details[this.blog.currentPageNumber];
    if (detail) {
      const postContainer = document.createElement("div");
      postContainer.className = "post-container mb-4";

      const itemDate = new Date(detail.date);
      const options = { year: "numeric", month: "long", day: "numeric" };
      const formattedDate = itemDate.toLocaleDateString("en-US", options);

      const postHeader = document.createElement("div");
      postHeader.className = "post-header mb-3";
      const postHeaderImage = detail.imageEnable
        ? `<div class="post-image mb-5">
                    <img src="./images/${detail.year}/${
            this.blog.currentPageNumber + 1
          }/${detail.image}" class="img-fluid">
          <span>${detail.imageCaption}</span>
                  </div>`
        : "";
      postHeader.innerHTML = `
                  ${postHeaderImage}
                  <h2>${detail.title}</h2>
                  <p class="date">${formattedDate}</p>
              `;
      postContainer.appendChild(postHeader);

      const postBody = document.createElement("div");
      postBody.className = "post-body";

      detail.content.forEach((item) => {
        if (item.type === "text") {
          const textElement = document.createElement(item.tag || "p");
          textElement.innerHTML = item.value;
          if (item.class) {
            textElement.className = item.class;
          }
          postBody.appendChild(textElement);
        } else if (item.type === "image") {
          const imgWrapper = document.createElement("div");
          if (item.class) {
            imgWrapper.className = `post-image ${item.class}`;
          } else {
            imgWrapper.className = "post-image";
          }
          postBody.appendChild(imgWrapper);

          const imgElement = document.createElement("img");
          imgElement.src = `./images/${detail.year}/${
            this.blog.currentPageNumber + 1
          }/${item.value}`;
          imgElement.className = "img-fluid";
          imgWrapper.appendChild(imgElement);
        } else if (item.type === "image_collection") {
          const rowDiv = document.createElement("div");
          rowDiv.className = `row ${item.class}`;

          item.value.forEach((imageSrc) => {
            const colDiv = document.createElement("div");
            colDiv.className = "col-6 col-md-4 mb-3";

            const imgElement = document.createElement("img");
            imgElement.src = `./images/${detail.year}/${
              this.blog.currentPageNumber + 1
            }/${imageSrc}`;
            imgElement.className = "img-fluid";
            imgElement.style.width = "100%";
            imgElement.style.height = "100%";
            imgElement.style.objectFit = "cover";

            imgElement.onload = () => {
              const width = imgElement.offsetWidth;
              colDiv.style.height = `${width}px`;
            };

            colDiv.appendChild(imgElement);
            rowDiv.appendChild(colDiv);
          });

          postBody.appendChild(rowDiv);
        } else if (item.type === "line") {
          const lineDiv = document.createElement(item.tag || "div");
          lineDiv.className = item.class;
          postBody.appendChild(lineDiv);
        } else if (item.type === "imageInText") {
          const imageInTextDiv = document.createElement("div");

          const imgElement = document.createElement("img");
          imgElement.src = `./images/${detail.year}/${
            this.blog.currentPageNumber + 1
          }/${item.image.value}`;
          imgElement.className = "img-fluid me-4";
          imgElement.style.width = `${item.image.width}px`;
          imgElement.style.float = `${item.image.float}`;
          imageInTextDiv.appendChild(imgElement);

          imageInTextDiv.innerHTML += item.backgroundText;

          postBody.appendChild(imageInTextDiv);
        }
      });

      postContainer.appendChild(postBody);
      this.post.appendChild(postContainer);
    } else {
      console.error("포스트 없음");
    }

    const pagination = document.createElement("div");
    pagination.className =
      "pagination d-flex justify-content-between mt-5 mb-5";
    const prevButton = document.createElement("button");
    prevButton.className = "btn btn-white";
    prevButton.innerText = "← Newer posts";

    console.log("currentArchiveNumber", this.blog.currentArchiveNumber);
    console.log("currentPageNumber", this.blog.currentPageNumber);

    if (this.blog.currentArchiveNumber > 0) {
      if (this.blog.currentPageNumber > 0) {
        pagination.className =
          "pagination d-flex justify-content-between mt-5 mb-5";
      } else {
        pagination.className =
          "pagination d-flex justify-content-between mt-5 mb-5";
      }
    } else {
      if (this.blog.currentPageNumber > 0) {
        pagination.className =
          "pagination d-flex justify-content-between mt-5 mb-5";
      } else {
        prevButton.classList.add("d-none");
        pagination.className =
          "pagination d-flex justify-content-end mt-5 mb-5";
      }
    }

    prevButton.onclick = () => {
      console.log("이전 페이지");
      if (this.blog.currentArchiveNumber > 0) {
        if (this.blog.currentPageNumber > 0) {
          this.blog.currentPageNumber--;
          this.blog.changePost(this.blog.currentPageNumber);
        } else {
          this.blog.currentArchiveNumber--;
          this.blog.currentPageNumber = details.length - 1;

          this.blog.changeArchive(
            this.blog.currentArchiveNumber,
            this.blog.currentPageNumber
          );
        }
      } else {
        if (this.blog.currentPageNumber > 0) {
          this.blog.currentPageNumber--;
          this.blog.changePost(this.blog.currentPageNumber);
        } else {
          console.log("이전 페이지 없음");
        }
      }
    };

    const nextButton = document.createElement("button");
    nextButton.className = "btn btn-white";
    nextButton.innerText = "Older Posts →";

    if (this.blog.currentArchiveNumber >= this.archive.length - 1) {
      if (this.blog.currentPageNumber >= details.length - 1) {
        nextButton.classList.add("d-none");
        pagination.className =
          "pagination d-flex justify-content-start mt-5 mb-5";
      } else {
        pagination.className =
          "pagination d-flex justify-content-between mt-5 mb-5";
      }
    } else {
      if (this.blog.currentPageNumber >= details.length - 1) {
        pagination.className =
          "pagination d-flex justify-content-between mt-5 mb-5";
      } else {
        if (
          this.blog.currentArchiveNumber > 0 &&
          this.blog.currentPageNumber > 0
        ) {
          pagination.className =
            "pagination d-flex justify-content-between mt-5 mb-5";
        }
      }
    }

    nextButton.onclick = () => {
      console.log("다음 페이지");
      if (this.blog.currentArchiveNumber >= this.archive.length - 1) {
        if (this.blog.currentPageNumber >= details.length - 1) {
          console.log("다음 페이지 없음");
        } else {
          this.blog.currentPageNumber++;
          this.blog.changePost(this.blog.currentPageNumber);
        }
      } else {
        if (this.blog.currentPageNumber >= details.length - 1) {
          this.blog.currentArchiveNumber++;
          this.blog.currentPageNumber = 0;
          this.blog.changeArchive(
            this.blog.currentArchiveNumber,
            this.blog.currentPageNumber
          );
        } else {
          this.blog.currentPageNumber++;
          this.blog.changePost(this.blog.currentPageNumber);
        }
      }
    };

    pagination.appendChild(prevButton);
    pagination.appendChild(nextButton);

    this.post.appendChild(pagination);
  }

  resize() {
    const images = document.querySelectorAll(".collection-img-wrapper img");
    images.forEach((img) => {
      const width = img.offsetWidth;
      img.parentElement.style.height = `${width}px`;
    });
  }
}
