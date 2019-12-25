const gobtn = document.getElementById("go")
// gobtn.addEventListener('click', startTracing)

const timecounter = document.getElementById("time")

const paramForm = document.getElementById("parameters")
paramForm.addEventListener('submit', startTracing);
let x = undefined

const message = document.getElementById("result")

function startTracing(form) {
    flagend = 0
    timecounter.textContent = 0
    if (x) {clearInterval(x)}

    console.log("clicked")
    let params = {}
    form.preventDefault();
    els = event.target.elements
    console.log(els)
    let arrayc = [0, 0, 0]
    let arrayl = [0, 0, 0]
    for (let i = 0; i < els.length - 1; i++) {
        let val = els[i].value
        if (val == '' || val == 'empty') {
            els[i].value = 'empty'
        }
        else {
            val = parseFloat(val)
            if (isNaN(val)) {
                els[i].value = 'error'
                return
            }
            if (els[i].name == 'CamPosx') {
                arrayc[0] = val
            }
            else if (els[i].name == 'CamPosy') {
                arrayc[1] = val
                console.log(arrayc[1])
            }
            else if (els[i].name == 'CamPosz') {
                arrayc[2] = val
                CamPos = new Vector3(arrayc[0], arrayc[1], arrayc[2])
                console.log(arrayc)
                console.log(CamPos)
                params["CamPos"] = CamPos
            }
            else if (els[i].name == 'LenPosx') {
                arrayl[0] = val
            }
            else if (els[i].name == 'LenPosy') {
                arrayl[1] = val
            }
            else if (els[i].name == 'LenPosz') {
                arrayl[2] = val
                LenPos = new Vector3(arrayl[0], arrayl[1], arrayl[2])
                params["LenPos"] = LenPos
            }
            else
                params[els[i].name] = val
        }
    }
    console.log(params)


    const view = document.getElementById('view')
    const context = view.getContext('2d')
    context.clearRect(0, 0, view.width, view.height);

    const scene = new BoxScene(params)
    message.textContent = scene.getmsg();
    const tracer = new Tracer({ scene, width: view.width, height: view.height, bounces: 10, debug: 1000 })
    const renderer = new CanvasRenderer(tracer, view)
    
    scene.load().then(() => {
        tracer.start();
        console.log('hey');
    })
    
    
    x = setInterval(timecount, 100)
}

function timecount() {
    let time = parseFloat(timecounter.textContent)
    time += 0.1
    time = time.toFixed(2)
    timecounter.textContent = time
}