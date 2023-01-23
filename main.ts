import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs"
import { readdir,  } from "node:fs/promises"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { load } from "js-yaml"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const outputPath = join(__dirname, 'dist/actions');
const actionsPath = join(__dirname, 'actions');

if (!existsSync(outputPath)) mkdirSync(outputPath, { recursive: true });

const actionFiles = await readdir(actionsPath)
actionFiles.forEach(file => {
    const inputFilePath = join(actionsPath, file)
    const outputFilePath = join(outputPath, file.replace('.yaml', '.json'))
    const action = load(readFileSync(inputFilePath, 'utf8')) as any;
    const fileName = file.split(".")[0]
    if (action.spec.slug == null) {
        action.spec = {
            ...action.spec,
            slug: fileName
        }
    }
    writeFileSync(outputFilePath, JSON.stringify(action));
});
