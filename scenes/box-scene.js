class BoxScene extends Scene {
  constructor (params) {
    super()
    this.envn = params["n1"]
    this.lensen = params["n2"]
    let CamPos = params["CamPos"]
    let LenPos = params["LenPos"]
    let r1 = params["r1"]
    let r2 = params["r2"]
    let width = params["width"]

    const materials = this.materials
    this.environment = 'images/uffizi-probe.png'
    this.objects = [
      // new Sphere(new Vector3(-1005, 0, -8), 1000, materials.bluePlastic),//left
      // new Sphere(new Vector3(1005, 0, -8), 1000, materials.redPlastic),//right
      // new Sphere(new Vector3(0, -1003, -8), 1000, materials.shinyBlack),//bottom
      // new Sphere(new Vector3(0, 1003, -8), 1000, materials.copper),//top
      // new Sphere(new Vector3(0, 0, -1010), 1000, materials.whiteLambert),//straight
      
      // new Sphere(new Vector3(0, 13, -8), 10.5, materials.brightLight),//light
      // new Sphere(new Vector3(0, -2, -7), 1, materials.gold),
      // new Sphere(new Vector3(0, -2, -3), 1, materials.greenGlass)

      // new Sphere(new Vector3(-2020, 20, 0), 2000, materials.bluePlastic),//left
      // new Sphere(new Vector3(2020, 20, 0), 2000, materials.redPlastic),//right
      new Sphere(new Vector3(0, -2000, 0), 2000, materials.yellowPlastic),//bottom
      // new Sphere(new Vector3(0, 2040, 0), 2000, materials.greenPlastic),//top
      // new Sphere(new Vector3(0, 0, -2020), 2000, materials.whiteLambert),//straight
      
      new Sphere(new Vector3(0, 45, 0), 12, materials.brightLight),//light
      new Sphere(new Vector3(0, 23, -100), 23, materials.bluePlastic),
      // new Sphere(LenPos, 10, materials.glass),
      new Lense(r1, r2, width, 0, 0, 0, this.lensen, LenPos, materials.lensematerial)
    ]
    //0.040, 15
    this.camera = new Camera({ lens: 0.04, focus: 15, position: CamPos, verticalAngle: 0, horizontalAngle: -90 })
  }
  // http://blog.selfshadow.com/publications/s2015-shading-course/hoffman/s2015_pbs_physics_math_slides.pdf
  get materials () {
    return {
      brightLight: new Material({
        light: new Vector3(3000, 3000, 3000),
        transparency: 1,
        fresnel: new Vector3(0, 0, 0)
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
      lensematerial: new Material({
        refraction: this.lensen,
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
