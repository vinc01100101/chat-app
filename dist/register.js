

const handleSubmit = (e)=>{
  const p = document.getElementById('password');
  const cP = document.getElementById('rConfirmPassword').value;
  if(p.value !== cP){
    e.preventDefault();
    alert('Passwords does not match');
    p.focus();
  }
}
