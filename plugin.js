import { initVueApp } from "./source/UI/loader/VueComponentsLoader.js";
import { EventBus } from "./source/utils/eventBus.js";
import {reactive,watch} from './static/vue.esm-browser.js'
let eventBus= new EventBus('TEPbrPreview')
let status = reactive({
    env:{
        hdr:{
            fileURL:import.meta.resolve('./default.HDR')
        },
    },
    material:{
        color:"",
        colorMap:""
    },
    matInfo:[
        
    ],
    d5Material:{
            "appendColor": {
                "x": 0,
                "y": 0,
                "z": 0
            },
            "brand": "",
            "categoryId": 0,
            "code": "",
            "collection": "",
            "color": "",
            "companyId": 0,
            "createTime": 0,
            "dependent_pak_lists": [],
            "emissiveAppendColor": {
                "x": 0,
                "y": 0,
                "z": 0
            },
            "emissiveColor": 0,
            "fromPlugin": 0,
            "id": "0A0080524B1D80923CCA04B68A0BC568",
            "isDel": false,
            "isPrivate": false,
            "isPublished": false,
            "isRepeat": false,
            "isSubmit": false,
            "landscapeGrassParameter": "",
            "matInfo": [
                {
                    "name": "OpacityMap_GammaMode",
                    "type": 1,
                    "value": "X=0.000000 Y=0.000000 Z=0.000000",
                    "group": "OpacityMap_GammaMode",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "SubsurfaceMap_GammaMode",
                    "type": 1,
                    "value": "X=1.000000 Y=0.000000 Z=0.000000",
                    "group": "SubsurfaceMap_GammaMode",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "EmissiveMap_GammaMode",
                    "type": 1,
                    "value": "X=0.000000 Y=0.000000 Z=0.000000",
                    "group": "EmissiveMap_GammaMode",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "Diffuse Map",
                    "type": 3,
                    "value": "um/993ea1e2cb4009899adb7777363062bf/3DC09AD343D9EEE901C3DD826BD665CF.jpg",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "Utiling",
                    "type": 1,
                    "value": "X=5.000000 Y=0.000000 Z=0.000000",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "Vtiling",
                    "type": 1,
                    "value": "X=5.000000 Y=0.000000 Z=0.000000",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "Specular",
                    "type": 1,
                    "value": "X=0.280000 Y=0.000000 Z=0.000000",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "Roughness Map (opacity)",
                    "type": 1,
                    "value": "X=1.000000 Y=0.000000 Z=0.000000",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "Normal Map (opacity)",
                    "type": 1,
                    "value": "X=0.790000 Y=0.000000 Z=0.000000",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "Normal Map One",
                    "type": 3,
                    "value": "um/993ea1e2cb4009899adb7777363062bf/F83A3A0346D394352E0DF0B10904EE14.png",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "Roughness Map",
                    "type": 3,
                    "value": "um/993ea1e2cb4009899adb7777363062bf/C5BE4A984D80ED0216417AA73864DE83.jpg",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "EmissiveTemperature",
                    "type": 1,
                    "value": "X=6500.000000 Y=0.000000 Z=0.000000",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "DiffuseMap_GammaMode",
                    "type": 1,
                    "value": "X=1.000000 Y=0.000000 Z=0.000000",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "NormalMap_GammaMode",
                    "type": 1,
                    "value": "X=0.000000 Y=0.000000 Z=0.000000",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "SpecularMap_GammaMode",
                    "type": 1,
                    "value": "X=1.000000 Y=0.000000 Z=0.000000",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "RoughnessMap_GammaMode",
                    "type": 1,
                    "value": "X=1.000000 Y=0.000000 Z=0.000000",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "MetallicMap_GammaMode",
                    "type": 1,
                    "value": "X=1.000000 Y=0.000000 Z=0.000000",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "AOMap_GammaMode",
                    "type": 1,
                    "value": "X=1.000000 Y=0.000000 Z=0.000000",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "DiffuseColorStrength",
                    "type": 1,
                    "value": "X=1.000000 Y=0.000000 Z=0.000000",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "ChamferEnbale",
                    "type": 1,
                    "value": "X=0.000000 Y=0.000000 Z=0.000000",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "ChamferRadius",
                    "type": 1,
                    "value": "X=0.300000 Y=0.000000 Z=0.000000",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "LimitColorEnable",
                    "type": 1,
                    "value": "X=0.000000 Y=0.000000 Z=0.000000",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "CastShadow",
                    "type": 1,
                    "value": "X=1.000000 Y=0.000000 Z=0.000000",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "EmissiveTempEnable",
                    "type": 1,
                    "value": "X=0.000000 Y=0.000000 Z=0.000000",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "ThicknessMap_GammaMode",
                    "type": 1,
                    "value": "X=1.000000 Y=0.000000 Z=0.000000",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "Metallic",
                    "type": 1,
                    "value": "X=0.000000 Y=0.000000 Z=0.000000",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "Xmove",
                    "type": 1,
                    "value": "X=0.000000 Y=0.000000 Z=0.000000",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "Ymove",
                    "type": 1,
                    "value": "X=0.000000 Y=0.000000 Z=0.000000",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "UVAngle",
                    "type": 1,
                    "value": "X=0.000000 Y=0.000000 Z=0.000000",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "MaintainUV",
                    "type": 1,
                    "value": "X=0.000000 Y=0.000000 Z=0.000000",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "AoIntensity",
                    "type": 1,
                    "value": "X=1.000000 Y=0.000000 Z=0.000000",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "HueShift_Tex",
                    "type": 1,
                    "value": "X=0.000000 Y=0.000000 Z=0.000000",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "Saturation_Tex",
                    "type": 1,
                    "value": "X=0.000000 Y=0.000000 Z=0.000000",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "Brightness_Tex",
                    "type": 1,
                    "value": "X=0.000000 Y=0.000000 Z=0.000000",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "Contrast_Tex",
                    "type": 1,
                    "value": "X=0.000000 Y=0.000000 Z=0.000000",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "Diffuse (Color)",
                    "type": 2,
                    "value": "(R=1.000000,G=1.000000,B=1.000000,A=1.000000)",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "Height Ratio",
                    "type": 1,
                    "value": "X=0.050000 Y=0.000000 Z=0.000000",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "HeightMap_GammaMode",
                    "type": 1,
                    "value": "X=1.000000 Y=0.000000 Z=0.000000",
                    "group": "",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "Height Map",
                    "type": 3,
                    "value": "um/993ea1e2cb4009899adb7777363062bf/0C17706B411744990C93149F602D738D.jpg",
                    "group": "Heightmap Mode",
                    "default": false,
                    "fromPlugin": 0
                },
                {
                    "name": "AOMap",
                    "type": 3,
                    "value": "um/993ea1e2cb4009899adb7777363062bf/9BB8FF574690E060953F6793A21B7C38.jpg",
                    "group": "AOMap",
                    "default": false,
                    "fromPlugin": 0
                }
            ],
            "matInfo2": "",
            "metallic": 0,
            "pak_url": "m2/Base_9/1.pak",
            "roughness": 0,
            "source": 0,
            "sync_status": 0,
            "thumbnailUrl": "",
            "title": "",
            "type": 0,
            "uePath": "",
            "updateTime": 0,
            "userId": 0
        }
            
})
watch(status,(val)=>{
    console.log(val)
})
const defaultMateriaTemplate=await(await fetch(import.meta.resolve('./assets/defaultMateria/material.json'))).json()

defaultMateriaTemplate.getMatInfo = ()=>{
    return JSON.parse(defaultMateriaTemplate.matInfo)
}
status.matInfo=defaultMateriaTemplate.getMatInfo()
console.log(status.matInfo)

eventBus.eventTarget.status=status
const app= initVueApp(import.meta.resolve('./source/UI/components/app.vue'),'app',{},undefined,{eventBus,status})
await app.mount(document.body)


console.log(defaultMateriaTemplate.getMatInfo())