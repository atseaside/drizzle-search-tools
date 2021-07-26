const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const { execSync } = require('child_process');

const rootPath = process.cwd();
class Search {
    constructor({ params }) {
        this.params = params;
        this.dir = '';
        this.str = '';
        this.log = chalk.green('\n---搜索完成，本次搜索时长---');
        this.all = [];
        this.exactFiles = [];
        this.ignore = ['node_modules', 'README.md', 'package-lock.json', 'package.json'];

        this.init();
    }

    init() {
        console.log(chalk.yellow(`\n---搜索开始，本搜索工具仅针对 .sleet 文件，如有其他需要请联系作者---\n`));
        console.time(this.log);
        const { params } = this;

        if (!params || !params.includes(':')) {
            console.log(
                chalk.red(`\nsearch result:\n------请检查输入参数是否正确：${this.params}------\n`)
            );
            return;
        }
        const temp = params.split(':');
        this.dir = temp[0];
        this.str = temp[1];

        this.getAllPath(rootPath);
        this.find();
    }

    find() {
        this.generateExactFiles();
        const { str, exactFiles } = this;
        const result = [];
        exactFiles.forEach((filePath, i) => {
            const extname = path.extname(filePath);

            if (extname !== '.sleet') {
                // 只查找 .sleet 文件
                return;
            }

            const fileContent = fs.readFileSync(filePath, 'utf8').split('\n');

            const fileRes = fileContent.reduce((obj, line, lineNum) => {
                const reg = new RegExp(`view\\(["|']${str}`);
                if (reg.test(line)) {
                    obj = {
                        searchValue: str,
                        filePath: `${filePath}:${lineNum + 1}`,
                    };
                }
                return obj;
            }, {});

            if (Object.keys(fileRes).length > 0) {
                result.push(fileRes);
            }
        });

        console.timeEnd(this.log);
        console.log(
            chalk.green(
                '\n---------------------------------------------------------------------------\n'
            )
        );

        if (result.length === 0) {
            return console.log(chalk.red(`---没有匹配到任何内容---\n`));
        }

        console.log(
            chalk.yellow('将为您自动打开第一次匹配到的文件，如需查看其他匹配结果，请看下方👇🏻')
        );
        console.log(result);

        execSync(`code -r -g ${result[0].filePath}`);
    }

    generateExactDirs() {
        return this.all.filter((item, i) => {
            return item.includes(this.dir);
        });
    }

    generateExactFiles() {
        const exactPaths = this.generateExactDirs();
        exactPaths.forEach((n, m) => {
            fs.readdirSync(n).forEach((j, k) => {
                // 拼接绝对路径
                const temp = `${n}/${j}`;
                const isFile = fs.statSync(temp).isFile();
                isFile && this.exactFiles.push(temp);
            });
        });
    }

    getAllPath(dirName) {
        const dirFiles = fs.readdirSync(dirName);
        dirFiles.forEach((file, i) => {
            if (this.ignore.includes(file)) {
                return;
            }

            const filePath = `${dirName}/${file}`;

            const isDirectory = fs.statSync(filePath).isDirectory();

            if (isDirectory) {
                this.all.push(fs.realpathSync(filePath));
                // 递归深层目录
                return this.getAllPath(filePath);
            }
        });
    }
}

module.exports = { Search };
