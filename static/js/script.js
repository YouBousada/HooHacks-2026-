let map;

async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    
    map = new Map(document.getElementById("map"), {
        center: { lat: 38.0336, lng: -78.5080 }, // Cville Center
        zoom: 14,
    });
    console.log("Map Loaded!");
}

// Function to handle the budget slider in the sidebar
function updateBudget(val) {
    const label = document.getElementById('priceLabel');
    if (label) label.innerText = val;
    console.log("Current budget filter: $" + val);
}