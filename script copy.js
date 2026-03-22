let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  // Centers on Charlottesville (near UVA/Rotunda)
  map = new Map(document.getElementById("map"), {
    center: { lat: 38.0336, lng: -78.5080 },
    zoom: 14,
    disableDefaultUI: false, // Keeps zoom controls visible
  });
}

// Helper function you can use to add pins from your sidebar
function addPlaceMarker(lat, lng, name) {
    new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        title: name
    });
}
