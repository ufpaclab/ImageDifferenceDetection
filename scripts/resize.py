from PIL import Image
import os
import re

fileNames = os.listdir()
for baseFileName in fileNames:
    if re.match('.*_2\\.jpg', baseFileName) == None:
        continue
    print(baseFileName)
    baseFile = Image.open(baseFileName)
    modFileName = baseFileName.replace('_2.jpg', '_3.jpg')
    modFile = Image.open(modFileName)
    modFile = modFile.resize(baseFile.size, )
    modFile.save(modFileName)