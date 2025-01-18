import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

export class GuestBook {
  constructor(blog) {
    this.blog = blog;

    this.firebaseConfig = {
      apiKey: "AIzaSyBA61Rf9YlMZVvJjkpHFViwYbaj1lihLik",
      authDomain: "ant-eater-93de9.firebaseapp.com",
      projectId: "ant-eater-93de9",
      storageBucket: "ant-eater-93de9.firebasestorage.app",
      messagingSenderId: "502099054092",
      appId: "1:502099054092:web:40aa2c07302fc860612829",
      measurementId: "G-YZXB2Q0B5Z",
    };

    this.app = initializeApp(this.firebaseConfig);
    this.db = getFirestore(this.app);

    this.messages = [];
    this.createHTMLStructure();
    this.init();
  }

  createHTMLStructure() {
    const guestbookWrapper = document.createElement("div");
    guestbookWrapper.className = "guestbook";

    this.title = document.createElement("h1");
    this.title.innerText = `Comments`;
    guestbookWrapper.appendChild(this.title);

    this.messageList = document.createElement("div");
    this.messageList.className = "message-list";
    guestbookWrapper.appendChild(this.messageList);

    this.messageForm = document.createElement("div");
    this.messageForm.className = "message-form";

    this.form = document.createElement("form");
    this.form.id = "form";

    const nameWrapper = document.createElement("div");
    nameWrapper.className = "name_wrapper";

    const nameLabel = document.createElement("label");
    nameLabel.setAttribute("for", "name");
    nameLabel.textContent = "Author";
    this.nameInput = document.createElement("input");
    this.nameInput.type = "text";
    this.nameInput.id = "name";
    this.nameInput.required = true;

    nameWrapper.appendChild(nameLabel);
    nameWrapper.appendChild(this.nameInput);
    this.form.appendChild(nameWrapper);

    const contentLabel = document.createElement("label");
    contentLabel.setAttribute("for", "content");
    this.contentInput = document.createElement("textarea");
    this.contentInput.id = "content";
    this.contentInput.required = true;
    this.contentInput.style.width = "100%";
    this.contentInput.style.height = "20vw";
    this.contentInput.placeholder = "Please Enter Your Message";

    this.form.appendChild(contentLabel);
    this.form.appendChild(this.contentInput);

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";
    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.className = "btn btn-light btn-lg mt-3";
    submitButton.innerText = "Post Comment…";
    buttonContainer.appendChild(submitButton);
    this.form.appendChild(buttonContainer);

    this.messageForm.appendChild(this.form);
    guestbookWrapper.appendChild(this.messageForm);

    document.getElementById("post").appendChild(guestbookWrapper);
  }

  init() {
    this.fetchMessages();
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.form.addEventListener("submit", (event) => this.handleSubmit(event));
  }

  async fetchMessages() {
    const q = query(
      collection(
        this.db,
        `messages_${this.blog.currentArchiveNumber}_${this.blog.currentPageNumber}`
      ),
      orderBy("timestamp", "desc")
    );
    onSnapshot(
      q,
      (snapshot) => {
        this.messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        this.renderMessages();
        this.updateCommentCount();
      },
      (error) => {
        console.error("Error fetching messages:", error);
      }
    );
  }

  renderMessages() {
    this.messageList.innerHTML = "";
    this.messages.forEach((message) => {
      const itemDate = new Date(message.timestamp);
      const options = { year: "numeric", month: "long", day: "numeric" };
      const formattedDate = itemDate.toLocaleDateString("en-US", options);

      const messageDiv = document.createElement("div");
      messageDiv.className = "message";
      messageDiv.innerHTML = `
        <div class="message_header">
          <strong style="margin-right: auto;">${message.name}</strong>
          <p>${formattedDate}</p>
        </div>
        <p>${this.formatMessageContent(message.content)}</p>
      `;
      this.messageList.appendChild(messageDiv);
    });
  }

  formatMessageContent(content) {
    return content.replace(/\n/g, "<br>");
  }

  updateCommentCount() {
    this.title.innerText = `Comments (${this.messages.length})`;
  }

  formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  async handleSubmit(event) {
    event.preventDefault();
    try {
      await addDoc(
        collection(
          this.db,
          `messages_${this.blog.currentArchiveNumber}_${this.blog.currentPageNumber}`
        ),
        {
          name: this.nameInput.value,
          content: this.contentInput.value.replace(/\n/g, "<br>"),
          timestamp: Date.now(),
        }
      );
      this.nameInput.value = ""; // 이름 입력 필드 초기화
      this.contentInput.value = "";
    } catch (e) {
      console.error("Error adding document:", e);
    }
  }
}
