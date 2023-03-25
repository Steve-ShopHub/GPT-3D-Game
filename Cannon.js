const world = new CANNON.World();
world.gravity.set(0, 0, 0); // No gravity for a 2D plane
world.broadphase = new CANNON.NaiveBroadphase();
world.solver.iterations = 10;
