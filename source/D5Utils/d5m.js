// 读取并解析材质信息
const readAndParseMaterialJson = async (unzipPath) => {
    const path = window.require('path');
    const materialJson = JSON.parse(window.require('fs').readFileSync(path.join(unzipPath, 'material.json'), 'utf-8'));
    //matInfo是被二次序列化的,因此要再次JSON.parse
    materialJson.matInfo = JSON.parse(materialJson.matInfo);
    return materialJson;
};
