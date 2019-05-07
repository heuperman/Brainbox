'use strict';

function load() {
    textArea.innerHTML = localStorage.getItem('brainbox');
}

function save() {
    const text = textArea.value;
    localStorage.setItem('brainbox', text);
}

const textArea = document.getElementById('note-text');
textArea.addEventListener('keyup', save);

window.onload = () => load();

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then((reg) => {
                console.log('Service worker registered.', reg);
            });
    });
}


