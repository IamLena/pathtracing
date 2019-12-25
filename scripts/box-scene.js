class BoxScene extends Scene {
  constructor (params) {
    super()
    this.envn = params["n1"]
    this.lensen = params["n2"]
    let CamPos = params["CamPos"]
    let LenPos = params["LenPos"]
    let r1 = params["r1"]
    let r2 = params["r2"]
    let r = params["r"]
    let width = params["width"]
    let vertAngle = params["CamVert"]
    let horAngle = params["CamHor"]

    const materials = this.materials
    this.environment = 'images/uffizi-probe.png'
    this.objects = [
      new Sphere(new Vector3(0, -2000, 0), 2000, materials.yellowPlastic),//bottom
      
      new Sphere(new Vector3(0, 45, 0), 12, materials.brightLight),//light
      new Sphere(new Vector3(0, 30, -100), 30, materials.bluePlastic),
      new Lense(r1, r2, width, LenPos, materials.lensematerial, r)
    ]
    // this.msg = this.objects[3].getmsg();
    this.camera = new Camera({ lens: 0.04, focus: 15, position: CamPos, verticalAngle: vertAngle, horizontalAngle: horAngle })
  }
  getmsg() {
    return this.msg
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
