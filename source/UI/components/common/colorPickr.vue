<template>
    <div>
        <button class="cc-font-color-previewer editor-button" @click.left="clickTextColor"
            @click.right.prevent="clickBackgroundColor" :style="{ color: fontColor, backgroundColor: backgroundColor }">
            <strong>A</strong>
        </button>
        <div ref="textColorPicker" class="color-picker"></div>
        <div ref="backgroundColorPicker" class="color-picker"></div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { 打开颜色选择器 } from '../../../utils/colorProcessor.js';
const clickBackgroundColor = () => {
    let options = {
        onchange: (color, instance) => {
            this.backgroundColor = color.toHEXA().toString();
            eventBus.emit('css-props-change', { backgroundColor: this.backgroundColor })
        }
    }
    打开颜色选择器(this.$refs.backgroundColorPicker, options)
}
</script>

<style scoped>
.cc-font-color-previewer {
    border-color: none;
}

.color-picker {
    max-width: 0.1px;
}
</style>