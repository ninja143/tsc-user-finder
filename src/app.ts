
const getUsername = document.querySelector('#user') as HTMLInputElement;
const formSubmit  = document.querySelector('#form') as HTMLFormElement;
const main_container = document.querySelector('.main_container')as HTMLElement;
const thirdPartyUrl = "https:api.github.com/users";
// Lets define the contract 
interface UserData {
    id: number;
    login: string;
    avatar_url: string;
    location: string;
    url: string
}

const showResultUI = (singleUser: UserData ) => {
    const {avatar_url, login, url, location, id} = singleUser;
    main_container.insertAdjacentHTML(
        "beforeend",
        `<div class="card">
            <img src="${avatar_url}" alt="${login}" />
            <hr />
            <div class="card-footer">
                <img src="${avatar_url}" alt="${login}" />
                <a href="${url}"> <i>${login}</i> - Github </a> 
            </div>
        </div>
        `
    );
}
// Reusable 
async function myCustomFetcher<T>(url: string, option?: RequestInit): Promise<T> {
    const response = await fetch(url, option) ;

    if(!response.ok) {
        throw new Error(`Network response was not ok - status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Found Result : ", result.length);
    return result;
}


// default method calling anyhow 
const fetchUserData = (url: string) => {
    myCustomFetcher<UserData[]>(url, {})
    .then((usrInfo) => {
        for(const singleUser of usrInfo) {
            // console.log("Login : ", singleUser.login)
            showResultUI(singleUser);
        }
    })
}

// Calling function 
fetchUserData(thirdPartyUrl);


formSubmit.addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchTerm = getUsername.value.toLowerCase();
    try {
        const url = thirdPartyUrl;
        const allUserData = await myCustomFetcher<UserData[]>(url, {});
        const matchedUsers = allUserData.filter((user) => {
            return user.login.toLowerCase().includes(searchTerm);
        });
        console.log(matchedUsers.length);
        
        main_container.innerHTML = "";

        if(matchedUsers.length === 0) {
            main_container.insertAdjacentHTML(
                "beforeend",
                `<p class="empty_message">No matching found.</p>`
            )
        } else {
            for(const userRecord of matchedUsers) {
                // console.log("Login : ", singleUser.login)
                showResultUI(userRecord);
            }
        }
    } catch (error) {
        console.log("error : ", error)
    }
})