<template>
    <div @click.stop="swtichCurrent" class="fn__flex" @dragover.prevent @drop.prevent="handleDrop" ref="itemContainer">
        <div class="fn__flex-column">
            <div class="fn__flex material-label">
                <span class="material-label">HDR</span>
            </div>
            <div class="fn__flex">
                <div class="b3-card-img-container">
                    <img ref="imagePreviewer" src="eagle://item/LRXZJFVNZ2HF1" />
                </div>
                <div class="fn__space"></div>
                <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01"
                @input="adjustHDRBrightness" 
                :value='0.1'/>
                <div class="fn__space fn__flex-1"></div>
                <span></span>
            </div>

        </div>
    </div>
</template>
<script setup>
import { ref, inject, onMounted } from 'vue';
import { genHDRPreview } from '../../../hdrUtils/genPreview.js';
const { eventBus, status } = inject('appData')
const itemContainer = ref(null)
const imagePreviewer = ref(null); // 新增对img元素的引用
const imageFileSource = ref(null)
const swtichCurrent = () => {
    eventBus.emit('listenEagleItemChange', {
        target: 'env',
        key: "envMap"
    })
}
const adjustHDRBrightness=(e)=>{
    eventBus.emit(
        'adjustHDRBrightness',{value:parseFloat( e.target.value)}
    )
}
onMounted(
    () => genHDRPreview(status.env.hdr.fileURL).then(
        imgData => {
            status.HDRURL = status.env.hdr.fileURL
            imagePreviewer.value.src = imgData
            imageFileSource.value = status.env.hdr.fileURL
        }
    )

)
eventBus.on('envMapChange', (e) => {
    if (e.detail.fileURL && e.detail.fileURL !== imageFileSource.value) {
        genHDRPreview(e.detail.fileURL).then(
            imgData => {
                status.HDRURL = e.detail.fileURL
                imagePreviewer.value.src = imgData
                imageFileSource.value = e.detail.fileURL
            }
        )

    }
})
const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.name.endsWith('.hdr')) {
            let fileURL = `file:///${file.path}`
            genHDRPreview(`file:///${file.path}`).then(
                imgData => {
                    status.HDRURL = fileURL
                    imagePreviewer.value.src = imgData
                    imageFileSource.value = fileURL
                    eventBus.emit('envMapChange', { fileURL })
                }
            )
        }
    }
};
</script>
<style>

.material-label {
    padding-bottom: 5px;
}

.b3-card-img-container {
    border-radius: 5px;
    border: 1px solid black;
    min-width: 3rem;
    width: 3rem;
    min-height: 3rem;
    height: 3rem
}

.fn__space {
    min-width: 3rem;
}

.b3-card-img-container img {
    min-width: 100%;
    width: 100%;
    min-height: 100%;
    height: 100%
}
</style>
