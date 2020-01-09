class Lense {
    constructor(r1, r2, d, position, material, r) {
        this.material = material
        this.position = position
        this.d = d
    
        this.type = undefined 
        if (r1 > 0 && r2 < 0) {this.type = 0}
    
        r1 = Math.abs(r1)
        r2 = Math.abs(r2)
        this.r1 = r1
        this.r2 = r2
        this.r = r
        this.center1 = undefined
        this.center2 = undefined
        this.cylindr = undefined
        
        if (r > Math.min(r1, r2)) {r = Math.min(r1, r2);}
        this.width1 = r1 - Math.sqrt(r1 * r1 - r * r)
        this.width2 = r2 - Math.sqrt(r2 * r2 - r * r)

        
        if (this.type == 0){
            if (this.width1 + this.width2 >= d) {
                this.center1 = new Vector3 (position.x, position.y, position.z + this.width1/(this.width1 + this.width2) * d - r1)
                this.center2 = new Vector3 (position.x, position.y, position.z - this.width2/(this.width1 + this.width2) * d + r2)
            }
            else {
                this.width = d - this.width1 - this.width2
                this.cylindr = new Сylinder(position, r, this.width)
                this.center1 = new Vector3 (position.x, position.y, position.z + this.width1 + this.width/2 - r1)
                this.center2 = new Vector3 (position.x, position.y, position.z - this.width2 -  this.width/2 + r2)
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

        if (this.type == 0) {
            if (this.center1.z < this.position.z && this.position.z < this.center2.z) {
                if (t11=== undefined || t12 === undefined || t21=== undefined || t22=== undefined) {return {dist, point, normal};}
                let arr = [{t: t11, c: this.center1}, {t: t12, c: this.center1}, {t: t21, c: this.center2}, {t: t22, c: this.center2}]
                arr.sort((a,b) => (a.t > b.t) ? 1 : ((b.t > a.t) ? -1 : 0))
                if (arr[0].c == arr[1].c) return {dist, point, normal}
                if (arr[1].t < 0) {
                    if (arr[2].t < 0) return {dist, point, normal}
                    else {
                        dist = arr[2].t
                        point = put(dist, ray)
                        normal = point.minus(arr[2].c).normalized
                    }
                }
                else {
                    dist = arr[1].t
                    point = put(dist, ray)
                    normal = point.minus(arr[1].c).normalized
                }
                if (this.cylindr) {
                    let nx = point.x - this.position.x
                    let ny = point.y - this.position.y
                    let distToDot = Math.sqrt(nx * nx + ny * ny)
                    if (distToDot > this.r) {
                        let values = this.cylindr.intersectionDistance(ray)
                        dist = values.dist
                        point = values.point
                        normal = values.normal
                    }
                }
                return {dist, point, normal}
            }
            else {
                let arr = [{t: t11, c: this.center1}, {t: t12, c: this.center1}, {t: t21, c: this.center2}, {t: t22, c: this.center2}]
                arr.sort((a,b) => (a.t > b.t) ? 1 : ((b.t > a.t) ? -1 : 0))
                if (arr[0].t > 0) {
                    dist = arr[0].t
                    point = put(dist, ray)
                    normal = point.minus(arr[0].c).normalized
                    if (point.z > this.position.z + this.width/2 || point.z < this.position - this.width/2) {
                        return {dist, point, normal} 
                    }
                }
                if (arr[3].t == undefined || arr[3].t < 0) {
                    dist = Infinity
                    point = undefined
                    normal = undefined
                    return {dist, point, normal}
                }
                else {
                    let values = this.cylindr.intersectionDistance(ray)

                    if (values.dist < arr[3].t) {
                        dist = values.dist
                        point = values.point
                        normal = values.normal
                    }
                    else {
                        dist = arr[3].t
                        point = put(dist, ray)
                        normal = point.minus(arr[3].c).normalized
                    }
                    return {dist, point, normal}  
                }
            }
        }
    }
}