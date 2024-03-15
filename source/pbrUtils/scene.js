import { PMREMGenerator } from "../../static/threejs/three.module.js";
import { RGBELoader } from '../../static/threejs/examples/jsm/loaders/RGBELoader.js'
export function updateEnvironmentMap(scene, render, url) {
    new RGBELoader().load(url, function (texture) {
        const pmremGenerator = new PMREMGenerator(render)
        pmremGenerator.compileEquirectangularShader();
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        pmremGenerator.dispose();
        // 更新场景的环境贴图
        scene.environment = envMap;
        scene.background = envMap;
        adjustHDRBrightness(scene,0.5,envMap)
    });
}
export function adjustHDRBrightness(scene, brightness,envMap) {
    scene.traverse((object) => {
        if (object.isMesh && object.material) {
            object.material.envMap=envMap||object.material.envMap
            object.material.envMapIntensity = brightness;
            object.material.needsUpdate = true; // 确保材质更新
        }
    });
}