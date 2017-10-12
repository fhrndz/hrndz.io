(function () {
    var canvas = document.getElementById('mind');
    var ctx = canvas.getContext("2d");

    var mouse = {x: 0, y: 0};
    var nPos = {x: 0, y: 0};

    var noiseStrength = 1;
    var motion = 0.01;
    var color = '#1B2735';
    var lineWidth = 1;

    var numParticles = 100;

    var particles = [];
    var points = [];
    var vertices = [];

    var Particle = function () {
        this.x = random(-0.2, 1.2, true);
        this.y = random(-0.2, 1.2, true);
        this.z = random(0, 4);
    };

    function render() {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        for (var v = 0; v < vertices.length - 1; v++) {

            if ((v + 1) % 3 === 0) {
                continue;
            }

            var p1 = particles[vertices[v]],
                p2 = particles[vertices[v + 1]];

            var pos1 = position(p1.x, p1.y, p1.z),
                pos2 = position(p2.x, p2.y, p2.z);

            ctx.moveTo(pos1.x, pos1.y);
            ctx.lineTo(pos2.x, pos2.y);

        }
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        ctx.closePath();
    }

    function resize() {

        canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
        canvas.height = canvas.width * (canvas.clientHeight / canvas.clientWidth);
    }

    function position(x, y, z) {
        return {
            x: (x * canvas.width) + ((((canvas.width / 2) - mouse.x + ((nPos.x - 0.5) * noiseStrength)) * z) * motion),
            y: (y * canvas.height) + ((((canvas.height / 2) - mouse.y + ((nPos.y - 0.5) * noiseStrength)) * z) * motion)
        };
    }

    function random(min, max, float) {
        return float ?
            Math.random() * (max - min) + min :
            Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function init() {
        for (var i = 0; i < numParticles; i++) {
            var p = new Particle();
            particles.push(p);
            points.push([p.x * 100, p.y * 100]);
        }

        vertices = Delaunay.triangulate(points);

        if ('ontouchstart' in document.documentElement && window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', function (e) {
                mouse.x = (canvas.clientWidth / 2) - ((e.gamma / 90) * (canvas.clientWidth / 2) * 2);
                mouse.y = (canvas.clientHeight / 2) - ((e.beta / 90) * (canvas.clientHeight / 2) * 2);
                render();
            }, true);
        } else {
            document.body.addEventListener('mousemove', function (e) {
                mouse.x = e.clientX;
                mouse.y = e.clientY;
                render();
            });
        }


        document.getElementsByTagName("BODY")[0].onresize = function () {
            resize();
            render();
        };

        resize();
        render();
    }

    init();

})();