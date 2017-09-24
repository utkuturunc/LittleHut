const shell = require('shelljs')

shell.cp('-p', 'dist/')
shell.cp('-R', 'src/public', 'dist/')
