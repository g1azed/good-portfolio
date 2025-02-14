import { projects } from "./projects.js";
import { setupListMoreView } from "./listMoreView.js";
import {listMouseHover } from "./listMouseHover.js"

let currentCategory = "전체"; // 현재 필터링된 카테고리 저장
let visibleCount = 6; // ✅ 전역 변수 유지
export let filteredProjects = []; // ✅ 현재 필터링된 프로젝트 저장

// ✅ 현재 선택된 카테고리를 반환하는 함수
export function getCurrentCategory() {
    return currentCategory;
}

// ✅ visibleCount를 반환하는 함수 (getter)
export function getVisibleCount() {
    return visibleCount;
}

// ✅ visibleCount를 증가시키는 함수 (setter)
export function increaseVisibleCount() {
    visibleCount += 6;
}

export function renderBoardList(targetCategory = "전체", increaseVisible = false) {
    const boardList = document.getElementById("boardList");

    // ✅ More View 클릭 시 visibleCount 증가 유지
    if (!increaseVisible) {
        visibleCount = 6; // 필터 변경 시 초기화
    }

    // 현재 필터링된 카테고리 업데이트
    currentCategory = targetCategory;

    // 연도별 그룹화 및 필터링
    const projectsByYear = {};
    projects.forEach((project) => {
        if (targetCategory !== "전체" && project.category !== targetCategory) return;
        if (!projectsByYear[project.year]) {
            projectsByYear[project.year] = [];
        }
        projectsByYear[project.year].push(project);
    });

    // 필터링된 프로젝트를 내림차순 정렬하여 평탄화
    const sortedYears = Object.keys(projectsByYear).sort((a, b) => b - a);
    filteredProjects = sortedYears.flatMap(year => projectsByYear[year]); // ✅ 전역 변수에 저장

    function renderProjects() {
        boardList.innerHTML = ""; // 기존 내용 초기화
        let tempHTML = "";
        let currentYear = null;

        for (let i = 0; i < visibleCount && i < filteredProjects.length; i++) {
            const project = filteredProjects[i];

            // 연도가 변경되면 새로운 this-year 블록 생성
            if (currentYear !== project.year) {
                if (currentYear !== null) {
                    tempHTML += `</div>`; // 이전 .list-item-wrap 닫기
                }
                tempHTML += `
                    <div class="this-year">
                        <h5>${project.year}</h5>
                        <div class="list-item-wrap">
                `;
                currentYear = project.year;
            }

            // 프로젝트 리스트 추가
            tempHTML += `
                <div class="list">
                    <a href="./details.html">
                        <div class="list-hover-img"> <img src="./assets/image/board/board-img-${project.img}.png" alt=${project.title}/> </div>
                        <span>${project.title}</span>
                        <span>${project.firm}</span>
                        <span>${project.category}</span>
                        <div class="list-awards">
                            ${project.awardsM}
                            ${project.awardsA}
                        </div>
                    </a>
                </div>
            `;
        }
        
        tempHTML += `</div>`; // 마지막 .list-item-wrap 닫기
        boardList.innerHTML = tempHTML;

        // ✅ More View 버튼 초기화 및 세팅
        setupListMoreView();

        listMouseHover();
    }

    renderProjects();
}
