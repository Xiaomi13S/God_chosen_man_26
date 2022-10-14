import fs from 'fs'
const path = require('path')

const getFiles = (dir) => {
    const stat = fs.statSync(dir)
    if (stat.isDirectory()){
        const dirs = fs.readdirSync(dir)
        dirs.forEach(val => {
            getFiles(path.join(dir, val))
        })
    }else if (stat.isFile()){
        console.log('文件名称', dir)
        
    }
}
getFiles('./music')