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
import { ref, inject } from 'vue';
const { eventBus, status } = inject('appData')
const itemContainer = ref(null)
const imagePreviewer = ref(null); // 新增对img元素的引用
const imageFileSource = ref(null)
const selectedColor = ref('#ffffff'); // 默认颜色
const onColorChange = () => {
    console.log(selectedColor)
    requestIdleCallback(
        () => eventBus.emit(
            "colorChange", { value: selectedColor.value }
        )
    )
}
const swtichCurrent = () => {
    itemContainer.value.style.backgroundColor = itemContainer.value.style.backgroundColor ? '' : 'red'
    eventBus.emit('listenEagleItemChange', {
        target: 'env',
        key: "envMap"
    })
}
const handleClear = () => {
    imageFileSource.value = ``
    imagePreviewer.value.src = ''; // 将读取到的图片数据设置为img的src
    eventBus.emit('colorMapChange', { clear: true })
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
                imageFileSource.value = `file:///${file.path}`
                imagePreviewer.value.src = e.target.result; // 将读取到的图片数据设置为img的src
                eventBus.emit('colorMapChange', { fileURL: `file:///${file.path}` })
                status.material.colorMap = `file:///${file.path}`
            };
            reader.readAsDataURL(file); // 读取文件内容
        }
    }
};
eventBus.on('colorMapChange',(e)=>{
    let fileURL = e.detail.fileURL
    if(fileURL!==imagePreviewer.value.src){
      imagePreviewer.value.src = fileURL
      status.material.colorMap=fileURL
    }
  })
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
