import * as setmaker from "./setmaker.js";
import IonSets from "../common/sets.js";

IonSets.onReady(_ => {
    setmaker.init();
});