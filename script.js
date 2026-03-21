let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: 38.0336, lng: -78.5080 },
    zoom: 14,
  });
}

initMap();