const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const listEl = document.getElementById('list');
const form = document.getElementById('transactionForm');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function updateValues() {
  const amounts = transactions.map(t => t.amount);
  const income = amounts.filter(val => val > 0).reduce((a, b) => a + b, 0);
  const expense = amounts.filter(val => val < 0).reduce((a, b) => a + b, 0);
  const balance = income + expense;

  balanceEl.textContent = balance;
  incomeEl.textContent = income;
  expenseEl.textContent = Math.abs(expense);

  localStorage.setItem('transactions', JSON.stringify(transactions));
  renderChart(income, Math.abs(expense));
}

function renderTransactions() {
  listEl.innerHTML = '';
  transactions.forEach((t, index) => {
    const li = document.createElement('li');
    li.classList.add(t.amount > 0 ? 'income-item' : 'expense-item');
    li.innerHTML = `${t.text} <span>${t.amount > 0 ? '+' : '-'}₹${Math.abs(t.amount)}</span>`;
    
    // Optional: add delete button
    const delBtn = document.createElement('button');
    delBtn.textContent = '❌';
    delBtn.style.border = 'none';
    delBtn.style.background = 'transparent';
    delBtn.style.cursor = 'pointer';
    delBtn.onclick = () => deleteTransaction(index);
    li.appendChild(delBtn);

    listEl.appendChild(li);
  });
}

function deleteTransaction(index) {
  transactions.splice(index, 1);
  renderTransactions();
  updateValues();
}

function renderChart(income, expense) {
  const ctx = document.getElementById('chart').getContext('2d');
  if (window.myChart) window.myChart.destroy();
  window.myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        data: [income, expense],
        backgroundColor: ['#28a745', '#dc3545']
      }]
    }
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const newTransaction = {
    text: text.value,
    amount: +amount.value
  };
  transactions.push(newTransaction);
  renderTransactions();
  updateValues();
  text.value = '';
  amount.value = '';
});

renderTransactions();
updateValues();
