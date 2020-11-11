// Events (pubSub/Mediator) pattern

// EXAMPLE: 
// 1. events.on('peopleChanged', someHandlerFunction)
// 2. events.on('peopleChanged', someOtherHandler)
// 3. events.emit('peopleChanged', 3);

const events = {
  // No events by default
  events: {
    // EXAMPLE: Event added to list. peopleChanged = event
    // peopleChanged: [someHandlerFunction, someOtherHandler]
  },
  // subscribe === on
  on: function (eventName, fn) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn); // add function to subscribers list
  },
  // unsubscribe === off
  off: function (eventName, fn) {
    if (this.events[eventName]) {
      for (var i = 0; i < this.events[eventName].length; i++) {
        if (this.events[eventName][i] === fn) {
          this.events[eventName].splice(i, 1);
          break;
        }
      };
    }
  },
  // publish === emit
  // EXAMPLE: events.emit('peopleChanged', 1)
  emit: function (eventName, data) {
    if (this.events[eventName]) {
      // Event exists, loop through array until item found
      this.events[eventName].forEach(function (fn) {
        // EXAMPLE: where fn = handler functions in list; data = parameter of handler function
        // peopleChanged: [someHandlerFunction(data), someOtherHandler(data)]
        fn(data);
      });
    }
  }
};


const statsModule = (function() {
  let people = 0;

  //cache DOM
  const stats = document.getElementById('statsModule');
  const template = stats.querySelector('#stats-template');

  // event.on === Subscribe 
  // On a peopleChanged event, call setPeople()
  events.on('peopleChanged', setPeople);

  _render();

  function _render() {
    template.innerText = people;
  }

  function setPeople(newPeople) {
    people = newPeople;
    _render();
  }

  function destroy() {
    // Remove stats module from DOM
    stats.parentNode.removeChild(stats);
    events.off('peopleChanged', setPeople);

  }

})();


const people = (() => {

  const people = ["Tristan", "Will"];

  // Cache DOM
  const el = document.getElementById('peopleModule');
  const peopleBox = el.querySelector('#people-box');
  const addButton = el.querySelector('#addPerson');
  const input = el.querySelector('input');

  // Bind events
  addButton.addEventListener('click', addPerson);

  _render();
  // ONLY FUNCTION THAT SHOULD MODIFY DOM
  function _render() {
    people.forEach(person => {
      // If item doesn't exist, render to DOM
      if (!peopleBox.innerHTML.includes(person)) {
        peopleBox.innerHTML += `<p class='person'>${person} <span class='delete' 
          data-index='${people.indexOf(person)}'>X</span></p>`;
      }
    });

    // New event 'peopleChanged', with number of people changed as parameter
    // emit === publish
    events.emit('peopleChanged', people.length);
  }

  function addPerson(value) {
    // If string is passed, name = string; else  name = input.value [Can use addPerson() to manually enter a name]
    const name = (typeof value === "string") ? value : input.value;
    people.push(name);
    _render();
    input.value = ''; // reset input field
  }

  function deletePerson(event) {
    const i = event;
    people.splice(i, 1);
    _render();
  }

  return {
    addPerson,
    deletePerson
  }
})();


export default events;