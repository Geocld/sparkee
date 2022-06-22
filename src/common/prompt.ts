import inquirer, { ListChoiceOptions, Question } from 'inquirer'
import consola from 'consola'

export async function promptConfirm(message: string): Promise<boolean> {
  consola.pause()
  const answers = await inquirer.prompt([
    {
      type: 'expand',
      name: 'confirm',
      message,
      default: 2,
      choices: [
        { key: 'y', name: 'Yes', value: true },
        { key: 'n', name: 'No', value: false },
      ],
    },
  ])
  consola.resume()

  return answers.confirm;
}

export async function promptSelect(message: string, { choices } = {} as { choices: ListChoiceOptions[] }): Promise<string> {
  consola.pause()
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'prompt',
      message,
      choices
    },
  ])
  consola.resume()

  return answers.prompt;
}

export async function promptCheckbox(message: string, { choices } = {} as { choices: ListChoiceOptions[] }): Promise<string[]> {
  consola.pause()
  const answers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'prompt',
      message,
      choices
    },
  ])
  consola.resume()

  return answers.prompt;
}

export async function promptInput(message: string, initial: string = ''): Promise<string> {
  consola.pause()
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'prompt',
      message,
      default: initial
    },
  ])
  consola.resume()

  return answers.prompt;
}