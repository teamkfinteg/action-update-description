const fs = require('fs');
const core = require('@actions/core');
const { context } = require('@actions/github');
const { Octokit } = require('@octokit/rest');

const jsonPath = core.getInput('input-file');
const token = core.getInput('repo-token');

const github = new Octokit({ auth: token });
const { owner, repo } = context.repo;
async function getRepoDescription(owner, repo) {
  console.log(`Getting description for Repo: ${repo}`);
  const { data } = await github.repos.get({
    owner,
    repo
  });

  description = data.description
  console.log(`Repo Description: ${description}`)
  return description;
}

function getManifestDescription() {
  console.log(`Getting description from manifest file: ${jsonPath}`);
  try {
    const repoJSONProps = JSON.parse(fs.readFileSync(jsonPath));
    const jsonDescription = repoJSONProps.description;
    return jsonDescription;
  } catch (e) {
    console.log(e.message)
  }
}

async function updateRepoDescription(owner, repo, description) {
  try {
    const response = await github.request('PATCH /repos/{owner}/{repo}', {
      owner,
      repo,
      description
    });

  } catch (e) {
    console.log(e.message)
  }
}
function main() {
  jsonDescription = getManifestDescription()
  repoDescription = getRepoDescription(owner, repo)
    .then((repoDescription) => {
      if (repoDescription == null) {
        console.log(`Updating description to ${jsonDescription}`)
        updateRepoDescription(owner, repo, jsonDescription)
      }
    })
}

main()
