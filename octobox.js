// content_script

// TODO support github enterprise
// TODO support self-hosted octobox instances

function isActionablePage() {
  // check if loaded on an individual issue or pull request page
  //   *owner*/*name*/issues/*number*
  //   *owner*/*name*/pull/*number*

  var parts = window.location.pathname.split('/');
  return parts.length > 4 && ['issues', 'pull'].includes(parts[3])
}

function activate() {
  if(isActionablePage()){
    console.log('Octobox: Activate!!!')
    authenticate()
    lookup()
  }
}

function authenticate() {
  // TODO handle failure properly
  // TODO store token somewhere
  fetch('https://octobox.io/users/profile.json')
   .then(resp => resp.json())
   .then( json => console.log('Octobox:',json))
   .catch( error => console.error(error))
}

function markAsRead(notification) {
  if(!notification.unread){ return }
  fetch('https://octobox.io/notifications/mark_read_selected.json?id='+notification.id, {
    method: "POST",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Octobox-API': 'true'
      }
    })
    .then( resp => console.log('markAsRead', resp))
    .catch( error => console.error(error))
}

function lookup() {
  // TODO store current
  fetch('https://octobox.io/notifications/lookup?url='+window.location)
   .then(resp => resp.json())
   .then( json => render(json))
   .catch( error => console.error(error))
}

function toggleStar(notification) {
  // TODO allow starring even if notification is null
  console.log('star!')

  fetch('https://octobox.io/notifications/'+notification.id+'/star', {
    method: "POST",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Octobox-API': 'true'
      }
    })
    .then( resp => console.log('star', resp)) // Update star button
    .catch( error => console.error('star error', error))
}

function archive(notification) {
  console.log('archive!')
  fetch('https://octobox.io/notifications/archive_selected.json?id='+notification.id, {
    method: "POST",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Octobox-API': 'true'
      }
    })
    .then( resp => console.log('archive', resp)) // TODO update archive button
    .catch( error => console.error(error))
}

function unarchive(notification) {
  fetch('https://octobox.io/notifications/archive_selected.json?value=false&id='+notification.id, {
    method: "POST",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Octobox-API': 'true'
      }
    })
    .then( resp => console.log('unarchive', resp)) // TODO update archive button
    .catch( error => console.error(error))
}

function mute(notification) {
  // TODO octobox.io doesn't currently know if you're muted or not
  console.log('mute!')
  fetch('https://octobox.io/notifications/mute_selected.json?id='+notification.id, {
    method: "POST",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Octobox-API': 'true'
      }
    })
    .then( resp => console.log('mute', resp)) // TODO update mute button
    .catch( error => console.error(error))
}

function deleteNotification(notification) {
  console.log('delete!')
  fetch('https://octobox.io/notifications/delete_selected.json?id='+notification.id, {
    method: "POST",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Octobox-API': 'true'
      }
    })
    .then( resp => console.log('delete', resp)) // TODO update mute button
    .catch( error => console.error(error))
}

function next(notification) {
  // TODO how will this work?
}

function previous(notification) {
  // TODO how will this work?
}

function render(notification) {
  console.log('Rendering notification', notification)

  var octoboxRoot = document.getElementById('octobox-root');

  // TODO update onclicks with new notification id

  if(!octoboxRoot){
    // create it
    document.body.style.margin = "0 0 30px 0";
    var octoboxRoot = document.createElement("div");
    octoboxRoot.setAttribute("id", "octobox-root");
    document.body.appendChild(octoboxRoot);
    octoboxRoot.classList.add("octobox")

    var prevBtn = document.createElement("div")
    prevBtn.innerText = 'Previous'
    prevBtn.classList.add("btn")
    prevBtn.classList.add("mr-6")
    prevBtn.setAttribute("id", "octobox-prev");
    prevBtn.onclick = function(){ previous(notification) }
    octoboxRoot.appendChild(prevBtn)

    var starBtn = document.createElement("div")
    starBtn.innerText = 'Star'
    starBtn.classList.add("btn")
    starBtn.classList.add("mx-1")
    starBtn.classList.add("ml-6")
    starBtn.setAttribute("id", "octobox-star");
    starBtn.onclick = function(){ star(notification) }
    octoboxRoot.appendChild(starBtn)

    var archiveBtn = document.createElement("div")
    archiveBtn.innerText = 'Archive'
    archiveBtn.classList.add("btn")
    archiveBtn.classList.add("mx-1")
    archiveBtn.setAttribute("id", "octobox-archive");
    archiveBtn.setAttribute("aria-disabled", "true");
    archiveBtn.onclick = function(){ archive(notification) }
    octoboxRoot.appendChild(archiveBtn)

    var muteBtn = document.createElement("div")
    muteBtn.innerText = 'Mute'
    muteBtn.classList.add("btn")
    muteBtn.classList.add("mx-1")
    muteBtn.setAttribute("id", "octobox-mute");
    muteBtn.setAttribute("aria-disabled", "true");
    muteBtn.onclick = function(){ mute(notification) }
    octoboxRoot.appendChild(muteBtn)

    var deleteBtn = document.createElement("div")
    deleteBtn.innerText = 'Delete'
    deleteBtn.classList.add("btn")
    deleteBtn.classList.add("mx-1")
    deleteBtn.classList.add("mr-6")
    deleteBtn.setAttribute("id", "octobox-delete");
    deleteBtn.setAttribute("aria-disabled", "true");
    deleteBtn.onclick = function(){ deleteNotification(notification) }
    octoboxRoot.appendChild(deleteBtn)

    var nextBtn = document.createElement("div")
    nextBtn.innerText = 'Next'
    nextBtn.classList.add("btn")
    nextBtn.classList.add("ml-6")
    nextBtn.setAttribute("id", "octobox-next");
    nextBtn.onclick = function(){ next(notification) }
    octoboxRoot.appendChild(nextBtn)
  }

  if(notification.id){
    octoboxRoot.setAttribute('data-id', notification.id);

    // enable buttons
    // TODO buttons should have onclicks when enabled
    document.getElementById('octobox-delete').setAttribute("aria-disabled", "false");
    document.getElementById('octobox-mute').setAttribute("aria-disabled", "false");
    document.getElementById('octobox-archive').setAttribute("aria-disabled", "false");

    if(notification.starred){
      document.getElementById('octobox-star').innerText = 'Unstar'
    }

    if(notification.archived){
      document.getElementById('octobox-archive').innerText = 'Unarchive'
      // TODO switch onclick function to unarchive
      document.getElementById('octobox-archive').onclick = function(){ unarchive(notification) }
    }

    markAsRead(notification)
  }
}

// load on first page load
activate()

// load again after a pjax load
document.addEventListener('pjax:end', () => {
  activate()
});
