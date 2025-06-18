const map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -2,
  maxZoom: 4
});

const bounds = [[0, 0], [1000, 1000]];
map.fitBounds(bounds);

const highwaysLayer = new L.FeatureGroup().addTo(map);
const citiesLayer = new L.FeatureGroup().addTo(map);
const regionsLayer = new L.FeatureGroup().addTo(map);

const drawControl = new L.Control.Draw({
  edit: {
    featureGroup: highwaysLayer
  },
  draw: {
    polyline: {
      shapeOptions: {
        color: 'orange',
        weight: 4
      }
    },
    polygon: {
      shapeOptions: {
        color: 'green'
      }
    },
    marker: {
      icon: new L.Icon.Default()
    },
    rectangle: false,
    circle: false,
    circlemarker: false
  }
});
map.addControl(drawControl);

function promptAttributes(type) {
  const name = prompt("Nombre del elemento:");
  const color = prompt("Color (nombre o #hex):", type === 'polyline' ? 'orange' : type === 'polygon' ? 'green' : 'blue');
  return { name, color };
}

map.on('draw:created', function (e) {
  const layer = e.layer;
  const type = e.layerType;
  const attr = promptAttributes(type);

  if (type === 'polyline') {
    layer.setStyle({ color: attr.color });
    layer.bindTooltip(attr.name, { permanent: true, direction: 'center' });
    layer.feature = { properties: { name: attr.name, type: 'autovia', color: attr.color } };
    highwaysLayer.addLayer(layer);
  } else if (type === 'polygon') {
    layer.setStyle({ color: attr.color });
    layer.bindTooltip(attr.name, { permanent: true, direction: 'center' });
    layer.feature = { properties: { name: attr.name, type: 'region', color: attr.color } };
    regionsLayer.addLayer(layer);
  } else if (type === 'marker') {
    layer.bindTooltip(attr.name, { permanent: true, direction: 'top' });
    layer.feature = { properties: { name: attr.name, type: 'ciudad', color: attr.color } };
    citiesLayer.addLayer(layer);
  }
});

function exportData() {
  const data = {
    highways: highwaysLayer.toGeoJSON(),
    regions: regionsLayer.toGeoJSON(),
    cities: citiesLayer.toGeoJSON()
  };
  document.getElementById('output').textContent = JSON.stringify(data, null, 2);
}

function importData() {
  try {
    const input = JSON.parse(document.getElementById('importBox').value);
    L.geoJSON(input.highways, {
      onEachFeature: function (f, l) {
        if (f.properties.name) l.bindTooltip(f.properties.name, { permanent: true, direction: 'center' });
        if (f.properties.color) l.setStyle({ color: f.properties.color });
        highwaysLayer.addLayer(l);
      }
    });
    L.geoJSON(input.regions, {
      onEachFeature: function (f, l) {
        if (f.properties.name) l.bindTooltip(f.properties.name, { permanent: true, direction: 'center' });
        if (f.properties.color) l.setStyle({ color: f.properties.color });
        regionsLayer.addLayer(l);
      }
    });
    L.geoJSON(input.cities, {
      onEachFeature: function (f, l) {
        if (f.properties.name) l.bindTooltip(f.properties.name, { permanent: true, direction: 'top' });
        citiesLayer.addLayer(l);
      }
    });
  } catch (e) {
    alert("Error al importar datos: " + e);
  }
}
