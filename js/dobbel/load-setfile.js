import { updateIonSet } from "./main.js";
import { hide } from "./modal.js"
import IonSets from "../common/sets.js";

export function init() {
    const sets = IonSets.all();

    sets.forEach(set => {
        const option = document.createElement('option');

        option.innerText = set.name;
        option.value = set.slug;

        document.getElementById('setfile').appendChild(option);
    })

    document.getElementById('setfile').addEventListener('change', evt => {
        updateIonSet(IonSets.get(evt.target.value).contents);
        hide();
        alert('Nieuwe ionenset ingeladen!');
        console.log(IonSets.get(evt.target.value).contents)
    });
};