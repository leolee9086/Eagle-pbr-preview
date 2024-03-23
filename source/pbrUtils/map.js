// 处理材质贴图
const processMaterialMapFromFile = (unzipPath, materialJson, mapName, eventName) => {
    const path = window.require('path');
    let mapValue = getMapInfoValue(materialJson.matInfo, mapName);
    if (mapValue) {
        eventBus.emit(eventName, { fileURL: `file:///${path.join(unzipPath, 'textures', mapValue)}` });
    }
};
