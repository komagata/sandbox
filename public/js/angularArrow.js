var angularArrow = function(start, end, color) {
  var canvas = document.createElement('canvas')
  document.body.appendChild(canvas)
  var c = canvas.getContext('2d')
  var sx = start[0], sy = start[1],
      ex = end[0],   ey = end[1]
  var p1x = (ex - sx) / 2
  c.strokeStyle = color

  c.beginPath()
  c.arc(sx + 4, sy + 4, 2, 0, Math.PI*2, true)
  c.fill()
  c.stroke()

  c.beginPath()
  c.moveTo(sx, sy)
  c.lineTo(p1x, sy)
  c.lineTo(p1x, ey)
  c.lineTo(ex, ey)
  c.stroke()
  return canvas
}
