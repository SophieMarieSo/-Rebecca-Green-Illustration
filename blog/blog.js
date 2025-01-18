import { list } from "./archive/list.js";
import { Post } from "./sub/post.js";
import { Gallery } from "./sub/gallery.js";
import { Search } from "./sub/search.js";
import { GuestBook } from "./sub/guestbook.js";

export class Blog {
  constructor() {
    this.gallery = document.getElementById("gallery_list");
    this.search = document.getElementById("search");
    this.post = document.getElementById("post");
    this.archive = [];
    this.currentArchiveNumber = 1;
    this.currentPageNumber = 0;
    this.init();
  }

  async init() {
    await this.getData(list);
    this.runModule();
    this.event();
  }

  event() {
    window.addEventListener("resize", this.resize.bind(this));
    window.addEventListener("click", (event) => {
      this.searchModule.inputClear();
    });
  }

  async getData(list) {
    for (const detail of list) {
      const year = detail.year;
      const count = detail.count;

      const dataList = [];
      for (let i = 0; i < count; i++) {
        const path = `./archive/${year}/${i + 1}.js`;
        const { detail } = await import(path);

        const data = {
          year: year,
          title: detail.title,
          thumb: detail.thumb,
          imageEnable: detail.imageEnable,
          image: detail.image,
          imageCaption: detail.imageCaption,
          content: detail.content,
          date: detail.date,
          tags: detail.tags,
        };

        dataList.push(data);
      }

      this.archive.push(dataList);
    }
  }

  runModule() {
    this.runGallery();
    this.runPost();
    this.runSearch();
    this.runGuestBook();
  }

  runGallery() {
    this.galleryModule = new Gallery(this, this.gallery, this.archive);
  }

  runPost() {
    this.postModule = new Post(this, this.post, this.archive);
  }

  runSearch() {
    this.searchModule = new Search(this, this.archive);
  }

  runGuestBook() {
    this.guestBookModule = new GuestBook(this);
  }

  changePost(number) {
    this.currentPageNumber = number;
    this.post.innerHTML = "";
    this.runPost();
    this.runGuestBook();
  }

  changeArchive(archiveIndex, postIndex) {
    this.currentArchiveNumber = archiveIndex;
    this.gallery.innerHTML = "";
    this.runGallery();
    this.changePost(postIndex);
  }

  resize() {
    this.postModule.resize();
  }
}

new Blog();
