function potentiometerAnimation(textValue, textOptions, requestAnimationFrame) {
    textValue.innerText = `[ ${textOptions.value} ]`
    textValue.style.color = textOptions.color

    let valueAnimation = remapValues(textOptions.value, 0, 1023, 45, 315)
    let potentiometer = document.getElementById('potentiometer')
    potentiometer.style.transform = `rotate(${valueAnimation}deg)`

    requestAnimationFrame(() => {
        potentiometerAnimation(textValue, textOptions, requestAnimationFrame)
    })
}

function remapValues( x,  in_min,  in_max,  out_min,  out_max){
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}