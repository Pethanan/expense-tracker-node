async function login(e) {
  try {
    e.preventDefault();
    const loginDetails = {
      email: e.target.email.value,
      password: e.target.password.value,
    };
    await axios
      .post("http://localhost:4000/user/login", loginDetails)
      .then((response) => {
        if (response.status == 200) {
          alert(response.data.message);
          localStorage.setItem("token", response.data.token);
          window.location.href = "../ExpenseTracker/index.html";
        } else {
          throw new Error(response.data.message);
        }
      })
      .catch((err) => {
        console.log(JSON.stringify(err));
        document.body.innerHTML += `<div style="color:red";>${err.message}</div>`;
      });
  } catch (err) {
    document.body.innerHTML += `<div style="color:red;">${err}</div>`;
  }
}

function forgotpassword() {
  window.location.href = "../forgotPassword/index.html";
}
