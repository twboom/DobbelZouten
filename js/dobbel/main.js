import * as scroller from "./scroller.js";
import * as history from "./history.js";
import * as modal from "./modal.js";
import * as setloader from "./load-setfile.js";
import IonSets  from "../common/sets.js";

export let currentIonSet = {};

export function updateIonSet(newSet) {
    currentIonSet = newSet;
    scroller.updateIonSet();
};

IonSets.onReady(_ => {
    currentIonSet = IonSets.get('dobbelzouten-basis-ionset').contents
    scroller.init();
    history.init();
    modal.init();
    setloader.init();
});
