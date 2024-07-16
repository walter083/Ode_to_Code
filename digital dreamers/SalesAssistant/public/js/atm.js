const contactForm = document.querySelector('.meeting-form');
let name = document.getElementById('name');
let email = document.getElementById('email');
let meetingDate = document.getElementById('meeting-date')
let remainder = document.getElementById('reminder');

contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    
    let formData = {
        name: name.value,
        email: email.value,
        meetingDate: meetingDate.value,
        remainder: remainder.value
    }
    
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/');
    xhr.setRequestHeader('content-type','application/json');
    xhr.onload = function(){
        console.log(xhr.responseText);
        if(xhr.responseText == 'success'){
            alert('Email sent');
            name.value = "";
            email.value = "";
            meetingDate.value = "",
            remainder.value = ""
        }else{
            alert('Something went wrong!')
        }
    }

    xhr.send(JSON.stringify(formData));
})