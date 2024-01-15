import { intro, outro, text, select, isCancel } from '@clack/prompts';
import moment from 'moment';
import {mkdir} from 'fs/promises';
import * as path from 'path';
import {exec} from 'child_process'

const TmpProjectsDirectory = '/home/nate/Documents/tmp'

async function app() {
	intro(`Hello Sir`);
	
	const ProjectName = await text({
		message: 'What is the project name?',
		placeholder: `tmp-${moment().format('DD-MM-YYYY_HH:mm')}`,
		defaultValue: `tmp-${moment().format('DD-MM-YYYY_HH:mm')}`
	})

	if (isCancel(ProjectName)) {
		abort('Project Name')
	}

	let ProjectPath = path.join(TmpProjectsDirectory, String(ProjectName))

	await mkdir(ProjectPath);

	process.chdir(ProjectPath);


	const projectType = await select({
		message: 'Pick a project type.',
		options: [
			{ value: 'none', label: 'Blank' },
			{ value: 'bun', label: 'Bun Project' },
			{ value: 'npm', label: 'Npm Project', hint: 'oh no' },
		],
	});

	if (isCancel(projectType)) {
		abort('Project Type')
	}

	switch (projectType) {
		case "bun":
			exec('bun init -y')
		break;
		case "npm":
			exec('npm init -y')
			const projectNpmType = await select({
				message: 'Module or Program.',
				options: [
					{ value: 'index', label: 'Module' },
					{ value: 'main', label: 'Program' },
				],
			});

			if (isCancel(projectNpmType)) {
				abort('Project Type')
			}

			exec(`touch ${projectNpmType}.js`)
		break;
		default:
			console.log('Doing Nothing')
	}

	exec(`code ${ProjectPath}`);
	
	outro(`Done and opening your New Project`);
}

function abort(step) {
	console.log(`Abort called on step: ${step}`);
	process.exit(0)
}

app();