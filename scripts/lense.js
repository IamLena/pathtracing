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
            }
            else {
                this.width = d - this.width1 - this.width2
                this.cylindr = new Сylinder(position, r, this.width)
                this.center1 = new Vector3 (position.x, position.y, position.z + this.width1 + this.width/2 - r1)
                this.center2 = new Vector3 (position.x, position.y, position.z - this.width2 -  this.width/2 + r2)
            }
        }
        else if (this.type == 1) {
            this.width = d + this.width1 + this.width2
            this.cylindr = new Сylinder(position, r, this.width)
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
                this.cylindr = new Сylinder(cntr, r, this.width)
            }
        }
        else if (this.type == 3) {
            this.center1 = new Vector3 (position.x, position.y, position.z + d/2 - r1)
            this.center2 = new Vector3 (position.x, position.y, position.z - d/2 - r2)

            if (this.width1 - this.width2 > d || this.width1 <= this.width2) {
                this.width = d - this.width1 + this.width2
                let cylposz = position.z + d/2 - this.width1 - this.width/2
                let cntr = new Vector3(position.x, position.y, cylposz)
                this.cylindr = new Сylinder(cntr, r, this.width)
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

        if (this.type == 0) {
            if (this.center1.z < this.position.z && this.position.z < this.center2.z) {
                if (t11=== undefined || t12 === undefined || t21=== undefined || t22=== undefined) {return {dist, point, normal};}
                let arr = [{t: t11, c: this.center1}, {t: t12, c: this.center1}, {t: t21, c: this.center2}, {t: t22, c: this.center2}]
                arr.sort((a,b) => (a.t > b.t) ? 1 : ((b.t > a.t) ? -1 : 0))
                if (arr[0].c == arr[1].c) return {dist, point, normal}
                if (arr[1].t < BIAS) {
                    if (arr[2].t < BIAS) return {dist, point, normal}
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
                if (arr[0].t > BIAS) {
                    dist = arr[0].t
                    point = put(dist, ray)
                    normal = point.minus(arr[0].c).normalized
                    if (point.z > this.position.z + this.width/2 || point.z < this.position.z - this.width/2) {
                        return {dist, point, normal} 
                    }
                }
                if (arr[3].t == undefined || arr[3].t < BIAS) {
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
        else if (this.type == 1) {
            let values = this.cylindr.intersectionDistance(ray)
            if (values.dist != Infinity) {
                dist = values.dist
                point = values.point
                normal = values.normal
            }
            if (t11 != undefined && t21 == undefined) {
                if (t11 > BIAS) {
                    if (t11 < dist) {
                        let pointtry = put(t11, ray)
                        if (pointtry.z < this.center1.z - this.r1 + this.width1) {
                            dist = t11
                            point = pointtry
                            normal = this.center1.minus(point).normalized
                        }
                    }
                }
                else if (t12 > BIAS) {
                    if (t12 < dist) {
                        let pointtry = put(t12, ray)
                        if (pointtry.z < this.center1.z - this.r1 + this.width1) {
                            dist = t12
                            point = pointtry
                            normal = this.center1.minus(point).normalized
                        }
                    }
                }
            }
            else if (t11 == undefined && t21 != undefined) {
                if (t21 > BIAS) {
                    if (t21 < dist) {
                        let pointtry = put(t21, ray)
                        if (pointtry.z > this.center2.z + this.r2 - this.width2) {
                            dist = t21
                            point = pointtry
                            normal = this.center2.minus(point).normalized
                        }
                    }
                }
                else if (t22 > BIAS) {
                    if (t22 < dist) {
                        let pointtry = put(t22, ray)
                        if (pointtry.z > this.center2.z + this.r2 - this.width2) {
                            dist = t22
                            point = pointtry
                            normal = this.center2.minus(point).normalized
                        }
                    }
                }
            }
            else if (t11 != undefined && t21 != undefined) {
                let arr = [{t: t11, c: this.center1}, {t: t12, c: this.center1}, {t: t21, c: this.center2}, {t: t22, c: this.center2}]
                arr.sort((a,b) => (a.t > b.t) ? 1 : ((b.t > a.t) ? -1 : 0))
                if (arr[1].t < BIAS) {
                    if (arr[2].t > BIAS) {
                        let pointtry = put(arr[2].t, ray)
                        if (pointtry.z > this.center2.z + this.r2 - this.width2 && pointtry.z < this.center1.z + this.r1 - this.width1) {
                            dist = arr[2].t
                            point = pointtry
                            normal = arr[2].c.minus(point).normalized
                        }
                    }
                }
                else {
                    let pointtry = put(arr[1].t, ray)
                    if (pointtry.z > this.center2.z + this.r2 - this.width2 && pointtry.z < this.center1.z + this.r1 - this.width1) {
                        dist = arr[1].t
                        point = pointtry
                        normal = arr[1].c.minus(point).normalized
                    }
                    
                }
            }
            return {dist, point, normal}
        }
        else if (this.type == 2) {
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
            for (let i = 0; i < 4; i++)
            {
                if (arr[i].t > BIAS && arr[i].t < dist)
                {
                    let pointtry = put(arr[i].t, ray)
                    if (this.position.z - this.d/2 <= pointtry.z && pointtry.z <= this.position.z + this.d/2 + this.width1)
                    {
                        let nx = pointtry.x - this.position.x
                        let ny = pointtry.y - this.position.y
                        let distToDot = Math.sqrt(nx * nx + ny * ny)
                        if (distToDot < this.r) {
                            dist = arr[i].t
                            point = pointtry
                            if (arr[i].c == this.center1) {
                                normal = this.center1.minus(point).normalized
                            }
                            else {
                                normal = point.minus(this.center2).normalized
                            }
                            break
                        }
                    }
                }
            }
            return {dist, point, normal}
        }
        else if (this.type == 3) {
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
            for (let i = 0; i < 4; i++)
            {
                if (arr[i].t > BIAS && arr[i].t < dist)
                {
                    let pointtry = put(arr[i].t, ray)
                    if (this.position.z + this.d/2 >= pointtry.z && pointtry.z >= this.position.z - this.d/2 - this.width2)
                    {
                        let nx = pointtry.x - this.position.x
                        let ny = pointtry.y - this.position.y
                        let distToDot = Math.sqrt(nx * nx + ny * ny)
                        if (distToDot < this.r) {
                            dist = arr[i].t
                            point = pointtry
                            if (arr[i].c == this.center1) {
                                normal = point.minus(this.center1).normalized
                            }
                            else {
                                normal = this.center2.minus(point).normalized
                            }
                            break
                        }
                    }
                }
            }
            return {dist, point, normal}
        }
    }
}