const fs = require('fs');
const core = require('@actions/core');
const { context } = require('@actions/github');
const { Octokit } = require('@octokit/rest');

const jsonPath = core.getInput('input-file');
const token = core.getInput('repo-token');

const github = new Octokit({ auth: token });
const { owner, repo } = context.repo;
console.log(`owner: ${owner}, repo: ${repo}`)

async function getRepoDescription(owner, repo) {
  console.log(`Getting description for Repo: ${repo}`);
  const response = await github.request("GET /repos/{owner}/{repo}", {
    owner,
    repo
  });
  const { description } = response.data;
  console.log(response)
  console.log(`description: ${description}`)
  return description;
}
function getManifestDescription() {
  console.log(`Getting description from manifest: ${jsonPath}`);
  try {
    const repoJSONProps = JSON.parse(fs.readFileSync(jsonPath));
    const jsonDescription = repoJSONProps.description;
    console.log(`jsonDescription: ${jsonDescription}`)
    return jsonDescription;
  } catch (e) {
  }
}
  async function updateRepoDescription(owner, repo) {
    try {
      const description = getManifestDescription()
      const response = await github.request('PATCH /repos/{owner}/{repo}', {
        owner,
        repo,
        description
      });

    } catch (e) {
      console.log(e.message)
    }
  }

  function checkIfEmptyDescription(description) {
    console.log(`Checking if the description has been defined`)
    console.log(`description: ${description}`)
    const isEmpty = (description == null)
    console.log(`isEmpty: ${isEmpty}`)
    return isEmpty;
  }
async function checkAndUpdateDescription(owner, repo) {
    console.log(`Attempting to update description for ${repo}`)
    try {
      const repoDescription = getRepoDescription(owner, repo);
      if (!checkIfEmptyDescription(repoDescription)) {
        console.log(`Update ${repo} description: ${repoDescription}`);
        updateRepoDescription(owner, repo);
        }
    } catch (e) {
      console.log(e.message)
    }
  }

checkAndUpdateDescription(owner, repo)
