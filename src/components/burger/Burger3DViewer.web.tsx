
import { IngredientState } from '@src/lib/modules/ingredients';
import React, { useEffect, useRef, useState } from 'react';
import { MODEL_MAP } from './burgerModelMap';

// This component is for web only.
// It uses three.js to render a 3D burger.
// The native version of this component is in Burger3DViewer.tsx.

interface Props {
  ingredients: IngredientState[];
}

export function Burger3DViewer({ ingredients }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [three, setThree] = useState<typeof import('three') | null>(null);
  const modelsRef = useRef<Map<string, any>>(new Map());
  const ingredientsRef = useRef(ingredients);
  ingredientsRef.current = ingredients;

  useEffect(() => {
    // Dynamically import three.js only on the client-side (web)
    if (typeof window !== 'undefined') {
      import('three').then(threeModule => setThree(threeModule));
    }
  }, []);

  // Setup Three.js scene
  useEffect(() => {
    if (!three) return;

    let cancelled = false;
    let renderer: import('three').WebGLRenderer;
    let controls: any; // OrbitControls instance
    let rafId: number;

    const el = containerRef.current;
    if (!el) return;

    const setup = async () => {
      const w = el.clientWidth || 320;
      const h = 256;

      // Scene
      const scene = new three.Scene();
      scene.background = new three.Color(0xfff7ed);

      // Camera
      const camera = new three.PerspectiveCamera(45, w / h, 0.1, 100);
      camera.position.set(0, 1, 3);
      camera.lookAt(0, 0.35, 0);

      // Renderer
      renderer = new three.WebGLRenderer({ antialias: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = three.SRGBColorSpace;
      el.appendChild(renderer.domElement);

      // Lights
      scene.add(new three.AmbientLight(0xffffff, 0.8));
      const sun = new three.DirectionalLight(0xffffff, 1.2);
      sun.position.set(3, 5, 4);
      scene.add(sun);
      scene.add(new three.DirectionalLight(0xffffff, 0.3).translateX(-3));

      // Import loaders and controls
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');

      if (cancelled) return;

      // Controls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 2;
      controls.minPolarAngle = Math.PI / 6;
      controls.maxPolarAngle = Math.PI / 2.2;
      controls.target.set(0, 0.35, 0);

      // Load models
      const loader = new GLTFLoader();
      Object.entries(MODEL_MAP).forEach(([name, { url, y, scale }]) => {
        loader.load(url, (gltf) => {
          if (cancelled) return;
          const model = gltf.scene;
          model.rotation.x = Math.PI / 2;
          model.scale.setScalar(scale);
          model.position.y = y;
          const ing = ingredientsRef.current.find((i) => i.name === name);
          model.visible = ing?.selected ?? false;
          scene.add(model);
          modelsRef.current.set(name, model);
        });
      });

      // Animation loop
      const tick = () => {
        if (cancelled) return;
        rafId = requestAnimationFrame(tick);
        controls.update();
        renderer.render(scene, camera);
      };
      tick();
    };

    setup();

    // General cleanup
    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (controls) controls.dispose();
      if (renderer) {
        renderer.dispose();
        if (el.contains(renderer.domElement)) {
          el.removeChild(renderer.domElement);
        }
      }
      modelsRef.current.clear();
    };
  }, [three]);

  // Update visibility when ingredients change
  useEffect(() => {
    if (!three) return;
    ingredients.forEach((ing) => {
      const model = modelsRef.current.get(ing.name);
      if (model) {
        model.visible = ing.selected;
      }
    });
  }, [ingredients, three]);

  // Use a div for web, which is compatible with the HTMLDivElement ref
  return <div ref={containerRef} style={{ height: 256, width: '100%', overflow: 'hidden', borderRadius: 16 }} />;
}
