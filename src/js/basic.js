export default function(canvas) {
    if (!canvas.getContext) return


    var img = new Image(); // 创建一个<img>元素
    img.src = './static/timg.jpg'; // 设置图片源地址

    img.onload = function() {
        imgload(canvas, img)
    }
    //    ctx.putImageData(imageData, 0, 0);
}


function imgload(canvas, img) {

    const
        ctx = canvas.getContext('2d'),
        width = canvas.width,
        height = canvas.height

    ctx.drawImage(img, 0, 0, width, height)

    const
        imageData = ctx.getImageData(0, 0, height, width),
        data = imageData.data

    let DomHtml = ''

    const
        multiplying = 4

    //Gray = R*0.299 + G*0.587 + B*0.114

    const gray = []

    for (let i = 0; i < data.length; i += 4) {

        gray.push(
            Math.round((data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000)
        )

        data[i] = data[i + 1] = data[i + 2] = Math.round((data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000)
    }

    let sml = fromCtx(multiplying, width, height, gray),
        lag = toCtx(multiplying, width, height, sml)

    lag.forEach((v, i) => {
        const first = i * 4
        data[first] = data[first + 1] = data[first + 2] = v
    })

    ctx.putImageData(imageData, 0, 0)

    const chars = ['0','1','2','3','4']
    sml.forEach((v, i) => {
        DomHtml += `<span style="color:rgb(${v},${v},${v})">${chars[Math.floor(Math.random() *chars.length)]}${chars[Math.floor(Math.random() *chars.length)]}</span>`
        if ((i + 1) % (width / multiplying) == 0) DomHtml += '<br>'
    })
    console.log(gray)
    document.getElementById('app').style.fontSize = '12px'
    document.getElementById('app').style.lineHeight = '12px'
    document.getElementById('app').innerHTML = DomHtml
    
}


function toCtx(multiplying, w, h, arr) {
    const
        _w = w / multiplying,
        _h = h / multiplying

    let res = (new Array(w * h))

    arr.forEach((v, i) => {
        for (let x = 0; x < multiplying; x++) {
            for (let y = 0; y < multiplying; y++) {

                const first = (i - i % _w) * multiplying ** 2 + i % _w * multiplying
                res[first + x + y * (w)] = v
            }
        }
    })


    return res
}

function fromCtx(multiplying, w, h, arr) {
    const
        _w = w / multiplying,
        _h = h / multiplying

    let res = (new Array(w * h / (multiplying ** 2)))
        .fill(0)
        .map((v, i) => {
            const first = (i - i % _w) * multiplying ** 2 + i % _w * multiplying

            let count = 0,
                value = 0

            for (let x = 0; x < multiplying; x++) {
                for (let y = 0; y < multiplying; y++) {
                    count++
                    value += arr[first + x + y * (w)]
                }
            }
            return Math.floor(value / count)
        })

    return res
}