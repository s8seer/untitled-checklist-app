// IMPORT ORDER : 2

function loadNotes(textValue = history[encrypted_date]['notes']) {
    notepad.value = textValue;
    notepadTitle.innerHTML = `${notepadDefaultTitle}`;
}
  
function disableNotes(){ notepad.disabled = true; }
function enableNotes(){ notepad.disabled = false; }
  
function saveNotes() {
    textValue = notepad.value;
    history[date_selector.innerText]['notes'] = textValue;
    save_to_local_storage(history, localStorage_historyID);
    notepadTitle.innerHTML = `${notepadDefaultTitle}`;
}
  
function checkLoadState() {
    if ( notepad.value == history[date_selector.innerText]['notes']) {
        notepadTitle.innerHTML = `${notepadDefaultTitle}`;
        return true 
    }
    else {
        notepadTitle.innerHTML = `*${notepadDefaultTitle}`;
        return false
    };
}   

notepad.addEventListener('keydown', function (e){
    if ( e.key == 'Escape' ) { notepad.blur(); }
    else if ( e.ctrlKey && e.key == 's' && !e.altKey ){ 
        saveNotes(); e.preventDefault(); return false;
    }
}, false);
  
notepad.addEventListener('keyup', function (e){ if ( !e.altKey && !e.metaKey && !e.shiftKey ) { checkLoadState() }}, false);  