const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

searchForm.addEventListener('submit', (event) => {
  event.preventDefault(); 
  
  const query = searchInput.value;
  
  if (query.trim() !== '') {
    window.location.href = `https://www.google.com/search?q=${query}`;
  }
});