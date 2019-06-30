#target photoshop

var doc = app.activeDocument;

function main() {
    var originWidth = doc.width.as("px");
    var needWidth = prompt("Задайте необходимую ширину изображения (px)", originWidth, "Сохранить для Web с учётом DPR");
    if (!needWidth) return;
    var fullName = doc.name;
    var dotIndex = fullName.lastIndexOf('.');
    var name = (dotIndex !== -1) ? fullName.substr(0, dotIndex) : fullName;

    var dprRatio = [1, 1.5, 2, 2.5, 3, 3.5, 4];

    for (var i=0; i < dprRatio.length; i++) {
        var width = needWidth * dprRatio[i];
        if (width > originWidth) continue;
        var u = (needWidth < 1000) ? '_' : '';
        var whole = ~~dprRatio[i];
        var fract = (dprRatio[i] - whole) * 10;
        var newFile = File(doc.path+'/'+name+ u +needWidth+'_'+whole+'x'+fract+'.jpg');
        SaveForWebWithResize(newFile, 50, width);
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