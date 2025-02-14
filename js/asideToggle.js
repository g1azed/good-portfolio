window.onload = function () {
    /* aside toggle */
    const aside = document.querySelector("aside");
    const toggle_class = "aside-toggle"

    aside.addEventListener("click", (e) => {
        aside.classList.toggle(toggle_class);
        console.log("toggle")
    })
};
