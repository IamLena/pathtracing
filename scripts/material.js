class Material {
  constructor ({ color, fresnel, gloss, transparency, refraction, metal, light, envn }) {
    this.color = color || new Vector3()
    this.refraction = refraction || 1
    this.envn = envn || 1
    this.transparency = transparency || new Vector3(0, 0, 0)
    this.light = light || new Vector3(0, 0, 0)
    this.fresnel = fresnel || new Vector3(0.04, 0.04, 0.04)
    this.metal = metal || 0
    this.gloss = gloss || 0
  }
  emit (normal, direction) {
    if (this.light.max === 0) return null
    const cos = Math.max(normal.dot(direction.scaledBy(-1)), 0)
    return this.light.scaledBy(cos)
  }
  bsdf (normal, direction, length) {
    const entering = direction.enters(normal)
    if (entering) {
      const reflect = this._schlick(normal, direction)
      const roughness = 1 - this.gloss
      // reflected
      if (Math.random() <= reflect.ave) { 
        const reflected = direction.reflected(normal).randomInCone(roughness)
        const tint = new Vector3(1, 1, 1).lerp(this.fresnel, this.metal)
        // TODO: how to change color of reflections based on fresnel (gold?)
        return { direction: reflected, signal: tint }
      }
      // transmitted (entering)
      if (Math.random() <= this.transparency) {
        const transmitted = direction.refracted(normal, this.envn, this.refraction).randomInCone(roughness)
        return { direction: transmitted, signal: new Vector3(1, 1, 1) }
      }
      // absorbed
      if (Math.random() <= this.metal) return null
      // diffused
      const diffused = normal.randomInCosHemisphere
      const pdf = Math.PI // cosine weighted distribution doesn't need lambert's cos(theta)
      return { direction: diffused, signal: this.color.scaledBy(1 / pdf) } 
    }
    // transmitted (exiting)
    else {
      const exited = direction.refracted(normal.scaledBy(-1), this.refraction, this.envn)
      if (!exited) return null
      const opacity = 1 - this.transparency
      const volume = Math.min(opacity * length * length, 1)
      const tint = new Vector3(1, 1, 1).lerp(this.color, volume)
      return { direction: exited, signal: tint }
    }
  }
  // http://blog.selfshadow.com/publications/s2015-shading-course/hoffman/s2015_pbs_physics_math_slides.pdf
  // http://graphics.stanford.edu/courses/cs348b-10/lectures/reflection_i/reflection_i.pdf
  _schlick (incident, normal) {
    const cosIncident = incident.scaledBy(-1).dot(normal)
    return this.fresnel.plus((new Vector3(1,1,1).minus(this.fresnel)).scaledBy(Math.pow(1 - cosIncident, 5)))
  }
}
