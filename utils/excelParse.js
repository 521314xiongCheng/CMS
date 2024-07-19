'use strict'

const nodeXlsx = require('node-xlsx')

// const healthType = {
//   weight: 1, // 体重管理力
//   immunity: 2, // 免疫力
//   antioxidant: 3, // 抗氧力
//   skeleton: 4, // 骨骼力
//   intestine: 5, // 肠道力
//   skin: 6, // 皮肤力
//   eyesight: 7, // 视力
//   angiocarpy: 8 // 心血管力
// }
// 健康指数
// 1年龄 2体重 3睡眠 4肠道 5皮肤毛发 6饮食 7久坐 8视力 9感冒指数 10抽烟喝酒
// const healthIndexs = {
//   '年龄': 1,
//   '体重': 2,
//   '睡眠': 3,
//   '肠道': 4,
//   '皮肤毛发': 5,
//   '饮食': 6,
//   '久坐': 7,
//   '视力': 8,
//   '感冒指数': 9,
//   '抽烟喝酒': 10
// }

// const fs = require('fs')
// const path = require('path')
// const testData = parseExcelToJson(fs.readFileSync(path.join(__dirname, 'example_1.xlsx')))
// fs.writeFileSync('./example.json', JSON.stringify(testData, null, ' '))

function parser(buffer) {
  // console.log(buffer)
  // const content = nodeXlsx.parse(fs.readFileSync(path.resolve(__dirname, './example.xlsx')))
  const content = nodeXlsx.parse(buffer)
  let questions, risks, scores, improves, invitationQuestions

  content.forEach(item => {
    switch (item.name) {
      case '试题':
        questions = getQuestions(item.data)
        break
      case '健康力总分值':
        scores = getScores(item.data)
        break
      case '风险因素解读':
        risks = getRisks(item.data)
        break
      case '改善建议':
        improves = getImproves(item.data)
        break
      case '邀约':
        invitationQuestions = getInvitationQuestions(item.data)
        break
      default:
        break
    }
  })

  return {
    questions,
    risks,
    scores,
    improves,
    invitationQuestions
  }
}

function getQuestions(data) {
  const questions = []
  let heads = []
  let cacheHealthIndex = null
  data.forEach((row, index) => {
    if (index === 0) {
      return heads = heads.concat(row)
    }
    if (!row.length) return
    const question = {
      title: '', // 题目
      healthIndex: '', // 健康指数
      questionOption: 0, // 题目选项类型, tag === 体重 时 为1
      display: true, // 是否显示
      choice: 1, // 1单选 2多选 3填空
      options: [], // 选项
      num: null // 题号
    }
    const option = {}
    for (let i = 0; i < row.length; i++) {
      const item = row[i]
      if (question.hasOwnProperty(heads[i])) {
        if (heads[i] === 'healthIndex') {
          if (item) {
            cacheHealthIndex = item
          }
          question['healthIndex'] = cacheHealthIndex
          continue
        }
        question[heads[i]] = item
        continue
      }
      option[heads[i]] = item
    }
    if (row[0] || row[0] === 0) {
      question['options'][0] = option
      questions.push(question)
    } else {
      questions[questions.length - 1].options.push(option)
    }
  })
  // console.log(JSON.stringify(questions, null, ' '))
  return questions
}

function getRisks(data) {
  let heads = []
  const risks = []
  let cacheHealthIndex = null
  data.forEach((row, index) => {
    if (index === 0) {
      return heads = heads.concat(row)
    }
    if (!row.length) return
    const risk = {
      num: null,
      title: '',
      healthIndex: null
    }
    for (let i = 0; i < row.length; i++) {
      const item = row[i]
      if (heads[i] === 'healthIndex') {
        if (item) {
          cacheHealthIndex = item
        }
        risk['healthIndex'] = cacheHealthIndex
      } else if (item || item === 0) {
        risk[heads[i]] = item
      }
    }
    risks.push(risk)
  })
  // console.log(JSON.stringify(risks, null, ' '))
  return risks
}

function getScores(data) {
  const scores = {}
  let heads = []
  data.forEach((row, index) => {
    if (index === 0) {
      return heads = heads.concat(row)
    }
    let key = ''
    for (let i = 0; i < row.length; i++) {
      const item = row[i]
      if (i === 0) {
        key = item
        continue
      }
      if (!scores[heads[i]]) scores[heads[i]] = {}
      scores[heads[i]][key] = item
    }
  })
  // console.log(JSON.stringify(scores, null, ' '))
  // 后端需要 scores 是数组类型，方便计算？？？
  return [scores]
}

function getImproves(data) {
  const improves = []
  let heads = []
  data.forEach((row, index) => {
    if (index === 0) {
      return heads = heads.concat(row)
    }
    if (!row.length) return
    const improve = {}
    for (let i = 0; i < row.length; i++) {
      const item = row[i]
      improve[heads[i]] = item
    }
    improves.push(improve)
  })
  // console.log(JSON.stringify(improves, null, ' '))

  return improves
}

function getInvitationQuestions(data) {
  const invitationQuestions = []
  let heads = []

  data.forEach((row, index) => {
    if (index === 0) {
      return heads = row
    }
    if (!row.length) return
    const question = {
      num: '',
      title: '',
      choice: '',
      options: []
    }
    const option = {}
    for (let i = 0; i < row.length; i++) {
      const item = row[i]

      if (question.hasOwnProperty(heads[i])) {
        question[heads[i]] = item
        continue
      }
      option[heads[i]] = item
    }

    if (row[0] || row[0] === 0) {
      question['options'].push({
        subTitle: option.subTitle || '',
        subOptions: [
          {
            option: option.option,
            optionType: option.optionType
          }
        ]
      })
      invitationQuestions.push(question)
    } else {
      const invitationQuestionsIndex = invitationQuestions.length - 1
      const currentInvitationQuestions = invitationQuestions[invitationQuestionsIndex]
      if (option.subTitle) {
        currentInvitationQuestions.options.push({
          subTitle: option.subTitle || '',
          subOptions: []
        })
      }
      currentInvitationQuestions.options[currentInvitationQuestions.options.length - 1]['subOptions'].push({
        option: option.option,
        optionType: option.optionType
      })
    }
  })

  // console.log(JSON.stringify(invitationQuestions, null, ' '))

  return invitationQuestions
}

function parseExcelToJson(buffer) {
  if (!Buffer.isBuffer(buffer)) return null

  return parser(buffer)
}

exports.parseExcelToJson = parseExcelToJson
