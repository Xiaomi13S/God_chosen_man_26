//! 1.动态创建表格
const ul = document.querySelector('ul')
for (let i = 0; i < arr.length; i++) {
    // 创建li标签
    const li = document.createElement('li')
    ul.appendChild(li)
    for (let j = 0; j < arr[i].length;j++){
        // 创建span
        const span = document.createElement('span')
        span.innerHTML = arr[i][j]
        span.setAttribute('id', `_${i}-${j}`)
        li.appendChild(span)
    }
}
// 禁用复制
// document.addEventListener('selectstart',(e)=>{
//     e.preventDefault()
// })
//! 2.遍历找到所有为空的id, 用一个数组存起来之后使用
let noStudents = []
let allSpan = document.querySelectorAll('li span')
allSpan.forEach(item => {
    if (item.innerHTML == '--') {
        noStudents.push(item.id)
    }
})  

const btn = document.querySelector('.btn')
const lucky = document.querySelector('.lucky')

//! 3.随机抽取ID
let randomX = 0  // id
let randomY = 0  
const getId = () => {
    randomX = parseInt(Math.random() * arr.length)
    randomY = parseInt(Math.random() * arr[0].length)
    return `_${randomX}-${randomY}`
}
//! 4.按行抽取rows
const getRowsArr = () => {
    let tempArr = []
    randomX = parseInt(Math.random() * arr.length)
    for (var i = 0; i < 14; i++){  // 注意一行14位同学
        tempArr.push(`_${randomX}-${i}`)
    }
    return tempArr
}
//! 5.按列抽取 cols
const getColsArr = () => {
    let tempArr = []
    randomY = parseInt(Math.random() * arr[0].length)
    for (var i = 0; i < arr.length; i++){
        tempArr.push(`_${i}-${randomY}`)
    }
    return tempArr
}
//! 6.语音播放
const speakStr = (textToSpeak) => {
    var synth = window.speechSynthesis
    var u = new SpeechSynthesisUtterance
    // 汉语
    u.lang = 'zh-CN'
    u.rate = 1
    u.text = textToSpeak
    synth.speak(u)
}
//! 7.随机音乐
const createMusic = () => {
    const musicArr = ['祖海 - 好运来', '辉煌时刻']
    const index = Math.floor(Math.random() * musicArr.length)
    
    // const musicArr = ['祖海 - 好运来']
    // const index = 0
    const music = musicArr[index]
    var mp3Url = `./music/${music}.mp3`
    return new Audio(mp3Url);
}


//! 8. 倒计时
let countTimer = null
const countDiv = document.querySelector('.count')
let time = parseInt(countDiv.innerHTML)
let originTime = time
const countTime = (music) => {
   countTimer = setInterval(() => {
        if(time <= 0){
            time = originTime
            countDiv.innerHTML = time
            clearStatus(music)
            return
        }
        time--
        countDiv.innerHTML = time
        countDiv.classList.toggle('animate__heartBeat')
    }, 1000);
}

//! 9. 展示随机同学
const getRandom = (studentNum, type) => {
        let tempArr = [] 
        // 根据Type决定抽取方式
        if (type == 'row'){
            tempArr = getRowsArr()
        } else if (type == 'col'){
            tempArr = getColsArr()
        } else if (type == 'id') {
            // 存选中的id
            while(tempArr.length < studentNum){
                let randomId = getId()
                // 如果选中的id不是--空位置， 存到tempArr中
                if(!noStudents.includes(randomId)&&!tempArr.includes(randomId)){
                    // 可能有同学会抽中两次，amazing！ !tempArr.includes(randomId) 去重
                    tempArr.push(randomId)
                }
            }
        }
        // 清空已经被选中的
        const selected = document.querySelectorAll('.active')
        selected.forEach(el => {
            el.className = ''
        })
        // 将名字显示
        let str = ''
        tempArr.forEach(item =>{
            let span =  document.querySelector(`#${item}`)
            span.classList.add('active')
            span.classList.add('animate__heartBeat')
            str += `<span>${span.innerHTML}</span>`
        })
        lucky.innerHTML = str
        sessionStorage.setItem('lucky', str)
    }

// wait 是 计数number的setTimeout倒计时
let wait = originTime * 1000 
let interval_id = 0  // 随机抽取同学的定时器
let timeout_id = 0 // 计数器的定时器
let music = null  // 让music为全局的对象
let doingStatus = false  // 是否处于抽奖状态
let stuNum = 1 // 默认抽奖人数为1个
let ruleType = 'id'

//! 从缓存中获取上一次规则
const getRules = ()=>{
    let temp = JSON.parse(localStorage.getItem('lucky_rules'))
    console.log(temp)
    
    if (temp){
        const count_div = document.querySelector('.count')
        // const num_box = document.querySelector('.box-count')
        count_div.innerHTML = temp.wait_time
        // num_box.innerHTML = parseInt(temp.stu_num)
        stuNum = parseInt(temp.stu_num)
        ruleType = temp.type || 'id'

        time = temp.wait_time
        originTime = time
    }
}
// 调用一次
getRules()

//! 抽奖规则存local本地存储中
const saveRules = (wait, num, type) => {
    let temp = {
        wait_time: wait,
        stu_num:num,
        type,
    }
    localStorage.setItem('lucky_rules', JSON.stringify(temp))
}

//! 10.音乐起, 抽奖, 计时
const getLuckyGuy = () => {
    doingStatus = true
    music = createMusic()
    music.play()
    // 按钮改变
    btn.innerHTML = 'Stop'
    interval_id = setInterval(getRandom.bind(this, stuNum, ruleType), 1)
    // 计时开始
    countTime(music)  
}

//! 11.随时停止, 抽奖状态, 语音播报
const clearStatus = (music) =>{
    clearInterval(interval_id)
    clearTimeout(countTimer)
    // 停止音乐
    music.pause() 
    doingStatus = false
    btn.innerHTML = '开始'
    let lucky = sessionStorage.getItem('lucky')
    setTimeout(()=>{
        speakStr(`恭喜${lucky}`)
    },1000)
    
}

//! 18 获取当前的年月日，时分秒
const getTime = () => {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let d = date.getDate() // 日
    let h = date.getHours()
    let m = date.getMinutes()
    let s = date.getSeconds()
    month = month < 10 ? '0' + month : month;
    d = d < 10 ? '0' + d : d;
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    return `${year}-${month}-${d} ${h}:${m}:${s}`
}

//! 17 统计每位同学抽中的次数
const saveHistory = () => {
// <span>曾祥彬</span><span>杨伟</span>
// 正则获取span标签中的内容
    let history = []
    if (localStorage.getItem('lucky_history_26')){
        history = JSON.parse(localStorage.getItem('lucky_history_26'))
    }
    const lucky = sessionStorage.getItem('lucky')
    if(!lucky){
        alert('记录无效~')
        return // session没有，不记录了
    }
    const chooseArr = lucky.match(/[^><]+(?=<\/span>)/g)
    //! 记录年月日
    const tempObj = {
        create_time: +new Date(),
        time: getTime(),
        lucky:chooseArr
    }
    history.push(tempObj)
    localStorage.setItem('lucky_history_26', JSON.stringify(history))
    sessionStorage.removeItem('lucky')
    alert('已经记录~')
}
//! 12.点击按钮触发, 按下Space和Enter触发
btn.addEventListener('click', () => {
    if (!doingStatus){
        getLuckyGuy()
    } else {
        clearStatus(music)
    }
    
})

// 弹窗打开的状态
let showBox = false
const numBox = document.querySelector('.box-count')
const inputCount = document.querySelector('.box-count #count')
const inputStudent = document.querySelector('.box-count #student')
const inputType = document.querySelector('.box-count #type')
//! 15. 打开弹窗
const showDialog = ()=>{
    numBox.style.display = 'block'
    console.log(countDiv)
    console.log(inputCount)
    
    inputCount.value = countDiv.innerHTML
    inputStudent.value = stuNum
    inputType.value = ruleType
    inputCount.focus() // 自动获取焦点
    showBox = true
}

//! 16. 关闭弹窗
const closeDialog = ()=>{
    if(inputCount.value){
        countDiv.innerHTML = inputCount.value
        time = parseInt(inputCount.value)
        originTime = time
    }
    if(inputStudent.value){
        stuNum = inputStudent.value
    }
    if(inputType.value){
        ruleType = inputType.value
    }
    saveRules(time, stuNum, ruleType)
    numBox.style.display = 'none'
    showBox = false
}
// 增加键盘点击触发
document.addEventListener('keydown',(e)=>{
    if ((e.key === 'Enter' || e.code === 'Space')&&!showBox){
        if (!doingStatus){
            getLuckyGuy()
        } else {
            clearStatus(music)
        }
    }
    //! 14 回车 ESC 控制弹出关闭
    // console.log(e)
    
    if ((e.key === 'Enter'||e.key === 'Escape') && showBox){
        closeDialog()
    }
    //! 如果按alt+c 弹出修改框
    if(e.altKey && e.key ==='c' && !doingStatus){
        
        showDialog()
    }

})
//! 13.点击修改count时间
countDiv.addEventListener('click',(e) =>{
    if(!doingStatus){
        showDialog()
    } 
 
})

//! 点击存历史
const btnSave = document.querySelector('.save')
btnSave.addEventListener('click', ()=>{
    saveHistory()
})

//! 根据历史记录创建li
const showDatas = () =>{
    const ul = document.querySelector('.box-history ul')
    const stuArr = JSON.parse(localStorage.getItem('lucky_history_26'))
    ul.innerHTML = '' // 先清空
    stuArr.forEach(el =>{
        const li = document.createElement('li')
        li.innerHTML = `<span class="time">${el.time}</span>: <span class="stu">${el.lucky.join(' ')}</span>`
        ul.appendChild(li)
    })
    const box = document.querySelector('.box-history')
    box.style.display = 'block'
    box.children[0].classList.remove('rank-center')
}
//! 显示历史记录
const btnShow = document.querySelector('.show')
btnShow.addEventListener('click', ()=>{
    showDatas()
})

//! 显示排行榜
const btnRank = document.querySelector('.rank')
btnRank.addEventListener('click', ()=>{
    renderRank()
})
const getRank = () => {
    const history = JSON.parse(localStorage.getItem('lucky_history_26'))
    const tempArr = []
    history.forEach(item => {
        tempArr.push(item.lucky)
    })
    const originArr = tempArr.flat()
    // 转为统计后的对象
    const rankObj = originArr.reduce((obj,item) => {
        obj[item] ? obj[item]++ : obj[item] = 1
        return obj
    }, {})

    // 转为数组排序
    const finArr = []
    for (const [key, value] of Object.entries(rankObj)) {
        // console.log(`${key}: ${value}`);
        let tempObj = {
            name: key,
            num: value
        }
        finArr.push(tempObj)
      }
    // 冒泡排序
    var res = finArr.sort((a, b)=> b.num - a.num)
    console.log(res)
    return res
    // render!
}

//! 渲染排行榜
const renderRank = () => {
    const ul = document.querySelector('.box-history ul')
   
    ul.innerHTML = '' // 先清空
    const res = getRank()
    res.forEach(el =>{
        const li = document.createElement('li')
        li.innerHTML = `<span class="stu-name">${el.name}</span><span class="stu-rank">${el.num}</span>`
        ul.appendChild(li)
    })
    const box = document.querySelector('.box-history')
    box.style.display = 'block'
    box.children[0].classList.add('rank-center')
}