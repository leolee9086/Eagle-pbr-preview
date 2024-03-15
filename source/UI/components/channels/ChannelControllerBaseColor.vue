<template>
    <div @click.stop="swtichCurrent" class="fn__flex" @dragover.prevent @drop.prevent="handleDrop" ref="itemContainer">
        <div class="fn__flex fn__flex-column">
            <div class="fn__flex material-label">
                <span class="material-label">基础色</span>
            </div>
            <div class="fn__flex">
                <div class="b3-card-img-container" :style="{ backgroundColor: selectedColor }">
                </div>
                <div class="fn__space "></div>
            </div>
        </div>
        <div class="fn__flex fn__flex-column">
            <!-- 色相滑块 -->
            <div class="fn__space "></div>

            <input type="range" class="hue-slider" min="0" max="360" v-model="hue" @input="updateColor" />
            <div class="fn__space "></div>

            <!-- 饱和度滑块 -->
            <input type="range" class="saturation-slider" :style="{ background: saturationBackground }" min="0" max="100"
                v-model="saturation" @input="updateColor" />
            <div class="fn__space "></div>

            <!-- 明度滑块 -->
            <input type="range" class="brightness-slider" :style="{ background: brightnessBackground }" min="0" max="100"
                v-model="brightness" @input="updateColor" />
                <div class="fn__space "></div>
        </div>

    </div>
</template>
<script setup>
import { ref, inject, watch, computed } from 'vue';
const { eventBus, status } = inject('appData')
const itemContainer = ref(null)
const imagePreviewer = ref(null); // 新增对img元素的引用
const imageFileSource = ref(null)
const selectedColor = ref('#ffffff'); // 默认颜色
const brightness = ref(50); // 明度初始值，范围可以是0到100
const hue = ref(0); // 色相初始值，范围可以是0到360
const saturation = ref(100); // 饱和度初始值
const saturationBackground = computed(() => {
    return `linear-gradient(to right, hsl(${hue.value}, 0%, 50%), hsl(${hue.value}, 100%, 50%))`;
});

const brightnessBackground = computed(() => {
    return `linear-gradient(to right, hsl(${hue.value}, ${saturation.value}%, 0%), hsl(${hue.value}, ${saturation.value}%, 50%), hsl(${hue.value}, ${saturation.value}%, 100%))`;
});
const onColorChange = () => {
    console.log(selectedColor)
    requestIdleCallback(
        () => eventBus.emit(
            "colorChange", { value: selectedColor.value }
        )
    )
}
const updateColor = () => {
    selectedColor.value = `hsl(${hue.value}, ${saturation.value}%, ${brightness.value}%)`;
    eventBus.emit("colorChange", { value: selectedColor.value });
};

// 监听hue、saturation和brightness的变化，然后更新颜色
watch([hue, saturation, brightness], updateColor);

const swtichCurrent = () => {
    itemContainer.value.style.backgroundColor = itemContainer.value.style.backgroundColor ? '' : 'red'
    eventBus.emit('listenEagleItemChange', {
        target: 'env',
        key: "envMap"
    })
}

const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imageFileSource.value = `file:///${file.path}`
                imagePreviewer.value.src = e.target.result; // 将读取到的图片数据设置为img的src
                eventBus.emit('colorMapChange', { fileURL: `file:///${file.path}` })
                status.material.colorMap = `file:///${file.path}`
            };
            reader.readAsDataURL(file); // 读取文件内容
        }
    }
};
</script>
<style>
.b3-card-img-container {
    border-radius: 5px;
    border: 1px solid black;
    min-width: 3rem;
    width: 3rem;
    min-height: 3rem;
    height: 3rem
}

.b3-card-img-container.large {
    border-radius: 5px;
    border: 1px solid black;
    width: auto;
    height: auto;
}

.fn__space {
    min-width: 3rem;
}

.b3-card-img-container img,
.b3-card-img-container input {
    min-width: 100%;
    width: 100%;
    min-height: 100%;
    height: 100%;
    max-width: 100;
    max-height: 100%;
}

.hue-slider {
    -webkit-appearance: none;
    width: 100%;
    height: 10px;
    border-radius: 5px;
    background-image: linear-gradient(to right,
            red 0%,
            #ff0 17%,
            lime 33%,
            cyan 50%,
            blue 67%,
            magenta 83%,
            red 100%);
    outline: none;
    opacity: 0.7;
    transition: opacity .2s;
}

.hue-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
}

.hue-slider::-moz-range-thumb {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
}



.saturation-slider {
    -webkit-appearance: none;
    width: 100%;
    height: 10px;
    border-radius: 5px;
    background-image: linear-gradient(to right, #fff, currentColor);
    outline: none;
    opacity: 0.7;
    transition: opacity .2s;
}

.saturation-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
}

.saturation-slider::-moz-range-thumb {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
}


.brightness-slider {
    -webkit-appearance: none;
    width: 100%;
    height: 10px;
    border-radius: 5px;
    background-image: linear-gradient(to right, #fff, currentColor);
    outline: none;
    opacity: 0.7;
    transition: opacity .2s;
}

.brightness-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
}

.brightness-slider::-moz-range-thumb {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
}
</style>
