'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Mohammed Abdullahi',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');





const displayMovements = function(movements){
  containerMovements.innerHTML = '';
  movements.forEach(function(mov, i){
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements">
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>`
        containerMovements.insertAdjacentHTML('afterbegin', html)
  })

}


const calcDisplayBalance = function(movements){
  const balance = movements.reduce((acc, mov) => acc + mov, 0)
  labelBalance.textContent = `${balance} €`
}


const calDisplaySummary = function(acc){
  const incomes = acc.movements.filter(mov => mov > 0).
  reduce((acc,curr) => acc + curr)
  labelSumIn.textContent = `${incomes}€`
  
  const outcome = acc.movements.filter(mov => mov < 0).
  reduce((acc, mov) => acc + Math.abs(mov) , 0)
  labelSumOut.textContent = `${outcome}€`

  const interest = acc.movements.filter(mov => mov > 0).
  map(deposit => deposit * acc.interestRate/100).
  filter((intrst, i, arr) => intrst >= 1).
  reduce((acc,intrst) => acc + intrst, 0)
  labelSumInterest.textContent = `${interest}€`
}



const createUsernames = function(accts){
  accts.forEach(function(acc){
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('')
  }) 
}
createUsernames(accounts)


let currentAccount;
btnLogin.addEventListener('click', function(e){
  e.preventDefault()

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)

  if (currentAccount?.pin === Number(inputLoginPin.value) ){
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 100; 

    inputLoginUsername.value = inputLoginPin.value = ''
    inputLoginPin.blur()
    displayMovements(currentAccount.movements)
    calcDisplayBalance(currentAccount.movements)
    calDisplaySummary(currentAccount)
  }
})
























// // FILTER
// const deposits = movements.filter(function(mov, i, arr){
//   return mov > 0
// })

// console.log(movements)
// console.log(deposits)

// const depositsFor = []
// for (const mov of movements) if (mov > 0) depositsFor.push(mov)
// console.log(depositsFor)

// const withdrawals = movements.filter(function(mov){
//   return mov < 0
// })
// console.log(withdrawals)

// // Using Arrow functions
// const withdrawals = movements.filter(mov => mov < 0)
// console.log(withdrawals)


// // REDUCE 
// SYNTAX movements.reduce(function(accumulator, current element, index, array), initial value of accumulator)

// const balance = movements.reduce(function(acc, curr, i, arr){
//   console.log(`Iteration ${i}: ${acc}`)
//   return acc + curr
// }, 0)

// //Using reduce to calculate maximum value
// const max = movements.reduce((acc, mov) => acc > mov ? acc : mov, movements[0])
// console.log(max)

// // CHALLENGE
// const dogAges = [5, 2, 4, 1, 15, 8, 3]

// const calcAverageHumanAge = dogAges.map((dogAge, i) => 
//   dogAge <= 2 ?  2 * dogAge: 16 + dogAge * 4).
//   filter(HumanAge => HumanAge > 18).
//   reduce((acc, curr, i, arr) => 
//   acc + curr/ arr.length , 0)
// console.log(calcAverageHumanAge)
 

// // FIND 
// const firstWithdrawal = movements.find(mov => mov < 0)
// console.log(firstWithdrawal)
// console.log(accounts)

// const account = accounts.find(acc => acc.owner === 'Jessica Davis')
// console.log(account)
// const findAcct = function(accts){
//   for (const acc of accts){
//     if (acc.owner === 'Jessica Davis'){
//       return acc
//     }

//   }

// }
// console.log(findAcct(accounts))
 