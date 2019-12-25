      // if (d/2 < Math.min(r1, r2))
      // let cz1 = position.z + d/2 - r1;
      // let cz2 = position.z - d/2 + r2;
      // let sq = (r1 * r1 - r2 * r2) / 2 / (r1 + r2 - d) + position.z - r1/2 + r2/2
      // let h = r1 * r1 - sq * sq

      // if (r >= h) {
      //   this.center1 = new Vector3 (position.x, position.y, cz1)
      //   this.center2 = new Vector3 (position.x, position.y, cz2)
      // }
      // else {

      // }

    // if (r < h) {
    //   //cylind needed
    //   //recount centers
    // }
    // this.d = d

     // if (r1 > 0)
    //   this.center1 = new Vector3 (position.x, position.y, position.z + d/2 - Math.abs(r1))
    // else if (r1 < 0)
    //   this.center1 = new Vector3 (position.x, position.y, position.z + d/2 + Math.abs(r1))
    // if (r2 > 0)
    //   this.center2 = new Vector3 (position.x, position.y, position.z - d/2 - Math.abs(r2))
    // else if (r2 < 0)
    //   this.center2 = new Vector3 (position.x, position.y, position.z - d/2 + Math.abs(r2))

    if (r1 > 0)
    this.center1 = new Vector3 (position.x, position.y, position.z + this.width1 + this.width/2 - Math.abs(r1))
  else if (r1 < 0)
    this.center1 = new Vector3 (position.x, position.y, position.z + this.width1 +  this.width/2 + Math.abs(r1))
  if (r2 > 0)
    this.center2 = new Vector3 (position.x, position.y, position.z - this.width2 -  this.width/2 - Math.abs(r2))
  else if (r2 < 0)
    this.center2 = new Vector3 (position.x, position.y, position.z - this.width2 -  this.width/2 + Math.abs(r2))

        // this.F = (n - 1) * (1/Math.abs(r1) -  1/Math.abs(r2))
    // this.D = 1/ this.F
    // this.v = v //V


    //other lenses
    const side = this.position.minus(ray.origin) //side.z + d/2 < 0 cross  -r1-r2->; size.z + d/2 > 0 cross <-r1-r2-
    if (this.r1 > 0 && this.r2 > 0) { // ((
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