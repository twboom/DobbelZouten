const positive =[
    '<ion-display count="" charge="+">Na</ion-display>',
    '<ion-display count="" charge="+">K</ion-display>',
    '<ion-display count="4" charge="+">NH</ion-display>',
    '<ion-display count="" charge="2+">Mg</ion-display>',
    '<ion-display count="" charge="3+">Al</ion-display>',
    '<ion-display count="" charge="2+">Fe</ion-display>',
    '<ion-display count="" charge="3+">Fe</ion-display>',
    '<ion-display count="" charge="2+">Cu</ion-display>',
    '<ion-display count="" charge="2+">Ca</ion-display>',
    '<ion-display count="" charge="2+">Ba</ion-display>',
    '<ion-display count="" charge="4+">Pb</ion-display>',
    '<ion-display count="" charge="2+">Pb</ion-display>'
];

const negative = [
    '<ion-display count="3" charge="-">NO</ion-display>',
    '<ion-display count="2" charge="-">NO</ion-display>',
    '<ion-display count="" charge="-">Cl</ion-display>',
    '<ion-display count="" charge="-">Br</ion-display>',
    '<ion-display count="" charge="-">I</ion-display>',
    '<ion-display count="4" charge="2-">SO</ion-display>',
    '<ion-display count="3" charge="-">HCO</ion-display>',
    '<ion-display count="" charge="-">OH</ion-display>',
    '<ion-display count="3" charge="2-">SO</ion-display>',
    '<ion-display count="3" charge="2-">CO</ion-display>',
    '<ion-display count="4" charge="3-">PO</ion-display>',
    '<ion-display count="" charge="2-">O</ion-display>'
];

const doors = document.querySelectorAll('.door');

document.getElementById('button').addEventListener('click', evt => {
  const btn = evt.target;
  if (btn.dataset.action === 'spin') { spin(); btn.innerHTML = 'Reset'; btn.dataset.action = 'reset' }
  else if (btn.dataset.action === 'reset') { init(); btn.innerHTML = 'Spin'; btn.dataset.action = 'spin' };
})

function init(firstInit = true, groups = 1, duration = 1) {
  for (const door of doors) {
    if (firstInit) {
      door.dataset.spinned = '0';
    } else if (door.dataset.spinned === '1') {
      return;
    }

    let itemPool;
    if (door.classList.contains('negative')) { itemPool = negative }
    else if (door.classList.contains('positive')) { itemPool = positive };

    const boxes = door.querySelector('.boxes');
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
          door.dataset.spinned = '1';
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
      box.style.width = door.clientWidth + 'px';
      box.style.height = door.clientHeight + 'px';
      box.innerHTML = pool[i];
      boxesClone.appendChild(box);
    }
    boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
    boxesClone.style.transform = `translateY(-${door.clientHeight * (pool.length - 1)}px)`;
    door.replaceChild(boxesClone, boxes);
  }
}
async function spin() {
  init(false, 1, 2);
  
  for (const door of doors) {
    const boxes = door.querySelector('.boxes');
    const duration = parseInt(boxes.style.transitionDuration);
    boxes.style.transform = 'translateY(0)';
    await new Promise((resolve) => setTimeout(resolve, duration * 100));
  }
}

function shuffle([...arr]) {
  let m = arr.length;
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }
  return arr;
}
init();