/*globals formSerialize*/
import $$ from './utils/select';
import rq from './utils/request';
import UI from './ui';
import fire from './utils/fire';

let events = ((userCollection, taskCollection) => {
  let sourceModal = $$('#source-modal');
  let userModal = sourceModal.find('#user-modal');
  let taskModal = sourceModal.find('#task-modal');
  let taskTable = $$('#show-tasks');
  let deleteTask = $$('#delete-task');
  let userModalForm = userModal.find('form');
  let taskModalFrom = taskModal.find('form');
  let usersList = $$('#users');
  let showAllUsers = $$('#show-all-users');
  let addNewUserButton = $$('#add-new-user');
  let addNewTaskButton = $$('#add-new-task');

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
    let deleteIds = Array.import(taskTable.findAll('input[type=checkbox]:checked'))
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
  addNewUserButton.on('click', () => UI.showModal(userModal));
  addNewTaskButton.on('click', () => {
    UI.showModal(taskModal);
    taskModalFrom.reset();
    UI.removeTaskEditableClass();
    UI.changeModalHeaderText();
  });
});

export default events;

