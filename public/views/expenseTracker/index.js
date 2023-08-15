function addNewExpense(e) {
  e.preventDefault();
  const expenseDetails = {
    expenseamount: e.target.expenseamount.value,
    description: e.target.description.value,
    category: e.target.category.value,
  };
  const token = localStorage.getItem("token");
  axios
    .post("http://localhost:4000/expense/addexpense", expenseDetails, {
      headers: { Authorization: token },
    })
    .then((response) => {
      if (response.status === 201) {
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
    .get(`http://localhost:4000/expense/getexpenses`, {
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
  const parentElement = document.getElementById("listofExpenses");
  const expenseElemId = `expense-${expense.id}`;
  parentElement.innerHTML += `<li id=${expenseElemId}>
    ${expense.expenseamount} - ${expense.category} - ${expense.description}
    <button id="del-button" onClick='deleteExpense(event,${expense.id})'>Delete Expense</button>
    </li>`;
}

function deleteExpense(e, expenseid) {
  const token = localStorage.getItem("token");
  axios
    .delete(`http://localhost:4000/expense/deleteexpense/${expenseid}`, {
      headers: { Authorization: token },
    })
    .then(() => {
      removeExpensefromUI(expenseid);
    })
    .catch((err) => {
      showError(err);
    });
}

function removeExpensefromUI(expenseid) {
  const expenseElemId = `expense-${expenseid}`;
  document.getElementById(expenseElemId).remove();
}

function showError(err) {
  document.body.innerHTML += `<div style="color:red;">${err}</div>`;
}
