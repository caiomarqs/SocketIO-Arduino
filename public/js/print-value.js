function printValue(textValue, textOptions, requestAnimationFrame) {
    textValue.innerText = `[ ${textOptions.value} ]`
    textValue.style.color = textOptions.color
    
    requestAnimationFrame(() => {
        printValue(textValue, textOptions, requestAnimationFrame)
    })
    
}