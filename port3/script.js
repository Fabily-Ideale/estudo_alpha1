let activeMovable = null;
const container = document.getElementById('container');
const boxes = document.querySelectorAll('.box');
boxes.forEach(box => {
    box.addEventListener('click', function (e) {
        e.stopPropagation();
        if (activeMovable) {
            activeMovable.classList.remove('active');
        } activeMovable = this;
        activeMovable.classList.add('active');
    });
});
document.addEventListener('click', function () {
    if (activeMovable) {
        activeMovable.classList.remove('active');
        activeMovable = null;
    }
});
document.addEventListener('keydown', function (e) {
    if (!activeMovable) return;
    const step = e.shiftKey ? 100 : 10;
    let currentLeft = activeMovable.offsetLeft;
    let currentTop = activeMovable.offsetTop;
    const maxLeft = container.clientWidth - activeMovable.clientWidth;
    const maxTop = container.clientHeight - activeMovable.clientHeight;
    let newLeft = currentLeft;
    let newTop = currentTop;
    switch (e.key) {
        case "ArrowLeft":
            newLeft -= step;
            break;
        case "ArrowRight":
            newLeft += step;
            break;
        case "ArrowUp":
            newTop -= step;
            break;
        case "ArrowDown":
            newTop += step;
            break;
        default:
            return;
    }
    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop = Math.max(0, Math.min(newTop, maxTop));
    activeMovable.style.left = newLeft + 'px';
    activeMovable.style.top = newTop + 'px';
    e.preventDefault();
});