// -------------------------네브영역--------------------------------------
const menuButton = document.getElementById('menu-button');
const menuItems = document.querySelector('.reaction-type-menu-item');

// 버튼 클릭 이벤트 리스너 추가
menuButton.addEventListener('click', () => {
  // 클래스 토글로 display 상태 전환
  menuItems.classList.toggle('active');
});
// -------------------------네브영역--------------------------------------
// ---------------메인 섹션 2 이미지 모달 기능 영역--------------------------
const images = [
    "./main-assets/main-page-img/section-2-img1.jpg",
    "./main-assets/main-page-img/section-2-img2.jpg",
    "./main-assets/main-page-img/section-2-img3.jpg",
    "./main-assets/main-page-img/section-2-img4.jpg",
    "./main-assets/main-page-img/section-2-img5.jpg",
    "./main-assets/main-page-img/section-2-img6.jpg",
  ];
const lightboxImage = document.getElementById("lightbox-image");
const lightBox = document.getElementById("lightbox");
let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    lightBox.style.display = "flex";
    lightboxImage.src = images[currentIndex];
  }
  
  function closeLightbox() {
    lightBox.style.display = "none";
  }
  
  function changeImage(direction) {
    currentIndex = (currentIndex + direction + images.length) % images.length;
    lightboxImage.src = images[currentIndex]; 
  }
//   -------------------하단 쿠키 배너---------------------------------------

const cookieButton=(e)=>{
            document.querySelector(".main-cookies-banner-area").style.display="none"
}