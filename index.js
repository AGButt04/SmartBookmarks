const inputBtn = document.getElementById("input-btn");
const deleteBtn = document.getElementById("delete-btn");
const inputEL = document.getElementById("input-el");
const ulEL = document.getElementById("ul-el");
const tabBtn = document.getElementById("tab-btn");
const searchInput = document.getElementById("search-input");
const storageKey = "myLeads";
let myLeads = JSON.parse(localStorage.getItem(storageKey)) || [];

getFromLocalStorage();

// 🔑 Call them once to attach event listeners
addListener();
deleteAllListener();
enableDeleteDelegation();
enableEditDelegation();
attachSearch();
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

function attachSearch() {
    if (!searchInput) return;

    searchInput.addEventListener("input", function() {
        const query = searchInput.value.trim().toLowerCase();
        items = ulEL.querySelectorAll("li");

        items.forEach(li => {
            const link = li.querySelector("a");
            if (!link) return;

            title = link.textContent.toLowerCase();
            url = (link.getAttribute("href") || "").toLowerCase();

            const match = title.includes(query) || url.includes(query);
            li.style.display =  match? "" : "None";
        });
    });
}

function enableDeleteDelegation() {
    ulEL.addEventListener("click", function(event) {
        if (event.target.classList.contains("single-delete-btn")) {
            let index = event.target.dataset.index;
            myLeads.splice(index, 1);
            saveToLocalStorage();
            render(myLeads);
        }
    });
}

function enableEditDelegation() {
    ulEL.addEventListener("click", function(event) {
        if (event.target.classList.contains("single-edit-btn")) {
            let index = event.target.dataset.index;
            let newTitle = prompt("Enter the new title", myLeads[index].title);
            if (newTitle !== null && newTitle.trim() !== "") {
                myLeads[index].title = newTitle.trim();
                saveToLocalStorage();
                render(myLeads);
            }
        }
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
                <div class="button-container">
                    <button data-index="${i}" class="single-delete-btn">Delete</button>
                    <button data-index="${i}" class="single-edit-btn">Edit</button>
                </div>

            </li>`;
    }
    ulEL.innerHTML = listItems;
}


function saveToLocalStorage() {
    localStorage.setItem(storageKey, JSON.stringify(myLeads));
}

function getFromLocalStorage() {
    if (myLeads) {
        render(myLeads);
    }
}
