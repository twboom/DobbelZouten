let readyState = false;
let readyPromise;

const IonSets = [];

IonSets.IonSet = class {
    constructor(name, contents) {
        this.name = name;
        this.contents = contents;
        this.slug = '';
        
        for (let i=0; i < name.length; i++) {
            let char = name[i];
            if (/^[A-Za-z0-9 ]*$/.test(char)) {
                if (char === ' ') { char = '-' }
                this.slug += char.toLowerCase();
            } else {
                continue
            };
        };
    };

    get json() {
        return {
            'name': this.name,
            'slug': this.slug,
            'contents': this.contents,
        };
    };

    save() {
        IonSets.set(this.slug, this.json);
    };

    update(newContents) {
        this.contents = newContents;
        this.save();
    };
};

IonSets.get = function(slug) {
    const set = JSON.parse(localStorage.getItem('ionsets'))[slug];
    return new IonSets.IonSet(set.name, set.contents);
};

IonSets.set = function(slug, value) {
    let sets = JSON.parse(localStorage.getItem('ionsets'));
    sets[slug] = value;
    Object.keys(sets).forEach(key => sets[key] === undefined ? delete sets[key] : {});
    if (slug === undefined) { return; };
    localStorage.setItem('ionsets', JSON.stringify(sets))
};

function init() {
    const sets = localStorage.getItem('ionsets');

    if (sets === undefined || sets === null) {
        localStorage.setItem('ionsets', '{}');
        console.warn('LS: No IonSets found');
    };

    try {
        JSON.parse(sets);
    } catch(error) {
        localStorage.setItem('ionsets', '{}');
        console.log('LS: Problem with the IonSets storage item, resetting.');
    };

    readyPromise = new Promise((resolve, reject) => {
        fetch('assets/ions.json')
            .then(r => r.json())
            .then(json => {
                const set = new IonSets.IonSet('DobbelZouten Default IonSet', json);
                set.save();
                readyState = true;
                resolve();
            });
    });
};

init();

IonSets.onReady = function(resolve) {
    return new Promise(async _ => {
        if (readyState) { resolve(); return };
        console.log('not yet')
        readyPromise.then(_ => {
            resolve();
            console.log('now');
        });
    });
};

export default IonSets;