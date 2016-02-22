import $$ from './utils/select';
import saferHTML from "./utils/safer-html";

class UI {
  constructor() {
    this._usersListContainer = $$('#users');
    this._tasksContainer = $$('#show-tasks tbody')[0];
    this._contentModals = $$('.modal-content');
    this._sourceModal = $$('#source-modal');
    this._overLay = $$('.modal-backdrop')[0];
    this._userInTask = $$('#task-user');
    this._taskForm = this._sourceModal.find('#task-modal form');
    this._taskUserField = this._taskForm.find('[name="user"]');
    this._taskDescriptionField = this._taskForm.find('[name="description"]');
    this._taskTimeField = this._taskForm.find('[name="time"]');
    this._taskDateField = this._taskForm.find('[name="date"]');
    this._modalTaskTitle = this._sourceModal.find('.dynamic-task-title');
    this._filterUserId = null;
  }

  updateUsers(users) {
    /*User*/
    this._usersListContainer.innerHTML = users.reduce((usersHTML, user) => {
      return usersHTML + saferHTML`
      <li>
        <a href='#' data-user-id="${user.id}">${user.name} ${user.lastName}</a>
      </li>`;
    }, '');
    /*User-task*/
    this._userInTask.innerHTML = users.reduce((usersHTML, user) => {
      return usersHTML + saferHTML`
      <option value="${user.id}">${user.name} ${user.lastName}</option>`;
    }, '<option>Select user</option>');
  }

  updateTasks(tasks) {
    let filteredTasks = tasks;
    if(this._filterUserId) {
      filteredTasks = tasks.filter(task => task.creatorId === this._filterUserId)
    }

    this._tasksContainer.innerHTML = filteredTasks.reduce((tasksHTML, task, index) => {
      if(task) {
        return tasksHTML + saferHTML`
        <tr data-task-id='${task.id}'>
          <th scope="row">${index + 1}</th>
          <td><input type="checkbox"></td>
          <td>${task.description}</td>
          <td>${task.time}</td>
          <td>${task.date}</td>
          <td><a href="#" class="btn btn-info btn-xs edit-task">Edit</a></td>
        </tr>`;
      }
    }, '');
  }

  changeModalHeaderText(editable) {
    this._modalTaskTitle.innerText = editable ? 'Edit Task':'Add Task';
  }

  showModal(modal) {
    this.hideAllContentModals();
    modal.addClass('show');
    this._sourceModal.removeClass('out').addClass('in');
    this._overLay.removeClass('out').addClass('in');
  }

  hideModal() {
    this._sourceModal.removeClass('in').addClass('out');
    this._overLay.removeClass('in').addClass('out');
  }

  showEditModal(modal, task) {
    this.showModal(modal);
    this._taskForm.addClass('editable');
    this._taskUserField.value = task.creatorId;
    this._taskDescriptionField.value = task.description;
    this._taskTimeField.value = task.time;
    this._taskDateField.value = task.date;
  }

  removeTaskEditableClass() {
    this._taskForm.removeClass('editable');
  }

  hideAllContentModals() {
    for(let contentModal of Array.from(this._contentModals)) {
      contentModal.removeClass('show');
    }
  }

  setTaskId(id) {
    this._taskForm.attr('data-task-id', id);
  }

  setFilterUserId(id) {
    this._filterUserId = id;
  }
}

export default new UI();
