const notepad =                   document.getElementById('notepad');
const defaultNotepadPlaceholder = notepad.placeholder;
const notepadTitle =              document.getElementById('notepadTitle');
const notepadDefaultTitle =       notepadTitle.innerHTML;

const date_selector =             document.getElementById('date_selector');
const date_selector_content =     document.getElementById('date_selector_content');

const daily_tasks =               document.getElementById('daily');
const history_graph =             document.getElementById('history');

const localStorage_checklistsID = 'checklists';
const localStorage_historyID = 'history';

const default_checklists = {
  "Daily": {},
  "Weekly": {},
  "Weekdayly": {
    "Monday": {},
    "Tuesday": {},
    "Wednesday": {},
    "Thursday": {},
    "Friday": {},
    "Saturday": {},
    "Sunday": {}
  }
}

var today = new Date();
var long_weekday = today.toLocaleString('en-us', {  weekday: 'long' })

function get_time_without_seconds(){
  let date = new Date(); let hh = date.getHours(); let mm = date.getMinutes();
  hh = (hh < 10) ? "0" + hh : hh; mm = (mm < 10) ? "0" + mm : mm;
  let time = hh + ":" + mm; return time;
}

let encrypted_date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
let checklists = JSON.parse(localStorage.getItem(localStorage_checklistsID)) || default_checklists;
let history = JSON.parse(localStorage.getItem(localStorage_historyID)) || {};
history[encrypted_date] = history[encrypted_date] || {};

function sync_checklists(){
  // Remove from history json if it doesnt exist in checklist json
  // Optimize this with difference detection
  for (let i = 0; i < Object.keys(checklists['Daily']).length; i++){
  
  // Good luck understanding what the bottom line does
  if (!(Object.keys(history[encrypted_date]).includes(Object.keys(checklists['Daily'])[i]))){
      history[encrypted_date][Object.keys(checklists['Daily'])[i]] = checklists['Daily'][Object.keys(checklists['Daily'])[i]];  
    }
  }

  let deleted_checklists = Object.keys(history[encrypted_date]).filter(x => !Object.keys(checklists['Daily']).includes(x));
  for (let i = 0; i < deleted_checklists.length; i++){
    if ( !(deleted_checklists[i] == 'notes')){
      delete history[encrypted_date][deleted_checklists[i]]
    }
  }

  save_to_local_storage(history, localStorage_historyID);
  save_to_local_storage(checklists, localStorage_checklistsID);
}

sync_checklists()

function add_todo(name, type){
  if (type == 'Daily'){
    checklists['Daily'][name] = {} 
  }
  sync_checklists();
  load_history_graph();
}

function delete_todo(name, type){
  if (type == 'Daily'){
    delete checklists['Daily'][name]
  }
  load_delete_button();
  sync_checklists();
  load_history_graph();

  

  var mySpans = daily_tasks.getElementsByTagName('label');

  for(var i=0;i<mySpans.length;i++){
  
    if(mySpans[i].innerText == name){
    var parent = mySpans[i];
    break;
  }}

  parent.parentNode.removeChild(parent.nextElementSibling);
  parent.parentNode.removeChild(parent);
}

// add listeners to checkboxes to save them each time they get clicked
function savestuff(element) {

  element.checked = history[encrypted_date][element.id.substring(5)]['Completed'];


  element.onclick = function() { 
    if (element.checked){
      history[encrypted_date][element.id.substring(5)]['Completed'] = get_time_without_seconds();
    }else{
      history[encrypted_date][element.id.substring(5)]['Completed'] = element.checked;  
    }
    
    load_history_graph(encrypted_date)
    save_to_local_storage(history, localStorage_historyID);
  }
}

function generateCheckbox(ID, Description) {
  var input = document.createElement('input');
  input.id = `todo_${ID}`;
  input.type = 'checkbox';

  var label = document.createElement('label');
  label.for = input.id;
  label.append(input);
  label.innerHTML += Description;
  return label
};

function generateHeader(text){
  var header = document.createElement('h4');
  header.innerHTML = text;
  return header
}

daily_tasks.append(generateHeader('To-dos'));
daily_tasks.innerHTML += `<br>`;
for (var i = 0; i < Object.keys(history[encrypted_date]).length; i++){
  subject = history[encrypted_date][Object.keys(history[encrypted_date])[i]]
  if (!(Object.keys(history[encrypted_date])[i] == 'notes')){
    daily_tasks.append(generateCheckbox(Object.keys(history[encrypted_date])[i], Object.keys(history[encrypted_date])[i]));
  daily_tasks.innerHTML += '<br>'
  }
  
}

function save_to_local_storage(save_json, localStorageID) { localStorage.setItem(localStorageID, JSON.stringify(save_json)) };

// display history graph
function load_history_graph(json_index = encrypted_date){

  date_selector.innerText = json_index;

  let done_array = []; let undone_array = [];

  let checklist_keys = Object.keys(history[json_index])

  

  for (var i = 0; i < checklist_keys.length; i++) {
    let keyValue = checklist_keys[i]
    if (keyValue == 'notes'){
      // don't display notes as a to-do
    }
    else if (history[json_index][keyValue]['Completed']) {
      done_array.push(`${history[json_index][checklist_keys[i]]['Completed']} ${checklist_keys[i]}`)
    }
    else {
      undone_array.push(checklist_keys[i])
    }
  }
  // done_array.sort();
  // undone_array.sort();

  history_graph.innerHTML = '';
  history_graph.innerHTML += `completed ${done_array.length}/${done_array.length+undone_array.length}<br>`;

  if (checklist_keys.length == 0){
    history_graph.innerHTML = '<br>Please add a to-do to begin<br><br>';
  }
  
  if ( done_array.length != 0 ) { history_graph.innerHTML += `<br>DONE:<br>${done_array.join('<br>')}<br>`; }
  if ( undone_array.length != 0 ) { history_graph.innerHTML += `<br>UNDONE:<br>${undone_array.join('<br>')}<br>`; }

  if (json_index == encrypted_date){
    notepad.placeholder = defaultNotepadPlaceholder;
  } else{
    notepad.placeholder = 'No notes for today.';
  }
  notepadText = history[json_index]['notes'] || '';
  loadNotes(notepadText);

}

function filter_unwanted_characters(text){
  let unwanted_characters = ["'", '"', '*', '`', '/', '\\', ';', ':'];
  for (let i = 0; i < unwanted_characters.length; i++){
    text = text.replace(unwanted_characters[i], "")
  }
  return text
}

document.getElementById('add_todo').addEventListener("submit", function(e){
  e.preventDefault();
  let todo_value = filter_unwanted_characters(document.getElementById('add_todo').firstElementChild.value)

  add_todo(todo_value, 'Daily');
  daily_tasks.append(generateCheckbox(todo_value, todo_value));
  daily_tasks.innerHTML += '<br>';
  load_checkboxes();
  load_delete_button();
  document.getElementById('add_todo').firstElementChild.value = '';
});



// add buttons to delete button
function load_delete_button(){
  let delete_buttons = document.getElementById('delete_butons');
  delete_buttons.innerHTML = '';
  for (let i = 0; i < Object.keys(checklists['Daily']).length; i++){
    var x = document.createElement("button");
    var t = document.createTextNode(Object.keys(checklists['Daily'])[i]);
    x.appendChild(t);
    x.setAttribute('onclick', `delete_todo('${Object.keys(checklists['Daily'])[i]}', 'Daily')`)
    delete_buttons.appendChild(x);
    delete_buttons.innerHTML += '<br>'
    
    // document.getElementById('dropdown-content').innerHTML += `<a onclick="delete_todo('${Object.keys(checklists['Daily'])[i]}', 'Daily')" href="#">${Object.keys(checklists['Daily'])[i]}</a><br>`
  }
  if (Object.keys(checklists['Daily']).length == 0){
    var x = document.createElement("button");
    var t = document.createTextNode('Please add a to do first!');
    x.appendChild(t);
    x.setAttribute('onclick', `document.getElementById('add_todo').firstElementChild.focus()`)
    delete_buttons.appendChild(x);
  }
}

// save checkbox status of tasks to local storage automatically
function load_checkboxes(){
  let inputs = daily_tasks.getElementsByTagName('input');
  for (var i = 0; i< inputs.length; i++){ savestuff(inputs[i]) }
  load_history_graph();  
}

function load_date_selector(){
  selectable_dates = Object.keys(history)
  selectable_dates.sort();
  selectable_dates.reverse();

  date_selector_content.innerHTML = '';

  for (let i = 0; i < selectable_dates.length; i++){
    var x = document.createElement("button");
    var t = document.createTextNode(selectable_dates[i]);
    x.appendChild(t);
    
    x.setAttribute('onclick', `load_history_graph('${selectable_dates[i]}');`)
    date_selector_content.appendChild(x);
    date_selector_content.innerHTML += '<br>'
  }
}

load_date_selector();
load_checkboxes();
load_delete_button();

// notepad

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
  if ( e.key == 'Escape' ) {
      notepad.blur();
  } else if ( e.ctrlKey && e.key == 's' && !e.altKey ){ 
      saveNotes();
      e.preventDefault();
      return false;
  }
}, false);

notepad.addEventListener('keyup', function (e){ if ( !e.altKey && !e.metaKey && !e.shiftKey ) { checkLoadState() }}, false);
