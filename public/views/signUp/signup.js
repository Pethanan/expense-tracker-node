async function signup(e) {
  try {
    e.preventDefault();
    const signupDetails = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };
    console.log(signupDetails);
    await axios
      .post("http://localhost:4000/user/signup", signupDetails)
      .then((response) => {
        if (response.status == 201) {
          alert(response.data.message);
          window.location.href = "../login/login.html";
        } else {
          throw new Error(response.data.message);
        }
      });
  } catch (err) {
    document.body.innerHTML += `<div style="color:red;">${err}</div>`;
  }
}
