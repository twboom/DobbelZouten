export class Ion {
    constructor({elements, charge}) {
        this.elements = elements;
        this.charge = charge;
    };

    html(as_span=false) {
        // Empty string
        let text = ''
        
        // Elements
        for (let i = 0; i < this.elements.length; i++) {
            const el = this.elements[i];
            text = text.concat(el[0].charAt(0).toUpperCase() + el[0].slice(1));
            if (el[1] && el[1] != 1) { text = text.concat(`<sub>${el[1]}</sub>`) }
        };
        
        // Charge
        text = text.concat(`<sup>${this.charge}</sup>`)
        if (as_span) {
            return `<span class="ion">${text}</span>`
        }
        return `<p class="ion">${text}</p>`
    };
};
