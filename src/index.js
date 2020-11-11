

// List factory
const List = (title = "New project") => {

  const list = [];
  // Retrieve current list title
  const getTitle = () => title;
  // Modifiy list title
  const setTitle = (newTitle) => title = newTitle;

  const addTask = (task) => list.push(task);
  // Remove specified item from array (also returns the item; can be added to completed list)
  const removeTask = (id) => {
    // Find task; undefined = not found
    const task = getTask(id);
    // Get its index position [consolidate code later]
    const index = list.indexOf(task);

    list.splice(index, 1);
  }

  // Search list for specified task using its id property 
  const getTask = (id) => list.find(task => task.getId() === id);

  // Retrieve the array without being able to access items
  const getTasks = () => list;

  // Clear array of all items while preventing memory leaks
  const clearTasks = () => list.length = 0;

  return {
    getTitle,
    setTitle,
    addTask,
    removeTask,
    getTask,
    getTasks,
    clearTasks
  }
}





const backgroundImages = (() => {
  const images = [
    '/home/tristan/the_odin_project/todo-list/src/images/bridge.jpeg',
    '/home/tristan/the_odin_project/todo-list/src/images/autum-tree.jpeg',
    '/home/tristan/the_odin_project/todo-list/src/images/winter.jpg'
  ]

  let index = 0;

  function buildImage() {
    document.querySelector('#main:before').style.backgroundImage = 'url(' + images[1] + ')';
  }

  function changeImage() {
    index++;
    if (index >= images.length) index = 0;
    document.querySelector('#main:before').style.backgroundImage = 'url(' + images[index] + ')';
  }

  return { buildImage, changeImage }
})();


// Determine current date
const timeModule = ((dayInput = undefined) => {


  const newDay = new Date();

  // Parameter should contain a date object
  if (typeof (dayInput) === "object") {
    newDay = dayInput;
  }

  const dd = String(newDay.getDate()).padStart(2, '0');
  const mm = String(newDay.getMonth()).padStart(2, '0'); //January is 0!
  const yyyy = newDay.getFullYear();

  const months = [
    "Janurary", "Feburary", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ]

  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"];


  // Find current month as String
  const _getCurrentMonth = function (day = newDay) {

    const index = day.getMonth();

    return months[index];
  };


  // Find current weekday as String
  const _getCurrentWeekday = function (day = newDay) {

    const index = day.getDay();

    return weekdays[index];
  };


  // Format example: "Saturday, November 07"
  const dateWithWeekday = function (date = newDay, dd = newDay.getDate()) {

    return _getCurrentWeekday(date) + ', ' + _getCurrentMonth(date) + ' ' + dd;
  }


  // Format date: 2020/11/03
  const defaultDate = () => yyyy + '/' + mm + '/' + dd;

  const createNewDate = function (date) {
    // Create new date object
    const newDate = new Date();
    let newDateArr = null;

    // Create date array based on separators in parameter
    if (date.includes("-")) {
      newDateArr = date.split("-");
    }
    else {
      newDateArr = date.split("/");
    }
    // Year
    const newYear = newDateArr[0];
    newDate.setFullYear(Number(newYear));
    // Month
    const newMonth = newDateArr[1];
    newDate.setMonth(Number(newMonth))
    // Day
    const newDay = newDateArr[2];
    newDate.setDate(Number(newDay));

    // Return newly created date object
    return newDate;

  }

  return { createNewDate, defaultDate, dateWithWeekday }
})();


// ToDo factory
const Task = (
  // Set default parameters
  title, // mandatory
  id,
  dueDate = timeModule.defaultDate(), // optional, default's to current date
  note = "",
  priority = false,
  completed = false,
) => {

  const _taskId = id;

  const getTitle = () => title;

  const setTitle = (newTitle) => title = newTitle;

  const getId = () => _taskId;

  const getDueDate = () => dueDate;

  // Retrieve date and format it [EX: Tuesday, November 10];
  const _formatDueDate = () => timeModule.dateWithWeekday(dueDate);

  // Create new date object from string parameter
  const setDueDate = (newDueDate) => dueDate = timeModule.createNewDate(newDueDate);

  // Set initial date
  setDueDate(dueDate);

  const setNote = (newNote) => note = newNote;

  const getNote = () => note;

  const setPriority = (level) => priority = level;

  const getPriority = () => priority;

  const getCompleted = () => completed;

  const setCompleted = (value) => completed = value;

  const info = () => `${getTitle()} due on: ${_formatDueDate()} \nNotes: ${getNote()}`;

  return {
    getTitle,
    setTitle,
    getId,
    getDueDate,
    setDueDate,
    info,
    setNote,
    getNote,
    setPriority,
    getPriority,
    getCompleted,
    setCompleted
  }
}


const dailyTasks = (() => {

  const daily = List("Daily Tasks");
  const completed = List("Completed");
  const currentDate = timeModule.dateWithWeekday();

  // Will act as id for each task object
  let count = 0;

  // Cache DOM
  const listModule = document.querySelector('div.list-container');
  const defaultList = listModule.querySelector('ul.list');
  const completedList = listModule.querySelector('ul.list-completed')
  const listDate = listModule.querySelector('#list-date');

  // Bind

  // Set date to DOM
  listDate.textContent = currentDate;

  function newTask(
    title,
    dueDate = timeModule.defaultDate(),
    note = "",
    priority = false, 
    completed = false ) {

    // GET VALUES FROM DOM

    // Create new task from fields and add it to daily list
    daily.addTask(Task(title, count, dueDate, note, priority, completed));

    count++;

    _render();
  }

  function toggleTask(id) {

    let task = null;

    if (typeof (daily.getTask(id)) !== "undefined") {
      task = daily.getTask(id);
    }
    else {
      task = completed.getTask(id);
    }

    // If completed = true add task to completed and remove from default
    // Updating completed will count as an event that is apart of the "subscribers"
    // Any task in completed list will receive new CSS styling

    if (task.getCompleted() == false) {
      // If false; toggle to true
      task.setCompleted(true);

      daily.removeTask(id);

      completed.addTask(task);
    }
    else if (task.getCompleted() == true) {
      // If true; toggle to false
      task.setCompleted(false);
      completed.removeTask(id);

      daily.addTask(task);
    }
    else {
      console.log("Whoops -- you did something wrong...")
    }

    // Render changes 
    _render();
  }

  function priorityToggle(id) {
    let task = null;

    if (typeof (daily.getTask(id)) !== "undefined") {
      task = daily.getTask(id);
    }
    else {
      task = completed.getTask(id);
    }

    if (task.getPriority() == false) {
      // If false; toggle to true
      task.setPriority(true);
    }
    else if (task.getPriority() == true) {
      // If true; toggle to false
      task.setPriority(false);
    }

    _render();
  }


  function _render() {
    // Return list of tasks and display each task's info
    console.log("\nDAILY LIST:")
    // create function to add
    daily.getTasks().forEach(task => {
      console.log(task.info());
      
      if (!defaultList.innerHTML.includes(task.getId())) {
        // Check task's priority; true = checked, false = unchecked
        const isChecked = (task.getPriority() == true) ? "checked" : "unchecked";

        defaultList.innerHTML += 
        `<li data-id='${task.getId()}'>
            <span class="task-checkbox">
                <label class="container">
                  <input type="checkbox">
                  <span class="checkmark"></span>
                  </label>
                </span>${task.getTitle()}<i class="fa fa-star priority ${isChecked}" aria-hidden="true"></i></li>`
      }
    });

    if (completed.getTasks().length > 0) {
      console.log("\nCOMPLETED:");
      completed.getTasks().forEach(task => {
        console.log(task.info());
        // Add to DOM
        if (!completedList.innerHTML.includes(task.getId())) {
          // Check task's priority; true = checked, false = unchecked
          const isChecked = (task.getPriority() == true) ? "checked" : "unchecked";

          completedList.innerHTML += 
          `<li data-id='${task.getId()}'>
              <span class="task-checkbox">
                  <label class="container">
                    <input type="checkbox" checked>
                    <span class="checkmark"></span>
                    </label>
                  </span>${task.getTitle()}<i class="fa fa-star priority ${isChecked}" aria-hidden="true"></i></li>`
        }
      });
    }
  }


  return { newTask, toggleTask, priorityToggle }
})();


// Add task items as demos
dailyTasks.newTask("Study", undefined, "With Landyn", true, false);
dailyTasks.newTask("Workout", undefined, "Leg day with Kiley", true, false);
dailyTasks.newTask("Flex on em", undefined, undefined, false, false);
dailyTasks.newTask("Call Mom", undefined, undefined, true, false);
dailyTasks.newTask("Work at 9am", undefined, "Made $40", true, false);
dailyTasks.newTask("Text Suglo", undefined, undefined, false, false);
dailyTasks.newTask("Hit Superstore", undefined, "Need milk, bread, beef", true, false);
dailyTasks.newTask("Shopping", undefined, "Finish christmas shopping", false, false);

// TASKS NOT BEING DELETED FROM REGULAR LIST (DOM ISSUE)
dailyTasks.toggleTask(3);
dailyTasks.toggleTask(4);
dailyTasks.toggleTask(5);


// Simulate a user spam toggling a task

