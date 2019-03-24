const hamburger = document.getElementById('hamburger')
const navbar = document.querySelector('.navbar')
const navlink = document.querySelector('.navbar > .nav > .nav-links')
const navdrop = document.querySelector('.navbar > .nav > .nav-drop')

hamburger.addEventListener('click',()=>{
    navbar.classList.toggle('open')
    navlink.classList.toggle('show')
    navdrop.classList.toggle('show')
    console.log('ada')
})

