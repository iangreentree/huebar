/*
 * huebar.js
 * @version 1
 * @author:  Ian Greentree
 * @decription: easy to use pure javacript color picker with no need for JQUERY
 * @webpage : www.iangreentree.co.uk/huebar/
*/

var huebar = huebar || {};
var jambo = jambo || {};

huebar = {
    options : {},
    
    mouseDown : false,
    
// selectors
    boundaryId  : 'huebar-boundary',
    pickerId    : 'huebar-picker',

    rgb         : [255,255,255],
    hue         : 0,
    saturation  : 255,
    value       : 255,
    
    swiperHeight      : 100,
    swiperWidth       : 100,
    

    
    init : function (options)
    {
        this.options = options;
        this.initDefaultOptions();
        this.getSwiperDims();
    },

    getSwiperDims : function()
    {
        var container = document.getElementById(this.options.container);
        this.swiperHeight = container.offsetHeight;
        this.swiperWidth = container.offsetWidth;
        this.displaySwipe();
    },
    
    initDefaultOptions : function()
    {
        this.options.container = this.options.container || 'swipeContainer';
        this.options.showBorder = this.options.showBorder || true;
        this.options.whiteHeight = this.options.whiteHeight || 10;
        this.options.blackHeight = this.options.blackHeight || 10;
        this.options.showBorder = this.options.showBorder || true;
        this.options.template = this.options.template || 'basic';
        this.options.mouseUpCallback = this.options.mouseUpCallback || function (){return};
        this.saturation = this.options.saturation || 255;
        this.value = this.options.value || 255;
    },
    
    displaySwipe : function()
    {
        var picker = document.createElement("div");
        picker.style.position = "absolute";
        picker.style.border = "1px solid #555";
        picker.style.top = "3px";
        picker.style.left = "-6px";
        picker.style.width = (this.swiperWidth+10)+"px";
        picker.style.height = "1px";
        picker.style.background = "#fff";
        if(this.style[this.options.template].showDropShadow)
        {
            var boxshadowprop=this.getsupportedprop(['boxShadow', 'MozBoxShadow', 'WebkitBoxShadow'])
            picker.style[boxshadowprop]="1px 1px 5px 0px #818181";
        }
        if(this.style[this.options.template].showRounded)
        {
            var boxshadowprop=this.getsupportedprop(['borderRadius', 'MozBorderRadius'])
            picker.style[boxshadowprop]="2px";
        }
        picker.id = this.pickerId;

        var boundary = document.createElement("div");
        boundary.style.position = "relative";
        boundary.style.display = "block";
        boundary.style.top = "11px";
        boundary.style.left = "12px";
        boundary.style.width = this.swiperWidth+"px";
        boundary.style.height = this.swiperHeight+"px";
        boundary.style.background = "black";
        boundary.style.cursor = "pointer";
        if(this.style[this.options.template].showBorder){boundary.style.border = '1px solid #000';}
        if(this.style[this.options.template].showDropShadow)
        {
            var boxshadowprop=this.getsupportedprop(['boxShadow', 'MozBoxShadow', 'WebkitBoxShadow'])
            boundary.style[boxshadowprop]="5px 5px 5px 2px #818181";
        }
        if(this.style[this.options.template].showRounded)
        {
            var boxshadowprop=this.getsupportedprop(['borderRadius', 'MozBorderRadius'])
            boundary.style[boxshadowprop]="5px";
        }
        boundary.id = this.boundaryId;
        boundary.appendChild(picker);
        var container = document.getElementById(this.options.container);
        container.appendChild(boundary);
        this.initEvents();
    },
    
    initEvents : function()
    {
        var c = this;
        var boundary = document.getElementById(this.boundaryId);
        boundary.onmousedown = function(e)
        {
            c.mouseDown = true;
            var y = c.mouseYPosition(e);
            c.processEvent(y);
        }
        boundary.onmousemove=function(e)
        {
            if (c.mouseDown === false)
            {
                return;
            }
            var y = c.mouseYPosition(e);
            c.processEvent(y);
        }

        document.onmouseup = function()
        {
           if (c.mouseDown === true)
           {
               c.options.mouseUpCallback();
           }
           c.mouseDown = false;
        }        
    },

    processEvent :function(y)
    {
        this.movePicker(y);
        this.calculateHue(y);
        this.displayHue();        
    },
    
    mouseYPosition : function(e)
    {
        var isIE = document.all ? true : false;
	var _y;
	if (!isIE) {
		_y = e.pageY;
	}
	if (isIE) {
		_y = event.clientY + document.body.scrollTop;
	}
        var boundaryY = document.getElementById(this.boundaryId).offsetTop;
        
console.log('mouseYPosition', boundaryY, _y);        
	return _y-boundaryY;
    },
    
    movePicker : function(y)
    {
        var picker = document.getElementById(this.pickerId);
        picker.style.top = y+'px';
    },
    
    calculateHue : function (sliderPosition)
    {
        var saturation = this.saturation;
        var value = this.value;
        if (sliderPosition < this.options.blackHeight)
        {
            this.hue = 0;
            saturation = 0;
            value = 0;
        }
        
        else if (sliderPosition > (this.swiperHeight-this.options.whiteHeight))
        {
            this.hue = 360;
        }
        
        else
        {
            var sliderHeight = this.swiperHeight - (this.options.whiteHeight + this.options.blackHeight);
            var sliderPercentage = ((sliderPosition-this.options.blackHeight)/sliderHeight)*100;
            this.hue = (360/100)*sliderPercentage;
        }
console.log('ggg', sliderHeight , sliderPercentage, this.options.whiteHeight,this.options.blackHeight,  sliderPosition);        
        if (this.hue > 360)
        {
            this.hue = 360;
        }
        if (this.hue < 0)
        {
            this.hue = 0;
        }
        var r=0,g=0,b=0;
        var t1 = value;
        var t2 = (255-saturation) * value / 255;
        var t3 = (t1 - t2) * (this.hue % 60) / 60;
        if (this.hue < 60){r = t1; g = t2 + t3; b = t2;}
        else if (this.hue < 120){r = t1 - t3; g = t1; b = t2;}
        else if (this.hue < 180){r = t2; g = t1; b = t2+t3;}
        else if (this.hue < 240){r = t2; g = t1 - t3; b = t1;}
        else if (this.hue < 300){r = t2 + t3; g = t2; b = t1;}
        else if (this.hue < 360){r = t1; g = t2; b = t1 - t3;}
        else {r = 255; g = 255; b = 255;}
        this.rgb = [
            Math.round(r),
            Math.round(g),
            Math.round(b),
        ]
    },
        rgbToHue : function(rgb) 
    // returns hue as % decimal
    // -1 = black
    {
        if (rgb[0] == 0 && rgb[1] == 0 && rgb[2] == 0)
        {
            return -0.1;
        }
        if (rgb[0] == 255 && rgb[1] == 255 && rgb[2] == 255)
        {
            return 1.1;
        }
        var min = Math.min(rgb[0], rgb[1],rgb[2]);
        var max = Math.max(rgb[0], rgb[1],rgb[2]);
        var mid = max-min;
        
        var hue = 0;
        var sat = 0;
        
        var lit = (max + min)/2;
        if (mid == 0)
        {
            hue = 0;
            sat = 0;
        }
        else
        {
            if (lit < 0.5)
            {
                sat = mid / (max + min);
            }
            else
            {
                sat = mid / (2 - max - min);
            }
            var r = (((max - rgb[0])/6)+(max/2))/max;
            var g = (((max - rgb[1])/6)+(max/2))/max;
            var b = (((max - rgb[2])/6)+(max/2))/max;
            
            if (rgb[0] == max)
            {
                hue = b - g;
            }
            else if (rgb[1] == max)
            {
                hue = (1/3)+r-b;
            }
            else if (rgb[2] == max)
            {
                hue = (2/3)+g-r;
            }
            if(hue < 0)
            {
                hue += 1;
            }
            if(hue > 1)
            {
                hue -= 1;
            }
         }
        return hue;
    },
    
    displayHue : function()
    {
        var boundary = document.getElementById(this.boundaryId);
        boundary.style.background = 'rgb('+this.rgb[0]+','+this.rgb[1]+','+this.rgb[2]+')';
    },
    
    displayRGB : function()
    {
        var hue = this.rgbToHue(this.rgb)
        var pickerPosition;
        if (hue == -0.1)
        {
            pickerPosition = 15;
        }
        else if (hue == 1.1)
        {
            pickerPosition = 231;
        }
        
        else 
        {
            pickerPosition = Math.floor(hue*this.swiperHeight)+30;
            this.hue = Math.round(hue*360);
        }
        this.processEvent(pickerPosition);
        return pickerPosition;
    },
    
    paintElement : function (id)
    {
        document.getElementById(id).style.background = 'rgb('+this.rgb[0]+','+this.rgb[1]+','+this.rgb[2]+')';
    },
    
    cssRGB : function ()
    {
        return 'rgb('+this.rgb[0]+','+this.rgb[1]+','+this.rgb[2]+')';
    },
    
    RGBObject : function()
    {
        return {'red' : this.rgb[0], 'green' : this.rgb[1], 'blue' : this.rgb[2]};
    },
    
    style : {
        basic : {
            showDropShadow : false,
            showBorder : true,
            showRounded : false
        },
        
        lifted : {
            showDropShadow : true,
            showBorder : true,
            showRounded : false
        },
        
        modern : {
            showDropShadow : true,
            showBorder : true,
            showRounded : true
        }
    },
    getsupportedprop : function(proparray)
    {
        var root=document.documentElement;
        for (var i=0; i<proparray.length; i++)
        {
            if (typeof root.style[proparray[i]]=="string")
            {
                return proparray[i]
            }
        }
    }
} 