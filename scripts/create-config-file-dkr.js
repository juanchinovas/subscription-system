const yamlLib = require("yaml");
const envLoader = require("dotenv");
const nodeYml = require("node-yaml-config");
const configTemplate = require("./templates/config-service.json");
const configMap = require("./templates/env-key.map.json");
const fs = require("fs");
const lodash = require("lodash");

const [service, env] = process.argv.slice(2);
if (!service || !env) {
    console.log("Service path no provide");
    process.exit(1);
}

const cpw = process.cwd();
const envs = envLoader.parse(fs.readFileSync(`${cpw}/.env`));
if (!envs) {
    console.log(".env file not found");
    process.exit(1);
}

console.log("service: ", service, "target env: ", env);
console.log("cwd: ", process.cwd());

const serviceConfigPath = `${cpw}/packages/${service}/config`;
const serviceDevConfigFile = nodeYml.load(`${serviceConfigPath}/development-config.yml`);
const keysNeeded = Object.keys(serviceDevConfigFile);
console.log("Collection keys ...");
const newConfig = keysNeeded.reduce((config, key) => {
    return lodash.merge(
        serviceDevConfigFile,
        {
            [key]: configTemplate[key]
        },
        config
    );
}, {});

for (const key in configMap) {
    if (Object.hasOwnProperty.call(configMap, key)) {
        const configPath = key.split(".");
        const found = getParantObject(configPath, newConfig);
        if (found && typeof configMap[key] === 'string') {
            found[configPath.pop()] = envs[configMap[key]];
        }
    }
}

function getParantObject(keyPath, fromObject) {
    if (keyPath.length > 2) {
        let obj = {}
        for (let i = 0, len = keyPath.length - 1; i < len; i++) {
            obj = fromObject?.[keyPath[i]];
        }
        return obj;
    }

    return fromObject?.[keyPath[0]];
}

// avoid docker and dev port collide
if(newConfig.server.port) {
    newConfig.server.port += 2;
}

const fileName = `${serviceConfigPath}/${env}-config.yml`;

fs.writeFileSync(
    fileName,
    yamlLib.stringify({default: newConfig}),
    {
        encoding: "utf-8",
        flag: "w+"
    }
);

console.log("File: ", fileName, "Generated");