/* Vector functions
-------------------------------------------------- */

var Vect3 = module.exports = {
  create: function(x, y, z) {
    return [x || 0, y || 0, z || 0]
  },
  add: function(v1, v2) {
    return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]]
  },
  sub: function(v1, v2) {
    return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]]
  },
  mul: function(v1, v2) {
    return [v1[0] * v2[0], v1[1] * v2[1], v1[2] * v2[2]]
  },
  div: function(v1, v2) {
    return [v1[0] / v2[0], v1[1] / v2[1], v1[2] / v2[2]]
  },
  muls: function(v, s) {
    return [v[0] * s, v[1] * s, v[2] * s]
  },
  divs: function(v, s) {
    return [v[0] / s, v[1] / s, v[2] / s]
  },
  len: function(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])
  },
  dot: function(v1, v2) {
    return (v1[0] * v2[0]) + (v1[1] * v2[1]) + (v1[2] * v2[2])
  },
  cross: function(v1, v2) {
    return [v1[1] * v2[2] - v1[2] * v2[1], v1[2] * v2[0] - v1[0] * v2[2], v1[0] * v2[1] - v1[1] * v2[0]]
  },
  normalize: function(v) {
    return Vect3.divs(v, Vect3.len(v))
  },
  ang: function(v1, v2) {
    return Math.acos(Vect3.dot(v1, v2) / (Vect3.len(v1) * Vect3.len(v2)))
  },
  copy: function(v) {
    return [v[0], v[1], v[2]]
  },
  equal: function(v1,v2) {
    return v1[0] === v2[0] && v1[1] === v2[1] && v1[2] === v2[2]
  },
  rotate: function(v1, v2) {
    var x1 = v1[0]
      , y1 = v1[1]
      , z1 = v1[2]
      , angleX = v2[0] / 2
      , angleY = v2[1] / 2
      , angleZ = v2[2] / 2
      , cr = Math.cos(angleX)
      , cp = Math.cos(angleY)
      , cy = Math.cos(angleZ)
      , sr = Math.sin(angleX)
      , sp = Math.sin(angleY)
      , sy = Math.sin(angleZ)
      , w = cr * cp * cy + -sr * sp * sy
      , x = sr * cp * cy - -cr * sp * sy
      , y = cr * sp * cy + sr * cp * -sy
      , z = cr * cp * sy - -sr * sp * cy
      , m0 = 1 - 2 * ( y * y + z * z )
      , m1 = 2 * (x * y + z * w)
      , m2 = 2 * (x * z - y * w)
      , m4 = 2 * ( x * y - z * w )
      , m5 = 1 - 2 * ( x * x + z * z )
      , m6 = 2 * (z * y + x * w )
      , m8 = 2 * ( x * z + y * w )
      , m9 = 2 * ( y * z - x * w )
      , m10 = 1 - 2 * ( x * x + y * y )

    return [
        x1 * m0 + y1 * m4 + z1 * m8
      , x1 * m1 + y1 * m5 + z1 * m9
      , x1 * m2 + y1 * m6 + z1 * m10
    ]
  }
}
