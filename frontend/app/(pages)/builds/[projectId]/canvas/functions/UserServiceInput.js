
export function UserInput(storageKey,payload) { 



localStorage.setItem(storageKey, JSON.stringify(payload));


let serviceInput = JSON.parse(localStorage.getItem("service_input")) || [];


const index = serviceInput.findIndex(item => item.storageKey === storageKey);

if (index !== -1) {

  serviceInput[index] = { storageKey, ...payload };
} else {

  serviceInput.push({ storageKey, ...payload });
}


localStorage.setItem("service_input", JSON.stringify(serviceInput));
}