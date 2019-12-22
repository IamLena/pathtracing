class Ray3 {
  constructor (origin, direction, color = [255, 255, 255]) {
    this.origin = origin
    this.direction = direction  // must be normalized
    this.color = color
  }
}
