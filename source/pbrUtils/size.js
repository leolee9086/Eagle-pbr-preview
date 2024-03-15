 function fitRender2window(camera,renderer) {
    // 更新相机的宽高比
    camera.aspect = window.innerWidth / window.innerHeight;
    // 更新相机的投影矩阵
    camera.updateProjectionMatrix();
    // 更新渲染器大小
    renderer.setSize(window.innerWidth, window.innerHeight);
}
export const listenfit =(camera,renderer)=>{
    window.addEventListener('resize', () => requestIdleCallback(()=>{
        fitRender2window(camera,renderer)
       })
    , false);

}
