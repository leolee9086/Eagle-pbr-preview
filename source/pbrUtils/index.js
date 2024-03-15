import {TextureLoader} from '../../static/threejs/three.module.js'
const textureLoader = new TextureLoader();
// 检查图片是否存在并加载的函数
export function loadTexture(url, onSuccess, onError) {

    fetch(url, { method: 'HEAD' })
        .then(res => {
            if (res.ok) {
                textureLoader.load(url, onSuccess, undefined, onError);
            } else {
                onError(`File not found: ${url}`);
            }
        }).catch(onError);
}

export function updateMaterialWithTextures(material, texturesInfo) {
    Object.keys(texturesInfo).forEach(key => {
        // 检查图片是否存在并加载的函数
        loadTexture(texturesInfo[key], texture => {
            // 根据key更新对应的材质属性
            switch (key) {
                case 'colorMap':
                    material.map = texture;
                    break;
                case 'metalnessMap':
                    material.metalnessMap = texture;
                    break;
                case 'roughnessMap':
                    material.roughnessMap = texture;
                    break;
                case 'normalMap':
                    material.normalMap = texture;
                    break;
                // 可以根据需要添加更多case来支持更多属性
                default:
                    console.warn(`Unsupported texture type: ${key}`);
            }
            texture.needsUpdate = true;
            material.needsUpdate = true;
        }, error => console.error(error));
    });
}