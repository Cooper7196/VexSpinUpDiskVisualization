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
    let distX = Math.hypot((3.6576 - 0.801612) - x.map(0, size[0], 0, 3.6576), 0.441706 - y.map(0, size[1], 0, 3.6576));

    inches = distX * 39.37;
    feet = Math.floor(inches / 12);
    inches = round(inches % 12);

    document.getElementById("distance").innerHTML = "Dist: " + feet + " ft " + inches + " in";
    if (velocities[x][y] == velocities[x][y]) {
        document.getElementById("velocity").innerHTML = "Speed: " + round(velocities[x][y], 2) + " m/s";
    }
    else {
        document.getElementById("velocity").innerHTML = "Impossible at this location";
    }
});


canvas.addEventListener('click', event => {
    let bound = canvas.getBoundingClientRect();

    let x = event.clientX - bound.left - canvas.clientLeft;
    let y = event.clientY - bound.top - canvas.clientTop;
    x = round(x.map(0, size[0], 0, canvas.width));
    y = round(y.map(0, size[1], 0, canvas.height));
    let distX = Math.hypot((3.6576 - 0.451612) - x.map(0, size[0], 0, 3.6576), 0.441706 - y.map(0, size[1], 0, 3.6576));
    if (velocities[x][y] == velocities[x][y]) {
        drawLaunch(velocities[x][y], angle, distX, (0.635 - initHeight / 39.37));
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

document.getElementById("initHeight").addEventListener('input', event => {
    initHeight = event.target.value;
    // document.getElementById("angleHeading").innerHTML = "Angle: " + angle + "°";
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



function diskPos(time, speed, angle) {
    return speed * Math.sin(angle * Math.PI / 180.0) * time - 4.9 * time * time;
}


function drawLaunch(speed, angle, dist, height) {
    let disk = new Image()
    let goal = new Image()
    let ctx = diskCanvas.getContext("2d")
    let x = 0;
    let y = 0;
    let time = 0;
    let lastTimeStamp = 0;

    disk.onload = function () {
        requestAnimationFrame(animate);
    }
    disk.src = "disk.png";   // load image
    goal.src = "goal.png";   // load image
    function animate(timestamp) {
        if (lastTimeStamp == undefined) {
            requestAnimationFrame(animate);
            return
        }
        if (lastTimeStamp === 0) {
            lastTimeStamp = timestamp;
        }
        // console.log("y: " + y + " x: " + x);
        if (y > -0.1) {
            let speed = dist / Math.cos(angle * Math.PI / 180.0) * Math.sqrt(9.81 / (2 * (dist * Math.tan(angle * 3.14159265 / 180.0) - (0.635 - initHeight / 39.37))));
            elapsed = timestamp - lastTimeStamp;
            ctx.clearRect(0, 0, diskCanvas.width, diskCanvas.height);  // clear diskCanvas


            x = speed * Math.cos(angle * Math.PI / 180) * time;
            diskHeight = diskPos(time, speed, angle) + initHeight / 39.37
            y = diskHeight;
            if (x < dist) {
                time += elapsed / 1000;
            }
            ctx.drawImage(goal, dist.map(0, dist + 1, 0, diskCanvas.width), diskCanvas.height - 0.635.map(0, dist + 1, 0, diskCanvas.height) - 80, goal.height * 0.5, goal.height * 0.5);
            ctx.drawImage(disk, x.map(0, dist + 1, 0, diskCanvas.width), diskCanvas.height - y.map(0, dist + 1, 0, diskCanvas.height), disk.width * 0.1, disk.height * 0.1);


            lastTimeStamp = timestamp;
            requestAnimationFrame(animate);
            // console.log(x, y);
        }
        else {
            lastTimeStamp = 0;
        }
    }
}

diskCanvas = document.getElementById('diskCanvas');
diskCanvas.width = diskCanvas.getBoundingClientRect().width;
diskCanvas.height = diskCanvas.getBoundingClientRect().height;