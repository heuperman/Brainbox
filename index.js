const textArea = document.getElementById('note-text');
textArea.addEventListener('keyup', save);
window.onload = () => load();

function load() {
    textArea.innerHTML = localStorage.getItem('brainbox');
}

function save() {
    const text = textArea.value;
    localStorage.setItem('brainbox', text);
}


