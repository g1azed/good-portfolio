import { renderBoardList, filteredProjects, getVisibleCount, increaseVisibleCount, getCurrentCategory } from "./list.js";

export function setupListMoreView() {
    const listMoreView = document.querySelector("#list-load-more");
    const lay_gallery = document.querySelector(".board-gal"); // 갤러리 모드 감지

    if (!listMoreView) return;

    // ✅ 갤러리 모드일 경우 리스트 More View 버튼 숨기기 (초기 로드 시)
    if (lay_gallery.classList.contains("select-layout")) {
        console.log("📌 갤러리 모드 감지됨, List More View 버튼 숨김 (초기)");
        listMoreView.style.display = "none";
        return;
    }

    // ✅ 기존 이벤트 리스너 제거 후 다시 등록 (중복 방지)
    listMoreView.removeEventListener("click", handleMoreViewClick);
    listMoreView.addEventListener("click", handleMoreViewClick);

    // ✅ 초기 More View 버튼 상태 설정
    updateMoreViewButton();

    // ✅ 카테고리 변경 시 More View 버튼 상태 갱신
    window.addEventListener("categoryChanged", () => {
        updateMoreViewButton(); // 필터 변경 후 버튼 상태 업데이트
    });

    // ✅ 레이아웃 변경 시 More View 버튼 상태 갱신
    window.addEventListener("layoutChanged", () => {
        updateMoreViewButton();
    });
}

// ✅ More View 버튼 클릭 이벤트 핸들러
function handleMoreViewClick() {
    console.log("🔽 More View 버튼 클릭됨");

    increaseVisibleCount();
    renderBoardList(getCurrentCategory(), true);

    updateMoreViewButton(); // 버튼 상태 업데이트
}

// ✅ More View 버튼 상태 업데이트 함수
function updateMoreViewButton() {
    const listMoreView = document.querySelector("#list-load-more");
    const lay_gallery = document.querySelector(".board-gal"); // 갤러리 모드 감지

    if (!listMoreView) return;

    // ✅ 갤러리 모드일 경우 리스트 More View 버튼 숨김
    if (lay_gallery.classList.contains("select-layout")) {
        console.log("📌 갤러리 모드 감지됨, List More View 버튼 숨김 (업데이트)");
        listMoreView.style.display = "none";
        // ✅ 현재 필터링된 프로젝트 수와 visibleCount 비교
        if (filteredProjects.length > getVisibleCount()) {
            listMoreView.style.display = "block"; 
        } else {
            listMoreView.style.display = "none"; // 6개 미만이면 버튼 숨김
        }
        return;
    }


}
