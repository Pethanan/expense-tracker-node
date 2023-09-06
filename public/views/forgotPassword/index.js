async function resetPasswordHandler(e) {
  e.preventDefault();
  const mailId = e.target.mailId.value;
  console.log(e.target);
  console.log(e.target.mailId);
  await axios.post("http://localhost:4000/password/forgotPassword", { mailId });
}
