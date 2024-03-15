<template>
    <div @click.stop="switchCurrent" class="fn__flex" @dragover.prevent @drop.prevent="handleDrop" ref="itemContainer">
      <div class="fn__flex fn__flex-column">
        <!-- Label -->
        <div class="fn__flex material-label">
          <span class="material-label">{{ label }}</span>
        </div>
        <!-- Slider and Image Preview -->
        <div class="fn__flex">
          <div class="b3-card-img-container" 
          v-if="mapName" 
          @click="getMap"
          @click.right="handleClear"
          >
            <img v-show="status.material[mapName]" ref="imagePreviewer" :src="status.material[mapName]" />
          </div>
          <div class="fn__space "></div>
          <input type="range" :class="sliderClass" :min="min" :max="max" :step="step" v-model="value" @input="updateValue" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, inject, watch, nextTick } from 'vue';
  
  const { eventBus, status } = inject('appData');
  
  const props = defineProps({
    label: String,
    min: Number,
    max: Number,
    step: Number,
    initialValue: Number,
    eventName: String,
    sliderClass: String,
    valueName: String, // New prop for the value name
    mapName: String // New prop for the map name
  });
  
  const value = ref(props.initialValue);
  const imagePreviewer = ref(null);
  
  const updateValue = () => {
    if (props.valueName) {
      status.material[props.valueName] = value.value; // Dynamically update the value
    }
    eventBus.emit(props.eventName, { value: value.value });
  };
  
  const switchCurrent = () => {
    // Logic to switch current selected item
  };
  
  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0 && props.mapName) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => nextTick(() => {
          const fileURL = `file:///${file.path}`;
          status.material[props.mapName] = fileURL; // Dynamically update the map
          imagePreviewer.value.src = e.target.result;
          eventBus.emit(props.mapName + 'Change', { fileURL: fileURL });
        });
        reader.readAsDataURL(file); // Read the file content
      }
    }
  };
  const handleClear = () => {
    imagePreviewer.value.src = ''; // 将读取到的图片数据设置为img的src
    eventBus.emit(props.mapName + 'Change', { clear: true })
    status.material[props.mapName] = ``
  }
  
  eventBus.on(props.mapName+ 'Change',(e)=>{
    let fileURL = e.detail.fileURL.replace(/\\/g,'/')
    console.log(e.detail)
    if(fileURL!==imagePreviewer.value.src){
      status.material[props.mapName] = fileURL
      imagePreviewer.value.src = fileURL
    }
  })
  const getMap=()=>{
        const {fileURL} = eventBus.eventTarget.status.currentEagleItem[0]
        console.log(fileURL)
        status.material[props.mapName] = fileURL; // Dynamically update the map
          imagePreviewer.value.src = fileURL;
          eventBus.emit(props.mapName + 'Change', { fileURL: fileURL });
  }
  // Watch for value changes
  watch(value, updateValue);
  </script>
  
  <style>
  /* Add CSS styles if needed */
  </style>