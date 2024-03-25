const daily_tasks = document.getElementById('daily');
const history_graph = document.getElementById('history');
const notepad = document.getElementById('notepad');
const notepadTitle = document.getElementById('notepadTitle');
const defaultNotepadPlaceholder = notepad.placeholder;
const notepadDefaultTitle = notepadTitle.innerHTML;
const localStorage_tasksID = 'todo_save';
const localStorage_historyID = 'history';

var audio_volume = 1;
var muted = false;
function play(audio_dir){
  let click = new Audio(audio_dir);
  click.volume = audio_volume;
  if (!muted) {click.play()};
}

var today = new Date();
var long_weekday = today.toLocaleString('en-us', {  weekday: 'long' })

function time_without_seconds(){
  let date = new Date(); 
  let hh = date.getHours();
  let mm = date.getMinutes();
  hh = (hh < 10) ? "0" + hh : hh;
  mm = (mm < 10) ? "0" + mm : mm;
  let time = hh + ":" + mm;
  return time;
}

function loadNotes(textValue = currentHistory[encrypted_date]['notes']) {
  notepad.value = textValue;
  notepadTitle.innerHTML = `${notepadDefaultTitle}`;
}

function disableNotes(){ notepad.disabled = true; }
function enableNotes(){ notepad.disabled = false; }

var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();
let encrypted_date = `${yyyy}-${mm}-${dd}`

let currentHistory = JSON.parse(localStorage.getItem(localStorage_historyID)) || {};
currentHistory[encrypted_date] = currentHistory[encrypted_date] || {};
currentHistory[encrypted_date]['notes'] = currentHistory[encrypted_date]['notes'] || "";

// add listeners to checkboxes to save them each time they get clicked
function savestuff(element) {
  

  element.checked = false;
  currentHistory[encrypted_date][element.id] =  currentHistory[encrypted_date][element.id]
                                                || [element.parentNode.innerText, element.checked];
  element.checked = currentHistory[encrypted_date][element.id][1] || false;
  saveSettings(currentHistory, localStorage_historyID);

  element.onclick = function() { 
    play('./assets/audio/pen.wav')
    currentHistory[encrypted_date][element.id][1] = element.checked;
    if (element.checked) {
      currentHistory[encrypted_date][element.id][2] = time_without_seconds()
    } else {
      currentHistory[encrypted_date][element.id].splice(2, 1);
    }
    date_select.value = encrypted_date;
    
    load_history_graph(date_select.value)
    saveSettings(currentHistory, localStorage_historyID);
  }
}

// everything will be stored here
var schedules = {
  "Daily": {
    "Sing": {
      'Description': 'Vocal Training',
      'Time': '15 Minutes'
    },
    "Art": {
      'Description': 'Art prompt of the month',
      'Time': '15 Minutes'
    },
  },
  "Study": {
    "Daily": [
      // "Mathematics",
      
    ],
    "Monday":     [],
    "Tuesday":    [],
    "Wednesday":  [],
    "Thursday":   [],
    "Friday":     [],
    "Saturday":   [],
    "Sunday":     []
  },
  "Weekly_Tasks": {
    "Monday":     [                                             ],
    "Tuesday":    [ "1 page of art in notebook"                 ],
    "Wednesday":  [                                             ],
    "Thursday":   [                                             ],
    "Friday":     [ "1 page of art in notebook"                 ],
    "Saturday":   [                                             ],
    "Sunday":     [                                             ]
  }
}

let weekbreaks = ["Monday", "Thursday"];

let localization = {
  'English': {
    'To-dos': 'To-dos',
    'Study': 'Study',
    'Weekdays': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  'Japanese': {
    'To-dos': 'すること',
    'Study': '勉強',
    'Weekdays': ['月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', '日曜日']
  },
  'Turkish': {
    'To-dos': 'Yapılacaklar',
    'Study': 'Çalışılacak Dersler',
    'Weekdays': ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']
  },
  'Italian': {
    'To-dos': 'Cose da Fare',
    'Study': 'Lezioni da Studiare',
    'Weekdays': ['Lunedi', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica']
  },
  'French': {
    'To-dos': 'Choses à Faire',
    'Study': 'Leçons à Étudier',
    'Weekdays': ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
  }
}
let selected_language = 'English';

function generateCheckbox(ID, Description, Time = '') {
  var input = document.createElement('input');
  input.id = `todo_${ID}`;
  input.type = 'checkbox';
  
  var label = document.createElement('label');
  label.for = input.id;
  label.append(input);
  label.innerHTML += Description;
  label.title = Time;
  return label
};
function generateHeader(text){
  var header = document.createElement('h4');
  header.innerHTML = text;
  return header
}

// get weekly todos
let WeeklyTasksOfToday = schedules['Weekly_Tasks'][long_weekday];

daily_tasks.append(generateHeader(localization[selected_language]['To-dos']));
daily_tasks.innerHTML += `<br>`;
for (var i = 0; i < Object.keys(schedules['Daily']).length; i++){
  subject = schedules['Daily'][Object.keys(schedules['Daily'])[i]]

  daily_tasks.append(generateCheckbox(Object.keys(schedules['Daily'])[i], subject['Description'], subject['Time']));
  daily_tasks.innerHTML += '<br>'
}

// add weekly tasks to daily tasks
daily_tasks.append(generateHeader(localization[selected_language]['Weekdays'][today.getDay() === 0 ? 6 : today.getDay()-1]));
daily_tasks.innerHTML += `<br>`;
for (var i = 0; i < WeeklyTasksOfToday.length; i++) {
  daily_tasks.append(generateCheckbox(`weekly_task_${i}`, `${WeeklyTasksOfToday[i]}`))
  daily_tasks.innerHTML += '<br>'
}

// add today's lectures if today's not a weekend
if ( !weekbreaks.includes(long_weekday) && ( schedules['Study'][long_weekday].length || schedules['Study']['Daily'].length)) {
  daily_tasks.append(generateHeader(localization[selected_language]['Study']));
  daily_tasks.innerHTML += `<br>`;
  for (var i = 0; i < schedules['Study']['Daily'].length; i++) {
    daily_tasks.append(generateCheckbox(`study_${schedules['Study']['Daily'][i].replace(/ /g,"_")}_${i}`, `${schedules['Study']['Daily'][i]}`))
    daily_tasks.innerHTML += '<br>';
  }
  for (var i = 0; i < schedules['Study'][long_weekday].length; i++) {
    daily_tasks.append(generateCheckbox(`study_${schedules['Study'][long_weekday][i].replace(/ /g,"_")}_${i}`, `${schedules['Study'][long_weekday][i]}`));
    daily_tasks.innerHTML += '<br>'
  }
}

function saveSettings(save_json, localStorageID) { localStorage.setItem(localStorageID, JSON.stringify(save_json));};

// display history graph
function load_history_graph(json_index = encrypted_date){
  
  let SelectedDateKeys = Object.keys(currentHistory[json_index])

  let done_array = [];
  let undone_array = [];

  for (var i = 0; i < SelectedDateKeys.length; i++) {
    let keyValue = SelectedDateKeys[i]
    if (keyValue == 'notes'){
      // don't display notes
    }
    else if (currentHistory[json_index][keyValue][1]) {
      done_array.push(`${currentHistory[json_index][keyValue][2]} ${currentHistory[json_index][keyValue][0]}`)
    }
    else {
      undone_array.push(currentHistory[json_index][keyValue][0])
    }
  }
  done_array.sort();
  undone_array.sort();

  history_graph.innerHTML = '';
  history_graph.innerHTML += `completed ${done_array.length}/${done_array.length+undone_array.length}<br>`;
  
  if (done_array.length != 0) {
    history_graph.innerHTML += `<br>DONE:<br>${done_array.join('<br>')}<br>`;
  }
  if(undone_array.length != 0) {
    history_graph.innerHTML += `<br>UNDONE:<br>${undone_array.join('<br>')}<br>`;
  }

  if (json_index == encrypted_date){
    notepad.placeholder = defaultNotepadPlaceholder;
  } else{
    notepad.placeholder = 'No notes for today.';
  }
  notepadText = currentHistory[json_index]['notes'] || '';
  loadNotes(notepadText);
}

// save checkbox status of tasks to local storage automatically
var todoRE = /^todo_/;
var els=document.getElementsByTagName('*');
for (var i=els.length;i--;) if (todoRE.test(els[i].id)) savestuff(els[i]);
load_history_graph();

// this function is called from html don't delete
function downloadFile() {
  var e = JSON.stringify(currentHistory, undefined, 4);
  var c = document.createElement("a");
  c.style.display = 'none';
  c.download = `history_backup_${encrypted_date}.json`;
  var t = new Blob([e], {type: "text/plain"});
  c.href = URL.createObjectURL(t);
  c.click();
  setTimeout(() => { URL.revokeObjectURL(c.href); }, 0);
}

function handle_file_select( evt ) {
  let fl_files = evt.target.files;
  let fl_file = fl_files[0];
  let reader = new FileReader();
  let display_file = ( e ) => {
    currentHistory = JSON.parse(e.target.result);
    saveSettings(currentHistory, localStorage_historyID);
    load_history_graph();
  };
  let on_reader_load = ( fl ) => { return display_file; };
  reader.onload = on_reader_load( fl_file );
  reader.readAsText( fl_file );
}

const date_select = document.getElementById('dateSelect')
selectable_dates = Object.keys(currentHistory).reverse();
for (var i = 0; i < selectable_dates.length; i++) {
  var opt = document.createElement('option');
  opt.value = selectable_dates[i];
  opt.innerHTML = selectable_dates[i];
  date_select.appendChild(opt);
} 

// oh no the notepad
function saveNotes() {
  textValue = notepad.value;
  currentHistory[date_select.value]['notes'] = textValue;
  saveSettings(currentHistory, localStorage_historyID);
  notepadTitle.innerHTML = `${notepadDefaultTitle}`;
}

function checkLoadState() {
  if ( notepad.value == currentHistory[date_select.value]['notes']) {
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
date_select.addEventListener('change', function() {load_history_graph(date_select.value);});
document.getElementById('upload').addEventListener( 'change', handle_file_select, false );
loadNotes();