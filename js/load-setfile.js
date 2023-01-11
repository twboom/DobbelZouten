document.getElementById('setfile').addEventListener('change', evt => {
    const file = evt.target.files[0];
    if (file === undefined) { return };
    file.text().then(text => {
        const json = JSON.parse(text)
        ionSet = json;
        init();

        hideModal();
        alert('Nieuwe ionenset ingeladen!')
    });
});