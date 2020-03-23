class TrafficLight {
  constructor(id, lat, lng, timeout = 2000) {
    this.id = id;
    this.latitude = lat;
    this.longitude = lng;

    this.timeout = timeout;
    this.status = "red";

    this.show = map => {
      fill(this.status);
      let coords = map.latLngToPixel(this.latitude, this.longitude);
      this.x = coords.x;
      this.y = coords.y;
      rect(coords.x, coords.y, 5, 5);
    };

    this.toggle = () => {
      if (this.status == "red") this.status = "green";
      else this.status = "red";
    };

    setInterval(this.toggle, this.timeout);
  }
}
