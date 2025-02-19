import { setupLayoutSwitch } from "./detail/layout.js";
import { setupFilters } from "./detail/filter.js";

import { renderBoardList } from "./detail/list.js";
import { setupGalleryLoadMore } from "./detail/galleryloadMore.js";
import { setupListMoreView } from "./detail/listMoreView.js";
import { listMouseHover } from "./detail/listMouseHover.js"

window.onload = function () {
    setupLayoutSwitch();
    setupFilters();
    renderBoardList();
    setupGalleryLoadMore();
    setupListMoreView();
    listMouseHover();

    /* aside toggle */
    const aside = document.querySelector("aside");
    const toggle_class = "aside-toggle"

    aside.addEventListener("click", (e) => {
        aside.classList.toggle(toggle_class);
        console.log("toggle")
    })

    /* mobile header */
    const mo_hamburger = document.querySelector(".hamburger");
    const mo_head_list = document.querySelector(".header-content");
    const close = document.querySelector(".head-list-close")
    
    mo_hamburger.addEventListener("click", () => {
        console.log("클릭")
        mo_head_list.classList.remove("list-hidden")
    })

    close.addEventListener("click" ,() =>{
        mo_head_list.classList.add("list-hidden")
    })
};
