# Huebar v1.1
## easy to use pure javacript color picker with no need for JQUERY.

### Usage:
    huebar.init({options});

    options:
        container        -  string   -  container id
        saturation       -  int      -  saturation of color
        val              -  int      -  brightness value
        template         -  string   -  basic, lifted, modern
        mouseUpCallback  -  function - callback function on mouseup

### Example:
            huebar.init({
                container       : 'swipeContainer',
                saturation      : 000,
                val             : 000,
                template        : 'modern',
                mouseUpCallback : function ()
                {
                    huebar.paintElement('backgroundColor');
                    return;
                }
            });

### Methods:
  huebar.paintElement(destination id - string)    set the background color of the passed element.
  
  huebar.cssRGB()                                 Get RGB as css string.
  
  huebar.RGBObject()                              Get RGB as object.
