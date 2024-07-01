const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set up physics world
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// Create a plane
const planeGeometry = new THREE.PlaneGeometry(50, 50);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x0077ff, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

const planeBody = new CANNON.Body({
    mass: 0, // Mass of 0 makes the body static
    shape: new CANNON.Plane(),
});
planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(planeBody);

// Set camera position
camera.position.y = 5;
camera.position.z = 10;

// Function to create a ball
function createBall(x, z) {
    // Three.js ball
    const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.set(x, 10, z);
    scene.add(ball);

    // Cannon.js ball
    const ballShape = new CANNON.Sphere(0.5);
    const ballBody = new CANNON.Body({
        mass: 1, // Mass of the ball
        shape: ballShape,
        position: new CANNON.Vec3(x, 10, z),
    });
    world.addBody(ballBody);

    // Sync three.js ball with Cannon.js ball
    ball.userData.physicsBody = ballBody;
}

// Handle mouse click events
window.addEventListener('click', (event) => {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(plane);
    if (intersects.length > 0) {
        const intersect = intersects[0];
        createBall(intersect.point.x, intersect.point.z);
    }
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update physics
    world.step(1 / 60);

    // Sync three.js objects with physics objects
    scene.children.forEach((child) => {
        if (child.userData.physicsBody) {
            child.position.copy(child.userData.physicsBody.position);
            child.quaternion.copy(child.userData.physicsBody.quaternion);
        }
    });

    renderer.render(scene, camera);
}

animate();