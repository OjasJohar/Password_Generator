const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateB");
const allCheckBok=document.querySelectorAll("input[type=checkbox]");
const symbols='!@#$%^&*(){}:"<>?_+~/|][';

let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
setIndicator("#ccc");

function handleSlider(){
    //setPasswordlength
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
}

function getRndInteger(min , max){
   return Math.floor(Math.random()*(max-min))+min;
}

function generateRndNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbols(){
    const randNum =getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;

    if(hasUpper && hasLower && (hasNum || hasSym)&& passwordLength>= 8){
        setIndicator("#0f0");
    }else if(
        (hasLower || hasUpper)&&
        (hasNum || hasSym)&&
        passwordLength>=6
    ){
        setIndicator("#ff0");
    }else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="failed";
    }
    //to make copy span visible
    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}

function shufflepassword(array){
    //fisher yates method
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}

function handlecheckBoxChange(){
    checkCount=0;
    allCheckBok.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    });
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

allCheckBok.forEach((CheckBok)=>{
    CheckBok.addEventListener('change',handlecheckBoxChange)
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
        copyContent();    
})

generateBtn.addEventListener('click',()=>{
    if(checkCount<=0)return;

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    password="";

//    if(uppercaseCheck.checked){
//        password += generateUpperCase();
//    }
//    if(lowercaseCheck.checked){
//        password += generateLowerCase();
//    }
//    if(numbersCheck.checked){
//        password += generateRndNumber();
//    }
//    if(symbolsCheck.checked){
//        password += generateSymbols();
//    }

    let funArr=[];
    if(uppercaseCheck.checked)
        funArr.push(generateUpperCase);
    if(lowercaseCheck.checked)
        funArr.push(generateLowerCase);
    if(numbersCheck.checked)
        funArr.push(generateRndNumber);
    if(symbolsCheck.checked)
        funArr.push(generateSymbols);

    for(let i=0;i<funArr.length;i++){
        password+=funArr[i]();
    }
    for(let i=0;i<passwordLength-funArr.length;i++){
        let randIndex= getRndInteger(0,funArr.length);
        password+= funArr[randIndex]();
    }

    password=shufflepassword(Array.from(password));
    passwordDisplay.value=password;
    calcStrength();

});