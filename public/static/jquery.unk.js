(function($){
  $.fn.unk = function() {
    $(this).text('unk')
    return $(this) // 一応繋げられるようにする。
  }
})(jQuery)
