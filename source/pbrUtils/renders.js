import {
    AmbientLight,HemisphereLight, DirectionalLight,
    Mesh, MeshPhysicalMaterial,
    PerspectiveCamera, PMREMGenerator,
    Scene, SphereGeometry, WebGLRenderer, TextureLoader
} from "three";

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { listenfit } from "./size.js";
import { EventBus } from "../utils/eventBus.js";
import { adjustHDRBrightness, updateEnvironmentMap } from '../pbrUtils/scene.js';
import { loadTexture } from "./index.js";
// 创建并添加自定义的ShaderPass来调整饱和度
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
    const geometry = new SphereGeometry(1, 1000, 1000);
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
    bindChangeEvnets(scene,
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
function bindChangeEvnets(scene,
    camera,
    renderer,
    material
) {
    eventBus.on('envMapChange', (e) => {

        updateEnvironmentMap(scene, renderer, e.detail.fileURL)
    })
    eventBus.on(
        'adjustHDRBrightness', (e) => {
            let { value } = e.detail
            adjustHDRBrightness(scene, value)
        }
    )
    eventBus.on(
        'colorMapChange', (e) => {
            if (e.detail.clear) {
                // 根据传入的贴图名来确定需要清理的贴图属性
                if (material.map) {
                    material.map = null; // 清理对应的贴图
                    material.needsUpdate = true; // 标记材质需要更新
                }
                return
            }
            console.log(e.detail.fileURL)
            loadTexture(e.detail.fileURL, (texture) => {
                material.map = texture
                material.needsUpdate = true
            })
        }
    )
    eventBus.on(
        'colorChange', (e) => {
            // 设置材质的颜色。Three.js的Color对象接受CSS样式颜色字符串、十六进制等格式。
            material.color.set(e.detail.value);
            material.needsUpdate = true; // 标记材质需要更新
        }
    )
    eventBus.on(
        'metalnessChange', (e) => {
            // 设置材质的颜色。Three.js的Color对象接受CSS样式颜色字符串、十六进制等格式。
            material.metalness = parseFloat(e.detail.value);
            material.needsUpdate = true; // 标记材质需要更新
        }
    )

    eventBus.on('normalMapChange', (e) => {
        if (e.detail.clear) {
            if (material.normalMap) {
                material.normalMap = null; // 清理对应的贴图
                material.needsUpdate = true; // 标记材质需要更新
            }
            return
        }
        loadTexture(e.detail.fileURL, (texture) => {
            material.normalMap = texture;
            material.needsUpdate = true;
        });
    });

    eventBus.on('normalScaleChange', (e) => {
        let { value } = e.detail;
        if (material.normalScale) {
            material.normalScale.set(value, value);
        } else {
            material.normalScale = new THREE.Vector2(value, value);
        }
        material.needsUpdate = true;
    });

    eventBus.on('roughnessChange', (e) => {
        material.roughness = parseFloat(e.detail.value);
        material.needsUpdate = true;
    });

    eventBus.on('roughnessMapChange', (e) => {
        if (e.detail.clear) {
            if (material.roughnessMap) {
                material.roughnessMap = null; // 清理对应的贴图
                material.needsUpdate = true; // 标记材质需要更新
            }
            return
        }
        loadTexture(e.detail.fileURL, (texture) => {
            material.roughnessMap = texture;
            material.needsUpdate = true;
        });
    });

    eventBus.on('metalnessMapChange', (e) => {
        if (e.detail.clear) {
            if (material.metalnessMap) {
                material.metalnessMap = null; // 清理对应的贴图
                material.needsUpdate = true; // 标记材质需要更新
            }
            return
        }

        loadTexture(e.detail.fileURL, (texture) => {
            material.metalnessMap = texture;
            material.needsUpdate = true;
        });
    });

    eventBus.on('aoMapChange', (e) => {
        if (e.detail.clear) {
            if (material.aoMap) {
                material.aoMap = null; // 清理对应的贴图
                material.needsUpdate = true; // 标记材质需要更新
            }
            return
        }

        loadTexture(e.detail.fileURL, (texture) => {
            material.aoMap = texture;
            material.needsUpdate = true;
        });
    });

    eventBus.on('aoMapIntensityChange', (e) => {
        material.aoMapIntensity = parseFloat(e.detail.value);
        material.needsUpdate = true;
    });

    eventBus.on('displacementMapChange', (e) => {
        if (e.detail.clear) {
            if (material.displacementMap) {
                material.displacementMap = null; // 清理对应的贴图
                material.needsUpdate = true; // 标记材质需要更新
            }
            return
        }
        loadTexture(e.detail.fileURL, (texture) => {
            material.displacementMap = texture;
            material.needsUpdate = true;
        });
    });

    eventBus.on('displacementScaleChange', (e) => {
        material.displacementScale = parseFloat(e.detail.value);
        material.needsUpdate = true;
    });
    eventBus.on('specularIntensityChange', (e) => {
        // 设置材质的高光
        material.specularIntensity = parseFloat(e.detail.value);
        material.needsUpdate = true; // 标记材质需要更新
    });

    eventBus.on('specularIntensityMapChange', (e) => {
        if (e.detail.clear) {
            if (material.specularIntensityMap) {
                material.specularIntensityMap = null; // 清理对应的贴图
                material.needsUpdate = true; // 标记材质需要更新
            }
            return
        }
        // 加载并设置高光贴图
        loadTexture(e.detail.fileURL, (texture) => {
            material.specularIntensityMap = texture;
            material.needsUpdate = true;
        });
    });

    eventBus.on('roughnessChange', (e) => {
        // 设置材质的粗糙度
        material.roughness = parseFloat(e.detail.value);
        material.needsUpdate = true; // 标记材质需要更新
    });

    eventBus.on('roughnessMapChange', (e) => {
        // 加载并设置粗糙度贴图
        loadTexture(e.detail.fileURL, (texture) => {
            material.roughnessMap = texture;
            material.needsUpdate = true;
        });
    });
    eventBus.on('transmissionChange', (e) => {
        // 设置材质的粗糙度
        material.transmission = parseFloat(e.detail.value);
        material.needsUpdate = true; // 标记材质需要更新
    });
    eventBus.on('thicknessChange', (e) => {
        // 设置材质的粗糙度
        material.thickness = parseFloat(e.detail.value);
        material.needsUpdate = true; // 标记材质需要更新
    });
    eventBus.on('transmissionMapChange', (e) => {
        // 加载并设置粗糙度贴图
        loadTexture(e.detail.fileURL, (texture) => {
            material.transmissionMap = texture;
            material.needsUpdate = true;
        });
    });
    eventBus.on('iorChange', (e) => {
        // 加载并设置粗糙度贴图
        material.ior = parseFloat(e.detail.value);
        material.needsUpdate = true; // 标记材质需要更新

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
setInterval(() => requestIdleCallback(refreshPreview), 500)
