const btnEdit = document.getElementById('btn-edit');
const btnHistory = document.getElementById('btn-history');
const btnPass = document.getElementById('btn-pass');
const editProfile = document.querySelector('.content section.edit-profile')
const history = document.querySelector('.content > section.history-tiket')
const changePass = document.querySelector('.content > section.change-pass')

btnEdit.addEventListener('click',()=>{
    if (history.classList.contains('show') || changePass.classList.contains('show')) {
        history.classList.remove('show')
        changePass.classList.remove('show')
        editProfile.classList.toggle('show')
        editProfile.classList.remove('close')
        changePass.classList.remove('show')
    }else{
        editProfile.classList.toggle('show')
        editProfile.classList.remove('close')
        changePass.classList.remove('show')
    }
    console.log('ada');
})

btnHistory.addEventListener('click',()=>{
    if (editProfile.classList.contains('show') || changePass.classList.contains('show')) {
        editProfile.classList.remove('show')
        editProfile.classList.toggle('close')
        changePass.classList.remove('show')
        changePass.classList.toggle('close')
        history.classList.toggle('show')
        history.classList.remove('close')
    }else{
        editProfile.classList.toggle('close')
        changePass.classList.toggle('close')
        history.classList.toggle('show')
    }
    console.log('ada');
    
})

btnPass.addEventListener('click',()=>{
    if (editProfile.classList.contains('show') || history.classList.contains('show')) {
        history.classList.remove('show')
        history.classList.toggle('close')
        editProfile.classList.remove('show')
        editProfile.classList.toggle('close')
        changePass.classList.toggle('show')
        changePass.classList.remove('close')
    }else{
        editProfile.classList.toggle('close')
        history.classList.toggle('close')
        changePass.classList.toggle('show')
        changePass.classList.remove('close')
    }
    console.log('ada');
    
})