class CanvasRenderer {
  constructor (tracer, canvas) {
    const context = canvas.getContext('2d')
    frame()
    
    function frame() {
      context.putImageData(tracer.data, 0, 0)
      // if (flagend == 1) {
      //   requestAnimationFrame(frame)
      // }
      requestAnimationFrame(frame)
    }
  }
}