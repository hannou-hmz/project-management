const login = document.getElementById('login');
const signup = document.querySelector('.btn-hero-primary');
const signup2 = document.querySelector('.btn-primary');


login.addEventListener("click" , (event)=>{
    event.preventDefault();
    window.location.href = '/login';
});

signup.addEventListener("click" , (event)=>{
    event.preventDefault();
    window.location.href = '/signup';
});

signup2.addEventListener("click" , (event)=>{
    event.preventDefault();
    window.location.href = '/signup';
});