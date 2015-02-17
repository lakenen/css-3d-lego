'use strict'
var Vect3 = require('./vect3')
  , Lego = require('./lego')

var PI = Math.PI
var performance = window.performance ||
  { now: function() { return +new Date(); } }

window.onload = function () {
  var viewport = Lego.createAssembly()
  viewport.classList.add('viewport')
  viewport.style.transformStyle = 'preserve-3d'
  viewport.style.perspective = '5000px'


  // viewport.appendChild(Lego.createPlate(1, 1, 0, 0))
  // viewport.appendChild(Lego.createPlate(8, 1, 1, 0))
  // viewport.appendChild(makeSymbol(0, 0,  0))
  // viewport.appendChild(makeSymbol(1, 7,  0))
  viewport.appendChild(makeSymbol(2, 5, 0))
  // viewport.appendChild(makeSymbol(3, 21, 0))
  // viewport.appendChild(makeSymbol(4, 28, 0))
  // viewport.appendChild(makeSymbol(5, 0,  11))
  // viewport.appendChild(makeSymbol(6, 7,  11))
  // viewport.appendChild(makeSymbol(7, 14, 11))
  // viewport.appendChild(makeSymbol(8, 21, 11))
  // viewport.appendChild(makeSymbol(9, 28, 11))
  // viewport.appendChild(makeSymbol(':', 35, 0))
  document.body.appendChild(viewport)

  init(viewport)
}


function init(scene) {
  // Default positions
  var mouseX = -40, mouseY = 30
  var lightX = 100, lightY = 0
  var scale = 1

  var light = document.createElement('div')
  light.classList.add('light')
  scene.parentNode.appendChild(light)
  // var atomicBlocks = document.querySelectorAll('.assembly.atomic')
  // var blockFaces = []
  // Array.prototype.forEach.call(atomicBlocks, function (block) {
    var faces = Array.prototype.map.call(scene.querySelectorAll('.face'), function (face) {
      var verticies = computeVertexData(face)
      return {
        verticies: verticies,
        normal: Vect3.normalize(Vect3.cross(Vect3.sub(verticies.b, verticies.a), Vect3.sub(verticies.c, verticies.a))),
        center: Vect3.divs(Vect3.sub(verticies.c, verticies.a), 2),
        faceEl: face
      }
    })
  //   blockFaces.push({ blockEl: block, faces: faces })
  // })

  function render(startTime) {
    // blockFaces.forEach(function (block) {
      var face, direction, amount,
        // faces = block.faces,
        faceNum = 0, faceCount = faces.length,
        blockTransform = getTransform(scene),
        lightTransform = getTransform(light),
        lightPosition = Vect3.rotate(lightTransform.translate, Vect3.muls(blockTransform.rotate, -1))

      while (faceNum < faceCount && performance.now() - startTime <= 10) {
        face = faces[faceNum]
        direction = Vect3.normalize(Vect3.sub(lightPosition, face.center))
        amount = 1 - Math.max(0, Vect3.dot(face.normal, direction)).toFixed(2)
        if (face.light != amount) {
          face.light = amount
          face.faceEl.style.backgroundImage = 'linear-gradient(rgba(0,0,0,' + amount + '),rgba(0,0,0,' + amount + '))'
        }
        faceNum++
      }
    // })
  }

  function loop() {
    var now = performance.now()
    window.requestAnimationFrame(loop, scene)
    var s = scale.toFixed(4)
    scene.style.transform =
      'rotateY(' + (mouseX / 100).toFixed(4) + 'rad) ' +
      'rotateX(' + (-mouseY / 100).toFixed(4) + 'rad) ' +
      'scale3d(' + s + ',' + s + ',' + s + ')'
    light.style.transform = 'translateY(' + lightY.toFixed(4) + 'px) translateX(' + lightX.toFixed(4) + 'px) translateZ(250px)'
    render(now)
  }

  loop()

  // allow user to drag the object around with the mouse
  document.addEventListener('mousedown', function (e) {
    if (e.button !== 0) {
      return
    }
    var originX, originY,
      dragHandler = function(e) {
        if (originX || originY) {
          mouseX += e.pageX - originX
          mouseY += e.pageY - originY
        }
        originX = e.pageX
        originY = e.pageY
      }
    document.addEventListener('mousemove', dragHandler)
    document.addEventListener('mouseup', function dragEndHandler() {
      document.removeEventListener('mousemove', dragHandler)
      document.removeEventListener('mouseup', dragEndHandler)
    })
    e.preventDefault()
  })

  document.addEventListener('mousewheel', function (ev) {
    scale += ev.deltaY/1000
    scale = Math.min(Math.max(scale, 0.05), 1)
    ev.preventDefault()
  })
}

function makeSymbol(s, offX, offY, offZ) {
  offX = offX || 0
  offY = offY || 0
  offZ = offZ || 0
  var assembly = Lego.createAssembly()
  assembly.classList.add('symbol')
  switch (s) {
    case ':':
      assembly.appendChild(Lego.createPlate(1, 1, offX, offY + 1, offZ))
      assembly.appendChild(Lego.createPlate(1, 1, offX, offY + 7, offZ))
      break
    case 0:
      assembly.appendChild(Lego.createPlate(1, 9, offX, offY, offZ))
      assembly.appendChild(Lego.createPlate(3, 1, offX + 1, offY, offZ))
      assembly.appendChild(Lego.createPlate(1, 9, offX + 4, offY, offZ))
      assembly.appendChild(Lego.createPlate(3, 1, offX + 1, offY + 8, offZ))
      break
    case 1:
      assembly.appendChild(Lego.createPlate(1, 9, offX + 4, offY, offZ))
      break
    case 2:
      assembly.appendChild(Lego.createPlate(5, 1, offX, offY, offZ))
      assembly.appendChild(Lego.createPlate(1, 3, offX + 4, offY + 1, offZ))
      assembly.appendChild(Lego.createPlate(5, 1, offX, offY + 4, offZ))
      assembly.appendChild(Lego.createPlate(1, 3, offX, offY + 5, offZ))
      assembly.appendChild(Lego.createPlate(5, 1, offX, offY + 8, offZ))
      break
    case 3:
      assembly.appendChild(Lego.createPlate(5, 1, offX, offY, offZ))
      assembly.appendChild(Lego.createPlate(1, 3, offX + 4, offY + 1, offZ))
      assembly.appendChild(Lego.createPlate(5, 1, offX, offY + 4, offZ))
      assembly.appendChild(Lego.createPlate(1, 3, offX + 4, offY + 5, offZ))
      assembly.appendChild(Lego.createPlate(5, 1, offX, offY + 8, offZ))
      break
    case 4:
      assembly.appendChild(Lego.createPlate(1, 5, offX, offY, offZ))
      assembly.appendChild(Lego.createPlate(3, 1, offX + 1, offY + 4, offZ))
      assembly.appendChild(Lego.createPlate(1, 9, offX + 4, offY, offZ))
      break
    case 5:
      assembly.appendChild(Lego.createPlate(5, 1, offX, offY, offZ))
      assembly.appendChild(Lego.createPlate(1, 3, offX, offY + 1, offZ))
      assembly.appendChild(Lego.createPlate(5, 1, offX, offY + 4, offZ))
      assembly.appendChild(Lego.createPlate(1, 3, offX + 4, offY + 5, offZ))
      assembly.appendChild(Lego.createPlate(5, 1, offX, offY + 8, offZ))
      break
    case 6:
      assembly.appendChild(Lego.createPlate(1, 9, offX, offY, offZ))
      assembly.appendChild(Lego.createPlate(3, 1, offX + 1, offY + 4, offZ))
      assembly.appendChild(Lego.createPlate(1, 5, offX + 4, offY + 4, offZ))
      assembly.appendChild(Lego.createPlate(3, 1, offX + 1, offY + 8, offZ))
      break
    case 7:
      assembly.appendChild(Lego.createPlate(4, 1, offX, offY, offZ))
      assembly.appendChild(Lego.createPlate(1, 9, offX + 4, offY, offZ))
      break
    case 8:
      assembly.appendChild(Lego.createPlate(1, 9, offX, offY, offZ))
      assembly.appendChild(Lego.createPlate(3, 1, offX + 1, offY, offZ))
      assembly.appendChild(Lego.createPlate(3, 1, offX + 1, offY + 4, offZ))
      assembly.appendChild(Lego.createPlate(3, 1, offX + 1, offY + 8, offZ))
      assembly.appendChild(Lego.createPlate(1, 9, offX + 4, offY, offZ))
      break
    case 9:
      assembly.appendChild(Lego.createPlate(1, 9, offX + 4, offY, offZ))
      assembly.appendChild(Lego.createPlate(3, 1, offX + 1, offY, offZ))
      assembly.appendChild(Lego.createPlate(3, 1, offX + 1, offY + 4, offZ))
      assembly.appendChild(Lego.createPlate(1, 5, offX, offY, offZ))
      break
  }
  return assembly
}

function identityMatrix() {
  var m = {}
  m.m11 = 1; m.m12 = 0; m.m13 = 0; m.m14 = 0
  m.m21 = 0; m.m22 = 1; m.m23 = 0; m.m24 = 0
  m.m31 = 0; m.m32 = 0; m.m33 = 1; m.m34 = 0
  m.m41 = 0; m.m42 = 0; m.m43 = 0; m.m44 = 1
  return m
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

function getTransformMatrix(el) {
  var computedStyle = window.getComputedStyle(el, null),
    val = computedStyle.transform ||
        computedStyle.webkitTransform ||
        computedStyle.MozTransform ||
        computedStyle.msTransform
  return parseCSSMatrix(val)
}

function getTransform(el) {
  var matrix = getTransformMatrix(el)
    , rotateY = Math.asin(-matrix.m13)
    , rotateX = Math.atan2(matrix.m23, matrix.m33)
    , rotateZ = Math.atan2(matrix.m12, matrix.m11)

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

function computeVertexData(el, m) {
  var w = 100,
    h = 100,
    v = {
      a: { x: -w, y: -h, z: 0 },
      b: { x: w, y: -h, z: 0 },
      c: { x: w, y: h, z: 0 },
      d: { x: -w, y: h, z: 0 }
    },
    transform

  while (el.nodeType === 1) {
    transform = getTransform(el)
    v.a = Vect3.add(Vect3.rotate(v.a, transform.rotate), transform.translate)
    v.b = Vect3.add(Vect3.rotate(v.b, transform.rotate), transform.translate)
    v.c = Vect3.add(Vect3.rotate(v.c, transform.rotate), transform.translate)
    v.d = Vect3.add(Vect3.rotate(v.d, transform.rotate), transform.translate)
    el = el.parentNode
  }
  return v
}

function updateColors(node, m, h, s) {
  var style, matrix
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
