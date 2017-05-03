const fetch = require('node-fetch');
const Bluebird = require('bluebird');
Symbol.asyncIterator = Symbol.asyncIterator || Symbol("asyncIterator");

// With normal promises
function getGitHubUser(handle) {
  const url = `https://api.github.com/users/${handle}`;
  fetch(url)
    .then(response => response.json())
    .then(user => {
      console.log(`::function::getGitHubUser::${user.name}`);
    })
}

// with async - function declaration
async function getGitHubUserAsync(handle) {
  const url = `https://api.github.com/users/${handle}`;
  const response = await fetch(url);
  return await response.json();
}

// with async - function expression
const getGitHubUserAsync2 = async (handle) => { // const getGitHubUserAsync2 = async function(handle) {}
  const url = `https://api.github.com/users/${handle}`;
  const response = await fetch(url);
  return await response.json();
}

// use of async class method
class GitHubNameExtractor {
  async fetchUser(handle) {
    const url = `https://api.github.com/users/${handle}`;
    const response = await fetch(url);
    return await response.json();
  }
}

// with async - function declaration error handling
async function getGitHubUserAsyncErrorHandle(handle) {
  const url = `https://api.github.com/users/${handle}`;
  const response = await fetch(url);
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message);
  }

  return body;
}

getGitHubUser('pathumathukorala');

getGitHubUserAsync('pathumathukorala')
  .then(user => {
    console.log(`::function::getGitHubUserAsync::${user.name}`);
  });

getGitHubUserAsync2('pathumathukorala')
  .then(user => {
    console.log(`::function::getGitHubUserAsync2::${user.name}`);
  });

// with IIFE pattern
(async () => { // or (async function() {})();
  const user = await getGitHubUserAsync('pathumathukorala');
  console.log(`::pattern::IIFE::${user.name}`);
})();

// with IIFE pattern + async class method
(async () => { // or (async function() {})();
  const client = new GitHubNameExtractor();
  const user = await client.fetchUser('pathumathukorala');
  console.log(`::pattern::IIFE with JS classes::${user.name}`);
})();

// Error handling
getGitHubUserAsyncErrorHandle('idonotexist22222')
  .then(user => {
    console.log(user.name);
  })
  .catch(err => {
    console.error(`::Error:: ${err.message}`);
  });

// Using try catch blocks to handle errors
async function fetchUser(handle) {
  try {
    const user = await getGitHubUserAsyncErrorHandle(handle);
    console.log(`::success case of try-catch::${user.name}`);
  }
  catch(err) {
    console.error(`::Error from try-catch:: ${err.message}`);
  }
}

fetchUser('idonotexist22222'); // error case
fetchUser('pathumathukorala'); // success case

// await multiple promises sequentially or concurrently
async function fetchFromGitHub(endpoint) {
  const url = `https://api.github.com/${endpoint}`;
  const response = await fetch(url);
  return await response.json();
}

async function showUserAndRepos(handle) {
  //sequential
  const user = await fetchFromGitHub(`/users/${handle}`);
  const repos = await fetchFromGitHub(`/users/${handle}/repos`);

  console.log(user.name);
  console.log(repos.length);

  // concurrent
  const userPromise = fetchFromGitHub(`/users/${handle}`);
  const reposPromise = fetchFromGitHub(`/users/${handle}/repos`);

  const user2 = await userPromise;
  const repos2 = await reposPromise;

  console.log(user2.name);
  console.log(repos2.length);

  // concurrency with Promise.all and destructuring
  const [ user3, repos3 ] = await Promise.all([
    fetchFromGitHub(`/users/${handle}`),
    fetchFromGitHub(`/users/${handle}/repos`)
  ]);

  console.log(user3.name);
  console.log(repos3.length);
}

showUserAndRepos('pathumathukorala');

// use of await operator with any Thenable
async function main() {
  console.log('Working...');
  await Bluebird.delay(2000); // Its like having-> await Promise.resolve(Bluebird.delay(2000))
  console.log('Done');
}

main();
