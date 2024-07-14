document.addEventListener('DOMContentLoaded', () => {
    const githubForm = document.getElementById('github-form');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
  
    githubForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const searchInput = document.getElementById('search').value.trim();
  
      if (!searchInput) {
        alert('Please enter a GitHub username.');
        return;
      }
  
      try {
        // Fetch user data
        const userData = await fetchUserData(searchInput);
        displayUserData(userData);
  
      } catch (error) {
        console.error('Error fetching user data:', error);
        alert('Failed to fetch GitHub user data. Please try again.');
      }
    });
  
    async function fetchUserData(username) {
      const response = await fetch(`https://api.github.com/search/users?q=${username}`, {
        headers: {
          Accept: 'application/vnd.github.v3+json'
        }
      });
      const data = await response.json();
      return data.items; // Return array of user items
    }
  
    function displayUserData(users) {
      // Clear previous results
      userList.innerHTML = '';
  
      // Create list items for each user
      users.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = `
          <div>
            <img src="${user.avatar_url}" alt="${user.login}" style="width: 50px; height: 50px;">
            <span>${user.login}</span>
            <a href="${user.html_url}" target="_blank">Profile</a>
          </div>
        `;
        li.addEventListener('click', async () => {
          try {
            // Fetch repositories for the clicked user
            const reposData = await fetchUserRepositories(user.login);
            displayUserRepositories(reposData);
          } catch (error) {
            console.error('Error fetching repositories:', error);
            alert('Failed to fetch GitHub repositories. Please try again.');
          }
        });
        userList.appendChild(li);
      });
    }
  
    async function fetchUserRepositories(username) {
      const response = await fetch(`https://api.github.com/users/${username}/repos`, {
        headers: {
          Accept: 'application/vnd.github.v3+json'
        }
      });
      const data = await response.json();
      return data; // Return array of repositories
    }
  
    function displayUserRepositories(repos) {
      // Clear previous results
      reposList.innerHTML = '';
  
      // Create list items for each repository
      repos.forEach(repo => {
        const li = document.createElement('li');
        li.textContent = repo.full_name; // Display repository full name
        reposList.appendChild(li);
      });
    }
  });
  