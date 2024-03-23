const unzipItemFile = async (item) => {
    const AdmZip = window.require('adm-zip');
    const path = window.require('path');
    const unzipPath = path.join(eagle.plugin.path, 'temp', item.id);
    const zip = new AdmZip(item.filePath);
    zip.extractAllTo(unzipPath, true);
    return unzipPath;
};