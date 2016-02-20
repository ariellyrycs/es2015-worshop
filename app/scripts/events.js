/*globals formSerialize*/
let $$ = require('./utils/select');
let rq = require('./utils/request');
let UI = require('./ui');
let fire = require('./utils/fire');

var events = ((userCollection, taskCollection) => {
  let sourceModal = $$('#source-modal');
  let userModal = sourceModal.find('#user-modal');
  let taskModal = sourceModal.find('#task-modal');
  let taskTable = $$('#show-tasks');
  let deleteTask = $$('#delete-task');
  let userModalForm = userModal.find('form');
  let taskModalFrom = taskModal.find('form');
  let usersList = $$('#users');
  let showAllUsers = $$('#show-all-users');

  fire.subscribe('userChange', null, () => {
    UI.hideModal();
    userModalForm.reset();
  });

  fire.subscribe('taskChange', null, () => {
    UI.hideModal();
    taskModalFrom.reset();
  });

  userModalForm.on('submit', function (e) {
    e.preventDefault();
    let data = formSerialize(this, { hash: true });
    userCollection.add(data);
  });

  taskModalFrom.on('submit', function (e) {
    e.preventDefault();
    let data = formSerialize(this, { hash: true });
    if(this.hasClass('editable')) {
      taskCollection.update(this.data('task-id'), data);
    } else {
      taskCollection.add(data);
    }
  });

  deleteTask.on('click', e => {
    e.preventDefault();
    let deleteIds = Array.from(taskTable.findAll('input[type=checkbox]:checked'))
      .map(task => task.parent('tr').data('task-id'));
    taskCollection.deleteByIds(deleteIds);
  });

  taskTable.delegate('click', '.edit-task', e => {
    e.preventDefault();
    let taskElement = e.target.parent('tr');
    let taskId = taskElement.data('task-id');

    taskModalFrom.reset();
    UI.showEditModal(taskModal, taskCollection.findById(taskId));
    UI.setTaskId(taskId);
    UI.changeModalHeaderText(true);
  });

  usersList.delegate('click', 'a', e => {
    let userId = e.target.data('user-id');
    UI.setFilterUserId(userId);
    UI.updateTasks(taskCollection.fetch());
  });
  
  showAllUsers.on('click', () => {
    UI.setFilterUserId(null);
    UI.updateTasks(taskCollection.fetch());
  });

  sourceModal.delegate('click', '[data-dismiss=modal]', () => UI.hideModal());
  $$('#add-new-user').on('click', () => UI.showModal(userModal));
  $$('#add-new-task').on('click', () => {
    UI.showModal(taskModal);
    taskModalFrom.reset();
    UI.removeTaskEditableClass();
    UI.changeModalHeaderText();
  });
});

module.exports = events;
