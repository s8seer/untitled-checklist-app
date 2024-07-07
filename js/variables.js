// IMPORT ORDER : 1

const notepad                   = document.getElementById('notepad');
const defaultNotepadPlaceholder = notepad.placeholder;
const notepadTitle              = document.getElementById('notepadTitle');
const notepadDefaultTitle       = notepadTitle.innerHTML;

const date_selector             = document.getElementById('date_selector');
const date_selector_content     = document.getElementById('date_selector_content');

const daily_tasks               = document.getElementById('daily');
const history_graph             = document.getElementById('history');

const localStorage_checklistsID = 'checklists';
const localStorage_historyID = 'history';

const type_selector        = document.getElementById('type_selector')
const type_selector_title  = document.getElementById('type_selector_title')

const todo_types = ['Daily', 'Weekly'];

// Daily and Weekly are implemented
// Once and Weekdays are not implemented
const default_checklists = {
    "Daily": {},
    "Weekly": {},
    "Weekdays": {
      "Monday": {},
      "Tuesday": {},
      "Wednesday": {},
      "Thursday": {},
      "Friday": {},
      "Saturday": {},
      "Sunday": {}
    },
    "Once": {}
}

let today = new Date();
let long_weekday = today.toLocaleString('en-us', {  weekday: 'long' })
let encrypted_date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

// load items from localStorage
let checklists = JSON.parse(localStorage.getItem(localStorage_checklistsID)) || default_checklists;
let history = JSON.parse(localStorage.getItem(localStorage_historyID)) || {};
history[encrypted_date] = history[encrypted_date] || {};