if (this.type == 0) {
            if (this.center1.z <= this.position.z && this.position.z <= this.center2.z) {
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
            let arr = [{t: t11, c: this.center1}, {t: t12, c: this.center1}, {t: t21, c: this.center2}, {t: t22, c: this.center2}]
            arr.sort((a,b) => (a.t > b.t) ? 1 : ((b.t > a.t) ? -1 : 0))
            for (let i = 0; i < 4; i++)
            {
                if (arr[i].t > BIAS && arr[i].t < dist)
                {
                    let pointtry = put(arr[i].t, ray)
                    if (this.position.z - this.d/2 - this.width2 <= pointtry.z && pointtry.z <= this.position.z + this.d/2 + this.width1)
                    {
                        dist = arr[i].t
                        point = pointtry
                        normal = arr[i].c.minus(point).normalized
                        break
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