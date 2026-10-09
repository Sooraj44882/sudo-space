const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

searchForm.addEventListener('submit', (event) => {
  event.preventDefault(); 
  
  const query = searchInput.value;
  
  if (query.trim() !== '') {
    window.location.href = `https://www.google.com/search?q=${query}`;
  }
});

const apiKey = import.meta.env.VITE_NASA_API_KEY;
const nasaUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

async function fetchNASA() {
  
  try {
    const response = await fetch(nasaUrl);

    if (!response.ok) {
      throw new Error(`NASA API returned status ${response.status}`);
    }

    const data = await response.json();
    
    const imgElement = document.getElementById('nasa-pic');
    const titleElement = document.getElementById('nasa-title');
    const vidElement = document.getElementById('nasa-video');

    titleElement.textContent = data.title || 'Astronomy Picture of the Day';

    if (data.media_type === 'video') {
      vidElement.src = data.url;
      vidElement.style.display = 'block';
      imgElement.style.display = 'none';
    } else {
      imgElement.src = data.url;
      imgElement.style.display = 'block';
      vidElement.style.display = 'none';
    }
  } catch (error) {
    console.warn("NASA API unavailable or 500 error using fallback", error);

    imgElement.src = 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564';
    imgElement.style.display = 'block';
    vidElement.style.display = 'none';
    titleElement.textContent = 'Orion Nebula ';
  }
}

fetchNASA();

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

let tasks = JSON.parse(localStorage.getItem('my_tasks')) || [];

function renderTasks() {
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

todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (text !== '') {
    tasks.push(text);
    todoInput.value = '';
    saveAndRender();
  }
});

renderTasks();