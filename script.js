document.addEventListener('DOMContentLoaded', () => {
    const workplace = document.querySelector('.workplace');
    const modal = document.querySelector('.modal');
    const titleInput = document.getElementById('note-title');
    const contentInput = document.getElementById('note-content');
    const saveBtn = document.getElementById('save-note');
    const exitBtn = document.getElementById('exit');
    const deleteBtn = document.querySelector('.delete');
    const naxui = document.querySelector('.naxui');

    let notesData = [];
    let currentEditingIndex = null;
    let deleteMode = false;
    let selectedNotes = new Set();

    // Загрузка заметок с сервера
    async function loadNotes() {
        const res = await fetch('/authorization/notes_api.php');
        notesData = await res.json();
        render();
    }

    // Сохранение заметки (PUT или POST)
    async function saveNote(note) {
        await fetch('/authorization/notes_api.php', {
            method: note.id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(note)
        });
        loadNotes();
    }

    // Удалить все заметки
    naxui.addEventListener('click', () => {
        if (confirm('вы уверены что хотите удалить все заметки?')) {
            deleteAll();
        }
    });

    async function deleteAll() {
        await fetch('/authorization/notes_api.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ all: true })
        });
        loadNotes();
    }

    // Кнопка add создаётся только в JS!
    const addBtn = document.createElement('button');
    addBtn.className = 'add';
    addBtn.textContent = '+';

    addBtn.addEventListener('click', async () => {
        await fetch('/authorization/notes_api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: '', content: '' })
        });
        loadNotes();
    });

    // Кнопка удаления (режим выделения и удаление)
    deleteBtn.addEventListener('click', async () => {
        if (!deleteMode) {
            deleteMode = true;
            deleteBtn.classList.add('active');
            render();
        } else {
            // Удаляем выделенные заметки на сервере по их id
            for (let noteId of selectedNotes) {
                await fetch('/authorization/notes_api.php', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: noteId })
                });
            }
            selectedNotes.clear();
            deleteMode = false;
            deleteBtn.classList.remove('active');
            loadNotes();
        }
    });

    // Основная функция рендера
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
                    const note = notesData[cellIndex];
                    const noteId = note.id;
                    const noteDiv = document.createElement('div');
                    noteDiv.className = 'note';
                    noteDiv.innerText = note.title || 'Без названия';

                    // Сброс обработчиков
                    noteDiv.onclick = null;

                    if (deleteMode) {
                        noteDiv.style.cursor = 'pointer';
                        if (selectedNotes.has(noteId)) {
                            noteDiv.classList.add('selected');
                            cellDiv.classList.add('cell-selected');
                        } else {
                            noteDiv.classList.remove('selected');
                            cellDiv.classList.remove('cell-selected');
                        }
                        noteDiv.onclick = (e) => {
                            e.stopPropagation();
                            if (selectedNotes.has(noteId)) {
                                selectedNotes.delete(noteId);
                                noteDiv.classList.remove('selected');
                                cellDiv.classList.remove('cell-selected');
                            } else {
                                selectedNotes.add(noteId);
                                noteDiv.classList.add('selected');
                                cellDiv.classList.add('cell-selected');
                            }
                        };
                    } else {
                        noteDiv.classList.remove('selected');
                        cellDiv.classList.remove('cell-selected');
                        noteDiv.onclick = () => {
                            if (!deleteMode) openModal(noteId);
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

    // Открытие модального окна для редактирования
    function openModal(id) {
    const noteIndex = notesData.findIndex(note => note.id === id);
    if (noteIndex === -1) return;
    currentEditingIndex = noteIndex;
    titleInput.value = notesData[noteIndex].title || '';
    contentInput.value = notesData[noteIndex].content || '';
    modal.classList.remove('hidden');
    }

    // Сохранение изменений в заметке
    saveBtn.addEventListener('click', async () => {
        const newTitle = titleInput.value.trim();
        const newContent = contentInput.value.trim();

        if (currentEditingIndex !== null && notesData[currentEditingIndex]) {
            const note = notesData[currentEditingIndex];
            await fetch('/authorization/notes_api.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: note.id, title: newTitle, content: newContent })
            });
        }

        modal.classList.add('hidden');
        loadNotes();
    });

    if (exitBtn) {
        exitBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            currentEditingIndex = null;
        });
    }

    // Загружаем заметки при старте
    loadNotes();
});