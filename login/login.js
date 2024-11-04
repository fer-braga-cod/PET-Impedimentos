function redirectToHome() {  
    var email = document.getElementById("email").value;
    var senha = document.getElementById("senha").value;
  
    if (email === "pet-comp@ufms.br" && senha === "facom") {    
      window.location.href = "../home/home.html";
    } else {    
      alert("Login Invalido!");
    }
}