let readyState = false;
let readyPromise;

const IonSets = [];

IonSets.IonSet = class {
    constructor(name, contents) {
        this.name = name;
        this.contents = contents;
        this.id = 'last';
    };

    get slug() {
        let slug = '';
        for (let i=0; i < this.name.length; i++) {
            let char = this.name[i];
            if (/^[A-Za-z0-9 ]*$/.test(char)) {
                if (char === ' ') { char = '-' }
                slug += char.toLowerCase();
            } else {
                continue
            };
        };
        return slug;
    };

    get json() {
        return {
            'name': this.name,
            'slug': this.slug,
            'contents': this.contents,
        };
    };

    save() {
        if (validateContents(this.contents)) {
            this.id = IonSets.set(this.id, this.json);
            return true;
        } else {
            return false;
        };
    };

    update(newContents) {
        this.contents = newContents;
        this.save();
    };

    updateName(newName) {
        this.name = newName;
        this.save();
    };

    contentsEquals(other) {
        return JSON.stringify(this.contents) === JSON.stringify(other);
    };
};

IonSets.all = function() {
    const setsJSON = JSON.parse(localStorage.getItem('ionsets'));
    const sets = [];
    Object.keys(setsJSON).forEach(key => {
        const set = setsJSON[key];
        sets.push(new IonSets.IonSet(set.name, set.contents))
    });
    return sets;
};

IonSets.get = function(id, type='slug') {
    const sets = JSON.parse(localStorage.getItem('ionsets'))
    let set = sets.find( ({ slug }) => slug == id );
    if (type === 'id') { set = sets[id]; };
    if (set === undefined) { return null };
    return new IonSets.IonSet(set.name, set.contents);
};

IonSets.set = function(id, value) {
    let sets = JSON.parse(localStorage.getItem('ionsets'));
    if (id === 'last') { id = sets.length; };
    sets[id] = value;
    localStorage.setItem('ionsets', JSON.stringify(sets));
    return id;
};

function validateContents(contents) {
    try {
        if (contents.positive.length <= 0) { return false };
        if (contents.negative.length <= 0) { return false };
    } catch {
        return false;
    };

    return true;
};

function init() {
    const sets = localStorage.getItem('ionsets');

    if (sets === undefined || sets === null) {
        localStorage.setItem('ionsets', '[]');
        console.warn('LS: No IonSets found');
    };

    try {
        JSON.parse(sets);
    } catch(error) {
        localStorage.setItem('ionsets', '[]');
        console.log('LS: Problem with the IonSets storage item, resetting.');
    };

    
    readyPromise = new Promise((resolve, reject) => {
        fetch('assets/ions.json')
        .then(r => r.json())
        .then(json => {
            let currentDefault = IonSets.get('dobbelzouten-default-ionset');
            if (currentDefault !== null) {
                if (currentDefault.contentsEquals(json)) {
                    readyState = true;
                    resolve();
                    return;
                };
            };
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