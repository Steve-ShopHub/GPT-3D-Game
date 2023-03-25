const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a function to create a sphere
function createSphere(color, radius, mass) {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    
    const body = new CANNON.Body({ mass, shape: new CANNON.Sphere(radius) });
  
    return { mesh, body };
  }
  
  // Create the player, enemy, and defender avatars
  const player = createSphere(0x00ff00, 1, 1);
  const enemy = createSphere(0xff0000, 1, 1);
  const defender = createSphere(0x0000ff, 1, 1);
  
  // Set the initial positions for the avatars
  player.body.position.set(-10, 0, 0);
  player.mesh.position.copy(player.body.position);
  enemy.body.position.set(10, 0, 0);
  enemy.mesh.position.copy(enemy.body.position);
  defender.body.position.set(0, 10, 0);
  defender.mesh.position.copy(defender.body.position);
  
  // Add the avatars to the scene and the physics world
  scene.add(player.mesh, enemy.mesh, defender.mesh);
  world.addBody(player.body, enemy.body, defender.body);
  
  // Create random obstacles
  const obstacleCount = 10;
  const obstacles = [];
  
  for (let i = 0; i < obstacleCount; i++) {
    const size = Math.random() * 1 + 0.5;
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const mesh = new THREE.Mesh(geometry, material);
    
    const body = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Box(new CANNON.Vec3(size / 2, size / 2, size / 2))
    });
    
    body.position.set(Math.random() * 20 - 10, Math.random() * 20 - 10, 0);
    mesh.position.copy(body.position);
  
    obstacles.push({ mesh, body });
    scene.add(mesh);
    world.addBody(body);
  }

  function createWall(size, position) {
    const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    const material = new THREE.MeshBasicMaterial({ color: 0x808080 });
    const mesh = new THREE.Mesh(geometry, material);
    
    const body = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2)),
    });
    body.position.copy(position);
    mesh.position.copy(body.position);
  
    scene.add(mesh);
    world.addBody(body);
  }
  
  const wallSize = new THREE.Vector3(20, 1, 1);
  const halfSize = wallSize.clone().multiplyScalar(0.5);
  
  createWall(wallSize, new CANNON.Vec3(0, halfSize.y, halfSize.z)); // top
  createWall(wallSize, new CANNON.Vec3(0, halfSize.y, -halfSize.z)); // bottom
  createWall(wallSize, new CANNON.Vec3(halfSize.x, halfSize.y, 0)); // right
  createWall(wallSize, new CANNON.Vec3(-halfSize.x, halfSize.y, 0)); // left

  
  document.addEventListener('keydown', (event) => {
    const velocity = 5;
    switch (event.key) {
      case 'ArrowUp':
        player.body.velocity.z = -velocity;
        break;
      case 'ArrowDown':
        player.body.velocity.z = velocity;
        break;
      case 'ArrowLeft':
        player.body.velocity.x = -velocity;
        break;
      case 'ArrowRight':
        player.body.velocity.x = velocity;
        break;
    }
  });
  
  document.addEventListener('keyup', (event) => {
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
        player.body.velocity.z = 0;
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
        player.body.velocity.x = 0;
        break;
    }
  });
  
  let gameOver = false;

function updatePhysics(delta) {
  world.step(delta);

  player.mesh.position.copy(player.body.position);
  enemy.mesh.position.copy(enemy.body.position);
  defender.mesh.position.copy(defender.body.position);

  obstacles.forEach(({ mesh, body }) => mesh.position.copy(body.position));
}

function updateAI(delta) {
  // Update enemy and defender AI
}

function checkGameOver() {
  if (player.body.position.distanceTo(enemy.body.position) < 2) {
    gameOver = true;
  }
}

function animate() {
  if (!gameOver) {
    requestAnimationFrame(animate);
  }

  const delta = 1 / 60;
  updatePhysics(delta);
  updateAI(delta);
  checkGameOver();
  renderer.render(scene, camera);
}

animate();
