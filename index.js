const inputBtn = document.getElementById("input-btn");
const deleteBtn = document.getElementById("delete-btn");
const inputEL = document.getElementById("input-el");
const ulEL = document.getElementById("ul-el");
const tabBtn = document.getElementById("tab-btn");

let myLeads = [];
const leads = JSON.parse(localStorage.getItem("myLeads"));

getFromLocalStorage();

// 🔑 Call them once to attach event listeners
addListener();
deleteListener();
saveTab();

function saveTab() {
    tabBtn.addEventListener("click", function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            let activeTabUrl = tabs[0].url;
            myLeads.push(activeTabUrl);
            saveToLocalStorage();
            render(myLeads);
        });
    });
}

function deleteListener() {
    deleteBtn.addEventListener("dblclick", function() {
        localStorage.clear();
        myLeads = [];
        render(myLeads);
    });
}

function addListener() {
    inputBtn.addEventListener("click", function() {
        myLeads.push(inputEL.value);
        inputEL.value = "";
        saveToLocalStorage();
        render(myLeads);
    });
}

function render(leadsArray) {
    let listItems = "";
    for (let i = 0; i < leadsArray.length; i++) {
        const urlObj = new URL(leadsArray[i]);   // parses the URL
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}`;
        console.log("Rendering:", leadsArray[i], faviconUrl); // Debug log
        listItems += `
            <li>
                <img src="${faviconUrl}" width="16" height="16">
                <a target="_blank" href="${urlObj.href}">${urlObj.hostname}</a>
            </li>`;
    }
    ulEL.innerHTML = listItems;
}


function saveToLocalStorage() {
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
}

function getFromLocalStorage() {
    if (leads) {
        myLeads = leads;
        render(myLeads);
    }
}

// function renderLeads() {
//     ulEL.innerHTML = "Elements: ";
//     for (let i = 0; i < myLeads.length; i++) {
//         ulEL.innerHTML += "<li>" + myLeads[i] + "</li>";
//     }
//     // Alternative method
//     // const li = document.createElement("li");
//     // li.textContent = myLeads[i];
//     // ulEL.appendChild(li);
// }

// localStorage.setItem("myLeads", "AGButt04");
// let names = localStorage.getItem("myLeads");
// console.log(names);
// localStorage.clear(); // Uncomment to clear local storage
