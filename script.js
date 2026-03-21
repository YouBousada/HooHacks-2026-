let map;
let geocoder;
let searchMarker;

let tempMarker = null;
let formInfoWindow = null;
let isCreatingPost = false;

const savedPosts = [];

async function initMap() {
  const { Map, InfoWindow } = await google.maps.importLibrary("maps");

  // Centers on Charlottesville (near UVA/Rotunda)
  map = new Map(document.getElementById("map"), {
    center: { lat: 38.0336, lng: -78.5080 },
    zoom: 14,
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
