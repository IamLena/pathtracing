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
      new Lense(r1, r2, width, LenPos, materials.lensematerial, r) //lense
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
      })
    }
  }
}
