export function setupLayoutSwitch() {
    const lay_gallery = document.querySelector(".board-gal");
    const lay_list = document.querySelector(".board-list");

    const g_layout_btn = document.getElementById("g-lay");
    const l_layout_btn = document.getElementById("l-lay");

    const select_gallery = document.getElementById("select_g");
    const select_list = document.getElementById("select_l");

    const g_more_btn = document.getElementById("gallery-load-more");
    const l_more_btn = document.getElementById("list-load-more");

    function updateMoreViewVisibility() {
        const isListActive = lay_list.classList.contains("select-layout");
        g_more_btn.style.display = isListActive ? "block" : "none";
        l_more_btn.style.display = isListActive ? "none" : "block";

        // ✅ 레이아웃 변경 이벤트 발생
        window.dispatchEvent(new Event("layoutChanged"));
    }

    g_layout_btn.addEventListener("click", () => {
        console.log("📌 갤러리 모드 선택됨");
        lay_list.classList.add("select-layout");
        lay_gallery.classList.remove("select-layout");
        select_gallery.src = "./assets/icons/board_gallery_select.svg";
        select_list.src = "./assets/icons/board_list.svg";
        updateMoreViewVisibility();
    });

    l_layout_btn.addEventListener("click", () => {
        console.log("📌 리스트 모드 선택됨");
        lay_gallery.classList.add("select-layout");
        lay_list.classList.remove("select-layout");
        select_list.src = "./assets/icons/board_list_select.svg";
        select_gallery.src = "./assets/icons/board_gallery.svg";
        updateMoreViewVisibility();
    });

    // ✅ 초기 상태 확인 및 버튼 업데이트
    document.addEventListener("DOMContentLoaded", () => {
        console.log("📌 브라우저 로드시 실행됨");
        updateMoreViewVisibility();
    });

    window.addEventListener("categoryChanged", updateMoreViewVisibility);
}
