// 创建测试贴图，使用改进的加载函数
const texturesToLoad = {
    colorMap: '',
    metalnessMap: '',
    roughnessMap: '',
    normalMap: '' // 增加法线贴图
};


// 假设material是你的MeshPhysicalMaterial实例
updateMaterialWithTextures(material, texturesToLoad);
function updateEnvironmentMap(url) {
    new RGBELoader()
        .load(url, function (texture) {
            const envMap = pmremGenerator.fromEquirectangular(texture).texture;
            pmremGenerator.dispose();

            // 更新场景的环境贴图
            scene.environment = envMap;
            scene.background = envMap;
        });
}
updateEnvironmentMap(import.meta.resolve('./室内GS.hdr'));

function getCurrentChannel() {
    const channels = document.getElementsByName('materialChannel');
    for (let i = 0; i < channels.length; i++) {
        if (channels[i].checked) {
            return channels[i].id.replace('Switch', '');
        }
    }
    return null; // 如果没有选中的通道，返回null
}

let fileURL
const refreshPreview = async () => {
    const item = await eagle.item.getSelected();
    console.log(item);
    const first = item[0];
    if (!first) {
        return
    }
    if (first.fileURL === fileURL) {
        return
    }
    fileURL = first.fileURL;
    const channel = getCurrentChannel()
    switch (channel) {
        case 'hdr':
            // 如果是HDR，可能需要特殊处理，这里只是示例
            updateEnvironmentMap(first.fileURL)
            break;
        case 'baseColor':
            texturesToLoad.colorMap = fileURL;
            break;
        case 'metalness':
            texturesToLoad.metalnessMap = fileURL;
            break;
        case 'roughness':
            texturesToLoad.roughnessMap = fileURL;
            break;
        case 'normal':
            texturesToLoad.normalMap = fileURL;
            break;
        default:
            console.warn('No valid channel selected or channel handling not implemented.');
            return; // 如果没有有效的通道被选中或者通道处理未实现，则退出函数
    }

    updateMaterialWithTextures(material, texturesToLoad);
}
eagle.onPluginCreate(async (plugin) => {
    refreshPreview()
    setInterval(refreshPreview, 500)
});