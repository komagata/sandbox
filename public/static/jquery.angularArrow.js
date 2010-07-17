(function($) {
  $.fn.angularArrow = function(options) {
    var elements = this
    var settings = $.extend({
      start: [],
      end: [],
      color: 'rgba(0, 0, 255, 0.8)'
    }, options)

    var stroke = function() {
      var angulararrow = $('<div>', {'class': 'angulararrow'})
      var angulararrow = document.createElement('canvas')
      document.body.appendChild(angulararrow)
      var c = angulararrow.getContext('2d')
      var sx = settings.start[0], sy = settings.start[1],
          ex = settings.end[0],   ey = settings.end[1]
      var p1x = (ex - sx) / 2
      c.strokeStyle = settings.color

      c.beginPath()
      c.moveTo(sx, sy)
      c.lineTo(p1x, sy)
      c.lineTo(p1x, ey)
      c.lineTo(ex, ey)
      c.stroke()
    }

    stroke()

    return this
  }
})(jQuery)
