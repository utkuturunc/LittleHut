const shell = require('shelljs')

shell.mkdir('-p', 'dist/')
shell.cp('-R', 'src/public', 'dist/')
