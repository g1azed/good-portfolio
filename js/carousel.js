const carousel = document.querySelector(".carousel");
const cells = document.querySelectorAll(".carousel__cell");
const totalCells = cells.length;
let currentAngle = 0;
const anglePerItem = 360 / totalCells ; // 아이템당 회전 각도

// 3D 원형 정렬
function arrangeCarousel() {
  const radius = 360; // 반지름
  cells.forEach((cell, i) => {
    const angle = anglePerItem * i;
    cell.style.transform = `rotateY(-${angle}deg) translateZ(${radius}px) rotateY(180deg)`;
  });
}

// 스크롤 이벤트 추가
function onScroll(event) {
  if (event.deltaY > 0) {
    currentAngle -= anglePerItem;
  } else {
    currentAngle += anglePerItem;
  }
  carousel.style.transform = `rotateY(${currentAngle}deg)`; // 🔹 회전만 변경
}

// 초기 배치 및 이벤트 리스너 등록
arrangeCarousel();
window.addEventListener("wheel", onScroll);