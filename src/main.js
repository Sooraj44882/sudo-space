
import backupImage from './assets/backup.jpg';

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

if (searchForm && searchInput) {
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const query = searchInput.value.trim();

    if (query) {
      window.location.href =
        `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    }
  });
}

const apiKey = import.meta.env.VITE_NASA_API_KEY;

const nasaUrl =
  `https://science.nasa.gov/wp-json/wp/v2/apod-basic/?api_key=${apiKey}`;

async function fetchNASA() {
  const imgElement = document.getElementById('nasa-pic');
  const titleElement = document.getElementById('nasa-title');
  const vidElement = document.getElementById('nasa-video');

  if (!imgElement || !titleElement || !vidElement) {
    console.error('NASA HTML elements not found.');
    return;
  }

  function showFallback() {
    imgElement.onerror = null;
    imgElement.src = backupImage;
    imgElement.style.display = 'block';
    vidElement.style.display = 'none';
    titleElement.textContent = 'Astronomy Picture of the Day';
  }

  try {
    const response = await fetch(nasaUrl);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || `NASA API returned ${response.status}`
      );
    }

    const apod = Array.isArray(data) ? data[0] : data;

    if (!apod || !apod.title) {
      throw new Error('Unexpected NASA response format.');
    }

    titleElement.textContent = apod.title;

    if (apod.media_type === 'video') {
      imgElement.style.display = 'none';
      vidElement.style.display = 'block';
      vidElement.src = apod.url;
      return;
    }

    const imageUrl =
      apod.hdurl ||
      (apod.url && /\.(jpg|jpeg|png|webp)(\?|$)/i.test(apod.url)
        ? apod.url
        : null);

    if (!imageUrl) {
      console.error('NASA response:', apod);
      throw new Error('No direct image URL found.');
    }

    vidElement.style.display = 'none';
    imgElement.style.display = 'block';

    imgElement.onerror = showFallback;
    imgElement.src = imageUrl;
  } catch (error) {
    console.error('NASA APOD failed:', error);
    showFallback();
  }
}

fetchNASA();

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

let tasks = [];

try {
  tasks = JSON.parse(localStorage.getItem('my_tasks')) || [];

  if (!Array.isArray(tasks)) {
    tasks = [];
  }
} catch {
  tasks = [];
}

function renderTasks() {
  if (!todoList) return;

  todoList.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.textContent = `> ${task}`;

    li.addEventListener('click', () => {
      tasks.splice(index, 1);
      saveAndRender();
    });

    todoList.appendChild(li);
  });
}

function saveAndRender() {
  localStorage.setItem('my_tasks', JSON.stringify(tasks));
  renderTasks();
}

if (todoForm && todoInput && todoList) {
  todoForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const text = todoInput.value.trim();

    if (text) {
      tasks.push(text);
      todoInput.value = '';
      saveAndRender();
    }
  });

  renderTasks();
}
