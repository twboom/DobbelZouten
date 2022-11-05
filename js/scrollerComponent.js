class SlotScroller extends HTMLElement {
    constructor() {
        super();

        // Create shadow root
        const shadow = this.attachShadow({ mode: "open" });

        // Create scroller
        this.door = document.createElement('div');
        this.door.setAttribute('class', 'door');

        this.boxes = document.createElement('div');
        this.boxes.setAttribute('class', 'boxes');
        this.door.appendChild(this.boxes);

        shadow.appendChild(this.door);
    };

    init(firstInit = true, groups = 1, duration = 1, itemPool) {
      this.itemPool = itemPool
        if (firstInit) {
            this.door.dataset.spinned = '0';
          } else if (this.door.dataset.spinned === '1') {
            return;
          }
      
        //   const boxes = this.door.querySelector('.boxes');
        const boxes = this.boxes;
        const boxesClone = boxes.cloneNode(false);
        const pool = ['❓'];
        if (!firstInit) {
          const arr = [];
          for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
            arr.push(...itemPool);
          }
          pool.push(...shuffle(arr));
          boxesClone.addEventListener(
            'transitionstart',
            function () {
              this.door.dataset.spinned = '1';
              this.querySelectorAll('.box').forEach((box) => {
                box.style.filter = 'blur(1px)';
              });
            },
            { once: true }
          );
          boxesClone.addEventListener(
            'transitionend',
            function () {
              this.querySelectorAll('.box').forEach((box, index) => {
                box.style.filter = 'blur(0)';
                if (index > 0) this.removeChild(box);
              });
            },
            { once: true }
          );
        }
        for (let i = pool.length - 1; i >= 0; i--) {
          const box = document.createElement('p');
          box.classList.add('box');
          box.style.width = this.door.clientWidth + 'px';
          box.style.height = this.door.clientHeight + 'px';
          box.innerHTML = pool[i];
          boxesClone.appendChild(box);
        }
        boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
        boxesClone.style.transform = `translateY(-${this.door.clientHeight * (pool.length - 1)}px)`;
        this.door.replaceChild(boxesClone, boxes);
    }

    async spin() {
        this.init(false, 1, 2, this.itemPool)

        const boxes = this.door.querySelector('.boxes');
        const duration = parseInt(boxes.style.transitionDuration);
        boxes.style.transform = 'translateY(0)';
        await new Promise((resolve) => setTimeout(resolve, duration * 100));
    }
};

customElements.define('slot-scroller', SlotScroller)