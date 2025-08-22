const inputBtn = document.getElementById("input-btn");
const deleteBtn = document.getElementById("delete-btn");
const inputEL = document.getElementById("input-el");
const ulEL = document.getElementById("ul-el");
const tabBtn = document.getElementById("tab-btn");
const storageKey = "myLeads";
let myLeads = JSON.parse(localStorage.getItem(storageKey)) || [];

getFromLocalStorage();

// 🔑 Call them once to attach event listeners
addListener();
deleteAllListener();
deleteSingleLink();
saveTab();

function saveTab() {
    tabBtn.addEventListener("click", function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            let activeTabUrl = {
                url: tabs[0].url,
                title: tabs[0].title
            };
            myLeads.push(activeTabUrl);
            saveToLocalStorage();
            render(myLeads);
        });
    });
}

function deleteSingleLink() {
    const deleteBtns = document.querySelectorAll(".single-delete-btn");
    deleteBtns.forEach(function(btn){
        btn.addEventListener("click", function() {
            let index = btn.dataset.index;
            myLeads.splice(index, 1);
            saveToLocalStorage();
            render(myLeads);
        });
    });
}

function deleteAllListener() {
    deleteBtn.addEventListener("dblclick", function() {
        const confirmation = confirm("Are you sure you want to delete all leads?");
        if (confirmation) {
            localStorage.removeItem(storageKey);
            myLeads = [];
            render(myLeads);
            alert("All stored leads have been deleted.");

        }
    });
}

function addListener() {
    inputBtn.addEventListener("click", function() {
        const value = inputEL.value.trim();
        if (!value) return;
        
        myLeads.push(value);
        inputEL.value = "";
        saveToLocalStorage();
        render(myLeads);
    });
}

function render(leadsArray) {
    let listItems = "";
    for (let i = 0; i < leadsArray.length; i++) {
        let lead = leadsArray[i];
        if (typeof lead === "string") {
            lead = {url: lead, title: lead};
        }
        const urlObj = new URL(lead.url);   // parses the URL
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}`;
        listItems += `
            <li>
                <div class="link-content">
                    <img src="${faviconUrl}" alt="Favicon">
                    <a target="_blank" href="${lead.url}">${lead.title}</a>
                </div>
                <button data-index="${i}" class="single-delete-btn">Delete</button>

            </li>`;
    }
    ulEL.innerHTML = listItems;
    deleteSingleLink(); // Reattach listeners after rendering
}


function saveToLocalStorage() {
    localStorage.setItem(storageKey, JSON.stringify(myLeads));
}

function getFromLocalStorage() {
    if (myLeads) {
        render(myLeads);
    }
}
