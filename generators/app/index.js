'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');

module.exports = class extends Generator {
  prompting() {
    this.log(
      yosay(`Welcome to the impeccable ${chalk.red('generator-nestjs-wtx')} generator!`)
    );

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Enter a name for your app',
        default: 'nestjs-app'
      },
      {
        type: 'input',
        name: 'path',
        message: 'Enter a destination path for your app',
        default: '.'
      },
      {
        type: 'list',
        name: 'manager',
        message: 'What package manager you want to use?',
        choices: [
          {
            name: 'npm',
            value: 'npm'
          },
          {
            name: 'yarn',
            value: 'yarn'
          },
          {
            name: 'bower',
            value: 'bower'
          },
          {
            name: 'Skip installing dependencies',
            value: 'skip'
          }
        ]
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  writing() {
    this.fs.copy(this.templatePath() + '/example-app/**/*', path.resolve(this.destinationPath(), this.props.path));
  }

  install() {
    if (this.props.manager !== 'skip') {
      const options = {
        npm: true,
        yarn: false,
        bower: false
      };
      options[this.props.manager] = true;
      this.spawnCommand(this.props.manager, ["install"], {
        cwd: path.resolve(this.destinationPath(), this.props.path)
      });
    }
    this.log(yosay(`Your template was generated! Have fun!`));
  }
};
