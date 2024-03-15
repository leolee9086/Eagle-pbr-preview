import * as Vue from '../../../static/vue.esm-browser.js'
import { loadModule } from '../../../static/vue3-sfc-loader.esm.js'
const moduleCache = {
    vue: Vue,    
}
let watched = {}
let { ref, reactive } = Vue
export {
    ref, reactive
}
function extractCorrectUrl(url) {
    // Create a new URL object
    const urlObj = new URL(url);

    // Extract the pathname and split it into parts
    const parts = urlObj.pathname.split('/');

    // Remove the first part if it matches the host
    if (parts[1] === urlObj.host) {
        parts.splice(1, 1);
    }

    // Reconstruct the pathname
    urlObj.pathname = parts.join('/');
    console.log(urlObj.toString())
    if(urlObj.toString().startsWith('eagleplugin')){
       if(!urlObj.pathname.startsWith('//')){
        return urlObj.origin+'/'+urlObj.pathname
       }else{
        
        return urlObj.origin+urlObj.pathname
       }
    }

    // Return the corrected URL string
    return urlObj.toString();
}
export const initVueApp = (appURL, name, mixinOptions = {}, directory, data={}) => {
    const asyncModules = {}
    const styleElements = []
    const options = {
        moduleCache: {
            ...moduleCache
        },
        async getFile(url) {
            const res = await fetch(extractCorrectUrl(url));
            if (!res.ok) {
                throw Object.assign(new Error(res.statusText + ' ' + url), { res });
            }

            if (url.endsWith('.js')) {
                if (!asyncModules[url]) {
                    let module = await import(extractCorrectUrl(url))
                    asyncModules[url] = module
                }
            }
            return {
                getContentData: asBinary => asBinary ? res.arrayBuffer() : res.text(),
            }
        },
        handleModule(type, source, path, options) {
            if (type === '.json') {
                return JSON.parse(source);
            }
            if (type === '.js') {
                console.log(asyncModules,path,asyncModules[path] )

                return asyncModules[path]
            }
        },

        addStyle(textContent) {
            const style = Object.assign(document.createElement('style'), { textContent });
            const ref = document.head.getElementsByTagName('style')[0] || null;
            document.head.insertBefore(style, ref);
            styleElements.push(style)
        },
    }

    let oldApp
    let _args
    let f = () => {
        try {
            styleElements.forEach(el => {
                el.remove()
            })
            oldApp ? oldApp.unmount : null
            let obj = { ...options, ...mixinOptions }
            obj.moduleCache = { ...moduleCache }
            let componentsCache = {}
            componentsCache[name] = Vue.defineAsyncComponent(() => loadModule(appURL, obj))
            let app = Vue.createApp({
                components: componentsCache,
                template: `<${name}></${name}>`,
                setup() {
                    const dataReactive = reactive(data||{});
                    app.provide('appData', dataReactive);
                }
            })
            if (window.require && directory) {
                watched[directory] = true
                let _mount = app.mount
                app.mount = (...args) => {
                    _args = args;
                    _mount.bind(app)(...args)
                }
            }
            return app
        } catch (e) {
            console.warn(e)
            return oldApp
        }
    }
    oldApp = f()
    if (window.require) {
        const fs = require('fs');
        const path = require('path');
        let previousContents = {};
        function watchDirectory(directory) {
            fs.readdirSync(directory).forEach(file => {
                let filePath = path.join(directory, file);
                let stats = fs.statSync(filePath);
                if (stats.isFile()) {
                    previousContents[filePath] = fs.readFileSync(filePath, 'utf-8');
                    fs.watchFile(filePath, (curr, prev) => {
                        let currentContent = fs.readFileSync(filePath, 'utf-8');
                        if (currentContent !== previousContents[filePath]) {
                            oldApp.unmount();
                            oldApp = f();
                            oldApp.mount(..._args);
                            previousContents[filePath] = currentContent;
                        }
                    });
                } else if (stats.isDirectory()) {
                    watchDirectory(filePath);  // Recursively watch subdirectories
                }
            });
        }
        directory && watchDirectory(directory);
    }
    return oldApp
}
