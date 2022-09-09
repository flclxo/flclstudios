let canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.id = "canvas";
var ctx = canvas.getContext("2d");
var spheres = [];
var imgdata = [];
canvas.width = 300;
canvas.height = 300;
var imgWidth = 100;
var imgHeight = 50;
var screenX = canvas.width / 2;
var screenY = canvas.height / 2;
var screenScale = 600;
var rotation = 0;
var isReadyAnimation = false;

var Vector = function (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

var Particle = function (x, y, z,colorsArrIndex) {
    this.pos = new Vector(x, y, z);
    this.posModel = new Vector(x, y, z);
    this.GenerateColorFromImgIndex(colorsArrIndex);
}

Particle.prototype.GenerateColorFromImgIndex = function (i) {
    this.r = 25-imgdata[i * 4 + 0];
    this.g = 100-imgdata[i * 4 + 1];
    this.b = imgdata[i * 4 + 2];
    this.a = 0;
}

var Sphere = function (x,y, radius, numPointsX, numPointsY) {
    this.pos = new Vector(x, y, 1);
    this.particles = [];
    this.GeneratePoints(x, y, radius, numPointsX, numPointsY);
}

function CreateColorsArr() {
    var canvasimg = document.createElement('canvas');
    var ctximg = canvasimg.getContext("2d");
    var img = new Image();
    img.crossOrigin = "";
    img.src = "https://ucarecdn.com/684548ca-0157-4455-9fe5-9782af655cf0/worldmapsmall_bw9sas.png";
    var ctximg = canvasimg.getContext("2d");
    img.onload = function () {
        ctximg.translate(imgWidth, imgHeight);
        ctximg.scale(-1, -1);
        ctximg.drawImage(img, 0, 0);
        imgdata = ctximg.getImageData(0, 0, imgWidth, imgHeight).data;
        ctximg.clearRect(0, 0, imgWidth, imgHeight);
        spheres.push(new Sphere(0, 0, canvas.height / 8, imgWidth,imgHeight));
        isReadyAnimation = true;
    }
}

Sphere.prototype.GeneratePoints = function (x, y, radius, num, num2) {
    x = x / 2;
    y = y / 2;
    num = Math.floor(num);
    var angle = 2 * Math.PI / num;
    var angle2 = Math.PI / num2;
    for (var j = 0; j <= num2; j++) {
    for (var i = 0; i < num; i++) {
            var rx = radius * Math.cos(angle * i) * Math.sin(angle2 * j);
            var rz = radius * Math.sin(angle * i) * Math.sin(angle2 * j);
            var ry = radius * Math.cos(angle2 * j);
            this.particles.push(new Particle(x + rx, y + ry, rz, j * imgWidth + i));
        }
    }
}

Sphere.prototype.RotateAxisY = function (angle) {
    for (var i = 0; i < this.particles.length; i++) {
        this.particles[i].posModel.x = this.particles[i].pos.x * Math.cos(angle) + this.particles[i].pos.z * (-1) * Math.sin(angle);
        this.particles[i].posModel.y = this.particles[i].pos.y;
        this.particles[i].posModel.z = this.particles[i].pos.x * Math.sin(angle) + this.particles[i].pos.z * Math.cos(angle);
    }
}

Sphere.prototype.Draw = function (ctx) {
    ctx.beginPath();
    for (var i = 0; i < this.particles.length; i++) {
        var z = this.particles[i].posModel.z;
            var x = this.particles[i].posModel.x * screenScale / (z*(-1) + screenScale) + screenX;
            var y = this.particles[i].posModel.y * screenScale / (z*(-1) + screenScale) + screenY;;
            var a = (this.particles[i].posModel.z + (imgWidth / 2)) / imgWidth;
            if (a > 0.2) {
                ctx.fillStyle = "rgba(" + this.particles[i].r + "," + this.particles[i].g + "," + this.particles[i].b + "," + a + ")";
                ctx.fillRect(this.pos.x + x, this.pos.y + y, 2, 2);
            }
        }
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (isReadyAnimation) {
        spheres[0].Draw(ctx);
        spheres[0].RotateAxisY(rotation);
        rotation += 0.05;
    }
    requestAnimationFrame(loop);
}
CreateColorsArr();
loop();
