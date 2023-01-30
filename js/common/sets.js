let readyState = false;
let readyPromise;

const IonSets = [];

IonSets.IonSet = class {
    constructor(name, contents, id, constant=false, intermediate=true) {
        this.name = name;
        this.contents = contents;
        this.id = 'last';
        if (id !== undefined) { this.id = id; };
        if (constant !== true) { constant = false };
        this.constant = constant;

        if (!intermediate) {
            if (IonSets.exists(name, 'name')) {
                console.log(name, 'exists')
                let count = 0;
                for (let i = 1; i < 1025; i++) {
                    if (!IonSets.exists(name + ` (${i})`, 'name')) {
                        count = i;
                        break;
                    };
                };
                this.name = name + ` (${count})`
            };
        };
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
            'constant': this.constant,
        };
    };

    save(constantOverwrite=false) {
        if (this.constant && !constantOverwrite) { return 'protected'; } else { console.log('protected ', this.constant) };
        if (validateContents(this.contents)) {
            this.id = IonSets.set(this.id, this.json);
            console.log(this.id)
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
        const oldName = this.name;
        this.name = newName;
        const success = this.save();
        if (!success) {
            this.name = oldName;
            return 'protected';
        };
        return true;
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
    if (type === 'name') { set = sets.find( ({ slug }) => slug == id ); };
    if (type === 'id') { set = sets[id]; };
    if (set === undefined) { return null };
    const index = sets.indexOf(set);
    return new IonSets.IonSet(set.name, set.contents, index, set.constant);
};

IonSets.isConstant = function(id, type='slug') {
    const sets = JSON.parse(localStorage.getItem('ionsets'))
    let set = sets.find( ({ slug }) => slug == id );
    if (type === 'name') { set = sets.find( ({ slug }) => slug == id ); };
    if (type === 'id') { set = sets[id]; };
    if (set === undefined) { return null };
    return set.constant;
};

IonSets.exists = function(id, type='slug') {
    const sets = JSON.parse(localStorage.getItem('ionsets'))
    let set = sets.find( ({ slug }) => slug == id );
    if (type === 'name') { set = sets.find( ({ name }) => name == id ); };
    if (type === 'id') { set = sets[id]; };
    // console.log(type, id, set)
    if (set === undefined) { return false; }
    else { return true; };
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
            const set = new IonSets.IonSet('DobbelZouten Default IonSet', json, undefined, true);
            set.save(true);
            readyState = true;
            resolve();
            });
    });
};

init();

IonSets.onReady = function(resolve) {
    return new Promise(async _ => {
        if (readyState) { resolve(); return };
        readyPromise.then(_ => {
            resolve();
        });
    });
};

export default IonSets;