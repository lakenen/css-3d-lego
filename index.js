
// var PI = Math.PI
//   , PI2 = 2 * PI
//   , CYL_FACES = 20

// function createFace(w, h, color) {
//   var el = document.createElement('div')
//   el.style.position = 'absolute'
//   el.style.top = 0
//   el.style.left = 0
//   el.style.width = w + 'px'
//   el.style.height = h + 'px'
//   el.style.background = color || 'red'
//   return el
// }

// function createCircularFace(r, color) {
//   var el = createFace(r * 2, r * 2, color)
//   el.style.borderRadius = r + 'px'
//   return el
// }

// function cylinder(x, y, z, r, h) {
//   var c = PI2 * r
//     , w = c / CYL_FACES
//     , i
//     , face
//     , rotateY = 360 / CYL_FACES
//     , container = document.createElement('div')
//     , top = createCircularFace(r, color)
//     , bottom = top.cloneNode()

//   for (i = 0; i < CYL_FACES; ++i) {
//     face = createFace(w, h)
//     face.style.transform = 'rotateY(' + (rotateY * i) + 'deg) translateZ(' + r + 'px)'
//     container.appendChild(face)
//   }

//   top.style.transform = ''
//   container.appendChild(top)
//   container.appendChild(bottom)

//   container.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px)'
//   container.style.transformStyle = 'preserve-3d'
//   return container
// }
'use strict'

var PI = Math.PI
// magic numbers that are approximately the correct actual lego ratios
var STUD_WIDTH = 50
var STUD_SPACING = STUD_WIDTH / 1.5
var PLATE_HEIGHT = STUD_SPACING
var STUD_HEIGHT = PLATE_HEIGHT / 1.88
var STUD_PADDING = STUD_WIDTH / 3.2


window.onload = function init() {
  var viewport = document.body
  viewport.style.transform = 'translate(50%, 50%)'
  viewport.style.transformStyle = 'preserve-3d'
  viewport.style.perspective = '1000px'

  var plate = createPlate(2, 5)
  viewport.appendChild(plate)

  function loop() {
    updateColors(plate)
    window.requestAnimationFrame(loop, plate)
  }

  loop()
}

function matrixString(m) {
  return 'matrix3d(' + [
    m.m11, m.m12, m.m13, m.m14,
    m.m21, m.m22, m.m23, m.m24,
    m.m31, m.m32, m.m33, m.m34,
    m.m41, m.m42, m.m43, m.m44
  ].join(', ') + ')'
}

function identityMatrix() {
  var m = {}
  m.m11 = m.a = 1; m.m12 = m.b = 0; m.m13 = 0; m.m14 = 0
  m.m21 = m.c = 0; m.m22 = m.d = 1; m.m23 = 0; m.m24 = 0
  m.m31 = 0; m.m32 = 0; m.m33 = 1; m.m34 = 0;
  m.m41 = m.e = 0; m.m42 = m.f = 0; m.m43 = 0; m.m44 = 1
  return m
}

function multiplyMatrix(m1, m2) {

  var m11 = m2.m11 * m1.m11 + m2.m12 * m1.m21 + m2.m13 * m1.m31 + m2.m14 * m1.m41
    , m12 = m2.m11 * m1.m12 + m2.m12 * m1.m22 + m2.m13 * m1.m32 + m2.m14 * m1.m42
    , m13 = m2.m11 * m1.m13 + m2.m12 * m1.m23 + m2.m13 * m1.m33 + m2.m14 * m1.m43
    , m14 = m2.m11 * m1.m14 + m2.m12 * m1.m24 + m2.m13 * m1.m34 + m2.m14 * m1.m44

    , m21 = m2.m21 * m1.m11 + m2.m22 * m1.m21 + m2.m23 * m1.m31 + m2.m24 * m1.m41
    , m22 = m2.m21 * m1.m12 + m2.m22 * m1.m22 + m2.m23 * m1.m32 + m2.m24 * m1.m42
    , m23 = m2.m21 * m1.m13 + m2.m22 * m1.m23 + m2.m23 * m1.m33 + m2.m24 * m1.m43
    , m24 = m2.m21 * m1.m14 + m2.m22 * m1.m24 + m2.m23 * m1.m34 + m2.m24 * m1.m44

    , m31 = m2.m31 * m1.m11 + m2.m32 * m1.m21 + m2.m33 * m1.m31 + m2.m34 * m1.m41
    , m32 = m2.m31 * m1.m12 + m2.m32 * m1.m22 + m2.m33 * m1.m32 + m2.m34 * m1.m42
    , m33 = m2.m31 * m1.m13 + m2.m32 * m1.m23 + m2.m33 * m1.m33 + m2.m34 * m1.m43
    , m34 = m2.m31 * m1.m14 + m2.m32 * m1.m24 + m2.m33 * m1.m34 + m2.m34 * m1.m44

    , m41 = m2.m41 * m1.m11 + m2.m42 * m1.m21 + m2.m43 * m1.m31 + m2.m44 * m1.m41
    , m42 = m2.m41 * m1.m12 + m2.m42 * m1.m22 + m2.m43 * m1.m32 + m2.m44 * m1.m42
    , m43 = m2.m41 * m1.m13 + m2.m42 * m1.m23 + m2.m43 * m1.m33 + m2.m44 * m1.m43
    , m44 = m2.m41 * m1.m14 + m2.m42 * m1.m24 + m2.m43 * m1.m34 + m2.m44 * m1.m44

  return {
    a: m11, b: m12, c: m21, d: m22, e: m41, f: m42,
    m11: m11, m12: m12, m13: m13, m14: m14,
    m21: m21, m22: m22, m23: m23, m24: m24,
    m31: m31, m32: m32, m33: m33, m34: m34,
    m41: m41, m42: m42, m43: m43, m44: m44
  }
}

function parseCSSMatrix(string) {
  var i
    , m = identityMatrix()
    , parts = []
    , patternNone = /^none$/
    , patternMatrix = /^matrix\((.*)\)/
    , patternMatrix3d = /^matrix3d\((.*)\)/

  string = String(string).trim()
  if (patternNone.test(string)) return m

  parts = string.replace(/^.*\((.*)\)$/g, "$1").split(/\s*,\s*/).map(parseFloat)

  if (patternMatrix.test(string) && parts.length === 6) {
    m.m11 = m.a = parts[0]; m.m12 = m.b = parts[2]; m.m41 = m.e = parts[4]
    m.m21 = m.c = parts[1]; m.m22 = m.d = parts[3]; m.m42 = m.f = parts[5]
  } else if (patternMatrix3d.test(string) && parts.length === 16) {
    m.m11 = m.a = parts[0]; m.m12 = m.b = parts[1]; m.m13 = parts[2];  m.m14 = parts[3]
    m.m21 = m.c = parts[4]; m.m22 = m.d = parts[5]; m.m23 = parts[6];  m.m24 = parts[7]
    m.m31 = parts[8]; m.m32 = parts[9]; m.m33 = parts[10]; m.m34 = parts[11]
    m.m41 = m.e = parts[12]; m.m42 = m.f = parts[13]; m.m43 = parts[14]; m.m44 = parts[15]
  } else {
    throw new TypeError('Invalid Matrix Value')
  }
  return m
}

function updateColors(node, m) {
  var style, matrix
  if (node.clientWidth && node.clientHeight) {
    style = window.getComputedStyle(node)
    matrix = multiplyMatrix(m || identityMatrix(), parseCSSMatrix(style.transform))
    var rx = Math.acos(matrix.m11) * (matrix.m13 > 0 ? -1 : 1)
    var ry = Math.asin(matrix.m22)


    var alpha = (100 * Math.cos(rx / 1.5) * Math.cos(ry / 2)).toFixed(0)
    if (node.dataset.alpha !== alpha) {

      if (node.classList.contains('cap')) {
        node.style.backgroundColor = node.parentNode.parentNode.style.background
        return
        var el = createAssembly()
        document.body.appendChild(el)
        el.style.transform = matrixString(matrix)
        console.log(matrix, rx * 180 / PI, ry * 180 / PI)
      }
      // if (node.classList.contains('top')) {
      //   var el = createAssembly()
      //   document.body.appendChild(el)
      //   el.style.transform = matrixString(matrix)
      //   console.log(matrix, rx * 180 / PI, ry * 180 / PI)
      // }
      node.style.backgroundColor = 'hsla(0, 0%, ' + alpha + '%, 1)'
      node.dataset.alpha = alpha
    }
  }
  if (node.hasChildNodes()) {
    Array.prototype.forEach.call(node.childNodes, function (n) {
      updateColors(n, matrix)
    })
  }
}


// assemblies are for grouping faces and other assemblies
function createAssembly() {
  var assembly = document.createElement('div')
  assembly.classList.add('assembly')
  return assembly
}

// rows/cols in studs
function createPlate(rows, cols, color) {

  var container = createAssembly()

  var plateWidth = STUD_PADDING * 2 + rows * (STUD_WIDTH + STUD_SPACING) - STUD_SPACING
  var plateLength = STUD_PADDING * 2 + cols * (STUD_WIDTH + STUD_SPACING) - STUD_SPACING


  var bottom = createFace(plateWidth, plateLength, 0, 0, 0, PI, PI, PI)
  var top = createFace(plateWidth, plateLength)
  top.classList.add('top')
  top.style.transform += ' translateZ(' + PLATE_HEIGHT.toFixed(2) + 'px)'
  var back = createFace(plateWidth, PLATE_HEIGHT, 0, 0, 0, PI / 2)
  back.classList.add('back')
  var front = createFace(plateWidth, PLATE_HEIGHT, 0, 0, 0, -PI / 2)
  front.classList.add('front')
  front.style.transform += ' translateZ(' + plateLength.toFixed(2) + 'px)'
  front.style.transform += ' translateY(' + (-PLATE_HEIGHT).toFixed(2) + 'px)'
  var left = createFace(PLATE_HEIGHT, plateLength, 0, 0, 0, 0, -PI / 2)
  left.classList.add('left')
  var right = createFace(PLATE_HEIGHT, plateLength, 0, 0, 0, 0, PI / 2)
  right.classList.add('right')
  right.style.transform += ' translateZ(' + plateWidth.toFixed(2) + 'px)'
  right.style.transform += ' translateX(' + (-PLATE_HEIGHT).toFixed(2) + 'px)'


  var studR = STUD_WIDTH / 2
    , studH = STUD_HEIGHT
    , studZ = 0
    , studRX = PI / 2
    , studX
    , studY
    , stud
    , r
    , c
  for (r = 0; r < rows; ++r) {
    for (c = 0; c < cols; ++c) {
      studX = STUD_PADDING + r * (STUD_WIDTH + STUD_SPACING)
      studY = STUD_PADDING + c * (STUD_WIDTH + STUD_SPACING)
      stud = createStud(studR, studH, studX, studY, studZ, studRX)
      top.appendChild(stud)
    }
  }

  container.appendChild(bottom)
  container.appendChild(front)
  container.appendChild(back)
  container.appendChild(left)
  container.appendChild(right)
  container.appendChild(top)
  return container
}


function createFace(w, h, x, y, z, rx, ry, rz, rad) {
  w = w || 0
  h = h || 0
  x = x || 0
  y = y || 0
  z = z || 0
  rx = rx || 0
  ry = ry || 0
  rz = rz || 0
  rad = rad || 0

  var face = document.createElement('div')
  face.style.cssText =
    'position: absolute;' +
    'top: 0; left: 0;' +
    'width:' + w.toFixed(2) + 'px;' +
    'height:' + h.toFixed(2) + 'px;' +
    'transform: translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,' + z.toFixed(2) + 'px) ' +
      'rotateX(' + rx.toFixed(2) + 'rad) rotateY(' + ry.toFixed(2) + 'rad) rotateZ(' + rz.toFixed(2) + 'rad);' +

    (rad ? 'border-radius: ' + rad.toFixed(2) + 'px' : '')
  return face
}

function createTube(r, height, sides) {
  var tube = createAssembly()
  var sideAngle = 2 * PI / sides
  var sideLen = r * 2 * Math.tan(PI / sides)
  for (var c = 0; c < sides; c++) {
    var x = Math.sin(sideAngle * c) * r
    var z = Math.cos(sideAngle * c) * r
    var ry = Math.atan2(x, z) + Math.tan(PI / sides) // compensate for shifting the origin? I have no idea why this works
    var face = createFace(sideLen, height, r + x, 0, z - r, 0, ry)
    tube.appendChild(face)
  }
  return tube
}

function createStud(r, h, x, y, z, rx, ry, rz) {
  x = x || 0
  y = y || 0
  z = z || 0
  rx = rx || 0
  ry = ry || 0
  rz = rz || 0
  var stud = createTube(r, h, 25)
  var cap = createFace(r * 2, r * 2, 0, 0, 0, -Math.PI / 2, 0, 0, r)
  cap.classList.add('cap')
  cap.style.transform += ' translateZ(' + h.toFixed(2) + 'px)'
  stud.appendChild(cap)
  stud.style.transform =
    'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,' + z.toFixed(2) + 'px) ' +
    'rotateX(' + rx.toFixed(2) + 'rad) rotateY(' + ry.toFixed(2) + 'rad) rotateZ(' + rz.toFixed(2) + 'rad)'

  return stud
}
