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
};
