import * as scroller from "./scroller.js";
import * as history from "./history.js";
import * as modal from "./modal.js";
import * as setloader from "./load-setfile.js"

export let currentIonSet = {};

export function updateIonSet(newSet) {
    currentIonSet = newSet;
};

scroller.init();
history.init();
modal.init();
setloader.init();