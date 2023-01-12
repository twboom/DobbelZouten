function renderSubset(set, setType) {
    const parent = document.getElementById(setType + '-ions');

    for (let i = 0; i < set.length; i++) {
        const ionLiElement = document.createElement('li');
        ionLiElement.classList.add('ion');
        ionLiElement.innerHTML += new Ion(set[i]).html(true);
        parent.appendChild(ionLiElement);
    };
};

function renderSet(ionSet) {
    renderSubset(ionSet.positive, 'positive');
    renderSubset(ionSet.negative, 'negative');
};

document.getElementById('setfile').addEventListener('change', evt => {
    const file = evt.target.files[0];
    if (file === undefined) { return; };
    file.text().then(text => {
        const json = JSON.parse(text);
        renderSet(json);
    });
});