// import testModules from './test-module.js';
/** ******** Your code here! *********** */

// console.log(testModules.hello);

const btnAddTeacher = document.querySelectorAll('.add-teacher-btn');
const dialogAddTeacher = document.getElementById('dialog-add-teacher');
const closeDialogAddTeacher = document.getElementById('close-add-teacher-btn');

const btnInfoTeacher = document.querySelectorAll('.teacher');
const dialogInfoTeacher = document.getElementById('dialog-teacher-info');
const closeInfoTeacher = document.getElementById('close-info-teacher-btn');

btnAddTeacher.forEach(btn => {
    btn.addEventListener('click', () => {
        dialogAddTeacher.showModal();
    });
});

closeDialogAddTeacher.addEventListener('click', () => {
    dialogAddTeacher.close();
});

btnInfoTeacher.forEach(btn => {
    btn.addEventListener('click', () => {
        dialogInfoTeacher.showModal();
    });
});

closeInfoTeacher.addEventListener('click', () => {
    dialogInfoTeacher.close();
});
