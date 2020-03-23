const UP = 1;
const DOWN = -1;

function getRandomDestination(map) {
  bounds = map.getBounds();
  var southWest = bounds.getSouthWest();
  var northEast = bounds.getNorthEast();
  var lngSpan = northEast.lng - southWest.lng;
  var latSpan = northEast.lat - southWest.lat;

  return {
    lat: southWest.lat + latSpan * Math.random(),
    lng: southWest.lng + lngSpan * Math.random()
  };
}

async function calculateRoute(source, destination) {
  const URL =
    "/route/" +
    source.lat +
    "," +
    source.lng +
    "," +
    destination.lat +
    "," +
    destination.lng;

  const response = await fetch(URL);
  if (response.status == 200) return await response.json();
  return [];
}

class Car {
  constructor(source, map) {
    this.source = source;
    this.destination = getRandomDestination(map.map);
    this.map = map;
    this.pos = map.latLngToPixel(this.source);

    this.pos_index = 0;
    this.direction = UP;
    this.engine = 1;
    this.traffic_light_distance = 10;
    this.route = [];

    this.findRoute = async () => {
      this.route = await calculateRoute(this.source, this.destination);
      this.valid = true;
    };

    this.show = () => {
      fill("red");
      ellipse(this.pos.x, this.pos.y, 5, 5);
    };

    this.run = traffic_lights => {
      if (this.engine) {
        if (this.pos_index > this.route.length - 2 || this.pos_index < 0) {
          this.direction = this.direction * -1;
          if (this.pos_index < 0) this.pos_index = 0;
        }

        const new_coords = this.route[this.pos_index];
        try {
          const new_pos = this.map.latLngToPixel(new_coords);
          this.pos = new_pos;
          this.pos_index += this.direction;
          for (let t in traffic_lights) {
            const tl = traffic_lights[t];
            if (tl.status == "red") {
              const d = dist(this.pos.x, this.pos.y, tl.x, tl.y);

              if (d < this.traffic_light_distance) {
                this.engine = 0;
              }
            }
          }
        } catch (e) {
          this.valid = false;
        }
      }
    };
  }
}
