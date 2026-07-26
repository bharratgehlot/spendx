const currentBudget = {};

const overlay = document.getElementById('modelOverlay');
const step1Error = document.getElementById('step1Error');

document.getElementById('newBudget').addEventListener('click', () => {
  overlay.classList.add('active');
});

document.getElementById('modelClose').addEventListener('click', closeModel);
overlay.addEventListener('click', (event) => {
  if (event.target === overlay) {
    closeModel();
  }
});

function closeModel() {
  overlay.classList.remove('active');
  step1Error.textContent = '';
}

document.getElementById('nextBtn').addEventListener('click', () => {
  const name = document.getElementById('budgetName').value.trim();
  const month = document.getElementById('budgetMonth').value;
  const amount = parseFloat(document.getElementById('targetAmount').value);

  if (!name || !month || !amount || amount <= 0) {
    step1Error.textContent = 'Please fill all fields correctly.';
    return;
  }

  currentBudget.name = name;
  currentBudget.month = month;
  currentBudget.targetAmount = amount;

  step1Error.textContent = '';
  console.log('Step 1 done:', currentBudget);
})