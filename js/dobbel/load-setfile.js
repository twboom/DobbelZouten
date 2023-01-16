import { updateIonSet } from "./main.js";
import { primeScrollers } from "./scroller.js";
import { hide } from "./modal.js"

export function init() {
    document.getElementById('setfile').addEventListener('change', evt => {
        const file = evt.target.files[0];
        if (file === undefined) { return };
        file.text().then(text => {
            const json = JSON.parse(text)
            updateIonSet(json);
            primeScrollers();
    
            hide();
            alert('Nieuwe ionenset ingeladen!')
        });
    });
};