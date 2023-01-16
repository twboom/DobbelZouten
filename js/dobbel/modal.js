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

export function show() {
    document.getElementById('modal').style.display = 'block';
};

export function hide() {
    document.getElementById('modal').animate(modalExitKeyframes, modalExitTiming);
    document.getElementById('menu').animate(menuExitKeyframes, menuExitTiming).addEventListener('finish', _ => {
        document.getElementById('modal').style.display = 'none';
    });
};

export function init() {
    document.getElementById('menu-show').addEventListener('click', show);
    document.getElementById('menu-hide').addEventListener('click', hide);
    document.getElementById('modal').addEventListener('click', evt => {
        if (evt.target === document.getElementById('modal')) { hide(); };
    });
};