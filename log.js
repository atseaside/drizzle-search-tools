const chalk = require('chalk')

module.exports = {
    log: (val)=>{
        console.log(chalk.bgGreenBright.black(` ${val} `))
    }
}
view('filter')