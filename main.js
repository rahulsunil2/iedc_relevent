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

scene.add(torus);

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

// Moon

const moonTexture = new THREE.TextureLoader().load("./assets/moon.jpg");
const normalTexture = new THREE.TextureLoader().load("./assets/normal.jpg");

const moon = new THREE.Mesh(
	new THREE.SphereGeometry(3, 32, 32),
	new THREE.MeshStandardMaterial({
		map: moonTexture,
		normalMap: normalTexture,
	})
);

// scene.add(moon);

// moon.position.z = 30;
// moon.position.setX(-10);

//event
function events() {
	const events_texture = new THREE.TextureLoader().load(
		"./assets/all-events.png"
	);
	const geometry = new THREE.PlaneGeometry(35, 20);
	const material = new THREE.MeshBasicMaterial({
		map: events_texture,
		side: THREE.DoubleSide,
	});
	const event_canvas = new THREE.Mesh(geometry, material);
	event_canvas.position.set(-15, 0, 30);
	event_canvas.rotation.y += 1.25;
	scene.add(event_canvas);
}

events();

logo.position.z = -5;
logo.position.x = 2;

// Scroll Animation

function moveCamera() {
	const t = document.body.getBoundingClientRect().top;
	moon.rotation.x += 0.05;
	moon.rotation.y += 0.075;
	moon.rotation.z += 0.05;

	logo.rotation.y += 0.1;

	camera.position.z = t * -0.01;
	camera.position.x = t * -0.0015;
	camera.rotation.y = t * -0.0002;
}
document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
	requestAnimationFrame(animate);

	torus.rotation.x += 0.01;
	torus.rotation.y += 0.005;
	torus.rotation.z += 0.01;

	moon.rotation.x += 0.005;

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
