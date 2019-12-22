class Sphere {
  constructor (center, radius, material) {
    this.center = center
    this.radius = radius
    this.material = material
  }
  // http://tfpsly.free.fr/english/index.html?url=http://tfpsly.free.fr/english/3d/Raytracing.html
  intersectionDistance (ray) {
    const BIAS = 1e-6 // TODO: make this an argument (this is the minimum distance)
    const op = this.center.minus(ray.origin);
    const b = op.dot(ray.direction);
    const det = b * b - op.dot(op) + this.radius * this.radius;
    if (det < 0) return Infinity;
    const detRoot = Math.sqrt(det);
    const t1 = b - detRoot;
    if (t1 > BIAS) return t1;
    const t2 = b + detRoot;
    if (t2 > BIAS) return t2;
    return Infinity;
  }
}

class Lense {
  constructor(r1, r2, d, F, D, V, n, position, material) {
    this.r1 = r1
    this.r2 = r2
    this.d = d
    this.position = position
    this.F = (n - 1) * (1/r1 -  1/r2)
    this.D = 1/F
    // this.v = v //V
    this.n = n
    console.log("focus = ", F)
    if (r1 > 0)
      this.center1 = new Vector3 (position.x, position.y, position.z + d/2 - Math.abs(r1))
    else if (r1 < 0)
      this.center1 = new Vector3 (position.x, position.y, position.z + d/2 + Math.abs(r1))
    if (r2 > 0)
      this.center2 = new Vector3 (position.x, position.y, position.z - d/2 - Math.abs(r2))
    else if (r2 < 0)
      this.center2 = new Vector3 (position.x, position.y, position.z - d/2 + Math.abs(r2))
    this.material = material
  }
  intersectionDistance (ray) {
    const BIAS = 1e-6
    let t11, t12, t21, t22, detRoot1, detRoot2;
    //sphere1
    const op1 = this.center1.minus(ray.origin);
    const b1 = op1.dot(ray.direction);
    const det1 = b1 * b1 - op1.dot(op1) + this.r1 * this.r1;
    if (det1 >= 0) {
      detRoot1 = Math.sqrt(det1);
      t11 = b1 - detRoot1;
      t12 = b1 + detRoot1;
    }

    //sphere2
    const op2 = this.center2.minus(ray.origin);
    const b2 = op2.dot(ray.direction);
    const det2 = b2 * b2 - op2.dot(op2) + this.r2 * this.r2;
    if (det2 >= 0) {
      detRoot2 = Math.sqrt(det2);
      t21 = b2 - detRoot2;
      t22 = b2 + detRoot2;
    }

    if (t11=== undefined || t12 === undefined || t21=== undefined || t22=== undefined) {return Infinity}
    if (t11 < 0 && t12 < 0 && t21 < 0 && t22 < 0) {return Infinity}
    
    // console.log(t11, t12, t21, t22)
    if (this.r1 > 0 && this.r2 < 0) { // ()
      let arr = [{t: t11, c: this.center1}, {t: t12, c: this.center1}, {t: t21, c: this.center2}, {t: t22, c: this.center2}]
      let result
      arr.sort((a,b) => (a.t > b.t) ? 1 : ((b.t > a.t) ? -1 : 0))
      if (arr[0].c == arr[1].c) return Infinity
      if (arr[1].t < 0) {
        if (arr[2].t < 0) return Infinity
        else {
          result = arr[2]
        }
      }
      else result = arr[1]
      this.center = result.c
      return result.t
    }


    const side = this.position.minus(ray.origin) //side.z + d/2 < 0 cross  -r1-r2->; size.z + d/2 > 0 cross <-r1-r2-
    if (this.r1 > 0 && this.r2 < 0) { //()
      if (side.z < 0) {
        if (t11 > BIAS) {
          this.center = this.center1;
          return t11;
        }
        if (t22 > BIAS) {
          this.center = this.center2;
          return t22;
        }
        return Infinity;
      }
      else {
        if (t22 > BIAS) {
          this.center = this.center2;
          return t22;
        }
        if (t11 > BIAS) {
          this.center = this.center1;
          return t11;
        }
        return Infinity;
      }
    }
    else if (this.r1 > 0 && this.r2 > 0) { // ((
      if (side.z < 0) {
        if (t11 > BIAS) {
          this.center = this.center1;
          return t11;
        }
        if (t21 > BIAS) {
          this.center = this.center2;
          return t21;
        }
        return Infinity;
      }
      else {
        if (t21 > BIAS) {
          this.center = this.center2;
          return t21;
        }
        if (t11 > BIAS) {
          this.center = this.center1;
          return t11;
        }
        return Infinity;
      }
    }
    else if (this.r1 < 0 && this.r2 < 0) { // ))
      if (side.z < 0) {
        if (t12 > BIAS) {
          this.center = this.center1;
          return t12;
        }
        if (t22 > BIAS) {
          this.center = this.center2;
          return t22;
        }
        return Infinity;
      }
      else {
        if (t22 > BIAS) 
        {
          this.center = this.center2;
          return t22;
        }
        if (t12 > BIAS) {
          this.center = this.center1;
          return t12;
        }
        return Infinity;
      }
    }
    else if (this.r1 < 0 && this.r2 > 0) { // )(
      if (side.z < 0) {
        if (t12 > BIAS) {
          this.center = this.center1;
          return t12;
        }
        if (t21 > BIAS) {
          this.center = this.center2;
          return t21;
        }
        return Infinity;
      }
      else {
        if (t21 > BIAS) {
          this.center = this.center2;
          return t21;
        }
        if (t12 > BIAS) {
          this.center = this.center1;
          return t12;
        }
        return Infinity;
      }
    }
  }
}