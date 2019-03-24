const btn = document.getElementById('btn-logged-in')
const drop = document.querySelector('.navbar > .nav > .nav-drop > .drop-content')

btn.addEventListener('click',()=>{
    drop.classList.toggle('show')
})