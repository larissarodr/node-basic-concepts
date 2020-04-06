const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

/**
 * GET /repositories: List all repos.
 */
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

/**
 * This route must receive title, url (github URL) and techs in the request body. 
 * The repository should be stored with the following format:
 * { id: "uuid", title: 'Desafio Node.js', techs: ["Node.js", "..."], likes: 0 }; 
 * The ID must be UUID, and likes must always start with 0.
 */
app.post("/repositories", (request, response) => {
  const { title, techs, url } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);
});

/**
 * PUT /repositories/:id: This route allows updating only the title, url and techs 
 * of the repo  * which ID matches the one sent in the URL.
 */
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if(repositoryIndex < 0){
    return response.status(400).json({ error: 'Repository not found.'});
  }
  
  const likes = repositories.find(repository => repository.id === id).likes;

  const repository = {
    id,
    title,
    url,
    techs,
    likes
  };

  repositories[repositoryIndex] = repository;
  
  return response.json(repository);
});

/**
 * DELETE /repositories/:id: This route must delete the repository matching the 
 * ID sent in the URL.
 */
app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    return res.status(400).json({ error: 'Repository not found.'});
  }

  repositories.splice(repositoryIndex, 1);

  return res.status(204).send();
});

/**
 * POST /repositories/:id/like: This route must increase the "likes" number by 1 
 * each and every time  * it's called. The repository to be updated must be the one 
 * which ID matches the ID sent in the URL.
 */
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if(repositoryIndex < 0){
    return response.status(400).json({ error: 'Repository not found.'});
  }

  repositories[repositoryIndex].likes = repositories[repositoryIndex].likes + 1;
  
  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
