Number.prototype.map = function (in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

var getColorAtScalar = function (n, maxLength) {
    var n = n * 240 / (maxLength);
    return 'hsl(' + n + ',100%,50%)';
}


function RainBowColor(length, maxLength) {
    var i = (length * 255 / maxLength);
    var r = Math.round(Math.sin(0.024 * i + 0) * 127 + 128);
    var g = Math.round(Math.sin(0.024 * i + 2) * 127 + 128);
    var b = Math.round(Math.sin(0.024 * i + 4) * 127 + 128);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function makeArray(w, h) {
    var arr = [];
    for (let i = 0; i < h; i++) {
        arr[i] = [];
        for (let j = 0; j < w; j++) {
            arr[i][j] = 0;
        }
    }
    return arr;
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var angleRangeElement = document.getElementById("angleRange");
document.querySelector("#loadingDiv").style.display = "none";

let angle = 45;
let initHeight = 14;
canvas.width = Math.min(500, canvas.getBoundingClientRect().width);
canvas.height = Math.min(500, canvas.getBoundingClientRect().height);

console.log(canvas.width, canvas.height);

let size = [canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height];
let startPos = [0, 0];
let velocities = generateMap([canvas.width, canvas.height]);
draw(velocities);


canvas.addEventListener('mousemove', event => {
    let bound = canvas.getBoundingClientRect();

    let x = event.clientX - bound.left - canvas.clientLeft;
    let y = event.clientY - bound.top - canvas.clientTop;
    x = round(x.map(0, size[0], 0, canvas.width));
    y = round(y.map(0, size[1], 0, canvas.height));
    let distX = Math.hypot((3.6576 - 0.451612) - x.map(0, size[0], 0, 3.6576), 0.441706 - y.map(0, size[1], 0, 3.6576));
    document.getElementById("mousePos").innerHTML = "Position: " + round(x.map(0, size[0], 0, 144), 1) + "in  " + round(y.map(0, size[1], 0, 144), 1) + " in" + " Dist: " + round(distX, 2) + " m";
    if (velocities[x][y] == velocities[x][y]) {
        document.getElementById("velocity").innerHTML = round(velocities[x][y], 2) + " m/s";
    }
    else {
        document.getElementById("velocity").innerHTML = "Impossible at this location";
    }
});

angleRangeElement.addEventListener('input', event => {
    angle = event.target.value;
    document.getElementById("angleHeading").innerHTML = "Angle: " + angle + "°";
});

angleRangeElement.addEventListener('change', event => {
    document.querySelector("#loadingDiv").style.display = "block";
    console.log(document.querySelector("#loadingDiv").style.visibility);
    angle = event.target.value;
    setTimeout(function () {
        velocities = generateMap(size);
        draw(velocities);
        document.querySelector("#loadingDiv").style.display = "none";
    }, 1000)

});

function draw(velocities) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (let i = 0; i < velocities.length; i++) {
        for (let j = 0; j < velocities[0].length; j++) {
            // console.log(velocities[i][j]);
            ctx.fillStyle = RainBowColor(velocities[i][j] * 10, 255);
            if (velocities[i][j] == velocities[i][j] && velocities[i][j] < 40) {
                ctx.fillRect(startPos[0] + i, startPos[1] + j, 1, 1);
            }
        }
    }
}


function generateMap(size) {
    let velocities = makeArray(size[0], size[1]);
    for (let i = 0; i < size[0]; i++) {
        for (let j = 0; j < size[1]; j++) {

            let distX = Math.hypot((3.6576 - 0.451612) - i.map(0, canvas.width, 0, 3.6576), 0.441706 - j.map(0, canvas.height, 0, 3.6576));
            let velocity = distX / Math.cos(angle * Math.PI / 180.0) * Math.sqrt(9.81 / (2 * (distX * Math.tan(angle * 3.14159265 / 180.0) - (0.635 - initHeight / 39.37))));
            velocities[i][j] = velocity;
        }
    }
    return velocities
}