import { parseIonString } from "./text-ion-parser.js";
import { Ion } from "../common/ionComponent.js";
import IonSets from "../common/sets.js";

let currentIonSet = {
    "positive": [],
    "negative": [],
};

let currentIonSetObj = new IonSets.IonSet('Unnamed set ' + new Date(Date.now()).toDateString(), currentIonSet, 'last', false, false);

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
        currentIonSetObj.contents = currentIonSet;
        const success = currentIonSetObj.save();
        if (success === 'protected') {
            alert('Je kan deze set niet bewerken!');
            if (ion.charge.includes('+')) {
                currentIonSet.positive.push(ion);
            };
            if (ion.charge.includes('-')) {
                currentIonSet.negative.push(ion);
            };
            return;
        };
        ionLiElement.remove();
    });
    ionLiElement.appendChild(deleteIon);
    if (ion.charge.includes('+')) {
        document.getElementById('positive-ions').appendChild(ionLiElement)
    };
    if (ion.charge.includes('-')) {
        document.getElementById('negative-ions').appendChild(ionLiElement);
    };

    if (!onlyRender) {
        if (ion.charge.includes('+')) {
            currentIonSet.positive.push(ion);
        };
        if (ion.charge.includes('-')) {
            currentIonSet.negative.push(ion);
        };
        currentIonSetObj.contents = currentIonSet;
        currentIonSetObj.save();
    };
};

function generateJSONDataURI() {
    const b64 = btoa(JSON.stringify(currentIonSet));
    const dataURI = 'data:application/json;base64,' + b64;
    return dataURI;
};

function downloadJSON(dataURI) {
    const setName = currentIonSetObj.slug;
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
    if (currentIonSet.positive.length !== 0 || currentIonSet.negative.length !== 0) {
        // const areYouSure = confirm('Weet je zeker dat je dit wilt doen? Hiermee gooi je de huidige set weg!');
        const areYouSure = true;
        if (!areYouSure) {
            return false;
        };
    };

    document.getElementById('set-name').value = ionSet.name;
    
    currentIonSetObj = ionSet;
    currentIonSet = ionSet.contents

    document.getElementById('positive-ions').innerHTML = '';
    document.getElementById('negative-ions').innerHTML = '';
    
    renderSubset(ionSet.contents.positive);
    renderSubset(ionSet.contents.negative);

    return true
};

function loadSetlist(target) {
    if (target === undefined) { target ='___create-new-set-reload'; };

    const sets = IonSets.all();

    document.getElementById('set-select').innerHTML = '';

    const emptyOption = document.createElement('option');
    emptyOption.innerText = '[Nieuwe set]';
    emptyOption.value = '___create-new-set-reload';
    document.getElementById('set-select').appendChild(emptyOption);

    sets.forEach(set => {
        const option = document.createElement('option');

        option.innerText = set.name;
        option.value = set.slug;

        document.getElementById('set-select').appendChild(option);
    });

    document.getElementById('set-select').value = target;
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
            // if (currentIonSet.positive.length !== 0 || currentIonSet.negative.length !== 0) {
            //     const areYouSure = confirm('Weet je zeker dat je dit wilt doen? Hiermee gooi je de huidige set weg!');
            //     if (!areYouSure) {
            //         evt.target.value = '';
            //         return;
            //     };
            // }
            const set = new IonSets.IonSet('Uploaded set ' + new Date(Date.now()).toDateString(), json, 'last', false, false);
            set.save();
            loadNewSet(set);
            loadSetlist(set.slug);
            evt.target.value = '';
        });
    });

    document.getElementById('set-name').addEventListener('change', evt => {
        const success = currentIonSetObj.updateName(evt.target.value);
        if (success === 'protected') {
            evt.target.value = currentIonSetObj.name;
            alert('Je kan deze set niet bewerken!');
            return;
        };
        loadSetlist(IonSets.getSlug(evt.target.value));
    });

    loadSetlist();

    document.getElementById('set-select').addEventListener('change', evt => {
        if (evt.target.value == '___create-new-set-reload') { location.reload(); };
        const set = IonSets.get(evt.target.value)
        loadNewSet(set)
    });

    document.getElementById('duplicate').addEventListener('click', _ => {
        const newName = prompt('Geef een naam op voor het duplicaat.');
        const newSet = new IonSets.IonSet(newName, currentIonSet, 'last', false, false);
        loadNewSet(newSet);
        currentIonSetObj.save();
        loadSetlist(newSet.slug);
    });

    document.getElementById('delete-set').addEventListener('click', _ => {
        if (currentIonSetObj.constant) {
            alert('Deze set is beschermd en is niet te verwijderen!');
            return;
        }
        if (currentIonSet.positive.length !== 0 || currentIonSet.negative.length !== 0) {
            const areYouSure = confirm(`Weet je zeker dat je dit wilt doen? Hiermee gooi je ${currentIonSetObj.name} weg! Dit is niet ongedaan te maken!`);
            if (!areYouSure) {
                evt.target.value = '';
                return;
            };
        };
        const success = currentIonSetObj.delete();
        if (success !== true) {
            alert('Deze set is niet te verwijderen!');
            return;
        };
        location.reload();
    });

    document.getElementById('set-name').value = currentIonSetObj.name
};
