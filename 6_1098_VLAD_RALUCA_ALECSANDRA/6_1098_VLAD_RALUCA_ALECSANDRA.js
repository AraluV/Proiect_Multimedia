var MOUSE_LEFT = 0, MOUSE_RIGHT = 2, KEY_DEL = 46;
var x1 = 0, y1 = 0, x2 = 0, y2 = 0;
var elementSelectat = null;
var figura = "dreptunghi";
var istoric = [];

var editor = document.getElementById("editorSvg");
var elemente = document.getElementById("elemente");
var culoare = document.getElementById("culoare");
var grosime = document.getElementById("grosime");
var undoButton = document.getElementById("undo");
var exportSVGButton = document.getElementById("exportSVG");
var exportPNGButton = document.getElementById("exportPNG");

document.getElementById("linie").onclick = () => {
    figura = "linie";
}

document.getElementById("elipsa").onclick = () => {
    figura = "elipsa";
}

document.getElementById("dreptunchi").onclick = () => {
    figura = "dreptunghi";
}

undoButton.onclick = undo;
exportSVGButton.onclick = exportSVG;
exportPNGButton.onclick = exportPNG;

culoare.onchange = (e) => {
    if (elementSelectat) {
        if (figura === "elipsa" || figura === "dreptunghi" || figura === "linie") {
            elementSelectat.style.fill = e.target.value;
        }
    }
}

function setareCoordonateLinie(obiect, x1, y1, x2, y2) {
    obiect.setAttributeNS(null, 'x1', x1);
    obiect.setAttributeNS(null, 'y1', y1);
    obiect.setAttributeNS(null, 'x2', x2);
    obiect.setAttributeNS(null, 'y2', y2);
    obiect.setAttributeNS(null, 'stroke', culoare.value);
    obiect.setAttributeNS(null, 'stroke-width', grosime.value);
    obiect.setAttributeNS(null, 'fill', 'none');
}

function setareCoordonateElipsa(obiect, x1, y1, x2, y2) {
    obiect.setAttributeNS(null, 'cx', (x1 + x2) / 2);
    obiect.setAttributeNS(null, 'cy', (y1 + y2) / 2);
    obiect.setAttributeNS(null, 'rx', Math.abs(x1 - x2) / 2);
    obiect.setAttributeNS(null, 'ry', Math.abs(y1 - y2) / 2);
    obiect.setAttributeNS(null, 'fill', culoare.value);
    obiect.setAttributeNS(null, 'stroke', 'none');
}

function setareCoordonateDreptunghi(obiect, x1, y1, x2, y2) {
    obiect.setAttributeNS(null, 'x', Math.min(x1, x2));
    obiect.setAttributeNS(null, 'y', Math.min(y1, y2));
    obiect.setAttributeNS(null, 'width', Math.abs(x1 - x2));
    obiect.setAttributeNS(null, 'height', Math.abs(y1 - y2));
    obiect.setAttributeNS(null, 'fill', culoare.value);
    obiect.setAttributeNS(null, 'stroke', 'none');
}

function adaugaForma(forma) {
    istoric.push(elemente.innerHTML);
    elemente.appendChild(forma);
}

function undo() {
    if (istoric.length > 1) {
        istoric.pop();
        elemente.innerHTML = istoric[istoric.length - 1];
    }
}

function exportSVG() {
    var svgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" xmlns:xlink="http://www.w3.org/1999/xlink">' + elemente.innerHTML + '</svg>';
    var blob = new Blob([svgContent], { type: "image/svg+xml" });
    var url = URL.createObjectURL(blob);

    var a = document.createElement("a");
    a.href = url;
    a.download = "desen.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function exportPNG() {
    var svgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" xmlns:xlink="http://www.w3.org/1999/xlink">' + elemente.innerHTML + '</svg>';

    var canvas = document.createElement('canvas');
    canvas.width = editor.clientWidth;
    canvas.height = editor.clientHeight;
    var context = canvas.getContext('2d');

    var data = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);

    var img = new Image();
    img.onload = function () {
        context.drawImage(img, 0, 0);

        var pngData = canvas.toDataURL('image/png');
        var a = document.createElement("a");
        a.href = pngData;
        a.download = "desen.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
    img.src = data;
}

editor.onmousedown = function (e) {
    if (e.button == MOUSE_LEFT) {
        x1 = e.pageX - this.getBoundingClientRect().left;
        y1 = e.pageY - this.getBoundingClientRect().top;
        switch (figura) {
            case "linie": {
                setareCoordonateLinie(selectieLinie, x1, y1, x1, y1);
                selectieLinie.style.display = "block";
                break;
            }
            case "elipsa": {
                setareCoordonateElipsa(selectieElipsa, x1, y1, x1, y1);
                selectieElipsa.style.display = "block";
                break;
            }
            case "dreptunghi": {
                setareCoordonateDreptunghi(selectieDreptunghi, x1, y1, x1, y1);
                selectieDreptunghi.style.display = "block";
                break;
            }
            default:
                break;
        }
    }
}

editor.onmouseup = function (e) {
    if (e.button == MOUSE_LEFT) {
        switch (figura) {
            case "linie":
                selectieLinie.style.display = "none";
                elementNou = document.createElementNS("http://www.w3.org/2000/svg", "line");
                setareCoordonateLinie(elementNou, x1, y1, x2, y2);
                break;
            case "elipsa":
                selectieElipsa.style.display = "none";
                elementNou = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
                setareCoordonateElipsa(elementNou, x1, y1, x2, y2);
                break;
            case "dreptunghi":
                selectieDreptunghi.style.display = "none";
                elementNou = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                setareCoordonateDreptunghi(elementNou, x1, y1, x2, y2);
                break;
            default:
                break;
        }
        adaugaForma(elementNou);
        elementNou.onmousedown = function (e) {
            if (e.button == MOUSE_RIGHT) {
                var elementeCopii = document.querySelectorAll("#elemente *");
                elementeCopii.forEach(el => el.classList.remove("selectat"));
                e.target.classList.add("selectat");
                elementSelectat = e.target;

                var offsetX = e.clientX - elementSelectat.getBoundingClientRect().left;
                var offsetY = e.clientY - elementSelectat.getBoundingClientRect().top;

                document.onmousemove = function (e) {
                    var x = e.pageX - offsetX;
                    var y = e.pageY - offsetY;
                    elementSelectat.setAttributeNS(null, 'x', x);
                    elementSelectat.setAttributeNS(null, 'y', y);

                    if (elementSelectat.tagName.toLowerCase() === 'line') {
                        elementSelectat.setAttributeNS(null, 'x1', x);
                        elementSelectat.setAttributeNS(null, 'y1', y);
                        elementSelectat.setAttributeNS(null, 'x2', x + x2 - x1);
                        elementSelectat.setAttributeNS(null, 'y2', y + y2 - y1);
                    } else if (elementSelectat.tagName.toLowerCase() === 'ellipse') {
                        elementSelectat.setAttributeNS(null, 'cx', x + (x2 - x1) / 2);
                        elementSelectat.setAttributeNS(null, 'cy', y + (y2 - y1) / 2);
                    } else if (elementSelectat.tagName.toLowerCase() === 'rect') {
                        elementSelectat.setAttributeNS(null, 'x', x);
                        elementSelectat.setAttributeNS(null, 'y', y);
                    }
                }

                document.onmouseup = function () {
                    document.onmousemove = null;
                    document.onmouseup = null;
                }
            }
        }
    }
}

editor.onmousemove = function (e) {
    x2 = e.pageX - this.getBoundingClientRect().left;
    y2 = e.pageY - this.getBoundingClientRect().top;
    switch (figura) {
        case "linie":
            setareCoordonateLinie(selectieLinie, x1, y1, x2, y2);
            break;
        case "elipsa":
            setareCoordonateElipsa(selectieElipsa, x1, y1, x2, y2);
            break;
        case "dreptunghi":
            setareCoordonateDreptunghi(selectieDreptunghi, x1, y1, x2, y2);
            break;
        default:
            break;
    }
}

document.onkeydown = function (e) {
    if (e.keyCode === KEY_DEL && elementSelectat) {
        elementSelectat.remove();
    }
}

editor.oncontextmenu = function (e) {
    e.preventDefault();
}
