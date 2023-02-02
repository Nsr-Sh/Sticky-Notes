// variables

const container = document.querySelector('#main>.container'),
  stickyNote = document.querySelector('.stickynotes'),
  title = document.querySelector('.stickynotes>input'),
  text = document.querySelector('.stickynotes>textarea'),
  date = document.querySelector('.stickynotes>span'),
  section = document.querySelector('section'),
  newIcon = document.querySelector('.fa-check'),
  clearBtn = document.querySelector('#clear');

// create list of colors
const colors = [];
stickyNote.querySelectorAll('.clr').forEach(item => {
  colors.push(item.classList[1]);
});

// ------------------New Note

//  get notes arrey from local storage if exist, else create empty array
let notes = JSON.parse(localStorage.getItem('notes')) || [];

// events:
newIcon.addEventListener('click', createNote);

//------------------------- Functions---------------------------
//------------- Date Function----------------
function insertDate() {
  //  dispaly date
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  let string = `Today: ${year}/${String(month).padStart(2, 0)}/${String(
    day
  ).padStart(2, 0)} at ${hours}:${String(minutes).padStart(2, 0)}:${seconds}`;
  date.textContent = string;
}
setInterval(insertDate, 1000);

//---------------Create Note Element Function
function createNote() {
  if (text.value && title.value) {
    // create noteInfo object
    const noteInfo = {
      title: title.value,
      text: text.value,
      date: date.textContent.split(' ').slice(1).join(' '),
      color: this.closest('form').classList[1],
    };

    // add new note to notes array
    notes.push(noteInfo);
    // save notes to local storage
    saveLS();
  } else {
    alert('please enter title and description');
  }
  // // show new note
  showNote();
  // reset form
  this.closest('form').reset();
  this.closest('form').classList.remove(...colors);
}
// -----------Save To Local Storage Function

function saveLS() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

//-------------Show Note Function
function showNote() {
  // remove previous notes before add new note
  section.querySelectorAll('.stickynotes').forEach(item => item.remove());
  // add new note:
  // first: create text html element(html markeup)
  notes.forEach((note, index, notes) => {
    const html = `   <form class="stickynotes ${note.color}">
    <h2>${note.title}</h2>
    <span>Last update: ${note.date}</span>
    <hr />
    <p>${note.text}</p>
    <!-- color palette -->
    <div class="colorpalette">
            <div class="clr yellow"></div>
            <div class="clr purple"></div>
            <div class="clr pink"></div>
            <div class="clr green"></div>
            <div class="clr blue"></div>
            <div class="clr white"></div>
          </div>

    <!-- buttom icons -->
    <div class="icons">
      <i class="fa-solid fa-pencil"></i>
      <i class="fa-solid fa-palette"></i>
      <i class="fa-regular fa-trash-can" onclick="deleteNote(${index})"></i>
    </div>
  </form>`;

    // second: add to pgae
    section.insertAdjacentHTML('afterbegin', html);
  });
}

//--------------Delete Note function (using onclick )

function deleteNote(ind) {
  const conf = confirm('Are You Sure You Want To Delete It ?');
  if (conf) {
    // delete note
    notes.splice(ind, 1);
    // save notes to local storage
    saveLS();
    showNote();
  }
}
// --------------change color and edit note (using AddEventListener)

// event: Open ColorPalettes(using event delegation)
container.addEventListener('click', changeColor);
//  add click listener to higher level element that exist in page:setion
section.addEventListener('click', editNote);

// --------------Change Color Function
function changeColor(e) {
  if (e.target.classList.contains('fa-palette')) {
    // open color palette
    const palette = e.target.parentElement.previousElementSibling;
    palette.classList.toggle('show');
    // change color
    const colorCircle = palette.querySelectorAll('.clr');
    colorCircle.forEach(item => item.addEventListener('click', coloring));

    function coloring(e) {
      const sticky = e.target.parentElement.parentElement;
      // remove all colors before add new color class
      e.target.parentElement.parentElement.classList.remove(...colors);
      e.target.parentElement.parentElement.classList.add(e.target.classList[1]);
      // find index of clicked(current) note
      let allStickyNotes = document.querySelectorAll('.stickynotes');
      const clickedNote = e.target.closest('.stickynotes');
      currentIndex = [...allStickyNotes].reverse().indexOf(clickedNote);

      // change color of current note
      if (notes[currentIndex]) {
        notes[currentIndex].color = e.target.classList[1];
      }
      // save to Local Storage
      saveLS();
    }
  }
}

// ---------------Edit Note Function

function editNote(e) {
  // check if edit button clicked
  if (e.target.classList.contains('fa-pencil')) {
    e.target.classList.remove('fa-pencil');
    e.target.classList.add('fa-check');

    const currentNote = e.target.closest('.stickynotes');
    currentIndex = notes.findIndex(
      item => item.title === currentNote.querySelector('h2').textContent
    );

    // replace h, p tags with input & textarea
    const h = currentNote.querySelector('h2');
    const p = currentNote.querySelector('p');
    // create new elements
    const input = document.createElement('input');
    const textarea = document.createElement('textarea');
    // set old values to new elements
    input.value = h.textContent;
    textarea.value = p.textContent;
    // replace
    currentNote.replaceChild(input, h);
    currentNote.replaceChild(textarea, p);

    checkBtn = currentNote.querySelector('.fa-check');
    // remove current event!
    e.target.removeEventListener('click', editNote);

    // new event for check btn
    checkBtn.addEventListener('click', () => {
      notes[currentIndex].title = input.value;
      notes[currentIndex].text = textarea.value;
      notes[currentIndex].date = date.textContent.split(' ').slice(1).join(' ');
      // save to Local Storage
      saveLS();
      showNote();
    });
  }
}
// ------------clear local storage
clearBtn.addEventListener('click', () => {
  confirm('Are you sure?');
  localStorage.clear();
  showNote();
});
clearBtn.addEventListener('mouseenter', e => {
  e.target.style.width = '255px';
});
clearBtn.addEventListener('mouseleave', e => {
  e.target.style.width = '60px';
});

//-------------display notes when page loaded
showNote();

//
