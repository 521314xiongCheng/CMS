const AdmZip =require('adm-zip')

// 行
const PRegExp = /<w:p[\s\S]*?<\/w:p>/ig
// table 行
const TrRegExp = /<w:tr[\s\S]*?<\/w:tr>/ig
// table
const TblRegExp = /<w:tbl[\s\S]*?<\/w:tbl>/ig
// table 列
const TcRegExp = /<w:tc[\s\S]*?<\/w:tc>/ig
// 文字
const TextRegExp = /<w:t[\s\S]*?>([\s\S]*?)<\/w:t>/ig

function parseWorldDoc(wordDocXml) {
  let json = []
  let jsonIndex = 0
  parseXML(wordDocXml).forEach(item => {
    const trXmls = parseTblXML(item)
    trXmls.forEach((trXml, trIndex) => {
      if (trIndex === 0) return
      const examQuestion = Object.create({})

      const tcXmls = parseTrXML(trXml)
      examQuestion.id = parseTpXML(parseTcXML(tcXmls[0])[0])
      // parseTpXML(parseTcXML(tcXml)[tcIndex])
      const testQuestion = parseTestQuestion(tcXmls[1])
      examQuestion.title = testQuestion.shift()

      // answer string
      const testAnswerStr = parseTestAnswer(tcXmls[2])
      examQuestion.isMultipleChoice = testAnswerStr.replace(' ','').length>1 ? true :false;
      const options = []
      testQuestion.forEach(item => {
        const optionId = item.substring(0, 1)
        let correct = false
        if (testAnswerStr.indexOf(optionId) >= 0) {
          correct = true
        }
        options.push({
          optionId: optionId,
          optionName: item,
          correct
        })
      })
      examQuestion.options = options

      json[jsonIndex] = examQuestion
      jsonIndex++
    })
  })
  return json
}

function parseTestQuestion(tcXml) {
  const tpXmls = parseTcXML(tcXml)
  const tps = []
  tpXmls.forEach(tpXml => {
    const tp = parseTpXML(tpXml)
    if (tp)
      tps.push(tp)
  })
  return tps
}

function parseTestAnswer(tcXml) {
  const tpXmls = parseTcXML(tcXml)
  return parseTpXML(tpXmls[0])
}

function parseXML(xml) {
  const tblArr = []
  xml.match(TblRegExp).forEach(item => tblArr.push(item))
  return tblArr
}

function parseTblXML(tblXml) {
  const trArr = []
  tblXml.match(TrRegExp).forEach(item => trArr.push(item))
  return trArr
}

function parseTrXML(trXml) {
  const tcArr = []
  trXml.match(TcRegExp).forEach(tc => tcArr.push(tc))
  return tcArr
}

function parseTcXML(tcXml) {
  const pArr = []
  tcXml.match(PRegExp).forEach(p => pArr.push(p))
  return pArr
}

function parseTpXML(tpXml) {
  let text = ''
  if (null == tpXml.match(TextRegExp)) return text
  tpXml.match(TextRegExp).forEach(p => text += p.replace(/<w:t[\s\S]*?>([\s\S]*?)<\/w:t>/ig, '$1'))
  return text
}


exports.docParseToJson = ( buffer ) => {
  if (!Buffer.isBuffer(buffer)) return null;

  const zip = new AdmZip(buffer)
  let contentXml = zip.readAsText('word/document.xml') // 将document.xml读取为text内容；

  const json = parseWorldDoc(contentXml)

  return JSON.stringify(json)

}