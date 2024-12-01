const axios = require("axios");

const checkGitHubRepo = async (repoName) => {
  try {
    const response = await axios.get(`https://api.github.com/repos/${repoName}`);
    const repoData = response.data;
    
    return {
      name: repoData.name,
      description: repoData.description,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      url: repoData.html_url
    };
  } catch (error) {
    console.error("Error checking GitHub repository:", error);
    return null;
  }
};

// Example usage
const repoName = "https://github.com/abbybots141/Queen luckily V1";
checkGitHubRepo(repoName).then((repoInfo) => {
  if (repoInfo) {
    console.log("Repository Name:", repoInfo.name);
    console.log("Description:", repoInfo.description);
    console.log("Stars:", repoInfo.stars);
    console.log("Forks:", repoInfo.forks);
    console.log("URL:", repoInfo.url);
  } else {
    console.log("Repository not found or error occurred.");
  }
});
```