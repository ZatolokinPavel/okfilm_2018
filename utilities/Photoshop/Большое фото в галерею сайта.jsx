#target photoshop

var doc = app.activeDocument;

function main() {
    var needMaxSize = 1200;
    var originWidth = doc.width.as("px");
    var originHeight = doc.height.as("px");
    var fullName = doc.name;
    var dotIndex = fullName.lastIndexOf('.');
    var name = (dotIndex !== -1) ? fullName.substr(0, dotIndex) : fullName;
    var newFile = File(doc.path+'/'+name+'.jpg');

    if (originWidth >= originHeight) {
        if (originWidth < needMaxSize) needMaxSize = originWidth;
        SaveForWebWithResize(newFile, 50, needMaxSize, null);
    } else {
        if (originHeight < needMaxSize) needMaxSize = originHeight;
        SaveForWebWithResize(newFile, 50, null, needMaxSize);
    }
}
main();

function SaveForWebWithResize(newFile, jpegQuality, width, height) {
    var savedState = doc.activeHistoryState;    // сохраняемся, чтобы откатить ресайз
    width = width ? UnitValue(width,"px") : null;
    height = height ? UnitValue(height,"px") : null;
    doc.resizeImage(width, height, null, ResampleMethod.BICUBIC);
    SaveForWeb(newFile, jpegQuality);
    doc.activeHistoryState = savedState;        // откатили изменения
}

function SaveForWeb(newFile, jpegQuality) {
    var sfwOptions = new ExportOptionsSaveForWeb();
    sfwOptions.format = SaveDocumentType.JPEG;   
    sfwOptions.includeProfile = false;   
    sfwOptions.interlaced = false;   
    sfwOptions.optimized = true;   
    sfwOptions.quality = jpegQuality; //0-100
    sfwOptions.blur = 0;
    activeDocument.exportDocument(newFile, ExportType.SAVEFORWEB, sfwOptions);
}