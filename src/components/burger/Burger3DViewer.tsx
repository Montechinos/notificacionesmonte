import React, { useRef, useEffect } from 'react';
import { View, Text, Platform } from 'react-native';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { IngredientState } from '@src/lib/modules/ingredients';
import { MODEL_MAP } from './burgerModelMap';

interface Props {
  ingredients: IngredientState[];
}

export function Burger3DViewer({ ingredients }: Props) {
  const containerRef = useRef<View>(null);
  const modelsRef = useRef<Map<string, THREE.Group>>(new Map());
  const ingredientsRef = useRef(ingredients);
  ingredientsRef.current = ingredients;

  const updateVisibility = () => {
    ingredientsRef.current.forEach((ing) => {
      const model = modelsRef.current.get(ing.name);
      if (model) model.visible = ing.selected;
    });
  };

  // Setup escena Three.js (solo web)
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const el = (containerRef.current as unknown) as HTMLDivElement;
    if (!el) return;

    const w = el.clientWidth || 320;
    const h = 256;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfff7ed);

    const camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 100);
    camera.position.set(0, 1.2, 3.5);
    camera.lookAt(0, 0.35, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(3, 5, 4);
    scene.add(sun);
    scene.add(new THREE.DirectionalLight(0xffffff, 0.3).translateX(-3));

    const ctrl = new OrbitControls(camera, renderer.domElement);
    ctrl.enableZoom = false;
    ctrl.enablePan = false;
    ctrl.autoRotate = true;
    ctrl.autoRotateSpeed = 2;
    ctrl.minPolarAngle = Math.PI / 6;
    ctrl.maxPolarAngle = Math.PI / 2.2;
    ctrl.target.set(0, 0.35, 0);

    const loader = new GLTFLoader();
    Object.entries(MODEL_MAP).forEach(([name, { url, y, scale }]) => {
      loader.load(url, (gltf) => {
        const model = gltf.scene;
        // Los modelos vienen en Z-up (Blender), rotar a Y-up (Three.js)
        model.rotation.x = Math.PI / 2;
        model.scale.setScalar(scale);
        model.position.y = y;
        model.visible = false;
        scene.add(model);
        modelsRef.current.set(name, model);
        updateVisibility();
      });
    });

    let raf: number;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      ctrl.update();
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ctrl.dispose();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      modelsRef.current.clear();
    };
  }, []);

  useEffect(updateVisibility, [ingredients]);

  if (Platform.OS !== 'web') {
    return (
      <View className="h-64 items-center justify-center rounded-2xl bg-orange-50">
        <Text className="text-gray-400">Vista 3D no disponible</Text>
      </View>
    );
  }

  return <View ref={containerRef} className="h-64 w-full overflow-hidden rounded-2xl" />;
}
