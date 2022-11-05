function showModal() {
    document.getElementById('modal').style.display = 'block';
};

function hideModal() {
    document.getElementById('modal').style.display = 'none';
};

document.getElementById('menu-show').addEventListener('click', showModal);
document.getElementById('menu-hide').addEventListener('click', hideModal);