'use strict';

let initialTouchPos;
let lastTouchPos;
let currentXPosition = 0;
let rafPending = false;
let noteContainer;
let currentState;

const STATE_DEFAULT = 1;
const STATE_LEFT_SIDE = 2;
const STATE_RIGHT_SIDE = 3;
const handleSize = 10;

// Perform client width here as this can be expensive and doens't
// change until window.onresize
const title = document.getElementsByClassName('title')[0];
let itemWidth = title.clientWidth;
let slopValue = itemWidth * (1/4);

// On resize, change the slop value
function resize() {
    itemWidth = title.clientWidth;
    slopValue = itemWidth * (1/4);
}

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
    noteContainer = document.createElement('div');
    noteContainer.classList.add('note-container');
    addSwipeEventListeners(noteContainer);
    const noteTextArea = document.createElement('textArea');
    noteTextArea.classList.add('note-text-area');
    noteTextArea.addEventListener('keyup', save);
    const addNoteButton = document.getElementById('add-note-button');
    noteContainer.appendChild(noteTextArea);
    document.body.insertBefore(noteContainer, addNoteButton);
    return noteTextArea;
}

function addSwipeEventListeners(container) {
    if (window.PointerEvent) {
        container.addEventListener('pointerdown', handleGestureStart, true);
        container.addEventListener('pointermove', handleGestureMove, true);
        container.addEventListener('pointerup', handleGestureEnd, true);
        container.addEventListener('pointercancel', handleGestureEnd, true);
    } else {
        container.addEventListener('touchstart', handleGestureStart, true);
        container.addEventListener('touchmove', handleGestureMove, true);
        container.addEventListener('touchend', handleGestureEnd, true);
        container.addEventListener('touchcancel', handleGestureEnd, true);

        container.addEventListener('mousedown', handleGestureStart, true);
    }
}

// Handle the start of gestures
function handleGestureStart(event) {
    event.preventDefault();
    if(event.touches && event.touches.length > 1) {
        return;
    }
    // Add the move and end listeners
    if (window.PointerEvent) {
        event.target.setPointerCapture(event.pointerId);
    } else {
        // Add Mouse Listeners
        document.addEventListener('mousemove', handleGestureMove, true);
        document.addEventListener('mouseup', handleGestureEnd, true);
    }
    initialTouchPos = getGesturePointFromEvent(event);
    event.target.parentElement.style.transition = 'initial';
}

// Handle end gestures
function handleGestureEnd(event) {
    event.preventDefault();
    if(event.touches && event.touches.length > 0) {
        return;
    }
    rafPending = false;

    // Remove Event Listeners
    if (window.PointerEvent) {
        event.target.releasePointerCapture(event.pointerId);
    } else {
        // Remove Mouse Listeners
        document.removeEventListener('mousemove', handleGestureMove, true);
        document.removeEventListener('mouseup', handleGestureEnd, true);
    }

    updateSwipeRestPosition();
    initialTouchPos = null;
}

function updateSwipeRestPosition() {
    var differenceInX = initialTouchPos.x - lastTouchPos.x;
    currentXPosition = currentXPosition - differenceInX;

    // Go to the default state and change
    let newState = STATE_DEFAULT;

    // Check if we need to change state to left or right based on slop value
    if(Math.abs(differenceInX) > slopValue) {
        if(currentState === STATE_DEFAULT) {
            if(differenceInX > 0) {
                newState = STATE_LEFT_SIDE;
            } else {
                newState = STATE_RIGHT_SIDE;
            }
        } else {
            if(currentState === STATE_LEFT_SIDE && differenceInX > 0) {
                newState = STATE_DEFAULT;
            } else if(currentState === STATE_RIGHT_SIDE && differenceInX < 0) {
                newState = STATE_DEFAULT;
            }
        }
    } else {
        newState = currentState;
    }

    changeState(newState);

    noteContainer.style.transition = 'all 150ms ease-out';
}

function changeState(newState) {
    let transformStyle;
    switch(newState) {
        case STATE_DEFAULT:
            currentXPosition = 0;
            break;
        case STATE_LEFT_SIDE:
            currentXPosition = -(itemWidth - handleSize);
            break;
        case STATE_RIGHT_SIDE:
            currentXPosition = itemWidth - handleSize;
            break;
    }

    transformStyle = 'translateX('+currentXPosition+'px)';

    noteContainer.style.msTransform = transformStyle;
    noteContainer.style.MozTransform = transformStyle;
    noteContainer.style.webkitTransform = transformStyle;
    noteContainer.style.transform = transformStyle;

    currentState = newState;
}

function getGesturePointFromEvent(event) {
    const point = {};

    if(event.targetTouches) {
        // Prefer Touch Events
        point.x = event.targetTouches[0].clientX;
        point.y = event.targetTouches[0].clientY;
    } else {
        // Either Mouse event or Pointer Event
        point.x = event.clientX;
        point.y = event.clientY;
    }

    return point;
}

function handleGestureMove(event) {
    event.preventDefault();

    if(!initialTouchPos) { return; }

    lastTouchPos = getGesturePointFromEvent(event);

    if(rafPending) { return; }
    rafPending = true;

    window.requestAnimationFrame(onAnimFrame);
}

function onAnimFrame() {
    if(!rafPending) {
        return;
    }

    let differenceInX = initialTouchPos.x - lastTouchPos.x;

    let newXTransform = (currentXPosition - differenceInX)+'px';
    let transformStyle = 'translateX('+newXTransform+')';
    noteContainer.style.webkitTransform = transformStyle;
    noteContainer.style.MozTransform = transformStyle;
    noteContainer.style.msTransform = transformStyle;
    noteContainer.style.transform = transformStyle;

    rafPending = false;
}

function addButtonListeners() {
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
    addButtonListeners();
    addServiceWorker();
};

window.onresize = () => resize();


