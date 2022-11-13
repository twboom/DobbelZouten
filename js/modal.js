const menuExitKeyframes = [
    { 'transform': 'translateY(0)' },
    { 'transform': 'translateY(-110%)' },
]

const menuExitTiming = {
    duration: 1000,
    iterations: 1,
    easing: 'ease',
}

const modalExitKeyframes = [
    { 'opacity': '100%' },
    { 'opacity': '0' },
]

const modalExitTiming = {
    duration: 1000,
    iterations: 1,
    easing: 'ease',
}

function showModal() {
    document.getElementById('modal').style.display = 'block';
};

function hideModal() {
    document.getElementById('modal').animate(modalExitKeyframes, modalExitTiming);
    document.getElementById('menu').animate(menuExitKeyframes, menuExitTiming).addEventListener('finish', _ => {
        document.getElementById('modal').style.display = 'none';
    });
};

document.getElementById('menu-show').addEventListener('click', showModal);
document.getElementById('menu-hide').addEventListener('click', hideModal);