/*globals formSerialize*/
import $$ from './utils/select';
import rq from './utils/request';
import UI from './ui';
import fire from './utils/fire';

let events = (() => {
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


});

export default events;
