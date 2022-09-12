class IonDisplay extends HTMLElement {
    constructor() {
        super();

        // Get element
        const element = this.innerText;
        const count = this.hasAttribute('count') ? this.getAttribute('count') : '';
        const charge = this.hasAttribute('charge') ? this.getAttribute('charge') : '+'

        // Create the text
        const text = `${element}<sub>${count}</sub><sup>${charge}</sup>`;

        // Replace innerHTML with the new text
        this.innerHTML = text;
    };
};

customElements.define('ion-display', IonDisplay)