import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs"
import { readdir, copyFile } from "node:fs/promises"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { load } from "js-yaml"
import { generateImages } from 'pwa-asset-generator'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const outputPath = join(__dirname, 'dist/actions');
const actionsPath = join(__dirname, 'actions');
const nodeModulesPath = join(__dirname, 'node_modules');

if (!existsSync(outputPath)) mkdirSync(outputPath, { recursive: true });

const actionFiles = await readdir(actionsPath)
actionFiles
    .filter(file => !file.startsWith("_template"))
    .forEach(async actionFile => {
        const action = load(readFileSync(join(actionsPath, actionFile), 'utf8')) as any;
        if (!actionFile.startsWith(action.spec.slug)) {
            throw new Error("action slug and file name (without extension) must be equal")
        }
        const outputActionPath = join(outputPath, action.spec.slug)
        if (!existsSync(outputActionPath)) mkdirSync(outputActionPath, { recursive: true });
        writeFileSync(join(outputActionPath, "action.json"), JSON.stringify(action));

        const fontAwesomeIconPath = join(nodeModulesPath, "@fortawesome/fontawesome-free/svgs/solid", `${action.spec.icon.name}.svg`)
        const iconWithColor = readFileSync(fontAwesomeIconPath, 'utf8').replace('<svg', '<svg style="fill: rgb(37 99 235);"')
        const outputActionIconPath = join(outputActionPath, "icon.svg")
        writeFileSync(outputActionIconPath, iconWithColor);

        await generateImages(
            outputActionIconPath,
            outputActionPath,
            {
                favicon: true,
                scrape: false,
                background: "#ffffff",
                iconOnly: true,
            }
        );
    });

await copyFile(join(actionsPath, "_template.yaml"), join(outputPath, "_template.yaml"))
