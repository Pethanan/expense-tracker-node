function addNewExpense(e) {
  e.preventDefault();
  const expenseDetails = {
    amount: +e.target.amount.value,
    description: e.target.description.value,
    category: e.target.category.value,
  };
  console.log(expenseDetails);
  const token = localStorage.getItem("token");
  axios
    .post("http://localhost:4000/expense/addExpense", expenseDetails, {
      headers: { Authorization: token },
    })
    .then((response) => {
      if (response.status === 201) {
        console.log("right place");
        addNewExpensetoUI(response.data.expense);
      }
    })
    .catch((err) => {
      showError(err);
    });
}

window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  axios
    .get(`http://localhost:4000/expense/getExpenses`, {
      headers: { Authorization: token },
    })
    .then((response) => {
      response.data.expenses.forEach((expense) => {
        addNewExpensetoUI(expense);
      });
    })
    .catch((err) => {
      showError(err);
    });
});

function getExpenses(page) {
  const token = localStorage.getItem("token");
  axios
    .get(`http://localhost:4000/expense/getexpenses?page=${page}`, {
      headers: { Authorization: token },
    })
    .then((response) => {
      response.data.expenses.forEach((expense) => {
        addNewExpensetoUI(expense);
      });
    });
}

function addNewExpensetoUI(expense) {
  console.log(expense);
  console.log(expense);
  console.log(expense.id);
  console.log(expense.id);

  const parentElement = document.getElementById("listofExpenses");
  const expenseElemId = `expense-${expense.id}`;
  parentElement.innerHTML += `<li id=${expenseElemId}>
    ${expense.amount} - ${expense.category} - ${expense.description}
    <button id="del-button" onClick='deleteExpense(event,${expense.id})'>Delete Expense</button>
    </li>`;
}

function deleteExpense(e, expenseId) {
  console.log(expenseId);
  const token = localStorage.getItem("token");
  axios
    .delete(`http://localhost:4000/expense/deleteExpense/${expenseId}`, {
      headers: { Authorization: token },
    })
    .then(() => {
      removeExpensefromUI(expenseId);
    })
    .catch((err) => {
      showError(err);
    });
}

function removeExpensefromUI(expenseId) {
  const expenseElemId = `expense-${expenseId}`;
  document.getElementById(expenseElemId).remove();
}

function showError(err) {
  document.body.innerHTML += `<div style="color:red;">${err}</div>`;
}
