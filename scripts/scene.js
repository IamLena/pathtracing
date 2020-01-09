class Scene {
  constructor () {
    this.objects = []
    this.environment = null
    this._black = new Vector3()
  }
  intersect (ray) {
    let closest = { object: undefined, distance: Infinity, normal: undefined}
    for (let obj of this.objects) {
      let value = obj.intersectionDistance(ray)
      let dist = value.dist
      let point = value.point
      let normal = value.normal
      if (dist < closest.distance) {
        closest = { object: obj, distance: dist, point: point, normal: normal}
      }
    }
    if (!closest.object) return {}
    const point = closest.point
    const normal = closest.normal
    return { hit: point, normal, material: closest.object.material, distance: closest.distance}
  }
  async load () {
    if (!this.environment) return
    const image = new Image()
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    image.src = this.environment
    return new Promise((resolve, reject) => {
      image.src = this.environment
      image.addEventListener('load', () => {
        canvas.width = image.width
        canvas.height = image.height
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        this.pixels = context.getImageData(0, 0, canvas.width, canvas.height).data
        resolve(this)
      })
    })
  }
  bg (ray) {
    if (!this.environment) return this._black
    const d = Math.sqrt(ray.direction.x * ray.direction.x + ray.direction.y * ray.direction.y)
    const r = 0.159154943 * Math.acos(ray.direction.z) / d
    const u = 0.5 + ray.direction.x * r
    const v = 0.5 + ray.direction.y * -r
    const x = u * 1500
    const y = v * 1500
    const index = (Math.floor(y) * 1500 + Math.floor(x)) * 4
    const rgb = new Vector3(this.pixels[index], this.pixels[index + 1], this.pixels[index + 2])
    const scale = rgb.length > 441 ? 2 : 1
    return rgb.scaledBy(scale)
  }
}

