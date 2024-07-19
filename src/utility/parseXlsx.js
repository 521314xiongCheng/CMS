import XLSX from 'xlsx'
export default (file, cb) => {
  const reader = new FileReader()
  reader.onload = e => {
    const data = e.target.result
    const arr = String.fromCharCode.apply(null, new Uint8Array(data))
    const wb = XLSX.read(btoa(arr), { type: 'base64' })
    const json = JSON.stringify(to_json(wb), 2, 2)
    // return json
    cb && cb(json)
  }
  reader.readAsArrayBuffer(file)
}

function to_json(workbook) {
  const result = {}
  workbook.SheetNames.forEach(sheetName => {
    const roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName])
    if (roa.length > 0) {
      result[sheetName] = roa
    }
  })
  return result
}
