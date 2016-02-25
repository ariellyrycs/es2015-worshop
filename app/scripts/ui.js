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


    /*
     USERS list item
     <li>
     <a href='#' data-user-id="userID">user name</a>
     </li>
     */

    /* users select options in addTask modal
     <option>Select user</option>
     <option value="userID>User Name</option>`;
     */

    /*
     task row
     <tr data-task-id=''>
     <th scope="row">index</th>
     <td><input type="checkbox"></td>
     <td>description</td>
     <td>time</td>
     <td>date</td>
     <td><a href="#" class="btn btn-info btn-xs edit-task">Edit</a></td>
     </tr>
     */

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
