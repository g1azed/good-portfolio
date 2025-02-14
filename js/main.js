import { setupLayoutSwitch } from "./layout.js";
import { setupFilters } from "./filter.js";

import { renderBoardList } from "./list.js";
import { setupGalleryLoadMore } from "./galleryloadMore.js";
import { setupListMoreView } from "./listMoreView.js";
import { listMouseHover } from "./listMouseHover.js"

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
    })

    /* mobile header */
    const mo_hamburger = document.querySelector(".hamburger");
    const mo_head_list = document.querySelector(".header-content");
    const close = document.querySelector(".head-list-close")
    
    mo_hamburger.addEventListener("click", () => {
        mo_head_list.classList.remove("list-hidden")
    })

    close.addEventListener("click" ,() =>{
        mo_head_list.classList.add("list-hidden")
    })
};
