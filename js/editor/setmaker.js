import { parseIonString } from "./text-ion-parser.js";
import { Ion } from "../common/ionComponent.js";
import IonSets from "../common/sets.js";

let currentIonSet = {
    "positive": [],
    "negative": [],
};

let currentIonSetObj = new IonSets.IonSet('Unnamed set ' + new Date(Date.now()).toDateString());

function addToSet(ion, onlyRender=false) {
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
        currentIonSetObj.contents = currentIonSet;
        currentIonSetObj.save();
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

    if (!onlyRender) {
        currentIonSetObj.contents = currentIonSet;
        currentIonSetObj.save();
    } else {
        console.log('only render')
    }
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

function renderSubset(subset) {
    for (let i = 0; i < subset.length; i++) {
        addToSet(subset[i], true)
    };
};

function loadNewSet(ionSet) {
    console.log(ionSet)
    if (currentIonSet.positive.length !== 0 || currentIonSet.negative.length !== 0) {
        const areYouSure = confirm('Weet je zeker dat je dit wilt doen? Hiermee gooi je de huidige set weg!');
        if (!areYouSure) {
            return false;
        };
    };

    
    currentIonSetObj = new IonSets.IonSet(ionSet.name, {}, ionSet.id);
    
    renderSubset(ionSet.contents.positive);
    renderSubset(ionSet.contents.negative);

    return true
};

export function init() {
    document.getElementById('text-input').addEventListener('keydown', evt => {
        if (evt.key == 'Enter') {
            handleFinishInput();
        };
    });

    document.getElementById('finish-input').addEventListener('click', handleFinishInput)

    document.getElementById('download-set').addEventListener('click', _ => {
        if (currentIonSet.positive.length === 0 || currentIonSet.negative.length === 0) {
            alert('Je kan dit niet downloaden omdat dit geen geldige set is!\nEen of meerdere rijen zijn leeg.')
            return;
        };
        downloadJSON(generateJSONDataURI());
    });

    document.getElementById('upload-set').addEventListener('click', _ => {
        document.getElementById('setfile').click();
    });

    document.getElementById('setfile').addEventListener('change', evt => {
        const file = evt.target.files[0];
        if (file === undefined) { return; };
        file.text().then(text => {
            const json = JSON.parse(text);
            if (currentIonSet.positive.length !== 0 || currentIonSet.negative.length !== 0) {
                const areYouSure = confirm('Weet je zeker dat je dit wilt doen? Hiermee gooi je de huidige set weg!');
                if (!areYouSure) {
                    evt.target.value = '';
                    return;
                };
            }
            renderSubset(json.positive);
            renderSubset(json.negative);
        });
    });

    document.getElementById('set-name').addEventListener('change', evt => {
        currentIonSetObj.updateName(evt.target.value);
    });

    const sets = IonSets.all();

    sets.forEach(set => {
        const option = document.createElement('option');

        option.innerText = set.name;
        option.value = set.slug;

        document.getElementById('set-select').appendChild(option);
    })

    document.getElementById('set-select').addEventListener('change', evt => {
        const set = IonSets.get(evt.target.value)
        loadNewSet(set)
    })
};
