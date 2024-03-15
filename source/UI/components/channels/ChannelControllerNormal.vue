<template>
    <div @click.stop="switchCurrent" class="fn__flex" @dragover.prevent @drop.prevent="handleDrop" ref="itemContainer">
        <div class="fn__flex fn__flex-column">
            <div class="fn__flex material-label">
                <span class="material-label">法线贴图</span>
            </div>
            <div class="fn__flex">
                <div class="b3-card-img-container" >
                    <img 
                    v-show="status.material.normalMap" 
                    ref="imagePreviewer" 
                    :src="status.material.normalMap" />

                </div>
                <div class="fn__space "></div>
                <input 
                type="range" 
                class="normal-intensity-slider" 
                min="-1" max="1" step="0.01" v-model="normalIntensity" @input="updateNormalIntensity" />

            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, inject, watch, nextTick } from 'vue';

const { eventBus, status } = inject('appData');
const itemContainer = ref(null);
const normalIntensity = ref(0.5); // 法线强度初始值，范围可以是0到1
const normalMap = ref(''); // 法线贴图的路径
const imagePreviewer = ref(''); // 法线贴图的预览

const updateNormalIntensity = () => {
    eventBus.emit("normalIntensityChange", { value: normalIntensity.value });
};

const switchCurrent = () => {
    // 这里可以添加切换当前选中项的逻辑
};

const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => nextTick(() => {

                normalMap.value = `file:///${file.path}`; // 将读取到的图片数据设置为背景图
                imagePreviewer.value.src = e.target.result; // 将读取到的图片数据设置为img的src
                eventBus.emit('normalMapChange', { fileURL: `file:///${file.path}` });
                status.material.normalMap = `file:///${file.path}`;
            })
            reader.readAsDataURL(file); // 读取文件内容
        }
    }
};

// 监听normalIntensity的变化，然后更新法线强度
watch(normalIntensity, updateNormalIntensity);
</script>

<style>
/* 这里可以添加CSS样式，参考原组件的样式进行调整 */
</style>