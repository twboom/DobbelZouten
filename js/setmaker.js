const currentIonSet = {
    "positive": [],
    "negative": [],
};

function addToSet(ion) {
    // const ionLiElement = `<li class="ion">${new Ion(ion).html()} <></li>`
    const ionLiElement = document.createElement('li');
    ionLiElement.classList.add('ion')
    ionLiElement.innerHTML += new Ion(ion).html(true);
    const deleteIon = document.createElement('span')
    deleteIon.classList.add('delete-ion');
    deleteIon.innerText = '🗑️'
    deleteIon.addEventListener('click', _ => {
        const areYouSure = confirm('Are you sure you want to delete this?');
        if (!areYouSure) { return; };
        currentIonSet.positive = currentIonSet.positive.filter(el => el !== ion);
        currentIonSet.negative = currentIonSet.negative.filter(el => el !== ion);
        ionLiElement.remove();
    });
    ionLiElement.appendChild(deleteIon);
    if (ion.charge.includes('+')) {
        currentIonSet.positive.push(ion);
        document.getElementById('positive-ions').appendChild(ionLiElement)
    };
    if (ion.charge.includes('-')) {
        currentIonSet.negative.push(ion);
        document.getElementById('negative-ions').appendChild(ionLiElement);
    };
};

function generateJSONDataURI() {
    const b64 = btoa(JSON.stringify(currentIonSet));
    const dataURI = 'data:application/json;base64,' + b64;
    return dataURI;
};

function downloadJSON(dataURI) {
    const setName = 'DobbelZouten-IonSet'
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataURI);
    downloadAnchorNode.setAttribute("download", setName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
};

function handleFinishInput() {
    const inputEl = document.getElementById('text-input');
    addToSet(parseIonString(inputEl.value));
    inputEl.value = '';
};

function main() {
    document.getElementById('text-input').addEventListener('keydown', evt => {
        if (evt.key == 'Enter') {
            handleFinishInput();
        };
    });
    document.getElementById('download-set').addEventListener('click', _ => {
        downloadJSON(generateJSONDataURI());
    })
};

main();