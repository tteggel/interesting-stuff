/*global document */

var InterestingStuff = function () {
};

InterestingStuff.init = function (drawingId, stuffContainerId) {
    var thingId, vennElement,
    venn = document.getElementById(drawingId),
    self = InterestingStuff,
    child, childIndex, stuffContainer;

    try {
        self.venn = venn.getSVGDocument();
    } catch (SVGdoc) {
        self.venn = venn.contentDocument;
    }

    stuffContainer = document.getElementById(stuffContainerId);
    for (childIndex = 0; childIndex < stuffContainer.children.length; childIndex = childIndex + 1) {
        child = stuffContainer.children[childIndex];
        vennElement = self.hookUpVennElement(child.id);
        child.style.display = 'none';
    }        
};

InterestingStuff.hookUpVennElement = function (thingId) {
    var self = InterestingStuff,
    vennElement = self.venn.getElementById(thingId);

    vennElement.onmouseover = self.focus;
    vennElement.onmouseout = self.blur;
    vennElement.onclick = self.click;
    vennElement.styleOff = self.fadeTo(vennElement, 0.0, 5);
    vennElement.styleSelected = self.fadeTo(vennElement, 0.8, 2);
    vennElement.styleHover = self.fadeTo(vennElement, 0.3, 2);
    vennElement.styleHoverSelected = self.fadeTo(vennElement, 1.0, 2);
    vennElement.styleOff();

    return vennElement;
};

InterestingStuff.focus = function (event) {
    var el = event.srcElement || event.target,
    self = InterestingStuff;
    if (self.selected && self.selected.id === el.id) {
        el.styleHoverSelected();
    } else {
        el.styleHover();
    }
};

InterestingStuff.blur = function (event) {
    var el = event.srcElement || event.target,
    self = InterestingStuff;
    
    if (self.selected && self.selected.id === el.id) {
        el.styleSelected();
    } else {
        el.styleOff();
    }
};

InterestingStuff.click = function (event) {
    var el = event.srcElement || event.target,
    self = InterestingStuff,
    list;
    
    if (self.selected) {
        list = document.getElementById(self.selected.id);
        list.style.display = "none";
        self.selected.styleOff();
    }

    el.styleHoverSelected();
    self.selected = el;

    list = document.getElementById(el.id);
    list.style.display = "block";
};

InterestingStuff.fadeTo = function (target, fade, duration) {
    var animation = document.createElementNS(
          'http://www.w3.org/2000/svg', 'animate');
    animation.setAttributeNS(null, 'attributeName', 'fill-opacity');
    animation.setAttributeNS(null, 'begin', 'indefinite');
    animation.setAttributeNS(null, 'to', fade);
    animation.setAttributeNS(null, 'dur', duration);
    animation.setAttributeNS(null, 'fill', 'freeze');
    animation.setAttributeNS(null, 'keyTimes', '0; 1');    
    animation.setAttributeNS(null, 'keySplines', '0 .75 .25 1');
    animation.setAttributeNS(null, 'calcMode', 'spline');

    target.appendChild(animation);

    if (animation.beginElement) {
        return function () { 
            animation.beginElement(); 
        };
    } else {
        return function () {
            target.style.opacity = fade;
        };
    }
};

