const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const profileContainer = document.getElementById("profile-container");
const errorContainer = document.getElementById("error-container");
const avatar = document.getElementById("avatar");
const nameElement = document.getElementById("name");
const usernameElement = document.getElementById("username");
const bioElement = document.getElementById("bio");
const locationElement = document.getElementById("location");
const joinedDateElement = document.getElementById("joined-date");
const profileLink = document.getElementById("profile-link");
const followers = document.getElementById("followers");
const following = document.getElementById("following");
const repos = document.getElementById("repos");
const companyElement = document.getElementById("company");
const blogElement = document.getElementById("blog");
const twitterElement = document.getElementById("twitter");
const companyContainer = document.getElementById("company-container");
const blogContainer = document.getElementById("blog-container");
const twitterContainer = document.getElementById("twitter-container");
const reposContainer = document.getElementById("repos-container");
const reposTitle = document.getElementById("repos-title");
const loading = document.getElementById("loading");
const noRepoMsg = document.getElementById("no-repo-msg");

profileContainer.classList.add("hidden");
errorContainer.classList.add("hidden");

reposContainer.innerHTML = "";
if (loading) loading.classList.add("hidden");
if (noRepoMsg) noRepoMsg.classList.add("hidden");

if (reposContainer) reposContainer.classList.add("hidden");
if (reposTitle) reposTitle.classList.add("hidden");

searchBtn.addEventListener("click", searchUser);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchUser();
});

async function searchUser() {
  const username = searchInput.value.trim();
  if (!username) return alert("Please enter a username");

  profileContainer.classList.add("hidden");
  errorContainer.classList.add("hidden");
  if (noRepoMsg) noRepoMsg.classList.add("hidden");
  reposContainer.innerHTML = "";
  if (reposContainer) reposContainer.classList.remove("hidden");
  if (reposTitle) reposTitle.classList.remove("hidden");
  if (loading) loading.classList.remove("hidden");

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) throw new Error("User not found");
    const userData = await response.json();
    displayUserData(userData);
    fetchRepositories(userData.repos_url);
  } catch (error) {
    showError();
  }
}

async function fetchRepositories(reposUrl) {
  reposContainer.innerHTML = "";
  if (reposTitle) reposTitle.classList.remove("hidden");
  if (loading) loading.classList.remove("hidden");
  if (noRepoMsg) noRepoMsg.classList.add("hidden");

  try {
    const response = await fetch(reposUrl);
    if (!response.ok) throw new Error("Could not fetch repos");
    const reposData = await response.json();

    if (loading) loading.classList.add("hidden");

    if (!reposData.length) {
      if (noRepoMsg) noRepoMsg.classList.remove("hidden");
      return;
    }

    reposData.slice(0, 6).forEach((repo) => {
      const repoCard = document.createElement("div");
      repoCard.className =
        "bg-white/5 rounded-[10px] p-4 border border-white/10 transition-transform transition-bg duration-200 hover:-translate-y-1 hover:bg-white/10 flex flex-col mb-2";

      const repoName = document.createElement("a");
      repoName.href = repo.html_url;
      repoName.target = "_blank";
      repoName.className =
        "font-semibold mb-2 text-[#c4b5fd] hover:underline block text-base";
      repoName.textContent = repo.name;

      const desc = document.createElement("div");
      desc.className = "text-[#9ca3af] text-sm mb-3 min-h-[35px]";
      desc.textContent = repo.description || "No description available";

      const meta = document.createElement("div");
      meta.className = "flex gap-4 text-xs text-[#9ca3af] flex-wrap";

      if (repo.language) {
        const lang = document.createElement("span");
        lang.className = "flex items-center gap-1";
        lang.innerHTML = `<i class="fa-solid fa-code text-[#a78bfa]"></i> ${repo.language}`;
        meta.appendChild(lang);
      }

      const stars = document.createElement("span");
      stars.className = "flex items-center gap-1";
      stars.innerHTML = `<i class="fa-solid fa-star text-[#a78bfa]"></i> ${repo.stargazers_count}`;
      meta.appendChild(stars);

      const forks = document.createElement("span");
      forks.className = "flex items-center gap-1";
      forks.innerHTML = `<i class="fa-solid fa-code-fork text-[#a78bfa]"></i> ${repo.forks_count}`;
      meta.appendChild(forks);

      const created = document.createElement("span");
      created.textContent = formatDate(repo.created_at);
      meta.appendChild(created);

      repoCard.appendChild(repoName);
      repoCard.appendChild(desc);
      repoCard.appendChild(meta);
      reposContainer.appendChild(repoCard);
    });
  } catch {
    if (loading) loading.classList.add("hidden");
    if (noRepoMsg) noRepoMsg.classList.remove("hidden");
  }
}

function displayUserData(user) {
  avatar.src = user.avatar_url;
  nameElement.textContent = user.name || user.login;
  usernameElement.textContent = `@${user.login}`;
  bioElement.textContent = user.bio || "No bio available";
  locationElement.textContent = user.location || "Not specified";
  joinedDateElement.textContent = formatDate(user.created_at);
  profileLink.href = user.html_url;
  followers.textContent = user.followers;
  following.textContent = user.following;
  repos.textContent = user.public_repos;

  if (user.company) companyElement.textContent = user.company;
  else companyElement.textContent = "Not specified";

  if (user.blog) {
    blogElement.textContent = user.blog;
    blogElement.href = user.blog.startsWith("http") ? user.blog : `https://${user.blog}`;
  } else {
    blogElement.textContent = "No website";
    blogElement.href = "#";
  }
  blogContainer.style.display = "flex";

  if (user.twitter_username) {
    twitterElement.textContent = `@${user.twitter_username}`;
    twitterElement.href = `https://twitter.com/${user.twitter_username}`;
  } else {
    twitterElement.textContent = "No Twitter";
    twitterElement.href = "#";
  }
  twitterContainer.style.display = "flex";

  profileContainer.classList.remove("hidden");
}

function showError() {
  errorContainer.classList.remove("hidden");
  profileContainer.classList.add("hidden");
  if (loading) loading.classList.add("hidden");
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
