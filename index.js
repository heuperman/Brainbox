'use strict';

function load() {
    const data = JSON.parse(localStorage.getItem('brainbox'));
    if (data && data.hasOwnProperty(0)) {
        createLoadedNotes(data);
    } else {
        localStorage.clear();
        addNote();
    }
}

function createLoadedNotes(data) {
    for (const entry in data) {
        if (data.hasOwnProperty(entry)) {
            const noteTextArea  = addNote();
            noteTextArea.value = data[entry];
        }
    }
}

function save() {
    const textAreas = document.getElementsByClassName('note-text-area');
    const data = {};
    let index = 0;
    for (const textArea of textAreas) {
        data[index] = textArea.value;
        index++;
    }
    localStorage.setItem('brainbox', JSON.stringify(data));
}

function addNote() {
    const noteContainer = document.createElement('div');
    noteContainer.classList.add('note-container');
    const noteTextArea = document.createElement('textArea');
    noteTextArea.classList.add('note-text-area');
    noteTextArea.addEventListener('keyup', save);
    const addNoteButton = document.getElementById('add-note-button');
    noteContainer.appendChild(noteTextArea);
    document.body.insertBefore(noteContainer, addNoteButton);
    return noteTextArea;
}

function addListeners() {
    const addNoteButton = document.getElementById('add-note-button');
    addNoteButton.addEventListener('click', addNote);
}

function addServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then((registration) => {
                console.log('Service worker registered., scope is:', registration.scope);
            })
            .catch(function(error) {
                console.log('Service worker registration failed, error:', error);
            });
    }
}

window.onload = () => {
    load();
    addListeners();
    addServiceWorker();
};


