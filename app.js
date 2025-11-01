const eventsEl = document.getElementById('events');
const countEl = document.getElementById('count');
let events = JSON.parse(localStorage.getItem('events') || '[]');

// Default sample events if none exist
if (events.length === 0) {
  events = [
    { id: genId(), name: 'AI Workshop', date: '2025-11-15', location: 'Hall A' },
    { id: genId(), name: 'Tech Fest', date: '2025-12-05', location: 'Main Ground' },
  ];
  save();
}

function genId() {
  return 'ev_' + Math.random().toString(36).slice(2, 9);
}

function save() {
  localStorage.setItem('events', JSON.stringify(events));
}

function render(filter = '', date = '', sort = 'asc') {
  let list = events.filter(e =>
    e.name.toLowerCase().includes(filter.toLowerCase()) ||
    e.location.toLowerCase().includes(filter.toLowerCase())
  );

  if (date) list = list.filter(e => e.date === date);

  list.sort((a, b) => sort === 'asc'
    ? a.date.localeCompare(b.date)
    : b.date.localeCompare(a.date)
  );

  eventsEl.innerHTML = list.map(e => `
    <div class='card'>
      <div class='date-pill'>${e.date}</div>
      <h4 class='event-title'>${e.name}</h4>
      <p class='event-location'>${e.location}</p>
      <button onclick="removeEvent('${e.id}')" class='btn' style='padding:6px;'>Remove</button>
    </div>
  `).join('');

  countEl.textContent = list.length;
}

function removeEvent(id) {
  if (!confirm('Do you want to remove this event?')) return;
  events = events.filter(e => e.id !== id);
  save();
  render();
}

const addBtn = document.getElementById('addBtn');
addBtn.onclick = () => {
  const name = document.getElementById('evName').value.trim();
  const date = document.getElementById('evDate').value;
  const location = document.getElementById('evLocation').value.trim();

  if (!name || !date) {
    alert('Please enter both event name and date.');
    return;
  }

  events.push({ id: genId(), name, date, location });
  save();
  render();

  document.getElementById('evName').value = '';
  document.getElementById('evDate').value = '';
  document.getElementById('evLocation').value = '';
};

// Filter controls
const searchInput = document.getElementById('searchInput');
const filterDate = document.getElementById('filterDate');
const sortSelect = document.getElementById('sortSelect');

searchInput.addEventListener('input', debounce(applyFilters, 200));
filterDate.addEventListener('change', applyFilters);
sortSelect.addEventListener('change', applyFilters);

function applyFilters() {
  render(searchInput.value, filterDate.value, sortSelect.value);
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

render();
