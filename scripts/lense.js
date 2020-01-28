class Lense {
    constructor(r1, r2, d, position, material, r) {
        this.material = material

        if (r1 > 0 && r2 < 0) {this.type = 0}       // ()
        else if (r1 < 0 && r2 > 0) {this.type = 1}  // )(
        else if (r1 < 0 && r2 < 0) {this.type = 2}  // ((
        else if (r1 > 0 && r2 > 0) {this.type = 3}  // ))

        this.r1 = Math.abs(r1)
        this.r2 = Math.abs(r2)
        let minr = Math.min(this.r1, this.r2)
        if (r > minr) {r = minr}
        this.r = r

        this.position = position

        let w1 = this.r1 - Math.sqrt(this.r1 * this.r1 - this.r * this.r)
        let w2 = this.r2 - Math.sqrt(this.r2 * this.r2 - this.r * this.r)

        if (this.type == 0) {
            if (w1 + w2 == d) {
                this.center1 = this.position
                this.center2 = this.position
                this.zfrontborder = this.position.z
                this.zbackborder = this.position.z
            }
            else if (w1 + w2 > d) {
                let a = 2 * this.r1 * this.r1 + 2 * this.r1 * this.r2 + d * d - 2 * this.r1 * d - 2 * this.r2 * d
                let b = 2 * (this.r1 + this.r2 - d)
                let x1 = a / b
                let x2 = this.r1 + this.r2 - d - x1

                this.center1 = new Vector3(this.position.x, this.position.y, this.position.z - x1)
                this.center2 = new Vector3(this.position.x, this.position.y, this.position.z + x2)
                this.zfrontborder = this.position.z
                this.zbackborder = this.position.z
            }
            else {
                let width = d - w1 - w2
                this.cylindr = new Cylinder(this.position, this.r, width)
                this.zfrontborder = this.position.z + width/2
                this.zbackborder = this.position.z - width/2
                this.center1 = new Vector3(this.position.x, this.position.y, this.zfrontborder + w1 - this.r1)
                this.center2 = new Vector3(this.position.x, this.position.y, this.zbackborder - w2 + this.r2)
            }
        }
        else if (this.type == 1) {
            this.zfrontborder = this.position.z + d/2 + w1
            this.zbackborder = this.position.z - d/2 - w2
            let width = d + w1 + w2
            let cylz = this.zbackborder + width / 2
            this.cylindr = new Cylinder(new Vector3(this.position.x, this.position.y, cylz), this.r, width)
            this.center1 = new Vector3(this.position.x, this.position.y, this.position.z + d/2 + this.r1)
            this.center2 = new Vector3(this.position.x, this.position.y, this.position.z - d/2 - this.r2)
        }
        else if (this.type == 2) {
            this.center1 = new Vector3 (this.position.x, this.position.y, this.position.z + d/2 + this.r1)
            this.center2 = new Vector3 (this.position.x, this.position.y, this.position.z - d/2 + this.r2)
            if (d < this.r2 * 2) {
                this.zfrontborder = ((this.r1 * this.r1 - this.r2 * this.r2) / (this.center2.z - this.center1.z) + this.center1.z + this.center2.z ) / 2
                this.zbackborder = this.zfrontborder
                if (this.zfrontborder - this.center2.z > 0) {
                    //cylindr
                    this.zbackborder = this.center2.z - this.r2 + w2
                    let width = this.zfrontborder - this.zbackborder
                    let cylpos = (this.zfrontborder + this.zbackborder) / 2
                    this.cylindr = new Cylinder(new Vector3(this.position.x, this.position.y, cylpos), this.r, width)
                }
            }
            else {
                //cylindr
                this.zbackborder = this.center2.z - this.r2 + w2
                this.zfrontborder = this.center1.z - this.r1 + w1
                let width = this.zfrontborder - this.zbackborder
                let cylpos = (this.zfrontborder + this.zbackborder) / 2
                this.cylindr = new Cylinder(new Vector3(this.position.x, this.position.y, cylpos), this.r, width)
            }
        }
    }
    intersectionDistance(ray) {
        let t11, t12, t21, t22;

        //sphere1
        const op1 = this.center1.minus(ray.origin);
        const b1 = op1.dot(ray.direction);
        const det1 = b1 * b1 - op1.dot(op1) + this.r1 * this.r1;
        if (det1 >= 0) {
            let detRoot1 = Math.sqrt(det1);
            t11 = b1 - detRoot1;
            t12 = b1 + detRoot1;
        }

        //sphere2
        const op2 = this.center2.minus(ray.origin);
        const b2 = op2.dot(ray.direction);
        const det2 = b2 * b2 - op2.dot(op2) + this.r2 * this.r2;
        if (det2 >= 0) {
            let detRoot2 = Math.sqrt(det2);
            t21 = b2 - detRoot2;
            t22 = b2 + detRoot2;
        }

        let dist = Infinity
        let point
        let normal

        let BIAS = 0.000001

        if (this.cylindr) {
            let values = this.cylindr.intersectionDistance(ray)
            if (values.dist != Infinity) {
                dist = values.dist
                point = values.point
                normal = values.normal
            }
        }

        let arr = [{t: t11, c: this.center1}, {t: t12, c: this.center1}, {t: t21, c: this.center2}, {t: t22, c: this.center2}]
        arr.sort((a,b) => (a.t > b.t) ? 1 : ((b.t > a.t) ? -1 : 0))
        //undefined in begining

        for (let i = 0; i < 4; i++) {
            if (arr[i].t != undefined && arr[i].t > BIAS && arr[i].t < dist) {
                let pointtry = put(arr[i].t, ray)
                if (this.type == 0) {
                    if (arr[i].c == this.center1 &&  pointtry.z >= this.zfrontborder) {
                        dist = arr[i].t
                        point = pointtry
                        normal = pointtry.minus(this.center1).normalized
                        break
                    }
                    if (arr[i].c == this.center2 && pointtry.z <= this.zbackborder) {
                        dist = arr[i].t
                        point = pointtry
                        normal = pointtry.minus(this.center2).normalized
                        break
                    }
                }
                else if (this.type == 1) {
                    if (arr[i].c == this.center1 &&  pointtry.z <= this.zfrontborder) {
                        dist = arr[i].t
                        point = pointtry
                        normal = pointtry.minus(this.center1).normalized
                        break
                    }
                    if (arr[i].c == this.center2 && pointtry.z >= this.zbackborder) {
                        dist = arr[i].t
                        point = pointtry
                        normal = pointtry.minus(this.center2).normalized
                        break
                    }
                }
                else if (this.type == 2) {
                    if (arr[i].c == this.center1 &&  pointtry.z <= this.zfrontborder) {
                        dist = arr[i].t
                        point = pointtry
                        normal = pointtry.minus(this.center1).normalized
                        break
                    }
                    if (arr[i].c == this.center2 && pointtry.z <= this.zbackborder) {
                        dist = arr[i].t
                        point = pointtry
                        normal = pointtry.minus(this.center2).normalized
                        break
                    }
                }          
            }
        }
        return {dist, point, normal}
    }
}