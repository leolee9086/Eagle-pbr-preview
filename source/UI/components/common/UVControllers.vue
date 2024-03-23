<template>
    <div class="fn__flex fn__flex-column" style="padding-bottom: 30px;">
        <div>UV</div>
        <div class="fn__space"></div>
        <div class="fn__flex">
            拉伸
            <svg style="color: gray;transform: rotate(90deg);width: 1rem;height: 1rem;">
                <use xlink:href="#iconLink"></use>
            </svg>
            <input type="range" :min="0.001" :max="100" :step="0.01" :value="1" @input="handlerUtilingChange"
                ref="UtilingInputer" />
            <input type="range" :min="0.001" :max="100" :step="0.01" :value="1" @input="handlerVtilingChange"
                ref="VtilingInputer" />

        </div>
        <div class="fn__space"></div>
        <div class="fn__flex">
            偏移
            <svg style="color: gray;transform: rotate(90deg);width: 1rem;height: 1rem;">
                <use xlink:href="#iconLink"></use>
            </svg>
            <input type="range" :min="0.001" :max="100" :step="0.01" />
            <input type="range" :min="0.001" :max="100" :step="0.01" />
        </div>
        <div class="fn__space"></div>

        <div class="fn__flex">
            旋转
            <div class="fn__space "></div>
            <div class="fn__flex-1">
                <input type="range" :min="0" :max="360" :step="1" style="width:100%" />
            </div>
        </div>
    </div>
</template>
<script setup>
import { inject, ref } from 'vue'
const { status } = inject('appData')
const attached = ref('true')
const UtilingInputer = ref(null)
const VtilingInputer = ref(null)
const Utiling = ref({
    "name": "Utiling",
    "type": 1,
    "value": "X=1.000000 Y=0.000000 Z=0.000000",
    "group": "",
    "default": false,
    "fromPlugin": 0
})
const Vtiling = ref(
    {
        "name": "Vtiling",
        "type": 1,
        "value": "X=1.000000 Y=0.000000 Z=0.000000",
        "group": "",
        "default": false,
        "fromPlugin": 0
    }
)
const handlerUtilingChange = (e) => {
    const valueWithPrecision = parseFloat(e.target.value).toFixed(6);
    Utiling.value.value = `X=${valueWithPrecision} Y=0.000000 Z=0.000000`
    UtilingInputer.value.value = valueWithPrecision
    if (attached.value) {
        Vtiling.value.value = `X=${valueWithPrecision} Y=0.000000 Z=0.000000`
        VtilingInputer.value.value = valueWithPrecision

    }
    updateMaterialUV(status.threeMaterial, Vtiling.value, Utiling.value)

}
const handlerVtilingChange = (e) => {
    const valueWithPrecision = parseFloat(e.target.value).toFixed(6);
    Vtiling.value.value = `X=${valueWithPrecision} Y=0.000000 Z=0.000000`
    VtilingInputer.value.value = valueWithPrecision
    if (attached.value) {
        Utiling.value.value = `X=${valueWithPrecision} Y=0.000000 Z=0.000000`
        UtilingInputer.value.value = valueWithPrecision

    }
    updateMaterialUV(status.threeMaterial, Vtiling.value, Utiling.value)
}
const updateMaterialUV = (material, utiling, vtiling,textureProperties=['map', 'normalMap', 'bumpMap', 'alphaMap', 'emissiveMap','aoMap']) => {
    // 定义需要更新的纹理属性列表
    textureProperties.forEach(prop => {
        const texture = material[prop];
        if (texture) {
            const uScale = parseFloat(utiling.value.split(' ')[0].split('=')[1]);
            const vScale = parseFloat(vtiling.value.split(' ')[0].split('=')[1]);
            texture.repeat.set(uScale, vScale);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.needsUpdate = true;
        }
    });
    if (!material.map) {
        console.warn('Material does not have a texture map to update UVs');
    }
}
</script>