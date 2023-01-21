import { Ion } from "../common/ionComponent.js"

// Where the history is written
let history = [];

export function add(ions) {
    const container = document.createElement('li');
    container.classList.add('history-item');

    for (const ion of ions) {
        const el = new Ion(ion).html(true);
        container.innerHTML += el;
    };

    document.getElementById('history').appendChild(container);
};

function erease() {
    const areYouSure = confirm('Weet je zeker dat je de geschiedenis wilt verwijderen?');
    if (!areYouSure) { return };

    history = [];
    document.getElementById('history').innerHTML = '';
};

function toggleHistory() {
    const currentlyOpen = document.getElementById('open-history').classList.contains('open');

    if (currentlyOpen) {
        document.getElementById('open-history').classList.remove('open');
        document.getElementById('history-container-outer').classList.add('hidden');
    } else {
        document.getElementById('open-history').classList.add('open');
        document.getElementById('history-container-outer').classList.remove('hidden');
    };
};

export function init() {
    document.getElementById('open-history').addEventListener('click', toggleHistory);
    document.getElementById('erease-history').addEventListener('click', erease);
};

init();