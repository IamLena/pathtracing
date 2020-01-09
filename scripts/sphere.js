function put(t, ray) {
  return ray.origin.plus(ray.direction.scaledBy(t))
}

class Sphere {
  constructor (center, radius, material) {
    this.center = center
    this.radius = radius
    this.material = material
  }
  // http://tfpsly.free.fr/english/index.html?url=http://tfpsly.free.fr/english/3d/Raytracing.html
  intersectionDistance (ray) {
    // const BIAS = 1e-6 // TODO: make this an argument (this is the minimum distance)
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

// class Lense {
//   constructor(r1, r2, d, position, material, r) {
//     this.material = material
//     this.position = position
//     this.d = d

//     this.type = undefined 
//     if (r1 > 0 && r2 < 0) {this.type = 0}
//     else if (r1 > 0 && r2 > 0) {this.type = 1}
//     else if (r1 < 0 && r2 < 0) {this.type = 2}
//     else if (r1 < 0 && r2 > 0) {this.type = 3}
//     else {    }

//     r1 = Math.abs(r1)
//     r2 = Math.abs(r2)
//     this.r1 = r1
//     this.r2 = r2
//     this.r = r
//     this.center1 = undefined
//     this.center2 = undefined
//     this.cylindr = undefined
    
//     if(r > Math.min(r1, r2)) {r = Math.min(r1, r2);}
//     this.width1 = r1 - Math.sqrt(r1 * r1 - r * r)
//     this.width2 = r2 - Math.sqrt(r2 * r2 - r * r)

//     if (this.type == 0){
//       if (this.width1 + this.width2 >= d) {
//           this.center1 = new Vector3 (position.x, position.y, position.z + this.width1/(this.width1 + this.width2) * d - r1)
//           this.center2 = new Vector3 (position.x, position.y, position.z - this.width2/(this.width1 + this.width2) * d + r2)
//       }
//       else {
//           this.width = d - this.width1 - this.width2
//           this.cylindr = new Сylinder(position, r, this.width)
//           this.center1 = new Vector3 (position.x, position.y, position.z + this.width1 + this.width/2 - r1)
//           this.center2 = new Vector3 (position.x, position.y, position.z - this.width2 -  this.width/2 + r2)
//           this.position.z = this.center1.z + r1 - d/2
//       }
//     }
//     else if (this.type == 1) {
//       if (this.width1 - this.width2 <= d) {
//         this.center1 = new Vector3 (position.x, position.y, position.z + d/2 - r1)
//         this.center2 = new Vector3 (position.x, position.y, position.z - d/2 - r2)
//       }
//       else {
//         //+cylindr
//         this.width = d - this.width1 + this.width2
//         this.cylindr = new Сylinder(position, r, this.width)
//         this.center1 = new Vector3 (position.x, position.y, position.z + this.width/2 + this.width1/2 - this.width/2 - r1)
//         this.center2 = new Vector3 (position.x, position.y, position.z - this.width/2 - this.width1/2 - this.width/2 - r2)
//       }
//     }
//     else if (this.type == 2) {
//       if (this.width2 - this.width1 <= d) {
//         this.center1 = new Vector3 (position.x, position.y, position.z + d/2 + r1)
//         this.center2 = new Vector3 (position.x, position.y, position.z - d/2 + r2)
//       }
//       else {
//         //+cylindr
//         this.width = d - this.width2 + this.width1
//         this.cylindr = new Сylinder(position, r, this.width)
//         this.center1 = new Vector3 (position.x, position.y, position.z - this.width/2 - this.width1/2 - this.width/2 - r1)
//         this.center2 = new Vector3 (position.x, position.y, position.z + this.width/2 + this.width1/2 - this.width/2 - r2)
//       }
//     }
//     else if (this.type == 3) {
//       this.width = d + this.width1 + this.width2
//       this.cylindr = new Сylinder(position, r, this.width)
//       this.center1 = new Vector3 (position.x, position.y, position.z + d/2 + r1)
//       this.center2 = new Vector3 (position.x, position.y, position.z - d/2 - r2)
//     }
//   }
//   intersectionDistance (ray) {
//     // const BIAS = 1e-6
//     let t11, t12, t21, t22;

//     //sphere1
//     const op1 = this.center1.minus(ray.origin);
//     const b1 = op1.dot(ray.direction);
//     const det1 = b1 * b1 - op1.dot(op1) + this.r1 * this.r1;
//     if (det1 >= 0) {
//       let detRoot1 = Math.sqrt(det1);
//       t11 = b1 - detRoot1;
//       t12 = b1 + detRoot1;
//     }

//     //sphere2
//     const op2 = this.center2.minus(ray.origin);
//     const b2 = op2.dot(ray.direction);
//     const det2 = b2 * b2 - op2.dot(op2) + this.r2 * this.r2;
//     if (det2 >= 0) {
//       let detRoot2 = Math.sqrt(det2);
//       t21 = b2 - detRoot2;
//       t22 = b2 + detRoot2;
//     }

//     let dist = Infinity
//     let point
//     let normal
    
//     if (this.type == 0) { // ()
//       if (this.center2.z >= this.position.z && this.position.z >= this.center1.z) {
//         if (t11=== undefined || t12 === undefined || t21=== undefined || t22=== undefined) {return {dist, point, normal};}
//         if (t11 < 0 && t12 < 0 && t21 < 0 && t22 < 0) {return {dist, point, normal}}

//         let arr = [{t: t11, c: this.center1}, {t: t12, c: this.center1}, {t: t21, c: this.center2}, {t: t22, c: this.center2}]
//         arr.sort((a,b) => (a.t > b.t) ? 1 : ((b.t > a.t) ? -1 : 0))
//         if (arr[0].c == arr[1].c) return {dist, point, normal}
//         if (arr[1].t < 0) {
//           if (arr[2].t < 0) return {dist, point, normal}
//           else {
//             dist = arr[2].t
//             point = put(dist, ray)
//             normal = point.minus(arr[2].c).normalized
//           }
//         }
//         else {
//           dist = arr[1].t
//           point = put(dist, ray)
//           normal = point.minus(arr[1].c).normalized
//         }
//       }
//       else {
//         let arr = [{t: t11, c: this.center1}, {t: t12, c: this.center1}, {t: t21, c: this.center2}, {t: t22, c: this.center2}]
//         arr.sort((a,b) => (a.t > b.t) ? 1 : ((b.t > a.t) ? -1 : 0))
//         if (arr[0].t < 0) {
//           if (arr[3].t > 0) {
//             dist = arr[3].t
//             point = put(dist, ray)
//             normal = point.minus(arr[3].c).normalized
//           }
//         }
//         else {
//           dist = arr[0].t
//           point = put(dist, ray)
//           normal = point.minus(arr[0].c).normalized
//         }
//       }
//     }
//     else if (this.type == 1) { //((
//       if (this.d < 2 * this.r1) {
//         if (t11=== undefined && t12 === undefined) return {dist, point, normal}
//         else if (t21=== undefined && t22=== undefined) {
//           if (t11 < 0){
//             if (t12 < 0) return {dist, point, normal}
//             else {
//               dist = t12
//               point = put(dist, ray)
//               normal = point.minus(this.center1).normalized
//             }
//           }
//           else {
//             dist = t11
//             point = put(dist, ray)
//             normal = point.minus(this.center1).normalized
//           }
//         }
//         else if (t11 < 0 && t12 < 0 && t21 < 0 && t22 < 0) return {dist, point, normal}
//         else {
//           let arr = [{t: t11, c: this.center1}, {t: t12, c: this.center1}, {t: t21, c: this.center2}, {t: t22, c: this.center2}]
//           arr.sort((a,b) => (a.t > b.t) ? 1 : ((b.t > a.t) ? -1 : 0))
          
//           if (arr[0].c == this.center1) {
//             if (arr[0].t > 0) 
//             { 
//               dist = arr[0].t
//               point = put(dist, ray)
//               normal = point.minus(arr[0].c).normalized
//             }
//             else if(arr[1].t > 0) {
//               dist = arr[1].t
//               point = put(dist, ray)
//               normal = point.minus(arr[1].c).normalized.scaledBy(-1)
//             }
//             else if(arr[2].c == this.center2) {
//               if (arr[2].t > 0) {
//                 dist = arr[2].t
//                 point = put(dist, ray)
//                 normal = point.minus(arr[2].c).normalized.scaledBy(-1)
//               }
//               else {
//                 dist = arr[3].t
//                 point = put(dist, ray)
//                 normal = point.minus(arr[3].c).normalized
//               }
//             }
//             else return {dist, point, normal}
//           }
//           else {
//             if(arr[2].c == this.center2) {
//               if (arr[2].t > 0) {
//                 dist = arr[2].t
//                 point = put(dist, ray)
//                 normal = point.minus(arr[2].c).normalized.scaledBy(-1)
//               }
//               else {
//                 dist = arr[3].t
//                 point = put(dist, ray)
//                 normal = point.minus(arr[3].c).normalized
//               }
//             }
//             else return {dist, point, normal}
//           }
//         }
//       }
//       return {dist, point, normal} 
//     }
//     else if (this.type == 2) { // ))
//       if (this.d < 2 * this.r2) {
//         if (t21 === undefined && t22 === undefined) return {dist, point, normal}
//         else if (t11=== undefined && t12=== undefined) {
//           if (t21  < 0){
//             if (t22 < 0) return {dist, point, normal}
//             else {
//               dist = t22
//               point = put(dist, ray)
//               normal = point.minus(this.center2).normalized
//             }
//           }
//           else {
//             dist = t21 
//             point = put(dist, ray)
//             normal = point.minus(this.center2).normalized
//           }
//         }
//         else if (t11  < 0 && t12 < 0 && t21 < 0 && t22 < 0) return {dist, point, normal}
//         else {
//           let arr = [{t: t11, c: this.center1}, {t: t12, c: this.center1}, {t: t21, c: this.center2}, {t: t22, c: this.center2}]
//           arr.sort((a,b) => (a.t > b.t) ? 1 : ((b.t > a.t) ? -1 : 0))
          
//           if (arr[0].c == this.center2) {
//             if (arr[0].t > 0) 
//             { 
//               dist = arr[0].t
//               point = put(dist, ray)
//               normal = point.minus(arr[0].c).normalized
//             }
//             else if(arr[1].t > 0) {
//               dist = arr[1].t
//               point = put(dist, ray)
//               normal = point.minus(arr[1].c).normalized.scaledBy(-1)
//             }
//             else if(arr[2].c == this.center1) {
//               if (arr[2].t > 0) {
//                 dist = arr[2].t
//                 point = put(dist, ray)
//                 normal = point.minus(arr[2].c).normalized.scaledBy(-1)
//               }
//               else {
//                 dist = arr[3].t
//                 point = put(dist, ray)
//                 normal = point.minus(arr[3].c).normalized
//               }
//             }
//             else return {dist, point, normal}
//           }
//           else {
//             if(arr[2].c == this.center1) {
//               if (arr[2].t > 0) {
//                 dist = arr[2].t
//                 point = put(dist, ray)
//                 normal = point.minus(arr[2].c).normalized.scaledBy(-1)
//               }
//               else {
//                 dist = arr[3].t
//                 point = put(dist, ray)
//                 normal = point.minus(arr[3].c).normalized
//               }
//             }
//             else return {dist, point, normal}
//           }
//         }
//       }
//     } 
//     else if (this.type == 3) { // )(
//       if (t11 === undefined && t12 === undefined && t21 === undefined && t22=== undefined) return {dist, point, normal}
//       if (t11  < 0 && t12 < 0 && t21 < 0 && t22 < 0) return {dist, point, normal}
//       if (t11 === undefined && t12 === undefined) {
//         if (t21  < 0){
//           if (t22 >= 0) {
//             dist = t22
//             point = put(dist, ray)
//             normal = point.minus(this.center2).normalized.scaledBy(-1)
//           }
//         }
//         else {
//           dist = t21 
//           point = put(dist, ray)
//           normal = point.minus(this.center2).normalized.scaledBy(-1)
//         }
//       }
//       else if (t21 === undefined && t22 === undefined) {
//         if (t11  < 0){
//           if (t12 >= 0) {
//             dist = t12
//             point = put(dist, ray)
//             normal = point.minus(this.center1).normalized.scaledBy(-1)
//           }
//         }
//         else {
//           dist = t11 
//           point = put(dist, ray)
//           normal = point.minus(this.center1).normalized.scaledBy(-1)
//         }
//       }
//       else {
//         let arr = [{t: t11, c: this.center1}, {t: t12, c: this.center1}, {t: t21, c: this.center2}, {t: t22, c: this.center2}]
//         arr.sort((a,b) => (a.t > b.t) ? 1 : ((b.t > a.t) ? -1 : 0))
//         if (arr[1] < 0) {
//           if (arr[2] > 0) {
//             dist = arr[2].t
//             point = put(dist, ray)
//             normal = point.minus(this.center2).normalized.scaledBy(-1)
//             // normal = this.center2.minus(point).normalized.scaledBy(-1)
//           }
//         }
//         else {
//           dist = arr[1].t
//           point = put(dist, ray)
//           normal = point.minus(this.center1).normalized.scaledBy(-1)
//           // normal = this.center1.minus(point).normalized.scaledBy(-1)
//         }
//       }
//     }

//     // no cylindr
//     if (this.cylindr == undefined) {
//       return {dist, point, normal}
//     }
//     else  {
//       if (this.type == 0) {
//         if (this.center2.z >= this.position.z && this.position.z >= this.center1.z) {
//           let point = put(dist, ray)
//           let nx = point.x - this.position.x
//           let ny = point.y - this.position.y
//           let distToDot = Math.sqrt(nx * nx + ny * ny)
//           if (distToDot <= this.r) {
//             return {dist, point, normal}
//           }
//           else { return this.cylindr.intersectionDistance(ray)}
//         }
//         else {
//           if (dist == Infinity) {
//             return this.cylindr.intersectionDistance(ray)
//           }
//           let point = put(dist, ray)
//           let nx = point.x - this.position.x
//           let ny = point.y - this.position.y
//           let nz = point.z - this.position.z
//           let distToDot = Math.sqrt(nx * nx + ny * ny)
//           if (distToDot <= this.r && Math.abs(nz) > this.cylindr.z) {return {dist, point, normal}}
//           else { return this.cylindr.intersectionDistance(ray)}
//         }
//       }
//       else if (this.type == 1) {
        
//       }
//       else if (this.type == 2) {
        
//       }
//       else if (this.type == 3) {
//         let values = this.cylindr.intersectionDistance(ray)
//         if (dist >= values.dist) {
//           return values          
//         }
//         return {dist, point, normal}
//       }
//       //else dif types
//     }
//   }

//   getmsg() {
//     let msg = ``
//     if (this.type == 0) {msg += `двояковыпуклая`}
//     //undefined
//     // msg += `
//     // c1 = ${this.center1.x}, ${this.center1.y}, ${this.center1.z}
//     // c2 = ${this.center2.x}, ${this.center2.y}, ${this.center2.z}
//     // w = ${this.cylindr.width}
//     // `
//     return msg
//   }
// }

class Сylinder {
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

    
    if (t1 < 0 && t2 < 0) {return {dist, point, normal}}
    if (t1 < 0) {
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