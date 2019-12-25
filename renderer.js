/* Handle window controls */
var btnclose = document.getElementById('btnclose')
var btnminimize = document.getElementById('btnminimize')
var btnmaximize = document.getElementById('btnmaximize')

btnclose.addEventListener('click', () => {
    window.closeCurrentWindow()
})

btnminimize.addEventListener('click', () => {
    window.minimizeCurrentWindow()
})

btnmaximize.addEventListener('click', () => {
    window.maximizeCurrentWindow()
    if (window.isMaximized) {
        btnmaximize.style.background = 'url("btnunmaximize.png")'
    } else {
        btnmaximize.style.background = 'url("btnmaximize.png")'
    }
})

/* Titlebar buttons / Service selector */
var titlebar = document.getElementById('titlebar')

// addService adds an service button to the titlebar: addService('myservice', 'icon.png')
function addService(name, icon, color) {
    var ul = document.getElementById('ultitlebuttons')
    var li = document.createElement('li')
    var btn = document.createElement('button')

    li.setAttribute('class', 'lititlebutton')
    
    btn.setAttribute('class', 'btntitlebutton')
    btn.setAttribute('id', 'btnservice' + name)
    btn.style.background = 'url(' + icon + ')'
    alert(btn.style.background)

    btn.addEventListener('click', () => {
        window.selectService(name)
        if (color != 'nochange') {
            titlebar.style.backgroundColor = color;
        }
    })


    li.append(btn)

    ul.appendChild(li)
}

window.addEventListener('message', (event) => {
    if (event.source != window) return
    if (event.data.type && (event.data.type == "ADDSERVICE")) {
        addService(event.data.text.name, event.data.text.iconpath, event.data.text.color)
    }
})
