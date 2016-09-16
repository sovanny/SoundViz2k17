/**
 * Created by elinlager on 2016-09-13.
 */


var myHeading = document.querySelector('h1');
myHeading.textContent = 'Hello world!';

//size of canvas
var WIDTH = 640;
var HEIGHT = 100;
var FFT_SIZE = 256;

// set up canvas context for visualizer
var canvas = document.querySelector('.visualizer');
var canvasCtx = canvas.getContext("2d");

// setup 3d scene
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//create cube

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;


/** Add the audio file **/
var audio = new Audio();
audio.src = 'Herbert Munkhammar - Malmö State of Mind.mp3';
audio.controls = true;
audio.autoplay = true;
document.querySelector('h2').appendChild(audio);

var context = new (window.AudioContext || window.webkitAudioContext)();
var analyser = context.createAnalyser();

window.addEventListener('load', function(e) {
    // Our <audio> element will be the audio source.
    var source = context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);
}, false);

analyser.fftSize = FFT_SIZE;
var bufferLength = analyser.frequencyBinCount;
console.log(bufferLength);
var dataArray = new Uint8Array(bufferLength);
canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

function draw() {
    drawVisual = requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    canvasCtx.fillStyle = 'rgb(0, 0, 0)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    var barWidth = (WIDTH / bufferLength) * 0.8;
    var barHeight;
    var x = 0;

    for(var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i]/2;

        var hue = i/this.analyser.frequencyBinCount * 360;
        canvasCtx.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
        //canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)'; <-- Röda nyanser
        canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight);


        x += barWidth + 1;
    }
};

draw();



//render cube
function render() {
    requestAnimationFrame( render );

    analyser.getByteFrequencyData(dataArray);

    cube.scale.x = dataArray[15]/50;
    cube.scale.y = dataArray[15]/50;
    cube.scale.z = dataArray[15]/50;
    cube.rotation.y += 0.01;
    cube.rotation.x += 0.01;

    renderer.render( scene, camera );
}
render();
