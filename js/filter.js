import { updateGallery } from "./gallery.js";
import { renderBoardList } from "./list.js";

const filterMapping = {
    "E-COMMERCE": "이커머스",
    금융: "금융",
    교육: "교육",
    "기업·브랜드": "기업·브랜드",
    공공기관: "공공기관",
    기타: "기타"
};

export function setupFilters() {
    const filterButtons = document.querySelectorAll('#filterButtons li[role="button"]');

    filterButtons.forEach((button) => {
        button.addEventListener("click", function () {

            // ✅ 필터 변경 시 More View 버튼 초기화 (layout.js에서 처리)
            window.dispatchEvent(new Event("categoryChanged"));
    
            // 모든 버튼 스타일 초기화
            filterButtons.forEach((btn) => {
                btn.classList.remove("active");
                btn.style.backgroundColor = "#fff";
                btn.style.border = "1px solid #121212";
            });

            // 클릭한 버튼 스타일 적용
            this.classList.add("active");
            this.style.backgroundColor = "#8CE457";
            this.style.border = "1px solid #8CE457";

            const btnText = this.textContent.trim();
            const targetCategory = filterMapping[btnText] || btnText;

            // ✅ 선택한 카테고리를 sessionStorage에 저장
            sessionStorage.setItem("selectedCategory", targetCategory);

            updateGallery(targetCategory);
            renderBoardList(targetCategory);

            // ✅ "카테고리 변경" 이벤트 발생 → galleryLoadMore.js에서 감지하여 초기화
            window.dispatchEvent(new Event("categoryChanged"));
        });
    });
}
