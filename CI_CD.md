# CI/CD Pipeline github actions-digital ocean

We need to do a couple of things to be able to set up the CI/CD  pipeline, there are to blocks

> `Cloud machine configuration` that we need to have ready before start with the github actions

![Cloud machine](./docs/cloud_machine.svg)


> `Github actions set up` we need to save as secrets the cloud machine, next we add github actions to the repo in the Actions options and configure.


![Cloud machine](./docs/block_repo.svg)

# All together

> Everytime we psuh a change to main in this case, the pipeline is triggered


![Cloud machine](./docs/cicd.svg)