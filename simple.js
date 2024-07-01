// Basic setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Camera position
camera.position.z = 5;

// Render loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate cubes if rotation is enabled
    scene.children.forEach(obj => {
        if (obj.isRotating) {
            obj.rotation.x += 0.01;
            obj.rotation.y += 0.01;
        }
    });

    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Function to create a cube
function createCube() {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(-1, 0, 0);
    cube.isRotating = false; // Custom property to track rotation state
    scene.add(cube);
    return cube;
}

// Function to create a sphere
function createSphere() {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(1, 0, 0);
    scene.add(sphere);
    return sphere;
}

// Add initial objects to the scene
const cube = createCube();
const sphere = createSphere();

// Raycaster for detecting clicks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
    // Convert mouse coordinates to normalized device coordinates (-1 to +1) for both components
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        const object = intersects[0].object;

        if (object.geometry.type === 'BoxGeometry') {
            // Toggle rotation
            object.isRotating = !object.isRotating;
        } else if (object.geometry.type === 'SphereGeometry') {
            // Change color
            object.material.color.set(Math.random() * 0xffffff);
        }
    }
}

document.addEventListener('click', onMouseClick);
