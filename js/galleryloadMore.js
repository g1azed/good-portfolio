import { projects } from "./projects.js";

export function setupGalleryLoadMore() {

    const boardGal = document.getElementById("boardGal");
    const galleryLoadMoreBtn = document.getElementById("gallery-load-more");

    let currentIndex = 0;
    const itemsPerPage = 6;

    function isGalleryMode() {
        const list_gallery = document.querySelector(".board-list");
        return list_gallery.classList.contains("select-layout");
    }

    function loadGalleryItems() {
        const selectedCategory = sessionStorage.getItem("selectedCategory") || "전체";
        // console.log("🔹 선택된 카테고리:", selectedCategory);

        const filteredProjects = selectedCategory === "전체"
            ? projects
            : projects.filter(project => project.category === selectedCategory);

        // console.log("🔹 필터링된 프로젝트 수:", filteredProjects.length);

        let outputHTML = "";
        const nextItems = filteredProjects.slice(currentIndex, currentIndex + itemsPerPage);
        
        // console.log("🔹 로드할 nextItems:", nextItems);

        if (nextItems.length === 0) {
            console.warn("⚠️ nextItems가 비어 있습니다.");
        }

        nextItems.forEach((project, idx) => {
            outputHTML += `
                <div class="gal-item-wrap">
                    <a href="./details.html">
                        <div class="gal-item">
                            <div class="gal-text">
                                <p>${project.title}</p>
                                <p>${project.category}</p>
                            </div>
                            <div class="gal-img-wrap">
                                <div class="gal-hover">
                                    <div class="hover-img-wrap">
                                        <img src="./assets/image/hover-img/gal-hover-dumb.svg" alt="프로젝트 갤러리 호버 이미지" />
                                    </div>
                                </div>
                                <div class="gal-img">
                                    <img src="./assets/image/board/board-img-${project.img}.png" alt="프로젝트 갤러리 이미지 ${project.img}" />
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            `;
        });

        boardGal.insertAdjacentHTML("beforeend", outputHTML);
        currentIndex += itemsPerPage;
        // console.log("isGalleryMode():", isGalleryMode());

        if (isGalleryMode() && currentIndex < filteredProjects.length) {
            // console.log("📌 갤러리 모드 - More View 버튼 활성화");
            galleryLoadMoreBtn.style.display = "block";
        } else {
            // console.log("❌ 리스트 모드 또는 모든 항목이 로드됨 - More View 버튼 숨김");
            galleryLoadMoreBtn.style.display = "none";
        }
    }

    // ✅ `DOMContentLoaded`를 기다리지 않고 즉시 실행
    loadGalleryItems();

    galleryLoadMoreBtn.addEventListener("click", function () {
        // console.log("🔽 More View 버튼 클릭됨");
        loadGalleryItems();
    });

    window.addEventListener("categoryChanged", function () {
        // console.log("🛠 카테고리 변경됨");
        currentIndex = 0;
        boardGal.innerHTML = "";
        loadGalleryItems();
    });
}
