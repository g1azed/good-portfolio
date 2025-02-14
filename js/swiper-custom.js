const progressCircle = document.querySelector(".autoplay-progress svg");
const progressContent = document.querySelector(".autoplay-progress span");

let ww = window.innerWidth;
let swiper;
responsiveSwiper();

function responsiveSwiper() {
	if (ww > 768) {
        swiper = new Swiper(".mySwiper", {
            spaceBetween: 30,
            loop: true,
            centeredSlides: true,
            // autoplay: {
            //     delay: 4500,
            //     disableOnInteraction: false,
            // },
            autoplay: false,
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
                renderBullet: function (index, className) {
                    return '<span class="' + className + '">0' + (index + 1) + "</span>";
                },
            },
            on: {
                autoplayTimeLeft(s, time, progress) {
                    progressCircle.style.setProperty("--progress", 1 - progress);
                }
            }   
        });
        
	} else if (ww <= 768) {
        swiper = new Swiper(".mySwiper", {
            spaceBetween: 30,
            loop: true,
            centeredSlides: true,
            // autoplay: {
            //     delay: 4500,
            //     disableOnInteraction: false,
            // },
            autoplay: false,
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            }, 
        });
	}
}



// 기본 autoplay delay (예: 4500ms)
const autoplayDelay = 4500; 
let remainingTime = autoplayDelay; // 남은 시간(ms)
let customTimer = null;
let progressUpdater = null;
let isAutoPlaying = false;

// 정지 시점까지의 진행률(0 ~ 1)
let storedProgressFraction = 0;
// 재시작 시 기준 시간 (resume 시각)
let resumeStartTime = null;
let isFreshCycle = true; // 슬라이드 전환 후 새 주기 여부



// 진행률 업데이트 함수
function updateProgress() {
    const localElapsed = Date.now() - resumeStartTime;
    const localFraction = Math.min(localElapsed / remainingTime, 1);
    // 전체 진행률 = 저장된 진행률 + (남은 구간 내 진행률)
    const totalProgress = storedProgressFraction + localFraction * (1 - storedProgressFraction);
    progressCircle.style.setProperty("--progress", totalProgress);
    if (localFraction < 1) {
        progressUpdater = requestAnimationFrame(updateProgress);
    }
}

// 자동 슬라이드 전환 함수 (남은 시간만큼 대기 후 slideNext)
function startCustomAutoplay() {
    if (window.innerWidth <= 768){
        
    }else{
        // 새 주기인 경우 초기화
        if (isFreshCycle) {
            storedProgressFraction = 0;
            remainingTime = autoplayDelay;
            isFreshCycle = false;
        }
        resumeStartTime = Date.now();
        updateProgress();
        customTimer = setTimeout(() => {
        swiper.slideNext();
        // 슬라이드 전환 후 새 주기로 표시
        isFreshCycle = true;
        startCustomAutoplay();
        }, remainingTime);

        if (ww > 768) {
        isAutoPlaying = true;

        } else if (ww <= 768) {
        isAutoPlaying = false;
        }
    } 
}

// 자동 재생 중지 함수
function stopCustomAutoplay() {
    if (customTimer) {
        clearTimeout(customTimer);
        customTimer = null;
    }
    if (progressUpdater) {
        cancelAnimationFrame(progressUpdater);
        progressUpdater = null;
    }
    const localElapsed = Date.now() - resumeStartTime;
    const localFraction = Math.min(localElapsed / remainingTime, 1);

    // 새 주기가 아니라면 현재 진행률 저장, 새 주기이면 그대로 0 유지
    if (!isFreshCycle) {
        storedProgressFraction = storedProgressFraction + localFraction * (1 - storedProgressFraction);
    }
    remainingTime = Math.max(remainingTime - localElapsed, 0);
    isAutoPlaying = false;
}

const progressBtn = document.querySelector(".autoplay-progress");
progressBtn.addEventListener('click', () => {
    if (isAutoPlaying) {
        stopCustomAutoplay();
        console.log("정지, 저장 진행률:", storedProgressFraction, "남은 시간:", remainingTime);
    } else {
        startCustomAutoplay();
        // console.log("재시작, 저장 진행률:", storedProgressFraction, "남은 시간:", remainingTime);
    }
});

swiper.on('slideChange', () => {
    stopCustomAutoplay();  // 진행률 및 타이머 완전 초기화
    storedProgressFraction = 0;  // 진행률 초기화
    remainingTime = autoplayDelay;  // 남은 시간 초기화
    isFreshCycle = true;  // 새 주기 시작
    startCustomAutoplay();  // 자동 재생 재시작
});

// 사용자가 드래그하여 슬라이드를 넘긴 경우에도 진행률 초기화
swiper.on('touchEnd', () => {
    stopCustomAutoplay();  // 진행률 및 타이머 완전 초기화
    storedProgressFraction = 0;  // 진행률 초기화
    remainingTime = autoplayDelay;  // 남은 시간 초기화
    isFreshCycle = true;  // 새 주기 시작
    startCustomAutoplay();  // 자동 재생 재시작
});

// 초기 자동 재생 시작
if (window.innerWidth > 768) { startCustomAutoplay(); }



