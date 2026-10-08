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

async function fetchNASAImage() {
  try {
    const response = await fetch(nasaUrl);
    console.log("hi");
    console.log(response);
    const data = await response.json();
    
    const imgElement = document.getElementById('nasa-pic');
    const titleElement = document.getElementById('nasa-title');

    imgElement.style.display = 'block';

    if (data.media_type === 'image') {
      imgElement.src = data.url; 
      titleElement.textContent = data.title;
    } else {
    
      imgElement.src = 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564';
      titleElement.textContent = 'Space Video Today (Fallback Image)';
    }
  } catch (error) {
    console.error("error could not reach to NASA:", error);
    document.getElementById('nasa-title').textContent = "Failed to load image.";
  }
}

fetchNASAImage();