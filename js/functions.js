// IMPORT ORDER : 2

function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

function get_time_without_seconds(){
  let date = new Date(); let hh = date.getHours(); let mm = date.getMinutes();
  hh = (hh < 10) ? "0" + hh : hh; mm = (mm < 10) ? "0" + mm : mm;
  let time = hh + ":" + mm; return time;
}

function encrypt_date(date_object){
  return `${date_object.getFullYear()}-${String(date_object.getMonth() + 1).padStart(2, '0')}-${String(date_object.getDate()).padStart(2, '0')}`
}

// a and b are javascript Date objects
function dateDiffInDays(a, b) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  let result = Math.floor((utc2 - utc1) / _MS_PER_DAY)
  if (result == 7){result = 0};
  return result;
}

function check_if_key_exists_until_the_last_monday(key){
  // returns false if the key doesn't exist
  let dateObj = new Date()
  let difference = dateDiffInDays(getMonday(dateObj), dateObj);
  
  if (history[encrypted_date][key]){
    return true
  } 
  
  // cycle through weekly checklists
  for (let i = 0; i < difference; i++){
    dateObj.setDate(dateObj.getDate() - 1);
    // console.log(dateObj)
    if (history[encrypt_date(dateObj)]){
      if (history[encrypt_date(dateObj)][key]){
        if (history[encrypt_date(dateObj)][key]['Completed']){
          return true  
        }
      }
    }
  }
  console.log('returned false')
  return false
}

function sync_checklists(){
  // Remove from history json if it doesnt exist in checklist json
  // Optimize this with difference detection
  for (let i = 0; i < Object.keys(checklists['Daily']).length; i++){
    // Good luck understanding what the bottom line does
    if (!(Object.keys(history[encrypted_date]).includes(Object.keys(checklists['Daily'])[i]))){
        // Sometimes To-Dos are saved to config as 'completed'. this is a dirty trick to fix it.z
        //checklists['Daily'][i]["Completed"] = false
        history[encrypted_date][Object.keys(checklists['Daily'])[i]] = checklists['Daily'][Object.keys(checklists['Daily'])[i]];  
      }
  }

  let deleted_checklists = Object.keys(history[encrypted_date]).filter(x => !
    [...Object.keys(checklists['Daily']), ...Object.keys(checklists['Weekly'])] // list of checklists where its added to the history
    .includes(x) 
  );
  for (let i = 0; i < deleted_checklists.length; i++){
    if ( !(deleted_checklists[i] == 'notes')){
      delete history[encrypted_date][deleted_checklists[i]]
    }
  }
  // Checks if any of the weekly to dos are completed until the previous monday
  for (let i = 0; i < Object.keys(checklists['Weekly']).length; i++){
    if (check_if_key_exists_until_the_last_monday(Object.keys(checklists['Weekly'])[i])){

    } else{
      history[encrypted_date][Object.keys(checklists['Weekly'])[i]] = checklists['Weekly'][Object.keys(checklists['Weekly'])[i]]
    }
  }

  save_to_local_storage(history, localStorage_historyID);
  save_to_local_storage(checklists, localStorage_checklistsID);
}

sync_checklists()

function add_todo(name, type){
  if (type == 'Daily'){
    checklists['Daily'][name] = {};
  } else if (type == 'Weekly'){
    checklists['Weekly'][name] = {};
  };
  sync_checklists();
  load_history_graph();
}

function delete_todo(name, type){
  if (type == 'Daily'){
    delete checklists['Daily'][name]
  } else if (type == 'Weekly'){
    delete checklists['Weekly'][name]
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
    notepad.placeholder = 'No notes for this day.';
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

  add_todo(todo_value, type_selector_title.innerHTML);
  daily_tasks.append(generateCheckbox(todo_value, todo_value));
  daily_tasks.innerHTML += '<br>';
  load_checkboxes();
  load_delete_button();
  document.getElementById('add_todo').firstElementChild.value = '';
});

function generate_button(json_key, type_of_todo){
  let delete_buttons = document.getElementById('delete_butons');
  for (let i = 0; i < Object.keys(json_key).length; i++){
    var x = document.createElement("button");
    var t = document.createTextNode(Object.keys(json_key)[i]);
    x.appendChild(t);
    x.setAttribute('onclick', `delete_todo('${Object.keys(json_key)[i]}', '${type_of_todo}')`)
    delete_buttons.appendChild(x);
    delete_buttons.innerHTML += '<br>'
  }
}

// add buttons to delete button
function load_delete_button(){
  let delete_buttons = document.getElementById('delete_butons');
  delete_buttons.innerHTML = 'Daily:';

  generate_button(checklists['Daily'], 'Daily');

  if (Object.keys(checklists['Weekly']).length > 0) {
    delete_buttons.innerHTML += '<br>'
    delete_buttons.innerHTML += 'Weekly:'
    generate_button(checklists['Weekly'], 'Weekly');
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

for (let i = 0; i < todo_types.length; i++){
  var x = document.createElement("button");
  var t = document.createTextNode(todo_types[i]);
  x.appendChild(t);
  x.setAttribute('onclick', `
  type_selector_title.innerHTML = '${todo_types[i]}'

  `)
  type_selector.appendChild(x);
  type_selector.innerHTML += '<br>'
}

function delete_history(){
  history = {};
  save_to_local_storage(history, localStorage_historyID);
};

load_date_selector();
load_checkboxes();
load_delete_button();

