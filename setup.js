/*
|-------------------------------------------------------------------------------
| NodeserverTS-installer Copyright © 2023 rvnrstnsyh All Rights Reserved
|-------------------------------------------------------------------------------
|
| Author    : Rivane Rasetiansyah <re@rvnrstnsyh.dev> (https://rvnrstnsyh.dev)
| GitHub    : https://github.com/rvnrstnsyh
| GitLab    : https://gitlab.com/rvnrstnsyh
|
*/
// eslint-disable-next-line
console.log('please wait...')
/**
 *  !-- VARIABLES
 *
 * @desc define the required variables
 */
import shell from 'child_process'

import { readFile, readFileSync, existsSync, writeFileSync, unlinkSync } from 'fs'

const args = []
process.argv.forEach(function (val, index, array) {
  args.push(val)
})

const packages = JSON.parse(readFileSync('./package.json', 'utf8'))
const managers = ['yarn', 'npm']
const deps = packages.dependencies
const depsLength = Object.keys(deps).length
const devDeps = packages.devDependencies
const devDepsLength = Object.keys(devDeps).length
const excludeDeps = ['ipfs-http-client', 'and-whatever']
const cerName = '_'
const sshKeygen = `ssh-keygen -t rsa -b 4096 -m PEM -f ${cerName}private.pem -N ""`
const openssl = `openssl rsa -in ${cerName}private.pem -pubout -outform PEM -out ${cerName}private.pem.pub`
const rename = `mv ${cerName}private.pem.pub ${cerName}public.pem`
const rs256 = `\n\t\t${sshKeygen} && \\\n\t\t${openssl} && \\\n\t\t${rename}`
const iteration = [0]
const flag = { flag: 'a' }
const tmpFile = './updater.tmp.sh'
const envFile = './.env'
const envFileExample = '.env.example'
/**
 *  !-- FILE CHECKER
 *
 * @desc check the existence of a file
 */
if (existsSync(tmpFile)) unlinkSync(tmpFile)
if (existsSync(`${cerName}public.pem`)) unlinkSync(`${cerName}public.pem`)
if (existsSync(`${cerName}private.pem`)) unlinkSync(`${cerName}private.pem`)
/**
 *  !-- TEMP FILE
 *
 * @desc create a file containing all package.json dependencies
 */
writeFileSync(tmpFile, '#!/bin/sh\n\n')
for (let i = 0; i < managers.length; i++) {
  //
  managers[i] === 'npm'
    ? writeFileSync(tmpFile, `${managers[i]}Install(){\n\t{\n\t\tnpm install \\\n\t\t\t\t`, flag)
    : writeFileSync(tmpFile, `${managers[i]}Install(){\n\t{\n\t\tyarn add \\\n\t\t\t\t`, flag)
  /**
   *  !-- DEPENDENCIES
   *
   * @desc ALL dependencies
   */
  for (const key in deps) {
    //
    if (excludeDeps.includes(key)) {
      // ? prevent updating to the latest version
      iteration[0] !== depsLength - 1
        ? writeFileSync(tmpFile, `${key}@${deps[key]} \\\n\t\t\t\t`, flag)
        : writeFileSync(tmpFile, `${key}@${deps[key]} && \\\n\n\t\t${managers[i]} ${managers[i] === 'npm' ? 'install' : 'add'} \\\n\t\t\t\t`, flag)
    } else {
      // ? update to the latest version
      iteration[0] !== depsLength - 1
        ? writeFileSync(tmpFile, `${key}@latest \\\n\t\t\t\t`, flag)
        : writeFileSync(tmpFile, `${key}@latest && \\\n\n\t\t${managers[i]} ${managers[i] === 'npm' ? 'install' : 'add'} \\\n\t\t\t\t`, flag)
    }
    iteration[0]++
  }
  iteration[0] = 0 // ? reset iteration for dev dependencies
  /**
   *  !-- DEV DEPENDENCIES
   *
   * @desc ALL DEV dependencies
   */
  for (const key in devDeps) {
    //
    if (excludeDeps.includes(key)) {
      // ? prevent updating to the latest version
      iteration[0] !== devDepsLength - 1
        ? writeFileSync(tmpFile, `${key}@${devDeps[key]} ${managers[i] === 'npm' ? '--save-dev' : '--dev'} \\\n\t\t\t\t`, flag)
        : writeFileSync(tmpFile, `${key}@${devDeps[key]} ${managers[i] === 'npm' ? '--save-dev' : '--dev'} && \\\n\n\t\t${rs256} && \\\n\t\trm -rf ./updater.tmp.sh\n\t}\n}\n\n`, flag)
    } else {
      // ? update to the latest version
      iteration[0] !== devDepsLength - 1
        ? writeFileSync(tmpFile, `${key}@latest ${managers[i] === 'npm' ? '--save-dev' : '--dev'} \\\n\t\t\t\t`, flag)
        : writeFileSync(tmpFile, `${key}@latest ${managers[i] === 'npm' ? '--save-dev' : '--dev'} && \\\n\n\t\t${rs256} && \\\n\t\trm -rf ./updater.tmp.sh\n\t}\n}\n\n`, flag)
    }
    iteration[0]++
  }
  iteration[0] = 0
}
writeFileSync(tmpFile, `${managers[0]}Install || ${managers[1]}Install\n`, flag)
/**
 *  !-- EXECUTE FILE
 *
 * @desc update to the latest version
 */
shell.execSync(`chmod u+x ${tmpFile} && bash ${tmpFile}`)
/**
 *  !-- ENVIRONMENT
 *
 * @desc sync and create new environment contents from .env.example file
 */

readFile(envFileExample, 'utf8', (error, data) => {
  //
  const env = {}
  const lines = data.split('\n')
  const alpha = /^[a-zA-Z]+$/

  for (let i = 0; i < lines.length - 1; i++) {
    //
    if (alpha.test(lines[i].substring(0, 1))) {
      //
      const parts = lines[i].split('=')
      env[parts[0].trim()] = parts.slice(1).join('=').trim()
      env[parts[0].trim()] = [`${i}+line+`].concat(parts[1].split('')).join('')
    }
  }

  const overrideEnv = {
    APP_URL: `http:127.0.0.1:${args[3]}`,
    APP_PORT: args[3]
  }

  for (const key in overrideEnv) env[key] = `${env[key].split('+line+')[0]}+line+${overrideEnv[key]}`
  if (existsSync(envFile)) unlinkSync(envFile)
  for (let i = 0; i < lines.length - 1; i++) {
    //
    if (!alpha.test(lines[i].substring(0, 1))) writeFileSync(envFile, `${lines[i]}\n`, flag)
    for (const key in env) if (parseInt(env[key].split('+line+')[0]) === i) writeFileSync(envFile, `${key}=${env[key].split('+line+')[1]}\n`, flag)
  }
})
