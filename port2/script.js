let activeMovable = null;
let initialMouseX = 0;
let initialMouseY = 0;
let initialBoxLeft = 0;
let initialBoxTop = 0;

const container = document.getElementById('container');
const boxes = document.querySelectorAll('.box');

boxes.forEach(box => {
    box.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        activeMovable = this;
        activeMovable.classList.add('active');
        document.body.style.cursor = 'grabbing';
        initialBoxLeft = activeMovable.offsetLeft;
        initialBoxTop = activeMovable.offsetTop;
        initialMouseX = e.clientX;
        initialMouseY = e.clientY;
    });
});

document.addEventListener('mousemove', function (e) {
    if (activeMovable) {
        const maxX = container.clientWidth - activeMovable.clientWidth;
        const maxY = container.clientHeight - activeMovable.clientHeight;
        const deltaX = e.clientX - initialMouseX;
        const deltaY = e.clientY - initialMouseY;
        const newLeft = Math.max(0, Math.min(initialBoxLeft + deltaX, maxX));
        const newTop = Math.max(0, Math.min(initialBoxTop + deltaY, maxY));

        activeMovable.style.left = newLeft + 'px';
        activeMovable.style.top = newTop + 'px';
    }
});

document.addEventListener('mouseup', function () {
    if (activeMovable) {
        activeMovable.classList.remove('active');
        activeMovable = null;
        document.body.style.cursor = '';
    }
});