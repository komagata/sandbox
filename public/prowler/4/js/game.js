var point = function(x, y) {
  var that = {}
  that.x = x
  that.y = y
  return that
}

var eventuality = function(that) {
  var registry = {}

  that.fire = function(event) {
    var array, func, handler,
        type = typeof event === 'string' ? event : event.type

    if (registry.hasOwnProperty(type)) {
      array = registry[type]
      for (var i = 0; i < array.length; i++) {
        handler = array[i]
        func = handler.method
        if (typeof func === 'string') {
          func = this[func]
        }
        func.apply(this, handler.parameters || [event])
      }
    }
    return this
  }

  that.on = function(type, method, parameters) {
    var handler = {method: method, parameters: parameters}
    if (registry,hasOwnProperty(type)) {
      registry[type].push(handler)
    } else {
      registry[type] = [handler]
    }
    return this
  }

  return that
}

var image = function(src, width, height) {
  if (width == null || height == null) {
    var img = new Image
  } else {
    var img = new Image(width, height)
  }
  img.src = src
  return img
}

var sprite = function(x, y, width, height) {
  var that = eventuality({})
  that.game = null
  that.x = x || 0
  that.y = y || 0
  that.width = width
  that.height = height
  that.is_player = false
  that.is_obstacle = false

  that.draw = function() {}

  return that
}

var sprite_image = function(img_src, x, y, width, height) {
  var that = sprite(x, y, width, height)
  that.img = image(img_src, width, height)

  that.on('enterframe', function(){
    that.game.context.drawImage(
      that.img,
      that.x,
      that.y,
      that.width,
      that.height
    )
  })

  return that
}

var game = function(elem, width, height) {
  var that = eventuality({})
  var ph = document.getElementById(elem)
  ph.innerHTML = '<canvas id="_canvas" width="'+width+'" height="'+height+'"></canvas>'
  that.width = width
  that.height = height
  that.canvas = document.getElementById('_canvas')
  that.context = that.canvas.getContext('2d')
  that.nodes = []
  that.fps = 24
  that.click = point(0, 0)
  that.player = null
  that.canvas.onclick = function(evt){
    that.onclick(evt)
  }

  that.add = function(node) {
    node.game = that
    that.nodes.push(node)
  }

  that.addPlayer = function(player) {
    that.player = player
    that.add(player)
  }

  that.on('enterframe', function() {
    for (var i = 0; i < that.nodes.length; i++) {
      that.nodes[i].fire('enterframe')
    }
  })

  that.start = function() {
    window.setInterval(function(){
      that.fire('enterframe')
    }, 1000 / that.fps)
  }

  that.onclick = function(evt) {
    var IE='\v'=='v'
    var x = IE ? event.offsetX : (evt.offsetX || evt.layerX)
    var y = IE ? event.offsetY : (evt.offsetY || evt.layerY)
//    console.log('src_x: %o, src_y: %o, dest_x: %o, dest_y: %o',
//                that.player.x, that.player.y, x - 8, y - 8)
    that.player.buildPath(point(x - 8, y - 8))
  }

  return that
}

var hunter = function(x, y, width, height) {
  var that = sprite(x, y, 16, 16)
  that.game = null
  that.uid = new Date().getTime()
  that.src = {
    n: [image('img/hunter_n_0.png', 16, 16),
        image('img/hunter_n_1.png', 16, 16)],
    e: [image('img/hunter_e_0.png', 16, 16),
        image('img/hunter_e_1.png', 16, 16)],
    s: [image('img/hunter_s_0.png', 16, 16),
        image('img/hunter_s_1.png', 16, 16)],
    w: [image('img/hunter_w_0.png', 16, 16),
        image('img/hunter_w_1.png', 16, 16)]
  }
  that.dir = 's'
  that.distance = 2
  that.state_interval = 7
  that.path = []
  that.state = 0
  that.buf = 0

  that.toggle_state = function() {
    if (that.state == 0) {
      that.state = 1
    } else {
      that.state = 0
    }
  }

  that.on('enterframe', function(){
    for (var i = 0; i < that.distance; i++) {
      that.move()
    }
    if (that.buf > that.state_interval) {
      that.buf = 0
      that.toggle_state()
    } else {
      that.buf++
    }

    // draw
    that.game.context.drawImage(
      that.src[that.dir][that.state],
      that.x,
      that.y,
      that.width,
      that.height
    )
  })

  that.move = function() {
    if (that.path.length > 0) {
      if (!that.is_collision(that.path[0])) {
        var p = that.path.shift()
        that.x = p.x
        that.y = p.y
      }
    }
  }

  that.is_collision = function(p) {
    var ax1 = p.x
    var ay1 = p.y
    var ax2 = p.x + that.width
    var ay2 = p.y + that.height

    for (var i = 0; i < that.game.nodes.length; i++) {
      var n = that.game.nodes[i]
      if (!n.is_player && n.is_obstacle) {
        var bx1 = n.x
        var by1 = n.y
        var bx2 = n.x + n.width
        var by2 = n.y + n.height

        if (!(ax2 < bx1 || ax1 > bx2 || ay1 > by2 || ay2 < by1)) {
          return true
        }
      }
    }
    return false
  }

  that.buildPath = function(destP) {
    var nextX = that.x
    var nextY = that.y
    var deltaX = destP.x - that.x
    var deltaY = destP.y - that.y
    var stepX, stepY
    var step = 0
    var fraction = 0
    that.path = []

    if (deltaX < 0) {
      stepX = -1
    } else {
      stepX = 1
    }
    if (deltaY < 0) {
      stepY = -1
    } else {
      stepY = 1
    }

    deltaX = Math.abs(deltaX * 2)
    deltaY = Math.abs(deltaY * 2)

    if (deltaX <= deltaY) {
      if (that.y < destP.y) that.dir = 's'
      if (that.y > destP.y) that.dir = 'n'
    } else {
      if (that.x < destP.x) that.dir = 'e'
      if (that.x > destP.x) that.dir = 'w'
    }

    that.path[step] = point(nextX, nextY)
    step++

    if (deltaX > deltaY) {
      fraction = deltaY - deltaX / 2;
      while (nextX != destP.x) {
        if (fraction >= 0) {
          nextY += stepY
          fraction -= deltaX
        }
        nextX += stepX
        fraction += deltaY
        that.path[step] = point(nextX, nextY)
        step++
      }
    } else {
      fraction = deltaX - deltaY / 2
      while (nextY != destP.y) {
        if (fraction >= 0) {
          nextX += stepX
          fraction -= deltaY
        }
        nextY += stepY
        fraction += deltaX
        that.path[step] = point(nextX, nextY)
        step++
      }
    }
  }

  return that
}

var obstacle = function(img_src, x, y, width, height) {
  var that = sprite_image(img_src, x, y, width, height)
  that.is_obstacle = true
  return that
}

var drumcan = function(x, y) {
  return obstacle('img/drumcan.png', x, y, 16, 16)
}

var fence = function(x, y) {
  return obstacle('img/fence.png', x, y, 16, 16)
}

var factory = function(x, y) {
  return sprite_image('img/factory.png', x, y, 32, 16)
}

var den = function(x, y) {
  return sprite_image('img/den.png', x, y, 32, 16)
}

var map = function(img_src, x, y, width, height) {
  var that = sprite_image(img_src, x, y, 320, 320)
  return that
}

var tile = function(x, y, width, height) {
  return map('img/tile.png', x, y, width, height)
}

var sand = function(x, y, width, height) {
  return map('img/sand.png', x, y, width, height)
}
