const map = L.map('map').setView([0, 0], 2);

// Puedes cambiar este fondo a uno tuyo más adelante
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19
}).addTo(map);

// Inicializamos la capa de elementos dibujados
const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// Controles de dibujo
const drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems
  },
  draw: {
    polyline: true,
    polygon: true,
    rectangle: false,
    circle: false,
    marker: true,
    circlemarker: false
  }
});
map.addControl(drawControl);

// Manejo de eventos de dibujo
map.on('draw:created', function (e) {
  drawnItems.addLayer(e.layer);
});

function exportData() {
  const data = drawnItems.toGeoJSON();
  const output = document.getElementById('output');
  output.textContent = JSON.stringify(data, null, 2);
}
