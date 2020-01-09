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
    this.lensen = params["lenseN"]
    this.envn = params["envN"]
    let objPos = params["objPos"]
    this.objcol = params["objcol"]
    let objr = params["objr"]
    
    const materials = this.materials
    this.environment = "./images/uffizi-probe.png"

    this.objects = [
      // new Sphere(new Vector3(0, -2000, 0), 2000, materials.yellowPlastic),//bottom
      
      new Sphere(new Vector3(0, 45, 0), 12, materials.brightLight),//light

      new Sphere(new Vector3(-14, 0, 40), 5, materials.bluePlastic),
      new Sphere(new Vector3(-7, 0, 55), 5, materials.greenPlastic),
      new Sphere(new Vector3(0, 0, 70), 5, materials.yellowPlastic),
      new Sphere(new Vector3(7, 0, 85), 5, materials.redPlastic),
      new Sphere(new Vector3(14, 0, 100), 5, materials.cyanPlastic),

      new Lense(r1, r2, width, LenPos, materials.lensematerial, r)
    ]
    this.camera = new Camera({ lens: 0.04, focus: 15, position: CamPos, verticalAngle: vertAngle, horizontalAngle: horAngle})
  }

  // http://blog.selfshadow.com/publications/s2015-shading-course/hoffman/s2015_pbs_physics_math_slides.pdf
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
        fresnel: new Vector3(0.02, 0.02, 0.02)
      }),
      objmaterial: new Material({
        color: this.objcol,
        fresnel: new Vector3(0.04, 0.04, 0.04),
        gloss: 0.2
      }),


      whiteLambert: new Material({
        color: new Vector3(1, 1, 1),
        fresnel: new Vector3(0.03, 0.03, 0.03),
        gloss: 0
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
      greenPlastic: new Material({
        color: new Vector3(0, 1, 0),
        fresnel: new Vector3(0.04, 0.04, 0.04),
        gloss: 0.2
      }),
      yellowPlastic: new Material({
        color: new Vector3(1, 1, 0),
        fresnel: new Vector3(0.04, 0.04, 0.04),
        gloss: 0.2
      }),
      cyanPlastic: new Material({
        color: new Vector3(0, 1, 1),
        fresnel: new Vector3(0.04, 0.04, 0.04),
        gloss: 0.2
      }),
      glass: new Material({
        refraction: 1.6,
        opacity: 0,
        transparency: 1,
        fresnel: new Vector3(0.04, 0.04, 0.04)
      }),
      gold: new Material({
        fresnel: new Vector3(1.022, 0.782, 0.344),
        color: new Vector3(0, 0, 0),
        metal: 1,
        gloss: 0.7
      }),
      shinyBlack: new Material({
        color: new Vector3(0, 0, 0),
        fresnel: new Vector3(0.04, 0.04, 0.04),
        gloss: 0.9
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
      greenGlass: new Material({
        refraction: 1.52,
        transparency: 0.95,
        gloss: 1,
        color: new Vector3(0, 1, 0),
        fresnel: new Vector3(0.05, 0.05, 0.05)
      })
    }
  }
}
