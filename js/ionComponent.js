class Ion {
    constructor({elements, charge}) {
        this.elements = elements;
        this.charge = charge;
    };

    html() {
        // Empty string
        let text = ''
        
        // Elements
        for (let i = 0; i < this.elements.length; i++) {
            const el = this.elements[i];
            text = text.concat(el[0].charAt(0).toUpperCase() + el[0].slice(1));
            if (el[1]) { text = text.concat(`<sub>${el[1]}</sub>`) }
        };
        
        // Charge
        text = text.concat(`<sup>${this.charge}</sup>`)
        return `<p class="ion">${text}</p>`
    };
};
