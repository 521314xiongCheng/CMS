const XLSX = require('xlsx');

function parseToJson(buffer) {
  let result = []

  let workbook = XLSX.read(buffer, {
    type: "buffer"
  })
  const sheetNames = workbook.SheetNames;
  const worksheet = workbook.Sheets[sheetNames[0]];
  let jsonData = XLSX.utils.sheet_to_json(worksheet);
  // let answerStr = "";
  // let index = 0;
  // let test = {};
  jsonData.forEach(item => {
    if (item['试题']) {
      let test = {};
      test['num'] = item['序号'];
      test['title'] = item['试题'];
      test['score'] = item['选择“是”所扣分数'];
      test['risk'] = item['选择“是”对应风险提示'];
      test['riskDetails'] = item['选择“是”对应风险因素解读'];
      test['tag'] = item['题型'];
      test['questionOption'] = item['BMI或年龄身高按钮']
      test['references'] = item['相关参考文献']
      result.push(test);
      // index++;
    } else if (item['答案']) {
      let test = {}
      test['question'] = item['问题']
      test['num'] = item['序号'];
      test['answer'] = item['答案']
      test['faqCategoryIds'] = item['所属分类ID']
      result.push(test)
    } else {
      let test = {};
      test['num'] = item['序号'];
      test['gender'] = item['性别'];
      test['beginAge'] = item['年龄段（起）（含）'];
      test['endAge'] = item['年龄段（止）（含）'];
      test['isFat'] = item['是否肥胖'];
      test['isSmoking'] = item['是否抽烟'];
      test['isDrink'] = item['是否喝酒'];
      test['nutritionFormula'] = item['提供产品配方'];
      test['nutritionDetails'] = item['营养补充详细话术'];
      test['liveDetails'] = item['健康生活详细话术'];
      test['dietDetails'] = item['健康饮食详细话术'];
      test['physicalDetails'] = item['体检详细话术'];
      result.push(test);

    }
  })

  return result;
}

exports.excelParseToJson = (buffer) => {
  if (!Buffer.isBuffer(buffer)) return null;

  return parseToJson(buffer);
}
