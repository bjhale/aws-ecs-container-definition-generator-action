import core from '@actions/core';
import process from 'process';
import yaml from 'yaml';
import fs from 'fs';
import crypto from 'crypto';
import ini from 'ini';

let containerDefinition = {};

const containerDefinitionRaw = core.getInput('containerDefinitionRaw');
if(containerDefinitionRaw) {
  containerDefinition = yaml.parse(containerDefinitionRaw);
}

const name = core.getInput('name');
if(name) {
  containerDefinition.name = name;
}

const image = core.getInput('image');
if(image) {
  containerDefinition.image = image;
}

const cpu = core.getInput('cpu');
if(cpu) {
  containerDefinition.cpu = parseInt(cpu);
}

const memory = core.getInput('memory');
if(memory) {
  containerDefinition.memory = parseInt(memory);
}

const memoryReservation = core.getInput('memoryReservation');
if(memoryReservation) {
  containerDefinition.memoryReservation = parseInt(memoryReservation);
}

const links = core.getInput('links');
if(links) {
  containerDefinition.links = yaml.parse(links);
}

const portMappings = core.getInput('portMappings');
if(portMappings) {
  containerDefinition.portMappings = yaml.parse(portMappings);
}

const entryPoint = core.getInput('entryPoint');
if(entryPoint) {
  containerDefinition.entryPoint = yaml.parse(entryPoint);
}

//Command
const command = core.getInput('command');
if(command) {
  containerDefinition.command = yaml.parse(command);
}

//Environment
containerDefinition.environment = [];
const environment = core.getInput('environment');
if(environment) {
  const env = ini.parse(environment);

  for (const [key, value] of Object.entries(env)) {
    containerDefinition.environment.push({
      name: key,
      value: typeof value != "string" ? value.toString() : value
    });
  }
}
const environmentYaml = core.getInput('environment_yaml');
if(environmentYaml) {
  containerDefinition.environment = [...containerDefinition.environment, ...yaml.parse(environmentYaml)]
}

const mountPoints = core.getInput('mountPoints');
if(mountPoints) {
  containerDefinition.mountPoints = yaml.parse(mountPoints);
}

const logConfiguration = core.getInput('logConfiguration');
if(logConfiguration) {
  containerDefinition.logConfiguration = yaml.parse(logConfiguration);
}

const dockerLabels = core.getInput('dockerLabels');
if(dockerLabels) {
  containerDefinition.dockerLabels = yaml.parse(dockerLabels);
}

const linuxParameters = core.getInput('linuxParameters');
if(linuxParameters) {
  containerDefinition.linuxParameters = yaml.parse(linuxParameters);
}

const dependsOn = core.getInput('dependsOn');
if(dependsOn) {
  containerDefinition.dependsOn = yaml.parse(dependsOn);
}

const healthCheck = core.getInput('healthCheck');
if(healthCheck) {
  containerDefinition.healthCheck = yaml.parse(healthCheck);
}

console.log("Container Definition: ", JSON.stringify(containerDefinition, null, 2));

core.setOutput('container_definition_raw', JSON.stringify(containerDefinition));

const tempDirectory = process.env['RUNNER_TEMP'];
const hash = crypto.createHash('sha256').update(JSON.stringify(containerDefinition)).digest('hex').substring(0,7);
const filename = `container-definition-${hash}.json`;
const filePath = `${tempDirectory}/${filename}`;

fs.writeFileSync(filePath, JSON.stringify(containerDefinition, null, 2));

core.setOutput('container_definition', filePath);
