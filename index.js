'use strict'

var PI = Math.PI
// magic numbers that are approximately the correct actual lego ratios
var STUD_WIDTH = 50
var STUD_SPACING = STUD_WIDTH / 1.5
var PLATE_HEIGHT = STUD_SPACING
var STUD_HEIGHT = PLATE_HEIGHT / 1.88
var STUD_PADDING = STUD_WIDTH / 3.2


window.onload = function init() {
  var viewport = createAssembly()
  viewport.classList.add('viewport')
  viewport.style.transformStyle = 'preserve-3d'
  viewport.style.perspective = '5000px'


  viewport.appendChild(createPlate(1, 1, 6, 4))
  // viewport.appendChild(makeSymbol(0, 10,  4))
  // viewport.appendChild(makeSymbol(1, 7,  0))
  // viewport.appendChild(makeSymbol(2, 14, 0))
  // viewport.appendChild(makeSymbol(3, 21, 0))
  // viewport.appendChild(makeSymbol(4, 28, 0))
  // viewport.appendChild(makeSymbol(5, 0,  11))
  // viewport.appendChild(makeSymbol(6, 7,  11))
  // viewport.appendChild(makeSymbol(7, 14, 11))
  // viewport.appendChild(makeSymbol(8, 21, 11))
  // viewport.appendChild(makeSymbol(9, 28, 11))
  // viewport.appendChild(makeSymbol(':', 35, 0))
  document.body.appendChild(viewport)

  var fid
  function update() {
    updateColors(viewport, null, 230, 100)
  }

  function loop() {
    update()
    fid = window.requestAnimationFrame(loop, viewport)
  }

  function stop() {
    window.cancelAnimationFrame(fid)
  }

  update()

  // loop()

  window.updateColors = update
  window.loop = loop
  window.stopUpdating = stop
}

function makeSymbol(s, offX, offY, offZ) {
  offX = offX || 0
  offY = offY || 0
  offZ = offZ || 0
  var assembly = createAssembly()
  assembly.classList.add('symbol')
  switch (s) {
    case ':':
      assembly.appendChild(createPlate(1, 1, offX, offY + 1, offZ))
      assembly.appendChild(createPlate(1, 1, offX, offY + 7, offZ))
      break
    case 0:
      assembly.appendChild(createPlate(1, 9, offX, offY, offZ))
      assembly.appendChild(createPlate(3, 1, offX + 1, offY, offZ))
      assembly.appendChild(createPlate(1, 9, offX + 4, offY, offZ))
      assembly.appendChild(createPlate(3, 1, offX + 1, offY + 8, offZ))
      break
    case 1:
      assembly.appendChild(createPlate(1, 9, offX + 4, offY, offZ))
      break
    case 2:
      assembly.appendChild(createPlate(5, 1, offX, offY, offZ))
      assembly.appendChild(createPlate(1, 3, offX + 4, offY + 1, offZ))
      assembly.appendChild(createPlate(5, 1, offX, offY + 4, offZ))
      assembly.appendChild(createPlate(1, 3, offX, offY + 5, offZ))
      assembly.appendChild(createPlate(5, 1, offX, offY + 8, offZ))
      break
    case 3:
      assembly.appendChild(createPlate(5, 1, offX, offY, offZ))
      assembly.appendChild(createPlate(1, 3, offX + 4, offY + 1, offZ))
      assembly.appendChild(createPlate(5, 1, offX, offY + 4, offZ))
      assembly.appendChild(createPlate(1, 3, offX + 4, offY + 5, offZ))
      assembly.appendChild(createPlate(5, 1, offX, offY + 8, offZ))
      break
    case 4:
      assembly.appendChild(createPlate(1, 5, offX, offY, offZ))
      assembly.appendChild(createPlate(3, 1, offX + 1, offY + 4, offZ))
      assembly.appendChild(createPlate(1, 9, offX + 4, offY, offZ))
      break
    case 5:
      assembly.appendChild(createPlate(5, 1, offX, offY, offZ))
      assembly.appendChild(createPlate(1, 3, offX, offY + 1, offZ))
      assembly.appendChild(createPlate(5, 1, offX, offY + 4, offZ))
      assembly.appendChild(createPlate(1, 3, offX + 4, offY + 5, offZ))
      assembly.appendChild(createPlate(5, 1, offX, offY + 8, offZ))
      break
    case 6:
      assembly.appendChild(createPlate(1, 9, offX, offY, offZ))
      assembly.appendChild(createPlate(3, 1, offX + 1, offY + 4, offZ))
      assembly.appendChild(createPlate(1, 5, offX + 4, offY + 4, offZ))
      assembly.appendChild(createPlate(3, 1, offX + 1, offY + 8, offZ))
      break
    case 7:
      assembly.appendChild(createPlate(4, 1, offX, offY, offZ))
      assembly.appendChild(createPlate(1, 9, offX + 4, offY, offZ))
      break
    case 8:
      assembly.appendChild(createPlate(1, 9, offX, offY, offZ))
      assembly.appendChild(createPlate(3, 1, offX + 1, offY, offZ))
      assembly.appendChild(createPlate(3, 1, offX + 1, offY + 4, offZ))
      assembly.appendChild(createPlate(3, 1, offX + 1, offY + 8, offZ))
      assembly.appendChild(createPlate(1, 9, offX + 4, offY, offZ))
      break
    case 9:
      assembly.appendChild(createPlate(1, 9, offX + 4, offY, offZ))
      assembly.appendChild(createPlate(3, 1, offX + 1, offY, offZ))
      assembly.appendChild(createPlate(3, 1, offX + 1, offY + 4, offZ))
      assembly.appendChild(createPlate(1, 5, offX, offY, offZ))
      break
  }
  return assembly
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
  m.m11 = 1; m.m12 = 0; m.m13 = 0; m.m14 = 0
  m.m21 = 0; m.m22 = 1; m.m23 = 0; m.m24 = 0
  m.m31 = 0; m.m32 = 0; m.m33 = 1; m.m34 = 0
  m.m41 = 0; m.m42 = 0; m.m43 = 0; m.m44 = 1
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
    m11: m11, m12: m12, m13: m13, m14: m14,
    m21: m21, m22: m22, m23: m23, m24: m24,
    m31: m31, m32: m32, m33: m33, m34: m34,
    m41: m41, m42: m42, m43: m43, m44: m44
  }
}

function parseCSSMatrix(matrixString) {
  var c = matrixString.split(/\s*[(),]\s*/).slice(1,-1)

  if (c.length === 6) {
    // 'matrix()' (3x2)
    return {
      m11: +c[0], m21: +c[2], m31: 0, m41: +c[4],
      m12: +c[1], m22: +c[3], m32: 0, m42: +c[5],
      m13: 0,     m23: 0,     m33: 1, m43: 0,
      m14: 0,     m24: 0,     m34: 0, m44: 1
    }
  } else if (c.length === 16) {
    // matrix3d() (4x4)
    return {
      m11: +c[0], m21: +c[4], m31: +c[8], m41: +c[12],
      m12: +c[1], m22: +c[5], m32: +c[9], m42: +c[13],
      m13: +c[2], m23: +c[6], m33: +c[10], m43: +c[14],
      m14: +c[3], m24: +c[7], m34: +c[11], m44: +c[15]
    }
  }
  return identityMatrix()
}

function getTransform(matrix) {
  var rotateY = Math.asin(-matrix.m13),
    rotateX,
    rotateZ

  rotateX = Math.atan2(matrix.m23, matrix.m33)
  rotateZ = Math.atan2(matrix.m12, matrix.m11)

  /*if (Math.cos(rotateY) !== 0) {
      rotateX = Math.atan2(matrix.m23, matrix.m33)
      rotateZ = Math.atan2(matrix.m12, matrix.m11)
  } else {
      rotateX = Math.atan2(-matrix.m31, matrix.m22)
      rotateZ = 0
  }*/

  return {
    matrix: matrix,
    rotate: {
      x: rotateX,
      y: rotateY,
      z: rotateZ
    },
    translate: {
      x: matrix.m41,
      y: matrix.m42,
      z: matrix.m43
    }
  }
}

function computeVertexData(elem, m) {
    var w = elem.offsetWidth / 2,
      h = elem.offsetHeight / 2,
      v = {
        a: { x: -w, y: -h, z: 0 },
        b: { x: w, y: -h, z: 0 },
        c: { x: w, y: h, z: 0 },
        d: { x: -w, y: h, z: 0 }
      },
      transform = getTransform(m)

    v.a = Vect3.add(Vect3.rotate(v.a, transform.rotate), transform.translate)
    v.b = Vect3.add(Vect3.rotate(v.b, transform.rotate), transform.translate)
    v.c = Vect3.add(Vect3.rotate(v.c, transform.rotate), transform.translate)
    v.d = Vect3.add(Vect3.rotate(v.d, transform.rotate), transform.translate)

    return v
}

function updateColors(node, m, h, s) {
  var style, matrix
  m = m || []
  style = window.getComputedStyle(node)
  m.push(parseCSSMatrix(style.transform))
  matrix = m.reverse().reduce(multiplyMatrix)


  var rx, rz, ry = Math.asin(-matrix.m13)
  if (Math.cos(ry) !== 0) {
      rx = Math.atan2(matrix.m23, matrix.m33)
      rz = Math.atan2(matrix.m12, matrix.m11)
  } else {
      rx = Math.atan2(-matrix.m31, matrix.m22)
      rz = 0
  }


  var shade = Math.cos(rx / 1.5) * Math.cos(ry / 2) * Math.cos(rz / 2)
  var lightness = (shade * 100).toFixed(0)
  if (node.classList.contains('cap')) {
    console.log((rx * 180 / PI).toFixed(0), (ry * 180 / PI).toFixed(0), (rz * 180 / PI).toFixed(0))
    console.log(lightness)
  }
  if (node.dataset.lightness !== lightness) {
    // node.style.opacity = alpha
    node.style.backgroundColor = 'hsla(' + h + ', ' + s+ '%, ' + lightness + '%, 1)'
    node.dataset.lightness = lightness
  }

  if (node.hasChildNodes()) {
    Array.prototype.forEach.call(node.childNodes, function (n) {
      updateColors(n, m.concat(), h, s)
    })
  }
}


// assemblies are for grouping faces and other assemblies
function createAssembly() {
  var assembly = document.createElement('div')
  assembly.classList.add('assembly')
  return assembly
}

function computePlateLength(studs) {
  return STUD_PADDING * 2 + studs * (STUD_WIDTH + STUD_SPACING) - STUD_SPACING
}

// rows/cols in studs
function createPlate(rows, cols, posX, posY, posZ, color) {

  var container = createAssembly()
  container.classList.add('plate', 'atomic')

  var plateWidth = computePlateLength(rows)
  var plateLength = computePlateLength(cols)
  var plateX = computePlateLength(posX || 0)
  var plateY = computePlateLength(posY || 0)
  var plateZ = (posZ || 0) * PLATE_HEIGHT

  var bottom = createFace(plateWidth, plateLength, plateX, plateY, plateZ, 0, PI, 0)
  bottom.style.transform += ' translateX(' + (-plateWidth).toFixed(2) + 'px)'

  var top = createFace(plateWidth, plateLength, plateX, plateY, plateZ)
  top.classList.add('top')
  top.style.transform += ' translateZ(' + PLATE_HEIGHT.toFixed(2) + 'px)'

  var back = createFace(plateWidth, PLATE_HEIGHT, plateX, plateY, plateZ, PI / 2)
  back.classList.add('back')

  var front = createFace(plateWidth, PLATE_HEIGHT, plateX, plateY, plateZ, -PI / 2)
  front.classList.add('front')
  front.style.transform += ' translateZ(' + plateLength.toFixed(2) + 'px)'
  front.style.transform += ' translateY(' + (-PLATE_HEIGHT).toFixed(2) + 'px)'

  var left = createFace(PLATE_HEIGHT, plateLength, plateX, plateY, plateZ, 0, -PI / 2)
  left.classList.add('left')

  var right = createFace(PLATE_HEIGHT, plateLength, plateX, plateY, plateZ, 0, PI / 2)
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
  face.classList.add('face')
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
  var stud = createTube(r, h, 15)
  var cap = createFace(r * 2, r * 2, 0, 0, 0, -Math.PI / 2, 0, 0, r)
  cap.classList.add('cap')
  cap.style.transform += ' translateZ(' + h.toFixed(2) + 'px)'
  stud.appendChild(cap)
  stud.style.transform =
    'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,' + z.toFixed(2) + 'px) ' +
    'rotateX(' + rx.toFixed(2) + 'rad) rotateY(' + ry.toFixed(2) + 'rad) rotateZ(' + rz.toFixed(2) + 'rad)'

  return stud
}
