function doGet(e) {
  var template = HtmlService.createTemplateFromFile('index')
  template.survey_code = e.parameter.survey_code
  return template.evaluate()
}

function GetSessionID() {
  var lock = LockService.getScriptLock()
  lock.waitLock(3000)
  
  var scriptProperties = PropertiesService.getScriptProperties()
  var currentID = ReadOrCreateProperty_('sessionId', '0')
  var newID = parseInt(currentID) + 1
  scriptProperties.setProperty('sessionId', newID.toString())
  
  lock.releaseLock()
  
  return newID
}

function Insert(id, data) {  
  var scriptProperties = PropertiesService.getScriptProperties()
  
  var lock = LockService.getScriptLock()
  lock.waitLock(3000)
  
  var keyCount = ReadOrCreateProperty_('keyCount', '1')
  keyCount = parseInt(keyCount)
  
  var paddedData = [id]
  var keys = Object.keys(data)
  for (var key of keys) {
    var keyIndex = ReadOrCreateProperty_(key, keyCount)
    if (keyIndex == keyCount)
      keyCount++

    paddedData[keyIndex] = data[key]
  }
  scriptProperties.setProperty("keyCount", keyCount.toString())
  
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var sheetName = 'Results'
  var sheet = ss.getSheetByName(sheetName)
  if (sheet == null) {
    sheet = ss.insertSheet(sheetName)
  }
  sheet.appendRow(paddedData)
  lock.releaseLock()
}

const IMAGE_USAGE_PREFIX = "imageManifest_"

function GetImageUsage(imageManifest) {
  var scriptProperties = PropertiesService.getScriptProperties()
  
  for (let image in imageManifest) {
    let propertyName = IMAGE_USAGE_PREFIX + imageManifest[image].name;
    imageManifest[image].usage = ReadOrCreateProperty_(propertyName, 0)
  }

  return imageManifest;
}

function UpdateImageUsage(imageManifest) {
  var scriptProperties = PropertiesService.getScriptProperties()

  for (let image of imageManifest) {
    let propertyName = IMAGE_USAGE_PREFIX + image.name;
    let currentImageCount = parseInt(ReadOrCreateProperty_(propertyName, 0))
    scriptProperties.setProperty(propertyName, currentImageCount + 1)
  }
}

function PrintAllProperties() {
  var scriptProperties = PropertiesService.getScriptProperties()
  var props = scriptProperties.getProperties()
  for (var property in props) {
    console.log('%s: %s', property, props[property]);
  }
}

function ReadOrCreateProperty_(key, defaultValue) {
  var scriptProperties = PropertiesService.getScriptProperties()
  var value = scriptProperties.getProperty(key)
  if (value == null) {
    value = defaultValue.toString()
    scriptProperties.setProperty(key, value)
  }
  return value
}