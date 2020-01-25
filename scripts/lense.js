class Lense {
    constructor(r1, r2, d, position, material, r) {
        this.material = material
        this.position = position
        this.d = d
    
        this.type = undefined 
        if (r1 > 0 && r2 < 0) {this.type = 0}       // ()
        else if (r1 < 0 && r2 > 0) {this.type = 1}  // )(
        else if (r1 < 0 && r2 < 0) {this.type = 2}  // ((
        else if (r1 > 0 && r2 > 0) {this.type = 3}  // ))
    
        r1 = Math.abs(r1)
        r2 = Math.abs(r2)
        this.r1 = r1
        this.r2 = r2
        this.center1 = undefined
        this.center2 = undefined
        this.cylindr = undefined
        
        if (r > Math.min(r1, r2)) {r = Math.min(r1, r2);}
        this.r = r
        this.width1 = r1 - Math.sqrt(r1 * r1 - r * r)
        this.width2 = r2 - Math.sqrt(r2 * r2 - r * r)

        
        if (this.type == 0){
            if (this.width1 + this.width2 >= d) {
                this.center1 = new Vector3 (position.x, position.y, position.z + this.width1/(this.width1 + this.width2) * d - r1)
                this.center2 = new Vector3 (position.x, position.y, position.z - this.width2/(this.width1 + this.width2) * d + r2)
                this.r = Math.sqrt(this.r1 * this.r1 - (position.z - this.center1) * (position.z - this.center1))
            }
            else {
                this.width = d - this.width1 - this.width2
                this.cylindr = new Cylinder(position, r, this.width)
                this.center1 = new Vector3 (position.x, position.y, position.z + this.width1 + this.width/2 - r1)
                this.center2 = new Vector3 (position.x, position.y, position.z - this.width2 -  this.width/2 + r2)
            }
        }
        else if (this.type == 1) {
            //check!
            this.width = d + this.width1 + this.width2
            let cylposz = position.z + d/2 + this.width1 - this.width/2
            let cntr = new Vector3(position.x, position.y, cylposz)
            this.cylindr = new Cylinder(cntr, r, this.width)
            this.center1 = new Vector3 (position.x, position.y, position.z + d/2 + r1)
            this.center2 = new Vector3 (position.x, position.y, position.z - d/2 - r2)
        }
        else if (this.type == 2) {
            this.center1 = new Vector3 (position.x, position.y, position.z + d/2 + r1)
            this.center2 = new Vector3 (position.x, position.y, position.z - d/2 + r2)

            if (this.width2 - this.width1 > d || this.width2 <= this.width1) {
                this.width = d - this.width2 + this.width1
                let cylposz = position.z - d/2 + this.width2 + this.width/2
                let cntr = new Vector3(position.x, position.y, cylposz)
                this.cylindr = new Cylinder(cntr, r, this.width)
            }
        }
        else if (this.type == 3) {
            this.center1 = new Vector3 (position.x, position.y, position.z + d/2 - r1)
            this.center2 = new Vector3 (position.x, position.y, position.z - d/2 - r2)

            if (this.width1 - this.width2 > d || this.width1 <= this.width2) {
                this.width = d - this.width1 + this.width2
                let cylposz = position.z + d/2 - this.width1 - this.width/2
                let cntr = new Vector3(position.x, position.y, cylposz)
                this.cylindr = new Cylinder(cntr, r, this.width)
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

        let zfrontborder
        let zbackborder

        if (this.cylindr) {
            let values = this.cylindr.intersectionDistance(ray)
            if (values.dist != Infinity) {
                dist = values.dist
                point = values.point
                normal = values.normal
            }
            zfrontborder = this.cylindr.center.z + this.width/2
            zbackborder = this.cylindr.center.z - this.width/2
        }
        else {
            zfrontborder = this.position.z
            zbackborder = this.position.z
        }

        let arr = [{t: t11, c: this.center1}, {t: t12, c: this.center1}, {t: t21, c: this.center2}, {t: t22, c: this.center2}]
        arr.sort((a,b) => (a.t > b.t) ? 1 : ((b.t > a.t) ? -1 : 0))
        //undefined in begining

        for (let i = 0; i < 4; i++) {
            if (this.type == 0) {
                if (arr[i].t != undefined && arr[i].t > BIAS && arr[i].t < dist) {
                    let pointtry = put(arr[i].t, ray)
                    let nx = pointtry.x - this.position.x
                    let ny = pointtry.y - this.position.y
                    let distToDot = Math.sqrt(nx * nx + ny * ny)
                    if (distToDot > this.r) {continue}
                    if (arr[i].c == this.center1 && pointtry.z >= zfrontborder) {
                        dist = arr[i].t
                        point = pointtry
                        normal = pointtry.minus(this.center1).normalized
                        break
                    }
                    if (arr[i].c == this.center2 && pointtry.z < zbackborder) {
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