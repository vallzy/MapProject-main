var TGA = require('tga');
var PNG = require('pngjs').PNG;
const fs = require('fs');

function convert(src, output) {
    return new Promise((resolve, reject) => {
        try {
            var tga = new TGA(fs.readFileSync(src));
            var png = new PNG({
                width: tga.width,
                height: tga.height
            });
            png.data = tga.pixels;
            let stream = png.pack();
            stream.on('end', () => {
                console.log('finished');
                resolve();
            });
            stream.pipe(fs.createWriteStream(output), { end: false })
        } catch (err) {
            reject(err);
        }
    })
}

module.exports = {
    convert
}