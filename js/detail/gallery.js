import { projects } from "./projects.js";

export function renderGallery() {
    const boardGal = document.getElementById("boardGal");
    let galOutputHTML = "";

    projects.forEach((project, idx) => {
        galOutputHTML += `
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

    boardGal.innerHTML = galOutputHTML;
}

export function updateGallery(targetCategory) {
    document.querySelectorAll(".board-gal .gal-item-wrap").forEach((item) => {
        const catEl = item.querySelector(".gal-text p:nth-child(2)");
        if (catEl) {
            const catText = catEl.textContent.trim();
            item.style.display = targetCategory === "전체" || catText === targetCategory ? "" : "none";
        }
    });
}
