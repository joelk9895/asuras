/**
 * This is a temporary fix for the BatchedMesh import error in three-mesh-bvh.
 * It patches the THREE object to include a dummy BatchedMesh if it doesn't exist.
 * This should be removed once three-mesh-bvh is updated to be compatible with the three version being used.
 */

// Apply this patch in client-side code only
if (typeof window !== "undefined") {
  const THREE = require("three");

  // Add BatchedMesh if it doesn't exist to prevent import errors
  if (!THREE.BatchedMesh) {
    console.warn(
      "Adding placeholder BatchedMesh to THREE to fix three-mesh-bvh compatibility"
    );

    // Create a placeholder class that extends Object3D
    THREE.BatchedMesh = class BatchedMesh extends THREE.Object3D {
      constructor() {
        super();
        console.warn("Placeholder BatchedMesh was instantiated");
      }
    };
  }
}

export {};
