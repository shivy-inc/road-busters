let map;
let canvas;

let ahmedabad_boundary;
let traffic_lights_data,
  traffic_lights = [],
  cars = [];
const mappa = new Mappa("Leaflet");

// Map configuration
const options = {
  lat: 23.0225,
  lng: 72.5714,
  zoom: 15,
  style: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
};

function preload() {
  ahmedabad_boundary = loadJSON("./data/ahmedabad.geojson");
  traffic_lights_data = loadTable(
    "./data/traffic_light_huge.csv",
    "csv",
    "header"
  );
}

function setup() {
  frameRate(30);
  canvas = createCanvas(innerWidth, innerHeight);

  // Create a tile map with the options declared
  map = mappa.tileMap(options);
  map.overlay(canvas);
  map.onChange(() => {
    L.geoJSON(ahmedabad_boundary, {
      style: {
        color: "green",
        fill: false
      }
    }).addTo(map.map);
  });

  traffic_lights_data.rows.map(e => {
    let t = new TrafficLight(
      e.obj.id,
      e.obj.latitude,
      e.obj.longitude,
      Math.random() * 13000 + 2000
    );
    traffic_lights.push(t);
  });
  delete traffic_lights_data;
}

// async function mousePressed() {
//   const coords = map.pixelToLatLng(mouseX, mouseY);
//   let c = new Car(coords, map);
//   c.findRoute().then(r => {
//     cars.push(c);
//   });
// }

function draw() {
  // Clear the previous canvas on every frame
  clear();

  // Logic to show traffic lights
  for (let i = 0; i < traffic_lights.length; i++) {
    traffic_lights[i].show(map);
  }

  // Logic to display vehicles
  for (let i = cars.length - 1; i >= 0; i--) {
    cars[i].show();
    cars[i].run(traffic_lights);
    if (cars[i].valid == false) {
      cars.splice(i, 1);
    }
  }
}
