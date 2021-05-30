const video = document.getElementById('video');
let emocao = document.getElementById('emocao');

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
    navigator.getUserMedia = ( navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

    navigator.getUserMedia(
        {video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)

    let neutro,feliz,triste,raiva,medo,desgosto,surpreso = 0
    setInterval(async () =>{
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

        neutro = detections.expressions.Neutro
        feliz = detections.expressions.Feliz
        triste = detections.expressions.Triste
        raiva = detections.expressions.Raiva
        medo = detections.expressions.Medo
        desgosto = detections.expressions.Desgosto
        surpreso = detections.expressions.Surpreso

        if(parseFloat(neutro) > 0.5){
            emocao.innerHTML = "Você está Neutro";
        }else if(parseFloat(feliz) > 0.5){
            emocao.innerHTML = "Você está Feliz";
        }else if(parseFloat(triste) > 0.5){
            emocao.innerHTML = "Você está Triste";
        }else if(parseFloat(raiva) > 0.5){
            emocao.innerHTML = "Você está com Raiva";
        }else if(parseFloat(medo) > 0.5){
            emocao.innerHTML = "Você está com Medo";
        }else if(parseFloat(desgosto) > 0.5){
            emocao.innerHTML = "Você está com Desgosto";
        }else if(parseFloat(surpreso) > 0.5){
            emocao.innerHTML = "Você está Surpreso";
        }
    }, 400)
})