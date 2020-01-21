const gobtn = document.getElementById("go")
const timecounter = document.getElementById("time")
const paramForm = document.getElementById("parameters")
paramForm.addEventListener('submit', startTracing);

let interval = undefined

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return [parseInt(result[1], 16) / 225, parseInt(result[2], 16) / 225, parseInt(result[3], 16) / 225]
}

const defaultparams = {
    "CamPosx": 0,
    "CamPosy": 0,
    "CamPosz": 220,
    "vert": 0,
    "horz": 0,
    "objr": 5,
    "objcol": "#0000ff",
    "objPosx": 0,
    "objPosy": -2,
    "objPosz": 150,
    "LenPosx": 0,
    "LenPosy": 0,
    "LenPosz": 170,
    "r1": 20,
    "r2": -30,
    "lenWid": 2,
    "lenseR": 10,
    "envN": 1,
    "lenN": 1.5,
    "CamPos": new Vector3(0, 10, 220),
    "LenPos": new Vector3(0, 10, 170),
    "objPos": new Vector3(0, 10, 150)
}

let els = paramForm.elements
for (let i = 0; i < els.length - 1; i++) {
    els[i].value = defaultparams[els[i].name]
}

function startTracing(form) {
    flagend = 0
    timecounter.textContent = 0
    if (interval) {clearInterval(interval)}

    let params = {}
    form.preventDefault();
    els = event.target.elements
    console.log(els)
    for (let i = 0; i < els.length - 1; i++) {
        val = els[i].value;
        params[els[i].name] = els[i].value;
    }
    console.log(params)

    let x, y, z

    //camera position
    x =  parseInt(params["CamPosx"])
    y =  parseInt(params["CamPosy"])
    z =  parseInt(params["CamPosz"])
    if (isNaN(x)) {x = defaultparams["CamPosx"]}
    if (isNaN(y)) {y = defaultparams["CamPosy"]}
    if (isNaN(z)) {z = defaultparams["CamPosz"]}
    params["CamPosx"] = x
    params["CamPosy"] = y
    params["CamPosz"] = z
    params["CamPos"] = new Vector3 (x, y, z)
    
    //camera angles
    let vert = parseInt(params["vert"])
    let horz = parseInt(params["horz"])
    if (isNaN(vert)) {params["vert"] = defaultparams["vert"]} else {params["vert"] = vert}
    if (isNaN(horz)) {params["horz"] = defaultparams["horz"]} else {params["horz"] = horz}

    //lenseposition
    x =  parseInt(params["LenPosx"])
    y =  parseInt(params["LenPosy"])
    z =  parseInt(params["LenPosz"])
    if (isNaN(x)) {x = defaultparams["LenPosx"]}
    if (isNaN(y)) {y = defaultparams["LenPosy"]}
    if (isNaN(z)) {z = defaultparams["LenPosz"]}
    params["LenPosx"] = x
    params["LenPosy"] = y
    params["LenPosz"] = z
    params["LenPos"] = new Vector3 (x, y, z)

    //lense raduis
    let r1 = parseFloat(params["r1"])
    if (isNaN(r1) || r1 == 0) {params["r1"] = defaultparams["r1"]} else {params["r1"] = r1}
    let r2 = parseFloat(params["r2"])
    if (isNaN(r2) || r2 == 0) {params["r2"] = defaultparams["r2"]} else {params["r2"] = r2}
    
    //lense width
    let lenWid = parseFloat(params["lenWid"])
    if (isNaN(lenWid) || lenWid <= 0) {params["lenWid"] = defaultparams["lenWid"]} else {params["lenWid"] = lenWid}
    //lenseR
    let lenseR = parseFloat(params["lenseR"])
    if (isNaN(lenseR) || lenseR <= 0) {params["lenseR"] = defaultparams["LenseR"]} else {params["lenseR"] = lenseR}

    // refractive indexes
    let lenN = parseFloat(params["lenN"])
    if (isNaN(lenN)) {params["lenN"] = defaultparams["LenN"]} else {params["lenN"] = lenN}
    let envN = parseFloat(params["envN"])
    if (isNaN(envN)) {params["envN"] = defaultparams["envN"]} else {params["envN"] = envN}

    //obj radius
    let objr = parseInt(params["objr"])
    if (isNaN(objr) || objr <= 0) {params["objr"] = defaultparams["objr"]}
    else {params["objr"] = objr}

    //obj color
    rgb = hexToRgb(params["objcol"])
    params["objcol"] = new Vector3 (rgb[0], rgb[1], rgb[2])

    //object position
    x =  parseInt(params["objPosx"])
    y =  parseInt(params["objPosy"])
    z =  parseInt(params["objPosz"])
    if (isNaN(x)) {x = defaultparams["objPosx"]}
    if (isNaN(y)) {y = defaultparams["objPosy"]}
    if (isNaN(z)) {z = defaultparams["objPosz"]}
    params["objPos"] = new Vector3 (x, y, z)

    for (let i = 0; i < els.length - 1; i++) {
        if (els[i].name != 'objcol') {
            els[i].value = params[els[i].name]
        }
    }

    let params2 = {}
    Object.assign(params2, params)
    let campos2 = new Vector3(params["LenPosx"] + params["CamPosz"] - params["LenPosz"], params["CamPosy"], params["LenPosz"])
    params2["CamPos"] = campos2
    params2["horz"] = params["horz"] - 90

    //VIEW 1
    const view1 = document.getElementById('view1')
    const context1 = view1.getContext('2d')
    context1.clearRect(0, 0, view1.width, view1.height);

    const scene1 = new BoxScene(params)
    const tracer1 = new Tracer({scene: scene1, width: view1.width, height: view1.height, bounces: 10, debug: 1000})
    const renderer1 = new CanvasRenderer(tracer1, view1)

    // VIEW 2
    const view2 = document.getElementById('view2')
    const context2 = view2.getContext('2d')
    context2.clearRect(0, 0, view2.width, view2.height);

    const scene2 = new BoxScene(params2)
    const tracer2 = new Tracer({scene: scene2, width: view2.width, height: view2.height, bounces: 10, debug: 1000})
    const renderer2 = new CanvasRenderer(tracer2, view2)

    scene1.load().then(() => {
        tracer1.start();
    })
    
    scene2.load().then(() => {
        tracer2.start();
    })

    interval = setInterval(timecount, 100)
}

function timecount() {
    let time = parseFloat(timecounter.textContent)
    time += 0.1
    time = time.toFixed(2)
    timecounter.textContent = time
}