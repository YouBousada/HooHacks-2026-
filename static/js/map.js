// 1. Initialize the map centered on Charlottesville, VA
const map = L.map('map').setView([38.0293, -78.4767], 14);

// 2. Add the "Base Layer" (The actual map tiles)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors © CARTO',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

// 3. Mock Data (This mimics what your teammate's Django backend will eventually send)
const cvilleLocations = [
    { name: "Bodo's Bagels", type: "restaurant", coords: [38.0355, -78.4996], desc: "A UVA staple on the Corner." },
    { name: "Rivanna Trail", type: "trail", coords: [38.0410, -78.4650], desc: "20-mile urban wilderness loop." },
    { name: "acac Fitness", type: "gym", coords: [38.0315, -78.4811], desc: "Premier local fitness center." },
    { name: "Carter Mountain", type: "trail", coords: [37.9918, -78.4687], desc: "Amazing views and apple picking." }
];

let activeMarkers = [];

// 4. Function to render markers based on category
function renderLocations(category) {
    // Clear existing markers first
    activeMarkers.forEach(marker => map.removeLayer(marker));
    activeMarkers = [];

    const listContainer = document.getElementById('location-list');
    listContainer.innerHTML = ''; // Clear the sidebar list

    cvilleLocations.forEach(loc => {
        if (category === 'all' || loc.type === category) {
            // Add marker to the map
            const marker = L.marker(loc.coords)
                .addTo(map)
                .bindPopup(`<b>${loc.name}</b><br>${loc.desc}`);
            
            activeMarkers.push(marker);

            // Add card to the sidebar
            const card = document.createElement('div');
            card.className = 'location-card';
            card.style.padding = "15px";
            card.style.borderBottom = "1px solid #eee";
            card.style.cursor = "pointer";
            card.innerHTML = `<strong>${loc.name}</strong><br><small>${loc.type.toUpperCase()}</small>`;
            
            // Interaction: Zoom to pin when sidebar card is clicked
            card.onclick = () => {
                map.flyTo(loc.coords, 16);
                marker.openPopup();
            };
            
            listContainer.appendChild(card);
        }
    });
}

// 5. Connect the filter function so the HTML buttons can call it
window.filterMap = renderLocations;

// Initial load: Show everything
renderLocations('all');
