const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

// 加载图像
async function loadImageAsync(sourceImagePath) {
    const img = await loadImage(sourceImagePath);
    return img;
}

// 创建灰度图像
function createGrayscaleImage(img) {
    const width = img.width;
    const height = img.height;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);

    for (let i = 0; i < imageData.data.length; i += 4) {
        const gray = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
        imageData.data[i] = gray;     // R
        imageData.data[i + 1] = gray; // G
        imageData.data[i + 2] = gray; // B
        // Alpha remains unchanged
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
}
// 生成法线贴图
function generateNormalMapFromGrayscale(grayscaleCanvas) {
    const width = grayscaleCanvas.width;
    const height = grayscaleCanvas.height;
    const outputCanvas = createCanvas(width, height);
    const outputCtx = outputCanvas.getContext('2d');
    const imageData = outputCtx.getImageData(0, 0, width, height);
    for (let i = 0; i < imageData.data.length; i += 4) {
        const gray = imageData.data[i]; // Assuming grayscale, R=G=B
        imageData.data[i] = gray;       // R
        imageData.data[i + 1] = gray;   // G
        imageData.data[i + 2] = 255;    // B
        imageData.data[i + 3] = 255;    // Alpha
    }
    outputCtx.putImageData(imageData, 0, 0);
    return outputCanvas;
}

// 保存图像
function saveCanvasToFile(canvas, outputImagePath) {
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputImagePath, buffer);
    console.log('法线贴图已生成:', outputImagePath);
}

// 主函数
async function baseColor2Normal(sourceImagePath, outputImagePath) {
    const img = await loadImageAsync(sourceImagePath);
    const grayscaleCanvas = createGrayscaleImage(img);
    const normalMapCanvas = generateNormalMapFromGrayscale(grayscaleCanvas);
    saveCanvasToFile(normalMapCanvas, outputImagePath);
}