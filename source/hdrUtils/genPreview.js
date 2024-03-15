import { RGBELoader } from "../../static/threejs/examples/jsm/loaders/RGBELoader.js";
import { FloatType } from "../../static/threejs/three.module.js";
const loader = new RGBELoader();
loader.setDataType(FloatType); // 保持HDR数据的浮点类型

export const genHDRPreview = (hdrPath) => {
    return new Promise((resolve, reject) => {
        loader.load(hdrPath, function (hdrData) {
            // hdrData是一个包含图像数据的DataTexture对象
            const width = hdrData.image.width;
            const height = hdrData.image.height;
            const data = hdrData.image.data;
            // 创建一个与HDR图像同样大小的canvas
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            const imageData = ctx.createImageData(width, height);

            // 处理HDR数据并填充到imageData中
            for (let i = 0; i < data.length; i += 4) {
                // 简单的色调映射：将浮点值转换为0-255范围的整数
                imageData.data[i] = data[i] * 255; // R
                imageData.data[i + 1] = data[i + 1] * 255; // G
                imageData.data[i + 2] = data[i + 2] * 255; // B
                imageData.data[i + 3] = 255; // A
            }

            // 将处理后的图像数据绘制到canvas上
            ctx.putImageData(imageData, 0, 0);

            // 使用toDataURL获取canvas内容的DataURL
            const imgData = canvas.toDataURL("image/png");
            resolve(imgData);
        }, undefined, function (error) {
            reject(error);
        });
    });
};