var PI = Math.PI
// magic numbers that are approximately the correct actual lego ratios
var STUD_WIDTH = 30
var STUD_SPACING = STUD_WIDTH / 1.5
var PLATE_HEIGHT = STUD_SPACING
var STUD_HEIGHT = PLATE_HEIGHT / 1.88
var STUD_PADDING = STUD_WIDTH / 3.2
var STUD_NUM_SIDES = 10

module.exports = {
    createAssembly: createAssembly
  , createPlate: createPlate
  , computePlateLength: computePlateLength
  , computePlateDepth: computePlateDepth
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

function computePlateDepth(depth) {
  return depth * PLATE_HEIGHT
}

// rows/cols in studs, depth in plates
function createPlate(rows, cols, depth, posX, posY, posZ) {

  var container = createAssembly()
  container.classList.add('plate', 'atomic')

  var plateWidth = computePlateLength(rows)
  var plateLength = computePlateLength(cols)
  var plateDepth = computePlateDepth(depth)
  var plateX = computePlateLength(posX || 0)
  var plateY = computePlateLength(posY || 0)
  var plateZ = (posZ || 0) * PLATE_HEIGHT

  var bottom = createFace(plateWidth, plateLength, plateX, plateY, plateZ, 0, PI, 0)
  bottom.style.transform += ' translateX(' + (-plateWidth).toFixed(2) + 'px)'

  var top = createFace(plateWidth, plateLength, plateX, plateY, plateZ)
  top.classList.add('top')
  top.style.transform += ' translateZ(' + plateDepth.toFixed(2) + 'px)'

  var back = createFace(plateWidth, plateDepth, plateX, plateY, plateZ, PI / 2)
  back.classList.add('back')

  var front = createFace(plateWidth, plateDepth, plateX, plateY, plateZ, -PI / 2)
  front.classList.add('front')
  front.style.transform += ' translateZ(' + plateLength.toFixed(2) + 'px)'
  front.style.transform += ' translateY(' + (-plateDepth).toFixed(2) + 'px)'

  var left = createFace(plateDepth, plateLength, plateX, plateY, plateZ, 0, -PI / 2)
  left.classList.add('left')

  var right = createFace(plateDepth, plateLength, plateX, plateY, plateZ, 0, PI / 2)
  right.classList.add('right')
  right.style.transform += ' translateZ(' + plateWidth.toFixed(2) + 'px)'
  right.style.transform += ' translateX(' + (-plateDepth).toFixed(2) + 'px)'

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
    var ry = Math.atan2(x, z) + Math.tan(PI / sides) // compensate for shifting the origin to 0,0
    var face = createFace(sideLen, height, r + x, 0, z - r, 0, ry)
    face.classList.add('tube')
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
  var stud = createTube(r, h, STUD_NUM_SIDES)
  var cap = createFace(r * 2, r * 2, 0, 0, 0, -Math.PI / 2, 0, 0, r)
  var bottomCap = createFace(r * 2, r * 2, 0, 0, 0, -Math.PI / 2, 0, 0, r)
  bottomCap.classList.add('cap')
  cap.classList.add('cap')
  cap.style.transform += ' translateZ(' + h.toFixed(2) + 'px)'
  stud.appendChild(bottomCap)
  stud.appendChild(cap)
  stud.style.transform =
    'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,' + z.toFixed(2) + 'px) ' +
    'rotateX(' + rx.toFixed(2) + 'rad) rotateY(' + ry.toFixed(2) + 'rad) rotateZ(' + rz.toFixed(2) + 'rad)'

  return stud
}
