class BoxScene extends Scene {
  constructor (params) {
    super()
    let CamPos = params["CamPos"]
    let vertAngle = params["vert"]
    let horAngle = params["horz"]
    let LenPos = params["LenPos"]
    let r1 = params["r1"]
    let r2 = params["r2"]
    let r = params["lenseR"]
    let width = params["lenWid"]
    this.lensen = params["lenN"]
    this.envn = params["envN"]
    let objPos = params["objPos"]
    this.objcol = params["objcol"]
    let objr = params["objr"]
    this.envn = params["EnvN"]
    
    const materials = this.materials
    this.environment = "./images/uffizi-probe.png"

    this.objects = [
      new Sphere(new Vector3(0, 25, 155), 2, materials.brightLight), //light
      new Sphere(objPos, objr, materials.objmaterial), //obj
      new Sphere(new Vector3(objPos.x, objPos.y + objr + objr/2, objPos.z), objr /2, materials.objmaterial2),
      new Lense(r1, r2, width, LenPos, materials.lensematerial2, r) //lense
    ]
    this.camera = new Camera({ lens: 0.04, focus: 15, position: CamPos, verticalAngle: vertAngle, horizontalAngle: horAngle})
  }

  get materials () {
    return {
      brightLight: new Material({
        light: new Vector3(3000, 3000, 3000),
        transparency: 1,
        fresnel: new Vector3(0, 0, 0)
      }),
      lensematerial: new Material({
        refraction: this.lensen,
        opacity: 0,
        transparency: 1,
        fresnel: new Vector3(0.02, 0.02, 0.02),
        envn: this.envn
      }),
      objmaterial: new Material({
        color: this.objcol,
        fresnel: new Vector3(0.04, 0.04, 0.04),
        gloss: 0.2
      }),
      objmaterial2: new Material({
        color: new Vector3(1 - this.objcol.x, 1 - this.objcol.y, 1 - this.objcol.z),
        fresnel: new Vector3(0.04, 0.04, 0.04),
        gloss: 0.2
      }),
      whiteLambert: new Material({
        color: new Vector3(1, 1, 1),
        fresnel: new Vector3(0.03, 0.03, 0.03),
        gloss: 0
      }),
      shinyBlack: new Material({
        color: new Vector3(0, 0, 0),
        fresnel: new Vector3(0.04, 0.04, 0.04),
        gloss: 0.9
      }),
      bluePlastic: new Material({
        color: new Vector3(0.1, 0.1, 1),
        fresnel: new Vector3(0.04, 0.04, 0.04),
        gloss: 0.2
      }),
      redPlastic: new Material({
        color: new Vector3(1, 0, 0),
        fresnel: new Vector3(0.04, 0.04, 0.04),
        gloss: 0.2
      }),
      gold: new Material({
        fresnel: new Vector3(1.022, 0.782, 0.344),
        color: new Vector3(0, 0, 0),
        metal: 1,
        gloss: 0.7
      }),
      copper: new Material({
        fresnel: new Vector3(0.955,0.638,0.538),
        metal: 0.9,
        gloss: 1
      }),
      silver: new Material({
        fresnel: new Vector3(0.972, 0.960, 0.915),
        color: new Vector3(0.972, 0.960, 0.915),
        metal: 0.9,
        gloss: 1
      }),
      glass: new Material({
        refraction: 1.6,
        opacity: 0,
        transparency: 1,
        fresnel: new Vector3(0.04, 0.04, 0.04)
      }),
      greenGlass: new Material({
        refraction: 1.52,
        transparency: 0.95,
        gloss: 1,
        color: new Vector3(0, 1, 0),
        fresnel: new Vector3(0.05, 0.05, 0.05)
      }),
      lensematerial2: new Material({
        refraction: this.lensen,
        transparency: 1,
        gloss: 1,
        fresnel: new Vector3(0.05, 0.05, 0.05)
      })
    }
  }
}
