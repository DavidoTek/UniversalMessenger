// Add services checkboxes
var ulservices = document.getElementById('ulservices')

var services = window.getservices()

services.forEach(service => {
    var li = document.createElement('li')

    var lbl = document.createElement('label')

    var cb = document.createElement('input')
    cb.setAttribute('type', 'checkbox')
    cb.setAttribute('value', service)
    cb.setAttribute('name', 'cbservices')
    
    cb.setAttribute('checked', window.getenabled(service))
    
    lbl.appendChild(cb)
    lbl.innerHTML += service

    li.appendChild(lbl)

    ulservices.appendChild(li)
});

var btnapply = document.createElement('button')
btnapply.innerHTML = 'Apply'

btnapply.addEventListener('click', () => {
    document.getElementsByName('cbservices').forEach((value, index, ar) => {
        window.enableserivce(cb.getAttribute('value'), cb.getAttribute('checked'))
        window.restartapp()
    })
})

ulservices.appendChild(btnapply)

/* Cookies */
var btnresetcookies = document.getElementById('btnresetcookies')
btnresetcookies.addEventListener('click', () => {
    window.deleteCookies()
})