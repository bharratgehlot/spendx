// ----- BLOCK 1 ----- Function to generate a random number ----- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


// ----- BLOCK 2 ----- Logic for repititive name input ----- //

// Run immediately

refillDefaultValues();

// NEW: Function

function refillDefaultValues() {
  const savedUserName = localStorage.getItem("storedUserName");

  if (savedUserName) {
    document.getElementById("userName").value = savedUserName;
  }

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  document.getElementById("date").value = `${yyyy}-${mm}-${dd}`;

}

// ----- BLOCK 3 ----- Background Image Changing & Arrays of the photo URLs ----- //  

const photos = [
  'assets/backgrounds/photo1.jpg',
  'assets/backgrounds/photo2.jpg',
  'assets/backgrounds/photo3.jpg',
  'assets/backgrounds/photo4.jpg',
  'assets/backgrounds/photo5.jpg',
  'assets/backgrounds/photo6.jpg',
  'assets/backgrounds/photo7.jpg',
  'assets/backgrounds/photo8.jpg',
  'assets/backgrounds/photo9.jpg',
  'assets/backgrounds/photo10.jpg',
  'assets/backgrounds/photo11.jpg',
  'assets/backgrounds/photo12.jpg',
  'assets/backgrounds/photo13.jpg',
  'assets/backgrounds/photo14.jpg',
  'assets/backgrounds/photo15.jpg',
  'assets/backgrounds/photo16.jpg',
  'assets/backgrounds/photo17.jpg',
  'assets/backgrounds/photo18.jpg',
  'assets/backgrounds/photo19.jpg',
  'assets/backgrounds/photo20.jpg',
  'assets/backgrounds/photo21.jpg',
  'assets/backgrounds/photo22.jpg',
  'assets/backgrounds/photo23.jpg',
  'assets/backgrounds/photo24.jpg',
  'assets/backgrounds/photo25.jpg',
];


let isBackgroundLocked = localStorage.getItem('isBackgroundLocked') === 'true'; // Check if background is locked from localStorage
let currentBackgroundUrl = localStorage.getItem('currentBackgroundUrl');

function setBackgroundPhoto() {
  if (!isBackgroundLocked) {
    const today = new Date();
    const dayOfYear = today.getFullYear() * 1000 + today.getMonth() * 31 + today.getDate(); // Unique number for each day
    const randomIndex = dayOfYear % photos.length; // Use dayOfYear to ensure consistent random photo each day
    const photoUrl = photos[randomIndex];
    const container = document.getElementById('container');
    container.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${photoUrl}')`;
    container.style.backgroundSize = 'cover'; // Ensure the background photo covers the container
    container.style.backgroundPosition = 'center'; // Center the background photo
    currentBackgroundUrl = photoUrl;
    localStorage.setItem('currentBackgroundUrl', currentBackgroundUrl);
  } else if (currentBackgroundUrl) {
    const container = document.getElementById('container');
    container.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${currentBackgroundUrl}')`;
    container.style.backgroundSize = 'cover'; // Ensure the background photo covers the container
    container.style.backgroundPosition = 'center'; // Center the background photo
  }
}

setBackgroundPhoto();

setInterval(() => {
  if (!isBackgroundLocked) {
    setBackgroundPhoto();
  }
}, 24 * 60 * 60 * 1000); // Set background photo every 24 hours if not locked


// ----- BLOCK 4 ----- Toggle Button Logic ----- //  


const toggleButton = document.getElementById('toggleButton');
updateButtonState(); // Update button state on page load

toggleButton.addEventListener('click', function () {
  isBackgroundLocked = !isBackgroundLocked;
  localStorage.setItem('isBackgroundLocked', isBackgroundLocked); // Save lock/unlock state to localStorage
  updateButtonState(); // Update button state after click
});

function updateButtonState() {
  if (isBackgroundLocked) {
    toggleButton.textContent = "Unlock-Image";
    toggleButton.classList.remove('unlocked');
    toggleButton.classList.add('locked');
  } else {
    toggleButton.textContent = "Lock-Image";
    toggleButton.classList.remove('locked');
    toggleButton.classList.add('unlocked');
  }
}


// ----- BLOCK 5 ----- Code for handling expenses, calculation ----- //  

const submitButton = document.getElementById('submitButton');


// ----- BLOCK 5.1 ----- Get available balance and total money spent from localstorage ----- //  


let availableBalance = localStorage.getItem('availableBalance');
let totalMoneySpent = parseInt(localStorage.getItem('totalMoneySpent')) || 0;  //Money Spent Box


// ----- BLOCK 5.2 ----- Initial Money Input or retrival from local storage ----- //  


if (availableBalance === null) {
  let initialBalance;

  do {
    initialBalance = prompt("Please enter your monthly budget (1-25000 INR)");

    if (initialBalance === null) {
      continue; // Keep asking if user cancels
    }

    let parsedBalance = parseFloat(initialBalance);

    if (!/^\d+(\.\d+)?$/.test(initialBalance.trim()) ||
      isNaN(parsedBalance) ||
      parsedBalance <= 0 ||
      parsedBalance > 25000) {
      alert("Please enter a valid number between 1 and 25,000");
      initialBalance = null; // Reset to continue loop
    } else {
      availableBalance = parsedBalance;
      break;
    }
  } while (true);

  localStorage.setItem('availableBalance', availableBalance);
  localStorage.setItem('initialBalance', availableBalance);


} else {
  availableBalance = parseInt(availableBalance); // Can be used parseFloat if stored as string
}


// ----- BLOCK 5.3 ----- Update both available balance and total balance ----- //  


document.getElementById('availableBalance').textContent = availableBalance; // Update available money box
document.getElementById('totalSpentAmount').textContent = totalMoneySpent; // Update total money spent box


// ----- BLOCK 5.4 ----- Table construction and adding values ----- //  


document.getElementById('expenseForm').addEventListener('submit', function (e) {
  e.preventDefault();
  let userName = document.getElementById('userName').value;
  let money = parseInt(document.getElementById('money').value);
  let description = document.getElementById('description').value;
  let date = document.getElementById('date').value;
  let location = document.getElementById('location').value;
  let category = document.getElementById('category').value;

  if (money > availableBalance) {
    alert("You don't have enough money to spend this amount.");
    return;
  }

  if (!category) {
    alert("Please select a category.");
    return;
  }

  if (money <= 0) {
    alert("Please enter a valid amount.");
    return;
  }


  let expense = {
    userName,
    money,
    description,
    date,
    location,
    category,
  };

  let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  expenses.push(expense);
  localStorage.setItem('expenses', JSON.stringify(expenses));

  localStorage.setItem('storedUserName', userName);  // Will stored username for later use

  // ----- BLOCK 5.5 ----- Deduct spend amount from available balance ----- //  


  availableBalance -= money;
  document.getElementById('availableBalance').textContent = availableBalance;
  localStorage.setItem('availableBalance', availableBalance);



  // ----- BLOCK 5.6  ----- update total money spent ----- //  

  totalMoneySpent += money;
  document.getElementById('totalSpentAmount').textContent = totalMoneySpent; // Update total money spent box


  // ----- BLOCK 5.7 ----- Display success message & reset fields ----- //


  this.reset();
  refillDefaultValues();

  submitButton.disabled = true;
  submitButton.textContent = "✓ Submitted";
  submitButton.classList.add("submitted");

  setTimeout(() => {
    submitButton.disabled = false;
    submitButton.textContent = "Add Expense";
    submitButton.classList.remove("submitted");
  }, 3000);

});


// ----- BLOCK 5.8 ----- Store the updated total money spent in localStorage when the page unloads ----- //  

window.addEventListener('beforeunload', function () {
  localStorage.setItem('totalMoneySpent', totalMoneySpent);
});


// ----- BLOCK 5.9 ----- Add event listener to clear total money spent when local storage is cleared ----- //  


window.addEventListener('storage', function (e) {
  if (e.key === null) {
    totalMoneySpent = 0;
    document.getElementById('totalSpentAmount').textContent = totalMoneySpent; // Update total money spent box
  }
});


// ----- BLOCK 6 ----- ANYTHING ELSE ----- //  


