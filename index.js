'use strict'
var Vect3 = require('./vect3')
  , Lego = require('./lego')

var PI = Math.PI
var performance = window.performance ||
  { now: function() { return +new Date(); } }

window.onload = function () {
  var viewport = Lego.createAssembly()
  viewport.classList.add('viewport')

  document.body.appendChild(viewport)

  init(viewport)

}


function init(viewport) {

  // viewport.appendChild(Lego.createPlate(1, 1, 1, 0, 0))
  // var background = Lego.createPlate(40, 24, 1, -2, -2, -1)
  // background.classList.add('background')
  // viewport.appendChild(background)
  // var symbols = [
  //     ['0', 0,  0]
  //   , ['1', 7,  0]
  //   , ['2', 14, 0]
  //   , ['3', 21, 0]
  //   , ['4', 28, 0]
  //   , ['5', 0,  11]
  //   , ['6', 7,  11]
  //   , ['7', 14, 11]
  //   , ['8', 21, 11]
  //   , ['9', 28, 11]
  //   , [':', 35, 0]
  // ]


  var clock = []
  function printTime(d) {
    d = d ? new Date(d) : new Date()
    var hours = d.getHours()
      , minutes = d.getMinutes()
      , seconds = d.getSeconds()
      , symbols


    function pad(n, c) {
      n = n.toString()
      if (n.length === 1) {
        n = c + n
      }
      return n
    }

    symbols = []
      .concat(pad(hours, ' ').split(''))
      .concat(':')
      .concat(pad(minutes, '0').split(''))
      .concat(':')
      .concat(pad(seconds, '0').split(''))

    var curX = 4
      , curY = 2
    symbols.forEach(function (s, i) {
      var c = clock[i]
      if (!c) {
        clock[i] = c = { symbols: {} }
      }
      if (c.symbol !== s) {
        if (c.block) {
          removeBlock(c.block)
          c.symbols[c.symbol] = c.block.blockEl
        }

        var block
        if (c.symbols[s]) {
          block = c.symbols[s]
        } else {
          block = makeSymbol(s, curX, curY)
        }
        c.symbol = s
        c.block = addBlock(block)
      }
      curX += (s === ':' ? 3 : 7)
    })
  }



  // Default positions
  var mouseX = 0, mouseY = 0
  var lightX = 0, lightY = 0
  var scale = 1
  var currentFaceIndex = 0
  var faceCount = 0
  var dirty = true

  var background = Lego.createAssembly()
  // var background = Lego.createPlate(52, 13, 1, 10, 5, -1)
  // // var background = Lego.createPlate(10, 10, 1, 10, 5, -1)
  background.classList.add('background')
  // addBlock(background)
  viewport.appendChild(background)

  var scene = Lego.createAssembly()
  viewport.appendChild(scene)
  // hard-coded to match the background image
  scene.style.transform = 'rotateY(5.6rad) rotateX(0.1rad) scale3d(1, 1, 1)'
  // scene.style.width = Lego.computePlateLength(52) + 'px'
  // scene.style.height = Lego.computePlateLength(13) + 'px'
  // scene.style.outline = '1px inset blue'

  var light = document.createElement('div')
  light.classList.add('light')
  viewport.parentNode.appendChild(light)
  var blocks = []
    , faces = []
  Array.prototype.forEach.call(scene.querySelectorAll('.assembly.atomic'), addBlock)

  setInterval(printTime, 100)

  // window.printTime = printTime
  // printTime()

  function addBlock(blockEl) {
    var block = { blockEl: blockEl }

    scene.appendChild(blockEl)
    block.faces = Array.prototype.map.call(blockEl.querySelectorAll('.face'), function (faceEl) {
      faceCount++
      var verticies = computeVertexData(faceEl)
      var face = {
          verticies: verticies
        , normal: Vect3.normalize(Vect3.cross(Vect3.sub(verticies.b, verticies.a), Vect3.sub(verticies.c, verticies.a)))
        , center: Vect3.divs(Vect3.sub(verticies.c, verticies.a), 2)
        , faceEl: faceEl
        , block: block
      }
      faces.push(face)
      return face
    })
    blocks.push(block)
    return block
  }

  function removeBlock(block) {
    var ind = blocks.indexOf(block)
    if (ind > -1) {
      blocks.splice(ind, 1)
      block.blockEl.parentNode.removeChild(block.blockEl)
      updateFaces()
    }
  }

  function updateFaces() {
    faces = blocks.map(function (block) {
      return block.faces
    }).reduce(function (a, b) {
      return a.concat(b)
    }, [])
    faceCount = faces.length
    currentFaceIndex = currentFaceIndex % faceCount
  }

  function render(startTime) {
    startTime = startTime || performance.now()
    var sceneTransform = getTransform(viewport)
      , lightTransform = getTransform(light)
      , faceIndex = 0
      , blockTransform
      , block
      , face
      , direction
      , amount
      , baseLightPosition
      , currentLightPosition

    baseLightPosition = Vect3.rotate(lightTransform.translate, Vect3.muls(sceneTransform.rotate, -1))
    while (++faceIndex < faceCount && performance.now() - startTime <= 2) {
      face = faces[currentFaceIndex]
      currentFaceIndex = (currentFaceIndex + 1) % faceCount

      // only shade if this face hasn't ever been shaded
      if (face.faceEl.dataset.shaded) {
        continue
      }

      if (face.block !== block) {
        block = face.block
        blockTransform = getTransform(block.blockEl)
        currentLightPosition = Vect3.rotate(baseLightPosition, Vect3.muls(blockTransform.rotate, -1))
      }

      direction = Vect3.normalize(Vect3.sub(currentLightPosition, face.center))
      amount = (1 - Math.max(0, Vect3.dot(face.normal, direction))).toFixed(2)
      if (face.light !== amount) {
        face.light = amount
        face.faceEl.style.backgroundImage = 'linear-gradient(rgba(0,0,0,' + amount + '),rgba(0,0,0,' + amount + '))'
      }

      face.faceEl.dataset.shaded = true
    }
  }

  function loop() {
    window.requestAnimationFrame(loop, viewport)
    if (dirty) {
      var s = scale.toFixed(4)
      dirty = false
      viewport.style.transform =
        // 'rotateY(' + (mouseX / 100).toFixed(4) + 'rad) ' +
        // 'rotateX(' + (-mouseY / 100).toFixed(4) + 'rad) ' +
        'scale3d(' + s + ',' + s + ',' + s + ')'
      light.style.transform = 'translateY(' + lightY.toFixed(4) + 'px) translateX(' + lightX.toFixed(4) + 'px) translateZ(250px)'
    }
    render()
  }

  loop()

  var maxScale = 1
    , minScale = 0.1
    , clockWidth = 2070
    , clockHeight = 650

  function adjustMaxScale() {
    var w = window.innerWidth
      , h = window.innerHeight
    maxScale = Math.min(1, w / clockWidth, h / clockHeight)
    if (scale !== minScale) {
      scale = maxScale
    }
    dirty = true
  }

  document.addEventListener('mousedown', function (event) {
    if (event.button !== 0) {
      return
    }

    if (scale === minScale) {
      scale = maxScale
    } else {
      scale = minScale
    }

    dirty = true
    event.preventDefault()
  })

  window.addEventListener('resize', function () {
    adjustMaxScale()
  })

  adjustMaxScale()

  // allow user to drag the object around with the mouse
  // document.addEventListener('mousedown', function (event) {
  //   if (event.button !== 0) {
  //     return
  //   }
  //   var originX, originY,
  //     dragHandler = function(event) {
  //       if (originX || originY) {
  //         dirty = true
  //         if (event.altKey) {
  //           lightX += event.pageX - originX
  //           lightY += event.pageY - originY
  //         } else {
  //           mouseX += event.pageX - originX
  //           mouseY += event.pageY - originY
  //         }
  //       }
  //       originX = event.pageX
  //       originY = event.pageY
  //     }
  //   document.addEventListener('mousemove', dragHandler)
  //   document.addEventListener('mouseup', function dragEndHandler() {
  //     document.removeEventListener('mousemove', dragHandler)
  //     document.removeEventListener('mouseup', dragEndHandler)
  //   })
  //   event.preventDefault()
  // })

  // document.addEventListener('mousewheel', function (ev) {
  //   dirty = true
  //   scale += ev.deltaY/1000
  //   scale = Math.min(Math.max(scale, 0.05), 1)
  //   ev.preventDefault()
  // })
}

function makeSymbol(s, offX, offY, offZ) {
  offX = offX || 0
  offY = offY || 0
  offZ = offZ || 0
  var depth = 3
  var assembly = Lego.createAssembly()
  assembly.classList.add('symbol')
  switch (s) {
    case ':':
      assembly.appendChild(Lego.createPlate(1, 1, depth, offX, offY + 1, offZ))
      assembly.appendChild(Lego.createPlate(1, 1, depth, offX, offY + 7, offZ))
      break
    case '0':
      assembly.appendChild(Lego.createPlate(1, 9, depth, offX, offY, offZ))
      assembly.appendChild(Lego.createPlate(3, 1, depth, offX + 1, offY, offZ))
      assembly.appendChild(Lego.createPlate(1, 9, depth, offX + 4, offY, offZ))
      assembly.appendChild(Lego.createPlate(3, 1, depth, offX + 1, offY + 8, offZ))
      break
    case '1':
      assembly.appendChild(Lego.createPlate(1, 9, depth, offX + 4, offY, offZ))
      break
    case '2':
      assembly.appendChild(Lego.createPlate(5, 1, depth, offX, offY, offZ))
      assembly.appendChild(Lego.createPlate(1, 3, depth, offX + 4, offY + 1, offZ))
      assembly.appendChild(Lego.createPlate(5, 1, depth, offX, offY + 4, offZ))
      assembly.appendChild(Lego.createPlate(1, 3, depth, offX, offY + 5, offZ))
      assembly.appendChild(Lego.createPlate(5, 1, depth, offX, offY + 8, offZ))
      break
    case '3':
      assembly.appendChild(Lego.createPlate(5, 1, depth, offX, offY, offZ))
      assembly.appendChild(Lego.createPlate(1, 3, depth, offX + 4, offY + 1, offZ))
      assembly.appendChild(Lego.createPlate(5, 1, depth, offX, offY + 4, offZ))
      assembly.appendChild(Lego.createPlate(1, 3, depth, offX + 4, offY + 5, offZ))
      assembly.appendChild(Lego.createPlate(5, 1, depth, offX, offY + 8, offZ))
      break
    case '4':
      assembly.appendChild(Lego.createPlate(1, 5, depth, offX, offY, offZ))
      assembly.appendChild(Lego.createPlate(3, 1, depth, offX + 1, offY + 4, offZ))
      assembly.appendChild(Lego.createPlate(1, 9, depth, offX + 4, offY, offZ))
      break
    case '5':
      assembly.appendChild(Lego.createPlate(5, 1, depth, offX, offY, offZ))
      assembly.appendChild(Lego.createPlate(1, 3, depth, offX, offY + 1, offZ))
      assembly.appendChild(Lego.createPlate(5, 1, depth, offX, offY + 4, offZ))
      assembly.appendChild(Lego.createPlate(1, 3, depth, offX + 4, offY + 5, offZ))
      assembly.appendChild(Lego.createPlate(5, 1, depth, offX, offY + 8, offZ))
      break
    case '6':
      assembly.appendChild(Lego.createPlate(1, 9, depth, offX, offY, offZ))
      assembly.appendChild(Lego.createPlate(3, 1, depth, offX + 1, offY + 4, offZ))
      assembly.appendChild(Lego.createPlate(1, 5, depth, offX + 4, offY + 4, offZ))
      assembly.appendChild(Lego.createPlate(3, 1, depth, offX + 1, offY + 8, offZ))
      break
    case '7':
      assembly.appendChild(Lego.createPlate(4, 1, depth, offX, offY, offZ))
      assembly.appendChild(Lego.createPlate(1, 9, depth, offX + 4, offY, offZ))
      break
    case '8':
      assembly.appendChild(Lego.createPlate(1, 9, depth, offX, offY, offZ))
      assembly.appendChild(Lego.createPlate(3, 1, depth, offX + 1, offY, offZ))
      assembly.appendChild(Lego.createPlate(3, 1, depth, offX + 1, offY + 4, offZ))
      assembly.appendChild(Lego.createPlate(3, 1, depth, offX + 1, offY + 8, offZ))
      assembly.appendChild(Lego.createPlate(1, 9, depth, offX + 4, offY, offZ))
      break
    case '9':
      assembly.appendChild(Lego.createPlate(1, 9, depth, offX + 4, offY, offZ))
      assembly.appendChild(Lego.createPlate(3, 1, depth, offX + 1, offY, offZ))
      assembly.appendChild(Lego.createPlate(3, 1, depth, offX + 1, offY + 4, offZ))
      assembly.appendChild(Lego.createPlate(1, 5, depth, offX, offY, offZ))
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
      matrix: matrix
    , rotate: [rotateX, rotateY, rotateZ]
    , translate: [matrix.m41, matrix.m42, matrix.m43]
  }
}

function computeVertexData(el) {
  var w = 100,
    h = 100,
    v = {
        a: [-w, -h, 0 ]
      , b: [w, -h, 0 ]
      , c: [w, h, 0 ]
      , d: [-w, h, 0 ]
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
