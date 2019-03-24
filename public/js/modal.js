const modal = document.querySelector('.modal')
const button = document.getElementById('btn')
const close = document.getElementById('close')
const btnLogin = document.getElementById('login')
const btnRegister = document.getElementById('register')
const login = document.querySelector('.modal .modal-content .modal-isi .login')
const register = document.querySelector('.modal .modal-content .modal-isi .regis')

button.addEventListener('click',()=>{
    modal.style.display = 'flex'
    console.log('ada')
})

close.addEventListener('click',()=>{
    modal.style.display = 'none'
})

btnRegister.addEventListener('click', ()=>{
    login.classList.toggle('close')
    register.classList.toggle('close')
    console.log('ada')
})

btnLogin.addEventListener('click', ()=>{
    login.classList.toggle('close')
    register.classList.toggle('close')
    console.log('ada')
})