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
  const page = 1;
  const token = localStorage.getItem("token");
  const decodeToken = parseJwt(token);
  const premiumUser = decodeToken.premiumUser;
  const rowsPerPage = localStorage.getItem("rowsPerPage") || 3; // Fetch rowsPerPage from localStorage or default to 3

  if (premiumUser) {
    showPremiumUsermessage();
    showLeaderboard();

    axios
      .get(
        `http://localhost:4000/expense/getExpenses?page=${page}&limit=${rowsPerPage}`,
        {
          headers: { Authorization: token },
        }
      )
      .then((response) => {
        response.data.expenses.forEach((expense) => {
          addNewExpensetoUI(expense);
        });
        showPagination(response.data.pagination);
      })
      .catch((err) => {
        showError(err);
      });
  }
});

function rowsPerPageHandler(event) {
  event.preventDefault();
  const rows = +event.target.rows.value;
  localStorage.setItem("rowsPerPage", rows); // Storing user-defined rows in localStorage
  getExpenses(1); // Fetch the expenses for the first page with the updated limit
}
function getExpenses(page) {
  const token = localStorage.getItem("token");
  const rowsPerPage = localStorage.getItem("rowsPerPage") || 3; // Fetch rowsPerPage from localStorage or default to 3

  axios
    .get(
      `http://localhost:4000/expense/getexpenses?page=${page}&limit=${rowsPerPage}`,
      {
        headers: { Authorization: token },
      }
    )
    .then((response) => {
      const parentElement = document.getElementById("listofExpenses");
      parentElement.innerHTML = ""; // Clear the existing expenses
      response.data.expenses.forEach((expense) => {
        addNewExpensetoUI(expense);
      });
      console.log(response.data.pagination);
      showPagination(response.data.pagination);
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

document.getElementById("rzp-btn").onclick = async function (e) {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:4000/purchase/premium-membership",
      { headers: { Authorization: token } }
    );
    console.log(response);
    console.log(response);
    console.log(response);

    var options = {
      key: response.data.key_id,
      order_id: response.data.order.id,
      // handler use for success payment
      handler: async function (response) {
        console.log(response);
        const res = await axios.post(
          "http://localhost:4000/purchase/update-transaction-status",
          {
            orderId: options.order_id,
            paymentId: response.razorpay_payment_id,
          },
          { headers: { Authorization: token } }
        );
        alert("You are a premium user Now");
        localStorage.setItem("token", res.data.token);
        showPremiumUsermessage();
        showLeaderboard();
        showExpensesFilter();
      },
    };

    const rzp1 = new Razorpay(options);

    rzp1.open();
    e.preventDefault();
    rzp1.on("payment failed", function (response) {
      console.log(response);
      alert("something went wrong, transaction failed");
    });
  } catch (err) {
    console.log(err);
  }
};
function showError(err) {
  document.body.innerHTML += `<div style="color:red;">${err}</div>`;
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

function showPremiumUsermessage() {
  document.getElementById("rzp-btn").style.display = "none";
  document.getElementById("premium-user").innerHTML = "you are a premium user";
  document.getElementById("download-expense").style.visibility = "visible";
}

function showLeaderboard() {
  const inputElement = document.createElement("input");
  inputElement.type = "button";
  inputElement.value = "Show Leaderboard";

  // Applying the CSS styles to the button
  inputElement.style.width = "40%";
  inputElement.style.padding = "0.5rem";
  inputElement.style.textTransform = "uppercase";
  inputElement.style.borderRadius = "20px";
  inputElement.style.cursor = "pointer";
  inputElement.style.transition = "background-color 0.3s ease";

  inputElement.onclick = async () => {
    const token = localStorage.getItem("token");
    const userLeaderBoardArray = await axios.get(
      `http://localhost:4000/premium/showLeaderBoard`,
      { headers: { Authorization: token } }
    );

    let LeaderboardElem = document.getElementById("leader-board-list");
    LeaderboardElem.innerHTML = ""; // Clear the leaderboard content before updating
    LeaderboardElem.innerHTML += "<h1>Leader Board</h1>";
    userLeaderBoardArray.data.forEach((userDetails) => {
      LeaderboardElem.innerHTML += `<li>Name - ${
        userDetails.name
      } | Total Expense - ${userDetails.total_cost || 0}</li>`;
    });
  };

  document.getElementById("leader-board").appendChild(inputElement);
}

function downloadHandler() {
  const token = localStorage.getItem("token");
  axios
    .get("http://localhost:4000/expenses/download", {
      headers: { Authorization: token },
    })
    .then((response) => {
      console.log(response);
      if (response.status === 200) {
        var a = document.createElement("a");
        a.href = response.data.fileURl;
        a.download = "myexpense.csv";
        a.click();
        showFileURl(response.data.fileURl);
      } else {
        throw new Error(response.data.message);
      }
    })
    .catch((err) => {
      document.body.innerHTML += `<div style="color:red;">${err}</div>`;
    });
}

function showFileURl(filelink) {
  document.body.innerHTML += `<a >${filelink}</a><br><a style="color:red">IF YOU WANT PREVIOUS  FILE COPY THE  URL</a>`;
}

function showPagination({
  currentPage,
  hasNextPage,
  hasPreviousPage,
  nextPage,
  previousPage,
}) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  if (hasPreviousPage) {
    const btn2 = document.createElement("button");
    btn2.innerHTML = previousPage;
    btn2.addEventListener("click", () => getExpenses(previousPage));
    pagination.appendChild(btn2);
  }
  const btn1 = document.createElement("button");
  btn1.innerHTML = `<h3>${currentPage}</h3>`;
  btn1.addEventListener("click", () => getExpenses(currentPage));
  pagination.appendChild(btn1);
  if (hasNextPage) {
    const btn3 = document.createElement("button");
    btn3.innerHTML = nextPage;
    btn3.addEventListener("click", () => getExpenses(nextPage));
    pagination.appendChild(btn3);
  }
}
