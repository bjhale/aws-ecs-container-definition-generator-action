import core from '@actions/core';
import process from 'process';
import yaml from 'yaml';
import fs from 'fs';
import crypto from 'crypto';

let containerDefinition = {};

const name = core.getInput('name');
if(name) {
  containerDefinition.name = name;
}

const image = core.getInput('image');
if(image) {
  containerDefinition.image = image;
}

const portMappings = core.getInput('port_mappings');
if(portMappings) {
  containerDefinition.portMappings = yaml.parse(portMappings);
}

const environment = core.getInput('environment');
if(environment) {
  containerDefinition.environment = yaml.parse(environment);
}

const mountPoints = core.getInput('mount_points');
if(mountPoints) {
  containerDefinition.mountPoints = yaml.parse(mountPoints);
}

const logConfiguration = core.getInput('log_configuration');
if(logConfiguration) {
  containerDefinition.logConfiguration = yaml.parse(logConfiguration);
}

const dockerLabels = core.getInput('docker_labels');
if(dockerLabels) {
  containerDefinition.dockerLabels = yaml.parse(dockerLabels);
}

const linuxParameters = core.getInput('linux_parameters');
if(linuxParameters) {
  containerDefinition.linuxParameters = yaml.parse(linuxParameters);
}

console.log("Container Definition: ", JSON.stringify(containerDefinition, null, 2));

core.setOutput('container_definition_raw', JSON.stringify(containerDefinition));

const tempDirectory = process.env['RUNNER_TEMP'];
const hash = crypto.createHash('sha256').update(JSON.stringify(containerDefinition)).digest('hex').substring(0,7);
const filename = `container-definition-${hash}.json`;

const filePath = `${tempDirectory}/${filename}`;

fs.writeFileSync(filePath, JSON.stringify(containerDefinition, null, 2));

core.setOutput('container_definition', filePath);
