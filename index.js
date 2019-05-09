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
    console.log('Saving...', data);
    localStorage.setItem('brainbox', JSON.stringify(data));
}

function addNote() {
    const noteContainer = document.createElement('div');
    noteContainer.classList.add('note-container');
    const noteTextArea = document.createElement('textArea');
    noteTextArea.classList.add('note-text-area');
    const addNoteButton = document.getElementById('add-note-button');
    noteContainer.appendChild(noteTextArea);
    document.body.insertBefore(noteContainer, addNoteButton);
    return noteTextArea;
}

function addListeners() {
    const textAreas = document.getElementsByClassName('note-text-area');
    const addNoteButton = document.getElementById('add-note-button');
    addNoteButton.addEventListener('click', addNote);
    for (const textArea of textAreas) {
        textArea.addEventListener('keyup', save);
    }
}

window.onload = () => {
    load();
    addListeners();
};

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then((reg) => {
                console.log('Service worker registered.', reg);
            });
    });
}


