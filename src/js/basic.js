export default function(canvas){
    if (!canvas.getContext) return

    const 
        ctx = canvas.getContext('2d'),
        width = canvas.width,
        height = canvas.height,
        imageData = ctx.createImageData(height,width),
        data = imageData.data

    for(let i = 0; i <data.length;i+=4){
        data[i] = 255
        data[i+1] = 255
        data[i+2] = 255
        data[i+3] = 255
    }

    ctx.putImageData(imageData, 0, 0);

    console.log(data)
}
