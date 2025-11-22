"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Mohammed Abdullahi',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2024-11-18T21:31:17.178Z',
    '2024-12-23T07:42:02.383Z',
    '2025-01-28T09:15:04.904Z',
    '2025-04-01T10:17:24.185Z',
    '2025-11-17T14:11:59.604Z',
    '2025-11-21T17:01:17.194Z',
    '2025-07-28T23:36:17.929Z',
    '2025-11-22T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'en-GB', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'pt-PT',
};

const accounts = [account1, account2];




// const account1 = {
//   owner: "Mohammed Abdullahi",
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: "Jessica Davis",
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: "Steven Thomas Williams",
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: "Sarah Smith",
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");


const formatMovementDate = function(date, locale){
  const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) /(1000 * 60 * 60 * 24))
  
  const daysPassed = calcDaysPassed(new Date(), date)
  

  if (daysPassed === 0) return 'Today'
  if (daysPassed === 1) return 'Yesterday'
  if (daysPassed <= 7) return `${daysPassed} days ago`
  else{
    // const day = `${date.getDate()}`.padStart(2, 0)
    // const month = `${date.getMonth() + 1}`.padStart(2, 0)
    // const year = date.getFullYear()   

    // return `${day}/${month}/${year}`
    return new Intl.DateTimeFormat(locale).format(date)

  }
  
}

const FormatCur = function(value, locale, currency){
  return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(value)
}

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const combinedMovsDates = acc.movements.map((mov, i) => ({movement: mov, movementDate: acc.movementsDates.at(i)}))


  // const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;
  if (sort) combinedMovsDates.sort((a,b) => a.movement - b.movement)
  combinedMovsDates.forEach(function (obj, i) {
    const { movement, movementDate} = obj
    const type = movement > 0 ? "deposit" : "withdrawal";

    const date = new Date(movementDate)
    const displayDate = formatMovementDate(date, acc.locale)

    const formattedMov = FormatCur(movement, acc.locale, acc.currency)
    

    const html = `<div class="movements">
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((accu, mov) => accu + mov, 0);

  labelBalance.textContent = FormatCur(acc.balance, acc.locale, acc.currency)
};

const calDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, curr) => acc + curr);
  labelSumIn.textContent = FormatCur(incomes, acc.locale, acc.currency)

  const outcome = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + Math.abs(mov), 0);
  labelSumOut.textContent = FormatCur(outcome, acc.locale, acc.currency);

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((intrst, i, arr) => intrst >= 1)
    .reduce((acc, intrst) => acc + intrst, 0);
  labelSumInterest.textContent = FormatCur(interest, acc.locale, acc.currency)
};

const updateUI = function (acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calDisplaySummary(acc);
};


// setting the logout Timer 
const startLogoutTimer = function(){
  const tick = function(){
    const min = String(Math.trunc(time / 60)).padStart(2, 0)
    const sec = String(time % 60).padStart(2, 0)
    labelTimer.textContent = `${min}:${sec}`;
      
    if (time === 0){
      clearInterval(timer)
      labelWelcome.textContent = 'Log in to get started'
      containerApp.style.opacity = 0;
    }
    time--;       
  }
  
  let time = 600;
 
  tick();
  const timer = setInterval(tick, 1000)
  return timer;
}


const createUsernames = function (accts) {
  accts.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);

let currentAccount, timer;

// currentAccount = account1
// updateUI(currentAccount)
// containerApp.style.opacity = 100





btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    const now = new Date()
    const option ={
      hour: 'numeric', 
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      //weekday: 'long'
    }
    
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, option).format(now)

    // const now = new Date()
    // const day = `${now.getDate()}`.padStart(2, 0)
    // const month = `${now.getMonth() + 1}`.padStart(2, 0)
    // const year = now.getFullYear()
    // const hour = `${now.getHours()}`.padStart(2, 0)
    // const min = `${now.getMinutes()}`.padStart(2, 0)

    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`

    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogoutTimer();
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString())
    recieverAcc.movementsDates.push(new Date().toISOString())

    updateUI(currentAccount);
    
    // Reset Timer 
    clearInterval(timer);
    timer = startLogoutTimer();
  }
  inputTransferAmount.value = inputTransferTo.value = "";
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    setTimeout(function(){currentAccount.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString())

    updateUI(currentAccount)}, 3000)

    // Reset Timer 
    clearInterval(timer);
    timer = startLogoutTimer();
  }
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = "";
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
});
















const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
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

// // SOME

// const anyDeposit = movements.some(mov => mov > 0)
// console.log(anyDeposit)
// // EVERY
// console.log(movements.every(mov => mov > 0))
// console.log(account4.movements.every(mov => mov > 0))

// // DoNOTREpeat with call back functions
// const deposit = mov => mov > 0
// console.log(movements.some(deposit))
// console.log(movements.every(deposit))
// console.log(account4.movements.every(deposit))

// FLAT & FLATMAP
// const arr = [[1, 2, 3], [4, 5, 6], 7, 8]
// console.log(arr.flat())

// const arrDeep = [[[1, 2],3], [4, [5, 6]], 7, 8]
// console.log(arrDeep.flat(1))
// console.log(arrDeep.flat(2))

// const acctMovements = accounts.map(acc => acc.movements)
// console.log(acctMovements)
// const allMovements = acctMovements.flat()
// console.log(allMovements)

// const overalBalance = allMovements.reduce((acc, mov) =>acc + mov, 0 )
// console.log(overalBalance)

// Using chaining

// const overalBalance = accounts.map(acc => acc.movements).flat().reduce((acc, mov) =>acc + mov, 0)
// console.log(overalBalance)

// // We can also combine it using // FLATMAP

// const overalBalance = accounts.flatMap(acc => acc.movements).reduce((acc, mov) =>acc + mov, 0)
// console.log(overalBalance)

// // CHALLENGE

// const breeds = [
//   {
//     breed: 'German Shepherd',
//     averageWeight: 32,
//     activities: ['fetch', 'swimming'],
//   },
//   {
//     breed: 'Dalmatian',
//     averageWeight: 24,
//     activities: ['running', 'fetch', 'agility'],
//   },
//   {
//     breed: 'Labrador',
//     averageWeight: 28,
//     activities: ['swimming', 'fetch'],
//   },
//   {
//     breed: 'Beagle',
//     averageWeight: 12,
//     activities: ['digging', 'fetch'],
//   },
//   {
//     breed: 'Husky',
//     averageWeight: 26,
//     activities: ['running', 'agility', 'swimming'],
//   },
//   {
//     breed: 'Bulldog',
//     averageWeight: 36,
//     activities: ['sleeping'],
//   },
//   {
//     breed: 'Poodle',
//     averageWeight: 18,
//     activities: ['agility', 'fetch'],
//   },
// ]

// const huskyWeight = breeds.find(hus => hus.breed === 'Husky').averageWeight
// console.log(huskyWeight)

// const dogBothActivities = breeds.find(brid => brid.activities.includes('fetch') && brid.activities.includes('running')).breed
// console.log(dogBothActivities)

// const allActivities = breeds.flatMap(acct => acct.activities)
// console.log(allActivities)

// const allAct = breeds.flatMap(acct => acct.activities)
// const uniqueActivities = [...new Set(allAct)]
// console.log(uniqueActivities)

// const swimmingAdjacent = [...new Set(breeds.filter(breed=>breed.activities.includes('swimming')).flatMap(breed=>breed.activities).filter(activity=>activity != 'swimming'))]
// console.log(swimmingAdjacent)

// const avgWeight = breeds.some(acct => acct.activities.length >= 3)
// console.log(avgWeight)

// const avgWeight = (breeds.filter(weight => weight.activities.includes('fetch')).map(avgW => avgW.averageWeight)).find(Heavy=>Math.max(Heavy))
// console.log(avgWeight)

// // SORTING ARRAYS
// const owners = ['Jonas', 'Zach', 'Adam', 'Martha']
// console.log(owners.sort())
// console.log(owners)

// console.log(movements)
// return < 0, a, b (keep order)
// return > 0, b, a (switch order)

// movements.sort((a,b) => {
//   if (a > b) return 1
//   if (b > a) return -1
// })

// movements.sort((a,b) => a - b)
// console.log(movements)

// // movements.sort((a,b) => {
// //   if (a > b) return -1
// //   if (b > a) return 1
// // })
// // console.log(movements)

// movements.sort((a,b) => b - a)
// console.log(movements)

// ARRAY GROUPING

// const groupMovements = Object.groupBy(movements, mov => mov > 0 ? 'deposit' : 'withdrawal')
// console.log(groupMovements)

// const groupedByActivity = Object.groupBy(accounts, account => {
//   const movementCount = account.movements.length;

//   if (movementCount >= 8) return 'very active';
//   if (movementCount >= 4) return 'active';
//   if (movementCount >= 1) return 'moderate';
//   return 'inactive';
// });
// console.log(groupedByActivity)
// const arr = [1, 2, 3, 4, 5, 6, 7]
// const x = new Array(7);
// console.log(x)

// // FILL METHOD
// // x.fill(1);
// x.fill(1, 3, 5);
// console.log(x)

// arr.fill(23, 2, 6)
// console.log(arr)

// // ARRAY FROM

// const y = Array.from({ length: 7}, () => 1);
// console.log(y)

// const z = Array.from({length: 7}, (_, i) => i + 1);
// console.log(z)

// // Array with 100 random dice rolls
// const diceroll = Array.from({length: 100}, () => Math.floor(Math.random() * 6) + 1 )
// console.log(diceroll)

// labelBalance.addEventListener('click', function() {
//   const movementUI = Array.from( document.querySelectorAll('.movements__value'), el => Number(el.textContent.replace('€', '')))

//   console.log(movementUI)
// })

// // Non destructive alternatives: toReversed, toSorted,toSpliced, with

// console.log(movements)
// const reversedMov = movements.toReversed()
// const reversedMov = movements.reverse() // Mutates the array
// const reversedMov = movements.slice().reverse() // Helps not to mutate
// console.log(reversedMov)
// console.log(movements)

// movements[1] = 2000;
// console.log(movements)

// const newMov = movements.with(1, 3000)
// console.log(newMov)
// console.log(movements)

// Practice
// const bankDepositSum = accounts
//   .flatMap((acc) => acc.movements)
//   .filter((mov) => mov > 0)
//   .reduce((sum, curr) => curr + sum, 0);
// console.log(bankDepositSum);

// const numDeposit1000 = accounts.flatMap(acc => acc.movements).filter(mov => mov >= 1000).length
// console.log(numDeposit1000)

// const numDeposit1000 = accounts.flatMap(acc => acc.movements).reduce((count, curr) => curr >= 1000 ? ++count : count, 0)
// console.log(numDeposit1000)

// const sums = accounts
//   .flatMap((acc) => acc.movements)
//   .reduce(
//     (sum, curr) => {
//       curr > 0 ? (sum.deposits += curr) : (sum.withdrawals += curr)
//       return sum
//     },
//     { deposits: 0, withdrawals: 0 }
//   );
//   console.log(sums)

// Another way to write it
// const {deposits, withdrawals} = accounts
//   .flatMap((acc) => acc.movements)
//   .reduce(
//     (sum, curr) => {
//       sum[curr > 0 ? 'deposits' : 'withdrawals'] += curr;
//       return sum
//     },
//     { deposits: 0, withdrawals: 0 }
//   );
//   console.log(deposits, withdrawals)

// // Challenge

// const convertTitleCase = function (title) {
//   const exceptions = ["a", "an", "the", "and", "but", "or", "on", "in", "with"];

//   const capitalize = str => str[0].toUpperCase() + str.slice(1)

//   const titleCase = title
//     .toLowerCase()
//     .split(' ')
//     .map(word => exceptions.includes(word) ? word : capitalize(word)).join(' ');
//   return capitalize(titleCase);
// };

// console.log(convertTitleCase("this is a nice title"));
// console.log(convertTitleCase("this is a LONG title but not too long"));
// console.log(convertTitleCase('and here is another title with an EXAMPPLE'))

// const recommendedFood = weight ** 0.75 * 28;


// // CHALLENGE
// const dogs = [
//   { weight: 22, curFood: 250, owners: ["Alice", "Bob"] },
//   { weight: 8, curFood: 200, owners: ["Matilda"] },
//   { weight: 13, curFood: 275, owners: ["Sarah", "John", "Leo"] },
//   { weight: 18, curFood: 244, owners: ["Joe"] },
//   { weight: 32, curFood: 340, owners: ["Michael"] },
// ];
// // 1
// const Eachrecommended = dogs.forEach(
//   (dog) => (dog.recFood = Math.floor(dog.weight ** 0.75 * 28))
// );
// console.log(dogs);


// //2
// // const sarahDog = dogs.find((dog) =>
// //   dog.owners.includes("Sarah").recFood > dog.curFood
// //     ? console.log("eating too much")
// //     : console.log("eating too little")
// // );

// // console.log(sarahDog);

// // OR 


// const sarahDog = dogs.find((dog) =>
//   dog.owners.includes("Sarah")
// );

// console.log(`Sarah's dog eats too ${dogs.curFood > dogs.recFood ? 'Too much' : 'Too Little'}`);


// // 3
// const ownersTooMuch = dogs.filter(dog => dog.recFood < dog.curFood).flatMap(dog => dog.owners)
// console.log(ownersTooMuch)

// const ownersTooLittle = dogs.filter(dog => dog.recFood > dog.curFood).flatMap(dog => dog.owners)
// console.log(ownersTooLittle)

// // 4
// console.log(`${ownersTooMuch.join(' and ')}'s dog are eating too much`)
// console.log(`${ownersTooLittle.join(' and ')}'s dog are eating too little`)

// // 5
// const exactAmount = dogs.some(dog => dog.recFood === dog.curFood)
// console.log(exactAmount)

// // 6
// const checkEatingOkay = dog => dog.curFood < dog.recFood * 1.1 && dog.curFood > dog.recFood * 0.9
// const okayAmount = dogs.every(checkEatingOkay)
// console.log(okayAmount)

// // 7
// const dogEatingokay = dogs.filter(checkEatingOkay)
// console.log(dogEatingokay)

// // 8
// const dogsGroupedByPortion = Object.groupBy(dogs, dog =>{
//   if (dog.curFood > dog.recFood){
//     return 'too-much'
//   } else if(dog.curFood < dog.recFood){
//     return 'too-little'
//   } else{
//     return 'exact'
//   }

// })
// console.log(dogsGroupedByPortion)

// // 9
// const dogsGroupByOwners = Object.groupBy(dogs, dog => `${dog.owners.length}-owners`)
// console.log(dogsGroupByOwners)

// // 10

// const dogsSorted = dogs.toSorted((a, b) => a.recFood - b.recFood)
// console.log(dogsSorted)


// // Numbers, Dates, Intl, Timers


// console.log(Number('23'))
// console.log(+'23')

// Parsing
// console.log(Number.parseInt('30px', 10))
// console.log(Number.parseInt('223e23'))

// console.log(Number.parseFloat('2.5rem'))

// // check for NaN
// console.log(Number.isNaN(20))
// console.log(Number.isNaN(20 / 0))

// console.log(Number.isFinite(20))
// console.log(Number.isFinite('20'))
// console.log(Number.isFinite(+'20X'))

// console.log(Number.isInteger(23))
// console.log(Number.isInteger(23.0))
// console.log(Number.isInteger(23 / 0))

// console.log(Math.sqrt(25))
// console.log(25 ** (1/2))
// console.log(8 ** (1/3))

// console.log(Math.max(5, 18, 23, 11, 2))

// console.log(Math.PI * Number.parseFloat('10px') ** 2)
// console.log(Math.trunc(Math.random() * 6) + 1)

// Generate random numbers between a range 
// const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// console.log(randomInt(10, 20))
// console.log(randomInt(0, 3))

// //Rounding integers
// console.log(Math.trunc(23.3))

// console.log(Math.round(23.3))
// console.log(Math.round(23.9))

// console.log(Math.ceil(23.3))
// console.log(Math.ceil(23.7))

// console.log(Math.floor(-23.3))
// console.log(Math.trunc(-23.3))

// // Rounding Decimals
// console.log((2.7).toFixed(0))
// console.log((2.7).toFixed(3))
// console.log((2.345).toFixed(2))

// Remainder Operator
// console.log(5 % 2)
// console.log(8 % 3)

// const isEven = n => n % 2 === 0;
// console.log(isEven(8))
// console.log(isEven(23))


// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//     // 0, 2, 4, 6
//     if (i % 2 === 0) row.style.backgroundColor = 'orangered';
//     // 0, 3, 6, 9
//     if (i % 3 === 0) row.style.backgroundColor = 'blue';
//   });
// });

// Numeric Seperators

// const diameter = 287_260_000_000;
// console.log(diameter)


// // //Big Ints
// console.log(2 ** 53 - 1)
// console.log(398247923892479824n)
// console.log(BigInt(23982479))

// console.log(typeof 2n)

// // Dates and Time 
// const now = new Date()
// console.log(now)

// console.log(new Date('December 24, 2015'))
// console.log(new Date(2037, 10, 31))

// console.log(new Date(0))

// const future = new Date(2037, 10, 19, 15, 23)
// console.log(future)
// console.log(future.getFullYear())
// console.log(future.getMonth())
// console.log(future.getDate())
// console.log(future.toISOString())
// console.log(future.getTime())
// console.log(new Date(2142253380000))
// console.log(Date.now())


// const future = new Date(2037, 10, 19, 15, 23)
// console.log(+future)

// const daysPassed = (date1, date2) => (date2 - date1) /(1000 * 60 * 60 * 24)

// const days1 = daysPassed(new Date(2037, 3, 4), new Date(2037, 3, 14))
// console.log(days1)


// const num = 3672387.23
// const options = {
//   style: 'unit',
//   // unit: 'mile-per-hour',
//   unit: 'celsius',
//   currency: 'EUR'

// }

// console.log('US: ', new Intl.NumberFormat('en-US', options).format(num))
// console.log('Germany: ', new Intl.NumberFormat('de-DE', options).format(num))
// console.log('Syria: ', new Intl.NumberFormat('ar-SY', options).format(num))



// // SETTIMEOUT
// const ingredients = ['olives', 'spinach']
// const pizzaTimer = setTimeout((ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}`), 3000, ...ingredients )
// console.log('Waiting...')

// if(ingredients.includes('spinach')) clearTimeout(pizzaTimer)



// Set Interval
// setInterval(function(){
//   const now = new Date();
//   // console.log(now)
//   console.log(`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`)
// }, 1000)