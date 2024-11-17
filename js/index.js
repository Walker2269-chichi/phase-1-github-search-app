document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("github-form");
    const searchInput = document.getElementById("search");
    const resultsContainer = document.getElementById("results");
    let searchType = "users"; // Default search type
  
    const baseUrl = "https://api.github.com";
  
    // Dynamically add the toggle button to the form
    const searchTypeToggle = document.createElement("button");
    searchTypeToggle.id = "toggle-search-type";
    searchTypeToggle.textContent = "Search Repos"; // Initial text
    searchForm.appendChild(searchTypeToggle);
  
    // Event listener for form submission
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const query = searchInput.value.trim();
  
      if (query) {
        if (searchType === "users") {
          searchUsers(query);
        } else if (searchType === "repos") {
          searchRepos(query);
        }
      }
    });
  
    // Toggle search type
    searchTypeToggle.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent form submission on button click
      searchType = searchType === "users" ? "repos" : "users";
      searchTypeToggle.textContent =
        searchType === "users" ? "Search Repos" : "Search Users";
      searchInput.placeholder =
        searchType === "users" ? "Search for users..." : "Search for repositories...";
    });
  
    // Search GitHub users
    function searchUsers(query) {
      const url = `${baseUrl}/search/users?q=${query}`;
  
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          resultsContainer.innerHTML = ""; // Clear previous results
          data.items.forEach((user) => renderUser(user));
        })
        .catch((error) => console.error("Error fetching users:", error));
    }
  
    // Render a user card
    function renderUser(user) {
      const userCard = document.createElement("div");
      userCard.classList.add("user-card");
  
      userCard.innerHTML = `
        <img src="${user.avatar_url}" alt="${user.login}" class="avatar" />
        <h3>${user.login}</h3>
        <a href="${user.html_url}" target="_blank">View Profile</a>
      `;
  
      userCard.addEventListener("click", () => {
        fetchUserRepos(user.login);
      });
  
      resultsContainer.appendChild(userCard);
    }
  
    // Fetch user repositories
    function fetchUserRepos(username) {
      const url = `${baseUrl}/users/${username}/repos`;
  
      fetch(url)
        .then((response) => response.json())
        .then((repos) => {
          resultsContainer.innerHTML = `<h2>${username}'s Repositories</h2>`;
          repos.forEach((repo) => renderRepo(repo));
        })
        .catch((error) => console.error("Error fetching repositories:", error));
    }
  
    // Render a repository
    function renderRepo(repo) {
      const repoItem = document.createElement("div");
      repoItem.classList.add("repo-item");
  
      repoItem.innerHTML = `
        <h4><a href="${repo.html_url}" target="_blank">${repo.name}</a></h4>
        <p>${repo.description || "No description provided."}</p>
      `;
  
      resultsContainer.appendChild(repoItem);
    }
  
    // Search GitHub repositories
    function searchRepos(query) {
      const url = `${baseUrl}/search/repositories?q=${query}`;
  
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          resultsContainer.innerHTML = `<h2>Repositories Matching "${query}"</h2>`;
          data.items.forEach((repo) => renderRepo(repo));
        })
        .catch((error) => console.error("Error fetching repositories:", error));
    }
  });
  