import {
    AmbientLight,HemisphereLight, DirectionalLight,
    Mesh, MeshPhysicalMaterial,
    PerspectiveCamera, PMREMGenerator,
    Scene, SphereGeometry, WebGLRenderer, TextureLoader
} from "three";
import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { listenfit } from "./size.js";
import { EventBus } from "../utils/eventBus.js";
import { adjustHDRBrightness, updateEnvironmentMap } from '../pbrUtils/scene.js';
// 创建并添加自定义的ShaderPass来调整饱和度
import { updateMaterialProperty } from "./update/updateThreeScene.js";
window.THREE=THREE
const saturationShader = {
    uniforms: {
        tDiffuse: { value: null },
        saturation: { value: 1.2 }, // 示例值，可以根据需要调整
    },
    vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
    fragmentShader: `
            uniform sampler2D tDiffuse;
            uniform float saturation;
            varying vec2 vUv;
            void main() {
                vec4 color = texture2D(tDiffuse, vUv);
                float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
                gl_FragColor = vec4(mix(vec3(gray), color.rgb, saturation), color.a);
            }
        `
};

export function initScene(container) {
    const renderer = new WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMappingExposure = 1;
    renderer.physicallyCorrectLights = true; // 开启物理正确的光照
    container.appendChild(renderer.domElement);
    const scene = new Scene();
    const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;
    scene.add(camera);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    const pmremGenerator = new PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    // 添加环境光
    const ambientLight = new AmbientLight(0xffffff, 1.3);
    const hemisphereLight = new HemisphereLight(0xffffbb, 0x080820,1.3);
    scene.add(hemisphereLight);
    scene.add(ambientLight);
    // 添加方向光
  //  const directionalLight = new DirectionalLight(0xffffff,3);
  //  directionalLight.position.set(500, 300, 500);
   // scene.add(directionalLight);
    // 创建球体几何体
    const geometry = new SphereGeometry(1, 200, 200);
    // 创建PBR材质
    const material = new MeshPhysicalMaterial({
        color: 0xffffff, // 白色
        metalness: 0, // 金属度保持不变
        roughness: 0.8, // 增加粗糙度
        envMapIntensity:0.1
    });
    // 创建球体网格（Mesh）并添加到场景
    const sphere = new Mesh(geometry, material);
    scene.add(sphere);
    // 创建EffectComposer
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const saturationPass = new ShaderPass(saturationShader);

    composer.addPass(saturationPass);

    // 创建渲染循环
    function animate() {
        requestAnimationFrame(animate);
        controls.update(); // 更新控制器
        //        renderer.render(scene, camera);
        composer.render(); // 使用EffectComposer渲染场景

    }
    animate();
    listenfit(camera, renderer)
    bindChangeEvents(scene,
        camera,
        renderer,
        material
    )
    window.material = material
    return {
        scene,
        camera,
        renderer,
        material
    }
}
function bindChangeEvents(scene, camera, renderer, material) {
    eventBus.on('envMapChange', (e) => {
        updateEnvironmentMap(scene, renderer, e.detail.fileURL);
    });
    eventBus.on('adjustHDRBrightness', (e) => {
        adjustHDRBrightness(scene, e.detail.value);
    });
    const textureProperties = ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'displacementMap', 'specularIntensityMap', 'transmissionMap'];
    textureProperties.forEach(property => {
        eventBus.on(`${property}Change`, (e) => {
            updateMaterialProperty(material,property, {fileURL: e.detail.fileURL, clear: e.detail.clear}, true);
        });
    });
    const valueProperties = ['color', 'metalness', 'normalScale', 'roughness', 'aoMapIntensity', 'displacementScale', 'specularIntensity', 'transmission', 'thickness', 'ior'];
    valueProperties.forEach(property => {
        eventBus.on(`${property}Change`, (e) => {
            let value = property === 'color' ? e.detail.value : parseFloat(e.detail.value);
            if (property === 'normalScale' && material.normalScale) {
                value = new THREE.Vector2(value, value);
            }
            updateMaterialProperty(material,property, value);
        });
    });
}




const eventBus = new EventBus('TEPbrPreview')

const refreshPreview = async () => {
    const item = await eagle.item.getSelected();
    const first = item[0];
    if (!first) {
        return
    }

    let fileURL = first.fileURL;
    if (fileURL.endsWith('.hdr')) {
        if (eventBus.eventTarget.status.currentEnvMap !== fileURL) {
            eventBus.eventTarget.status.currentEnvMap = fileURL;

            eventBus.emit('envMapChange', { fileURL })

        }
    } else {
        // 确保window.status对象存在
        // 将非HDR贴图的URL写入到window.status.currentMapURL
        eventBus.eventTarget.status.currentEagleItem = item;
    }
}
//setInterval(() => requestIdleCallback(refreshPreview), 500)
