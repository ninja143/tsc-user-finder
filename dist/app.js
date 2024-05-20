"use strict";
const getUsername = document.querySelector('#user');
const formSubmit = document.querySelector('#form');
const main_container = document.querySelector('.main_container');
const thirdPartyUrl = "https:api.github.com/users";
const showResultUI = (singleUser) => {
    const { avatar_url, login, url, location, id } = singleUser;
    main_container.insertAdjacentHTML("beforeend", `<div class="card">
            <img src="${avatar_url}" alt="${login}" />
            <hr />
            <div class="card-footer">
                <img src="${avatar_url}" alt="${login}" />
                <a href="${url}"> <i>${login}</i> - Github </a> 
            </div>
        </div>
        `);
};
// Reusable 
async function myCustomFetcher(url, option) {
    const response = await fetch(url, option);
    if (!response.ok) {
        throw new Error(`Network response was not ok - status: ${response.status}`);
    }
    const result = await response.json();
    console.log("Found Result : ", result.length);
    return result;
}
// default method calling anyhow 
const fetchUserData = (url) => {
    myCustomFetcher(url, {})
        .then((usrInfo) => {
        for (const singleUser of usrInfo) {
            // console.log("Login : ", singleUser.login)
            showResultUI(singleUser);
        }
    });
};
// Calling function 
fetchUserData(thirdPartyUrl);
formSubmit.addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchTerm = getUsername.value.toLowerCase();
    try {
        const url = thirdPartyUrl;
        const allUserData = await myCustomFetcher(url, {});
        const matchedUsers = allUserData.filter((user) => {
            return user.login.toLowerCase().includes(searchTerm);
        });
        console.log(matchedUsers.length);
        main_container.innerHTML = "";
        if (matchedUsers.length === 0) {
            main_container.insertAdjacentHTML("beforeend", `<p class="empty_message">No matching found.</p>`);
        }
        else {
            for (const userRecord of matchedUsers) {
                // console.log("Login : ", singleUser.login)
                showResultUI(userRecord);
            }
        }
    }
    catch (error) {
        console.log("error : ", error);
    }
});
