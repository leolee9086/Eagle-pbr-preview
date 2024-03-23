import { loadTexture } from "../index.js";

export const updateMaterialProperty = (material,property, value, isTexture = false) => {
    if (isTexture) {
        if ((value.clear && material[property])||(!value.fileURL&&material[property])) {
            material[property] = null;
        } else if (!value.clear) {
            loadTexture(value.fileURL, (texture) => {
                console.log(material,texture,property)
                material[property] = texture;
                material.needsUpdate = true
            });
        }
    } else {
        material[property] = value;
    }
    material.needsUpdate = true;
};
