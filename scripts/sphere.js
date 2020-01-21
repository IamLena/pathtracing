function put(t, ray) {
  return ray.origin.plus(ray.direction.scaledBy(t))
}

class Sphere {
  constructor (center, radius, material) {
    this.center = center
    this.radius = radius
    this.material = material
  }
  intersectionDistance (ray) {
    const op = this.center.minus(ray.origin);
    const b = op.dot(ray.direction);
    const det = b * b - op.dot(op) + this.radius * this.radius;
    let dist = Infinity, normal, point;

    if (det < 0) return {dist, point, normal};
    const detRoot = Math.sqrt(det);
    const t1 = b - detRoot;
    if (t1 > 0) {
      dist = t1
      point = put(t1, ray)
      normal = point.minus(this.center).normalized
      return {dist, point, normal};
    }
    const t2 = b + detRoot;
    if (t2 > 0) {
      dist = t2
      point = put(t2, ray)
      normal = point.minus(this.center).normalized
      return {dist, point, normal};
    }
    return {dist, point, normal};
  }
}
class Cylinder {
  constructor(position, radius, width) {
    this.center = position
    this.radius = radius
    this.width = width
  }

  intersectionDistance(ray) {
    let point
    let normal
    let circlecenter
    let dist = Infinity
    let BIAS = 0.000001

    let dx = ray.direction.x
    let dy = ray.direction.y
    let koefa = dx * dx + dy * dy

    let ox = ray.origin.x
    let oy = ray.origin.y
    let cx = this.center.x
    let cy = this.center.y

    let koefb = 2 * (ox * dx - dx * cx + oy * dy - dy * cy)

    let koefc = cx * cx + ox * ox + cy * cy + oy * oy - 2 * ox * cx - 2 * oy *cy - this.radius * this.radius

    let dir = koefb * koefb - 4 * koefa * koefc
    if (dir < 0) {return {dist, point, normal}}
    let rootdir = Math.sqrt(dir)
    let t1 = (-koefb - rootdir) / 2 / koefa
    let t2 = (-koefb + rootdir) / 2 / koefa

    
    if (t1 < BIAS && t2 < BIAS) {return {dist, point, normal}}
    if (t1 < BIAS) {
      point = put(t2, ray)
      if (Math.abs(point.z - this.center.z) > this.width/2) {return {dist, point, normal}}
      circlecenter = new Vector3(this.center.x, this.center.y, point.z)
      normal = point.minus(circlecenter).normalized
      dist = t2
      return {dist, point, normal}
    }
    else {
      point = put(t1, ray)
      if (Math.abs(point.z - this.center.z) > this.width/2) {
        point = put(t2, ray)
        if (Math.abs(point.z - this.center.z) > this.width/2) {return {dist, point, normal}}
        circlecenter = new Vector3(this.center.x, this.center.y, point.z)
        normal = point.minus(circlecenter).normalized
        dist = t2
        return {dist, point, normal}
      }
      circlecenter = new Vector3(this.center.x, this.center.y, point.z)
      normal = point.minus(circlecenter).normalized
      dist = t1
      return {dist, point, normal}
    }
  }
} 