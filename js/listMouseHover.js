
export function listMouseHover(){
    document.querySelectorAll('.list').forEach(container => {
        const hoverImg = container.querySelector('.list-hover-img');
        
        container.addEventListener('mouseenter', () => {
            console.log("오버")
            hoverImg.style.display = 'block';
        });
        
        container.addEventListener('mouseleave', () => {
            hoverImg.style.display = 'none';
        });
        
        container.addEventListener('mousemove', e => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            hoverImg.style.left = (x - hoverImg.offsetWidth / 2) + 'px';
            hoverImg.style.top = (y - hoverImg.offsetHeight / 2) + 'px';
        });
    });
    
}

