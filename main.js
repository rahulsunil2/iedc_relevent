import "./style.css";
import "./spinner.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// Torus

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry, material);

// scene.add(torus);

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

function addStar() {
	const starTexture = new THREE.TextureLoader().load("./assets/star.png");

	const geometry = new THREE.PlaneGeometry(1, 1);
	const material = new THREE.MeshBasicMaterial({
		map: starTexture,
		side: THREE.DoubleSide,
		alphaTest: 0.5,
	});
	const star = new THREE.Mesh(geometry, material);

	const [x, y, z] = Array(3)
		.fill()
		.map(() => THREE.MathUtils.randFloatSpread(100));

	star.position.set(x, y, z);
	scene.add(star);
}

Array(500).fill().forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load("./assets/bg.png");
scene.background = spaceTexture;

// Avatar

const logoTexture = new THREE.TextureLoader().load(
	"./assets/CatalystWhiteFGBlackBG.png"
);

const logo = new THREE.Mesh(
	new THREE.BoxGeometry(2, 2, 2),
	new THREE.MeshBasicMaterial({ map: logoTexture })
);

scene.add(logo);

//event
function events(event_img_src, index) {
	const events_texture = new THREE.TextureLoader().load(event_img_src);
	const geometry = new THREE.PlaneGeometry(16, 9);
	const material = new THREE.MeshBasicMaterial({
		map: events_texture,
		side: THREE.DoubleSide,
	});
	const event_canvas = new THREE.Mesh(geometry, material);
	event_canvas.position.set(-15, 0, 15 * index);
	event_canvas.rotation.y += 1.25;
	scene.add(event_canvas);
	return event_canvas;
}

var eventList = [
	events("./assets/all-events.png", 1),
	events("./assets/img-01.jpg", 2),
	events("./assets/img-07.jpg", 3),
	events("./assets/img-11.jpg", 4),
];

logo.position.z = -5;
logo.position.x = 2;

// Scroll Animation

function moveCamera() {
	const t = document.body.getBoundingClientRect().top;
	logo.rotation.y += 0.1;

	logo.scale.x = 1 + t * -0.0015;
	logo.scale.y = 1 + t * -0.0015;
	logo.scale.z = 1 + t * -0.0015;

	camera.position.z = t * -0.01;
	camera.position.x = t * -0.0015;
	camera.rotation.y = t * -0.0002;

	eventList.forEach((event) => {
		event.position.x = -10 + t * 0.0001;
		event.rotation.y = 0 + t * 0.0005;
	});
}
document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
	requestAnimationFrame(animate);
	logo.rotation.y += 0.01;

	torus.rotation.x += 0.01;
	torus.rotation.y += 0.005;
	torus.rotation.z += 0.01;

	eventList.forEach((event) => {
		event.rotation.y += 0.0005;
	});

	renderer.render(scene, camera);
}

function init() {
	THREE.DefaultLoadingManager.onLoad = () => {
		document.getElementById("loader").classList.add("hidden");
		// setTimeout(() => {}, 3000);
	};

	animate();
}

init();
