<template>
    <div @click.stop="swtichCurrent" class="fn__flex" @dragover.prevent @drop.prevent="handleDrop" ref="itemContainer">
        <div class="fn__flex-column">
            <div class="fn__flex material-label">
                <span class="material-label">基础色贴图</span>
            </div>
            <div class="fn__flex">
                <div class="b3-card-img-container" @click.right="handleClear">
                    <img v-show="status.material.colorMap" ref="imagePreviewer" :src="status.material.colorMap" />
                </div>
                <div class="fn__space "></div>

            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, inject, watch, nextTick } from 'vue';
const { eventBus, status } = inject('appData')
const itemContainer = ref(null)
const imagePreviewer = ref(null); // 新增对img元素的引用
const imageFileSource = ref(null)
const swtichCurrent = () => {
    itemContainer.value.style.backgroundColor = itemContainer.value.style.backgroundColor ? '' : 'red'
    eventBus.emit('listenEagleItemChange', {
        target: 'env',
        key: "envMap"
    })
}
// 监听 status.material.colorMap 的变化
watch(() => status.material.colorMap, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        imagePreviewer.value.src = newVal || ''; // 更新图片预览
    }
});
const handleClear = () => {
    status.material.colorMap = ``
}
const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                status.material.colorMap = ""
                nextTick(() => { status.material.colorMap = `file:///${file.path}` })
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
</style>
