const gobtn = document.getElementById("go")
const timecounter = document.getElementById("time")
const paramForm = document.getElementById("parameters")
paramForm.addEventListener('submit', startTracing);

let interval = undefined

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
    
    //background
    if (params["background"] == "phon1") {params["background"] = "./images/uffizi-probe.png"}
    else if (params["background"] == "phon2") {params["background"] = "./images/stpeters-probe.png"}
    else if (params["background"] == "phon3") {params["background"] = "./images/grace-probe.png"}

    //camara position
    x =  parseInt(params["CamPosx"])
    y =  parseInt(params["CamPosy"])
    z =  parseInt(params["CamPosz"])
    if (isNaN(x)) {x = 0}
    if (isNaN(y)) {y = 30}
    if (isNaN(z)) {z = 100}
    params["CamPos"] = [x, y, z]
    
    //camera angles
    let vert = parseInt(params["vert"])
    let horz = parseInt(params["horz"])
    if (isNaN(vert)) {params["vert"] = 0} else {params["vert"] = vert}
    if (isNaN(horz)) {params["horz"] = 0} else {params["horz"] = horz}

    //obj radius
    let objr = parseInt(params["objr"])
    if (isNaN(objr) || objr <= 0) {params["objr"] = 20}
    else {params["objr"] = objr}

    //lenseposition
    x =  parseInt(params["LenPosx"])
    y =  parseInt(params["LenPosy"])
    z =  parseInt(params["LenPosz"])
    if (isNaN(x)) {x = 0}
    if (isNaN(y)) {y = 30}
    if (isNaN(z)) {z = 100}
    params["LenPos"] = [x, y, z]

    //lense raduis
    let r1 = parseFloat(params["r1"])
    if (isNaN(r1)) {params["r1"] = 10} else {params["r1"] = r1}
    let r2 = parseFloat(params["r2"])
    if (isNaN(r2)) {params["r2"] = 10} else {params["r2"] = r2}
    let lenseR = parseFloat(params["lenseR"])
    if (isNaN(lenseR) || lenseR <= 0) {params["lenseR"] = 10} else {params["lenseR"] = lenseR}

    //lense width
    let lenWid = parseFloat(params["lenWid"])
    if (isNaN(lenWid) || lenWid <= 0) {params["lenWid"] = 20} else {params["lenWid"] = lenWid}

    // refractive indexes
    let lenN = parseFloat(params["lenN"])
    if (isNaN(lenN)) {params["lenN"] = 1.5} else {params["lenN"] = lenN}
    let envN = parseFloat(params["envN"])
    if (isNaN(envN)) {params["envN"] = 1} else {params["envN"] = envN}

    //object positions
    let objzStep = parseInt(params["objzStep"])
    if (isNaN(objzStep)) {objzStep = 30}
    params["objzStep"] = objzStep

    x =  parseInt(params["objPosx"])
    y =  parseInt(params["objPosy"])
    z =  parseInt(params["objPosz"])
    if (isNaN(x)) {x = 0}
    if (isNaN(y)) {y = 30}
    if (isNaN(z)) {z = 100}
    params["objPos"] = [x, y, z]

    let params2 = params
    let params3 = params
    let params4 = params
    params2["objPos"] = [x, y, z - objzStep]
    params3["objPos"] = [x, y, z - 2 * objzStep]
    params4["objPos"] = [x, y, z - 3 * objzStep]

    console.log(params)

    //VIEW 1
    const view1 = document.getElementById('view1')
    const context1 = view1.getContext('2d')
    context1.clearRect(0, 0, view1.width, view1.height);

    const scene1 = new BoxScene(params)
    const tracer1 = new Tracer({scene: scene1, width: view1.width, height: view1.height, bounces: 10, debug: 1000})
    const renderer1 = new CanvasRenderer(tracer1, view1)

    //VIEW 2
    const view2 = document.getElementById('view2')
    const context2 = view2.getContext('2d')
    context2.clearRect(0, 0, view2.width, view2.height);

    const scene2 = new BoxScene(params)
    const tracer2 = new Tracer({scene: scene2, width: view2.width, height: view2.height, bounces: 10, debug: 1000})
    const renderer2 = new CanvasRenderer(tracer2, view2)

    //VIEW 3
    const view3 = document.getElementById('view3')
    const context3 = view3.getContext('2d')
    context3.clearRect(0, 0, view3.width, view3.height);

    const scene3 = new BoxScene(params)
    const tracer3 = new Tracer({scene: scene3, width: view3.width, height: view3.height, bounces: 10, debug: 1000})
    const renderer3 = new CanvasRenderer(tracer3, view3)

    //VIEW 4
    const view4 = document.getElementById('view4')
    const context4 = view4.getContext('2d')
    context4.clearRect(0, 0, view4.width, view4.height);

    const scene4 = new BoxScene(params)
    const tracer4 = new Tracer({scene: scene4, width: view4.width, height: view4.height, bounces: 10, debug: 1000})
    const renderer4 = new CanvasRenderer(tracer4, view4)

    scene1.load().then(() => {
        tracer1.start();
    })
    
    scene2.load().then(() => {
        tracer2.start();
    })
    
    scene3.load().then(() => {
        tracer3.start();
    })

    scene4.load().then(() => {
        tracer4.start();
    })
    
    interval = setInterval(timecount, 100)
}

function timecount() {
    let time = parseFloat(timecounter.textContent)
    time += 0.1
    time = time.toFixed(2)
    timecounter.textContent = time
}