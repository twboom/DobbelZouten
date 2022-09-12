const items = [
  '🍭',
  '❌',
  '⛄️',
  '🦄',
  '🍌',
  '💩',
  '👻',
  '😻',
  '💵',
  '🤡',    
  '🦖',
  '🍎',
  '😂',
  '🖕',
];

const positive =[
    'Na+',
    'K+',
    'NH4+',
    'Mg+2',
    'Al+3',
    'Fe+2',
    'Zn+2',
    'Fe+3',
    'Cu+2',
    'Ca+2',
    'Ba+2',
    'Hg+2',
    'Pb+2',
    'Hg+',
    'Ag+'
];

const negative = [
    'NO3-',
    'Cl-',
    'Br-',
    'I-',
    'SO4-2',
    'F-',
    'S-2',
    'OH-',
    'SO3-2',
    'CO3-2',
    'PO4-3',
    'O-2'
];

const doors = document.querySelectorAll('.door');

document.querySelector('#spinner').addEventListener('click', spin);
document.querySelector('#reseter').addEventListener('click', init);
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
      box.textContent = pool[i];
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