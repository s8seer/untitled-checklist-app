// load this file before catsay.js and after mouse.js
const buttonImage = document.getElementById('buttonIMG');  
const buttonIndex = document.getElementById('buttonIndex');
const drive = document.getElementById('drive');  
const imageDir = './graphics/hots/';

const settingsID = 'settings';
const checkbox_mute = document.getElementById('checkbox_mute');
const checkbox_context_menu = document.getElementById('checkbox_context_menu');
const volume_slider = document.getElementById('volume_slider');
const defaultSettings = { 
    "context_menu": false,
    "hide_scrollbars": false,
    "audio_volume": 0.2,
    "audio_mute": false
}

function saveSettings(settings_json) { localStorage.setItem(settingsID, JSON.stringify(settings_json));};
function settingsSetup() { saveSettings(defaultSettings) };
let currentSettings = JSON.parse(localStorage.getItem(settingsID)) || defaultSettings;

let muted = currentSettings['audio_mute'] || defaultSettings['audio_mute'];
let audio_volume = currentSettings['audio_volume'] || defaultSettings['audio_volume'];

let button_index = 0;
let button_clicks = 0;

function explode(){
    let files = [
        'explode1.ogg',
        'explode2.ogg',
        'explode3.ogg',
        'explode4.ogg',
        'explode5.mp3'
    ];
    let file = files[Math.floor(Math.random() * files.length)];
    let explode = new Audio(`./graphics/audio/${file}`);
    explode.volume = audio_volume;
    explode.play();
    
    var img = new Image();
    img.src = './graphics/arts/explode.gif';
    img.style.height = '120px';
    img.style.position = 'absolute';
    img.style.left = 40+'px'; img.style.top = '-60px';
    buttonImage.parentNode.appendChild(img);
    setTimeout(function(){ img.style.visibility = 'hidden'; }, 2000);
}


function cycleButtons(buttons) {
    buttonIndex.innerHTML = `${button_index+1}/${buttons.length}`;
    buttonImage.src = imageDir + buttons[button_index++];
    if (button_index == buttons.length) { button_index = 0; };

    if (button_clicks > 15) { 
        const canvas = document.createElement('canvas')
        canvas.width = 88; canvas.height = 31;
        buttonImage.removeAttribute('id');
        buttonIndex.innerHTML = `:(&nbsp;`;
        buttonImage.src = canvas.toDataURL();
        buttonImage.onclick = function() {};
        explode();
    } else {button_clicks++}
};
function loadButtons(buttons) {
    cycleButtons(buttons);
    buttonImage.onclick = function() { click(); cycleButtons(buttons);}
};

// width: 2, height: 20, margin: 5
function barcode(element, pics) { 
    var a = Math.floor(Math.random() * pics.length); var img = pics[a];
    element.innerHTML = `<img src="${img}" height="16px">`; 
};

// call the functions
drive.addEventListener('mouseout', function() { drive.src = './graphics/arts/drive_still.png' });
drive.addEventListener('mouseover', function() { drive.src = './graphics/arts/drive_alive.gif' });
barcode( document.getElementById('bottombar'),
    [
        'graphics/arts/barcode2.png', // s8seer.github.io
        'graphics/arts/barcode3.png', // who uses a barcode scanner
        'graphics/arts/barcode4.png', // have a good day
        'graphics/arts/barcode5.png'  // bojack horseman is a great show
    ]
);
loadButtons(
    [ 
        'button_2.png',
        'button_1.png',
    ]
);

// Initialize and configure a new menu
const menu = new Menu({
    target: document,
    onOpen: function (_contextMenuEvent) {
        return true; // A callback must return true.
    },
    onClose: function () {
    }
});
menu.createItem('Copy', function () {
    navigator.clipboard.writeText(window.getSelection().toString())
});
menu.createItem('Refresh Page', function () {
    window.location.reload();
});
menu.createItem('Reload Page', function () {
    window.location.reload(true);
});
menu.createItem('Select all', function () {
    selectText(document);
});

function loadCheckBoxes(element, element_key) {
    element.checked = currentSettings[element_key];
    element.onclick = function() {
        currentSettings[element_key] = element.checked;
        context_enabled = currentSettings['context_menu'];
        saveSettings(currentSettings);
    };
}
function load_audio_settings() {
    volume_slider.oninput = function() {
        audio_volume = volume_slider.value/100;
        currentSettings['audio_volume'] = audio_volume;
    };
    volume_slider.onmouseup = function(){
        saveSettings(currentSettings);
        click()
    }
    checkbox_mute.onclick = function(){
        muted = !checkbox_mute.checked
        currentSettings['audio_mute'] = !checkbox_mute.checked;
        saveSettings(currentSettings);
    }
};

load_audio_settings();
volume_slider.value = audio_volume*100;
checkbox_mute.checked = !muted;
loadCheckBoxes(checkbox_context_menu, 'context_menu');
// Should or should not show the custom context menu
context_enabled = currentSettings['context_menu'];
