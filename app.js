const routes = {
  home: 'modules/home.html',
  artists: 'modules/artists.html',
  schedule: 'modules/schedule.html',
  messaging: 'modules/messaging.html',
  organizers: 'modules/organizers.html',
  admin: 'modules/admin.html'
};

// Simple users and permissions system
const users = {
  'exec1': { role: 'Executive' },
  'john_audio': { role: 'Audio' },
  'crew123': { role: 'Crew' }
};

function checkAccess(role, section) {
  const allowed = {
    Executive: ['home', 'admin', 'organizers', 'messaging', 'schedule', 'artists'],
    Audio: ['home', 'messaging', 'schedule'],
    Crew: ['home', 'messaging']
  };
  return allowed[role]?.includes(section);
}

// Mock: current logged in user (replace with login system later)
let currentUser = 'exec1';

function navigate(route) {
  const userRole = users[currentUser].role;
  if (!checkAccess(userRole, route)) {
    document.getElementById('app-content').innerHTML = `<p>🚫 Access denied for ${userRole} to ${route}.</p>`;
    return;
  }

  fetch(routes[route])
    .then(res => res.text())
    .then(html => {
      document.getElementById('app-content').innerHTML = html;

      // Module-specific hooks
      if (route === 'artists') initArtistsModule();
      if (route === 'organizers') initPitchBot?.();
      if (route === 'messaging') initMessaging?.();
      if (route === 'schedule') initSchedule?.();
    });
}

// Artists module logic
function initArtistsModule() {
  const form = document.getElementById('artistForm');
  const list = document.getElementById('artistList');

  if (!form) return;

  let artists = JSON.parse(localStorage.getItem('artists')) || [];

  function renderList() {
    list.innerHTML = '';
    artists.forEach(a => {
      const li = document.createElement('li');
      li.textContent = `${a.name} (${a.genre})`;
      list.appendChild(li);
    });
  }

  form.onsubmit = e => {
    e.preventDefault();
    const name = document.getElementById('artistName').value;
    const genre = document.getElementById('artistGenre').value;
    artists.push({ name, genre });
    localStorage.setItem('artists', JSON.stringify(artists));
    renderList();
    form.reset();
  };

  renderList();
}

// Service Worker registration + initial page load
window.addEventListener('load', () => {
  navigate('home');

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
  }
});
