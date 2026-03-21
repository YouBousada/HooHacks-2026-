let map;
let geocoder;
let searchMarker;

let tempMarker = null;
let formInfoWindow = null;
let isCreatingPost = false;

let posts = [];
let postMarkers = [];

function lockMapInteraction() {
  map.setOptions({
    draggable: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    gestureHandling: "none",
    keyboardShortcuts: false
  });
}

function unlockMapInteraction() {
  map.setOptions({
    draggable: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    gestureHandling: "greedy",
    keyboardShortcuts: false
  });
}

async function initMap() {
  const { Map, InfoWindow } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: 38.0336, lng: -78.5080 },
    zoom: 14,
    disableDefaultUI: true,
    gestureHandling: "greedy",
    keyboardShortcuts: false,
    styles: [
      {
        featureType: "poi",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "transit",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "road",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }]
      }
    ]
  });

  geocoder = new google.maps.Geocoder();
  formInfoWindow = new InfoWindow();

  setupSearch();
  setupMapClick();
  renderPosts();

  // Helpful for debugging in browser console
  window.posts = posts;
}

function setupSearch() {
  const input = document.getElementById("address-input");
  const button = document.getElementById("search-button");

  if (!input || !button) return;

  async function searchAddress() {
    const address = input.value.trim();
    if (!address) return;

    try {
      const response = await geocoder.geocode({ address });

      if (!response.results || response.results.length === 0) {
        alert("Address not found.");
        return;
      }

      const result = response.results[0];
      const location = result.geometry.location;

      if (result.geometry.viewport) {
        map.fitBounds(result.geometry.viewport);
      } else {
        map.setCenter(location);
        map.setZoom(16);
      }

      if (searchMarker) {
        searchMarker.setMap(null);
      }

      searchMarker = new google.maps.Marker({
        map,
        position: location
      });
    } catch (error) {
      console.error("Geocoding failed:", error);
      alert("Could not find that address.");
    }
  }

  button.addEventListener("click", searchAddress);

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      searchAddress();
    }
  });
}

function setupMapClick() {
  map.addListener("click", (event) => {
    if (isCreatingPost) {
      return;
    }

    const clickedLatLng = event.latLng;

    map.panTo(clickedLatLng);

    if (map.getZoom() < 17) {
      map.setZoom(17);
    }

    tempMarker = new google.maps.Marker({
      map,
      position: clickedLatLng
    });

    isCreatingPost = true;
    lockMapInteraction();

    openPostForm(clickedLatLng);
  });
}

function openPostForm(latLngObject) {
  const lat = latLngObject.lat();
  const lng = latLngObject.lng();

  const content = `
    <div style="min-width: 220px; padding: 4px 2px;">
      <div style="font-weight: 600; margin-bottom: 8px;">Create post</div>

      <div style="font-size: 12px; margin-bottom: 8px; color: #555;">
        Lat: ${lat.toFixed(6)}<br>
        Lng: ${lng.toFixed(6)}
      </div>

      <input
        id="post-title-input"
        type="text"
        placeholder="Enter a title"
        style="
          width: 100%;
          box-sizing: border-box;
          padding: 8px;
          margin-bottom: 10px;
          font-size: 14px;
        "
      />

      <div style="display: flex; gap: 8px; justify-content: flex-end;">
        <button
          id="cancel-post-button"
          style="
            padding: 7px 10px;
            border: 1px solid #ccc;
            background: white;
            cursor: pointer;
          "
        >
          Cancel
        </button>

        <button
          id="save-post-button"
          style="
            padding: 7px 10px;
            border: none;
            background: #1a73e8;
            color: white;
            cursor: pointer;
          "
        >
          Save
        </button>
      </div>
    </div>
  `;

  formInfoWindow.setContent(content);
  formInfoWindow.setPosition(latLngObject);
  formInfoWindow.open({
    map,
    anchor: tempMarker
  });

  google.maps.event.addListenerOnce(formInfoWindow, "domready", () => {
    const titleInput = document.getElementById("post-title-input");
    const saveButton = document.getElementById("save-post-button");
    const cancelButton = document.getElementById("cancel-post-button");

    if (titleInput) {
      titleInput.focus();

      titleInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          handleSavePost(latLngObject);
        }
      });
    }

    if (saveButton) {
      saveButton.addEventListener("click", () => {
        handleSavePost(latLngObject);
      });
    }

    if (cancelButton) {
      cancelButton.addEventListener("click", handleCancelPost);
    }
  });

  google.maps.event.addListenerOnce(formInfoWindow, "closeclick", () => {
    if (isCreatingPost) {
      handleCancelPost();
    }
  });
}

function buildPostData(latLngObject) {
  const titleInput = document.getElementById("post-title-input");
  const title = titleInput ? titleInput.value.trim() : "";

  return {
    id: Date.now(),
    title,
    lat: latLngObject.lat(),
    lng: latLngObject.lng()
  };
}

function handleSavePost(latLngObject) {
  const post = buildPostData(latLngObject);

  if (!post.title) {
    alert("Please enter a title.");
    return;
  }

  posts.push(post);

  cleanupPostCreationUI();
  renderPosts();

  console.log("Current posts:", posts);
}

function handleCancelPost() {
  cleanupPostCreationUI();
}

function cleanupPostCreationUI() {
  if (tempMarker) {
    tempMarker.setMap(null);
    tempMarker = null;
  }

  formInfoWindow.close();
  isCreatingPost = false;
  unlockMapInteraction();
}

function renderPosts() {
  clearPostMarkers();

  posts.forEach((post) => {
    const marker = new google.maps.Marker({
      map,
      position: { lat: post.lat, lng: post.lng },
      title: post.title
    });

    const postInfoWindow = new google.maps.InfoWindow({
      content: `
        <div style="min-width: 160px;">
          <div style="font-weight: 600; margin-bottom: 4px;">
            ${escapeHtml(post.title)}
          </div>
          <div style="font-size: 12px; color: #555;">
            Lat: ${post.lat.toFixed(6)}<br>
            Lng: ${post.lng.toFixed(6)}
          </div>
        </div>
      `
    });

    marker.addListener("click", () => {
      postInfoWindow.open({
        map,
        anchor: marker
      });
    });

    postMarkers.push(marker);
  });
}

function clearPostMarkers() {
  postMarkers.forEach((marker) => marker.setMap(null));
  postMarkers = [];
}

function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

initMap();