<template>
    <baseIcons></baseIcons>
    <div class="fn__flex fn__flex-column fn__relative b3-card" style="
    z-index:1000;
    background-color: rgba(245, 245, 220, 0.473);
    min-width: 300px;
    max-height:100vh;
    overflow:auto;">
        <button @click="预览当前材质">预览当前材质</button>
        <ChannelControllerHDR></ChannelControllerHDR>
        <div class="hr-horizontal"></div>
        <channelControllerBaseColor></channelControllerBaseColor>
        <div class="hr-horizontal"></div>
        <channelControllerColorMap></channelControllerColorMap>
        <div class="hr-horizontal"></div>
        <ChannelControllerGeneric label="法线" :min="-1" :max="1" :step="0.01" :initialValue="0" eventName="normalScaleChange"
            sliderClass="normal-slider" valueName="normalScale" mapName="normalMap" />
        <div class="hr-horizontal"></div>
        <!--  <ChannelControllerMetalness></ChannelControllerMetalness>
       -->
        <ChannelControllerGeneric label="金属度" :min="0" :max="1" :step="0.01" :initialValue="0" eventName="metalnessChange"
            sliderClass="metalness-slider" valueName="metalness" mapName="metalnessMap" />
        <div class="hr-horizontal"></div>
        <ChannelControllerGeneric label="粗糙度" :min="0" :max="1" :step="0.01" :initialValue="0.5" eventName="roughnessChange"
            sliderClass="roughness-slider" valueName="roughness" mapName="roughnessMap" />
        <div class="hr-horizontal"></div>

        <ChannelControllerGeneric :min="0" :max="2" :step="0.01" label="高光" :initialValue="0.5"
            eventName="specularIntensityChange" sliderClass="specular-slider" valueName="specularIntensity"
            mapName="specularIntensityMap" />
        <div class="hr-horizontal"></div>

        <ChannelControllerGeneric label="透明度" :min="0" :max="1" :step="0.01" :initialValue="0"
            eventName="transmissionChange" sliderClass="opacity-slider" valueName="transmission"
            mapName="transmissionMap" />
        <div class="hr-horizontal"></div>

        <ChannelControllerGeneric label="AO" :min="0" :max="100" :step="0.01" :initialValue="0"
            eventName="aoMapIntensityChange" sliderClass="ao-slider" valueName="aoMapIntensity" mapName="aoMap" />
        <div class="hr-horizontal"></div>

        <ChannelControllerGeneric label="厚度" :min="0" :max="1" :step="0.01" :initialValue="0" eventName="thicknessChange"
            sliderClass="opacity-slider" valueName="thickness" />
        <ChannelControllerGeneric label="折射率" :min="1" :max="2.42" :step="0.01" :initialValue="0" eventName="iorChange"
            sliderClass="ior-slider" valueName="ior" />
    </div>
    <div id="previewer" ref="previewer">
    </div>
    <!--TEPbrPreview-->
</template>
<script setup>
import { ref, onMounted, inject } from 'vue'
import ChannelControllerHDR from './channels/ChannelControllerHDR.vue';
import ChannelControllerBaseColor from './channels/ChannelControllerBaseColor.vue';
import ChannelControllerColorMap from './channels/ChannelControllerColorMap.vue';
import ChannelControllerGeneric from './channels/ChannelControllerGeneric.vue';
import baseIcons from './common/baseIcons.vue'
import { initScene } from '../../pbrUtils/renders.js'

import { updateEnvironmentMap } from '../../pbrUtils/scene.js';
const { status,eventBus } = inject('appData')
const previewer = ref(null)
onMounted(
    () => {
        let { scene, camera, renderer, material } = initScene(previewer.value)
        // 假设material是你的MeshPhysicalMaterial实例
        const defaultHDRPath = status.env.hdr.fileURL
        updateEnvironmentMap(scene, renderer, defaultHDRPath)

    }
)

const 预览当前材质 = async()=>{
    const item =await eagle.item.getSelected()
    console.log(item)
    if(item[0]&&item[0].ext==="d5m"){
        const AdmZip = window.require('adm-zip');
        const path=window.require('path')
        const unzipPath = path.join(eagle.plugin.path,'temp',item[0].id)
        try {
            // 使用adm-zip解压文件
            const zip = new AdmZip(item[0].filePath);
            zip.extractAllTo(unzipPath, true);
            const materialJson=JSON.parse( window.require('fs').readFileSync(path.join(unzipPath,'material.json'),'utf-8'))
            materialJson.matInfo=JSON.parse(materialJson.matInfo)
            console.log(materialJson)

            let DiffuseMap=getMapInfoValue(materialJson.matInfo,'Diffuse Map')
            DiffuseMap&&eventBus.emit('colorMapChange',{fileURL:`file:///${path.join(unzipPath,'textures',DiffuseMap)}`})
            let AOMap=getMapInfoValue(materialJson.matInfo,'AOMap')
            AOMap&&eventBus.emit('AOMapChange',{fileURL:`file:///${path.join(unzipPath,'textures',AOMap)}`})
            let NormalMapOne = getMapInfoValue(materialJson.matInfo,'Normal Map One')
            eventBus.emit('normalMapChange',{fileURL:`file:///${path.join(unzipPath,'textures',NormalMapOne||DiffuseMap)}`})
            let RoughnessMap =getMapInfoValue(materialJson.matInfo,'Roughness Map')
            eventBus.emit('roughnessMapChange',{fileURL:`file:///${path.join(unzipPath,'textures',RoughnessMap)}`})
            console.log('文件解压成功');
        } catch (error) {
            console.error('解压文件时发生错误:', error);
        }
    }
}
const getMapInfoValue=(matInfo,name)=>{
    let item = matInfo.find(item=>{return item.name ===name})
    return item&&item.value
}
</script>