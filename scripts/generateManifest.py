# generate manifest file by looking for jpeg files that end in the '_2.jpg' suffix

import os
import re

class Manifest():
  def __init__(self):
    self.data = "const IMAGE_MANIFEST = ["

  def addFile(self, filename):
    self.data = self.data + f"{{name: '{fileName}',extension: 'jpg',}},"

  def toString(self):
    return self.data + "];"

manifest = Manifest()

fileNames = os.listdir()
for fileName in fileNames:
  isProperFileTypeAndName = re.search(".*_2\\.jpg", fileName) != None
  if (isProperFileTypeAndName):
    fileName = fileName.replace("_2.jpg", "")
    manifest.addFile(fileName)

fileHandle = open("ImageManifest.js", "w")
fileHandle.write(manifest.toString())