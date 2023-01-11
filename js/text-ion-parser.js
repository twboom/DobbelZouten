function parseIonString(ionString) {
    // Ion structure
    const ion = {
        "elements": [],
        "charge": ""
    };

    // Set string to lowercase
    ionString = ionString.toLowerCase();

    // Parser
    const tokens = ionString.split('');
    let currentElement = ["", ""];
    let inCharge = false;
    for (let i = 0; i < tokens.length; i++) {
        const char = tokens[i];
        if (!inCharge) {
            if (char == ';') {
                ion.elements.push(currentElement);
                currentElement = ["", ""];
            };
            if (char == ':') {
                ion.elements.push(currentElement);
                currentElement = ["", ""];
                inCharge = true;
            };
            
            if (/[a-z]/.test(char)) {
                currentElement[0] += char;
            };
            if (/[0-9]/.test(char)) {
                currentElement[1] += char;
            };
        } else {
            ion.charge += char;
        };
    };
    
    return ion
};