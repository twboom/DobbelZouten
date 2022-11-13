class Ion {
    constructor(elements, charge) {
        this.elements = elements;
        this.charge = charge;
    };

    html() {
        // Empty string
        let text = ''
        console.log(this.elements)
        // Elements
        for (let i = 0; i < this.elements.length; i++) {
            const el = this.elements[i];
            text = text.concat(el[0].charAt(0).toUpperCase() + el[0].slice(1));
            if (el[1]) { text = text.concat(`<sub>${el[1]}</sub>`) }
        };
        
        // Charge
        text = text.concat(`<sup>${this.charge}</sup>`)
        return text
    };
};

class IonDisplay extends HTMLElement {
    constructor() {
        super();

        // Get element
        const element = this.innerText;
        const count = this.hasAttribute('count') ? this.getAttribute('count') : '';
        const charge = this.hasAttribute('charge') ? this.getAttribute('charge') : ''

        // Create the text
        const text = `${element}<sub>${count}</sub><sup>${charge}</sup>`;

        // Replace innerHTML with the new text
        this.innerHTML = text;
    };
};

customElements.define('ion-display', IonDisplay)