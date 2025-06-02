document.addEventListener('DOMContentLoaded', () => {
    const workplace = document.querySelector('.workplace');
    const modal = document.querySelector('.modal');
    const titleInput = document.getElementById('note-title');
    const contentInput = document.getElementById('note-content');
    const saveBtn = document.getElementById('save-note');
    const exitBtn = document.getElementById('exit');
    const deleteBtn = document.querySelector('.delete');
    const naxui = document.querySelector('.naxui')


    naxui.addEventListener('click', () =>{
       if(confirm('вы уверены что хотите удалить все заметки?')){
        deleteAll();
        
       }
       
    });
    
    function deleteAll(){
        notesData = [];
        render();
    }




    // Кнопка add создаётся только в JS!
    const addBtn = document.createElement('button');
    addBtn.className = 'add';
    addBtn.textContent = '+';

    let notesData = [];
    let currentEditingIndex = null;
    let deleteMode = false;
    let selectedNotes = new Set();

    addBtn.addEventListener('click', () => {
        notesData.push({ title: '', content: '' });
        render();
    });

    deleteBtn.addEventListener('click', () => {
        if (!deleteMode) {
            deleteMode = true;
            deleteBtn.classList.add('active');
            render(); // <--- ВАЖНО: сразу перерисовать!
        } else {
            // Удаляем выделенные заметки
            notesData = notesData.filter((_, idx) => !selectedNotes.has(idx));
            selectedNotes.clear();
            deleteMode = false;
            deleteBtn.classList.remove('active');
            render();
        }
    });

    

    // Функция сохранения
   
    
    function render() {
       
        workplace.innerHTML = '';
        let totalCells = notesData.length + 1;
        let rowsCount = Math.ceil(totalCells / 4);
        let cellIndex = 0;

        for (let i = 0; i < rowsCount; i++) {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'row';
        for (let j = 0; j < 4; j++) {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'cell';

                if (cellIndex < notesData.length) {
                    const noteDiv = document.createElement('div');
                    noteDiv.className = 'note';
                    noteDiv.innerText = notesData[cellIndex].title || 'Без названия';

                    const currentIndex = cellIndex;

                    // Сброс обработчиков, чтобы не накапливались
                    noteDiv.onclick = null;

                    if (deleteMode) {
                        noteDiv.style.cursor = 'pointer';
                        if (selectedNotes.has(currentIndex)) {
                            noteDiv.classList.add('selected');
                            cellDiv.classList.add('cell-selected');
                        } else {
                            noteDiv.classList.remove('selected');
                            cellDiv.classList.remove('cell-selected');
                        }
                        noteDiv.onclick = (e) => {
                            e.stopPropagation();
                            if (selectedNotes.has(currentIndex)) {
                                selectedNotes.delete(currentIndex);
                                noteDiv.classList.remove('selected');
                                cellDiv.classList.remove('cell-selected');
                            } else {
                                selectedNotes.add(currentIndex);
                                noteDiv.classList.add('selected');
                                cellDiv.classList.add('cell-selected');
                            }
                        };
                    } else {
                        noteDiv.classList.remove('selected');
                        cellDiv.classList.remove('cell-selected');
                        noteDiv.onclick = () => {
                            if (!deleteMode) openModal(currentIndex);
                        };
                    }

                    cellDiv.appendChild(noteDiv);
                } else if (cellIndex === notesData.length) {
                    cellDiv.appendChild(addBtn);
                }

                rowDiv.appendChild(cellDiv);
                cellIndex++;
                if (cellIndex >= totalCells) break;
            }
            workplace.appendChild(rowDiv);
        }
        
    }

    function openModal(index) {
        if (!notesData[index]) return;
        currentEditingIndex = index;
        titleInput.value = notesData[index].title || '';
        contentInput.value = notesData[index].content || '';
        modal.classList.remove('hidden');
    }

    saveBtn.addEventListener('click', () => {
        const newTitle = titleInput.value.trim();
        const newContent = contentInput.value.trim();

        if (currentEditingIndex !== null && notesData[currentEditingIndex]) {
            notesData[currentEditingIndex].title = newTitle;
            notesData[currentEditingIndex].content = newContent;
        }

        modal.classList.add('hidden');
        render();
    });

    if (exitBtn) {
        exitBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            currentEditingIndex = null;
        });
    }

    render();
});