import os
import re

fileNames = os.listdir()

for fileName in fileNames:
    isModifiedFile = re.search(".*_2\\.jpg", fileName) != None
    isJpeg = re.search(".*\\.jpg", fileName) != None
    if (not isModifiedFile and isJpeg):
        os.remove(fileName)
    if (isModifiedFile):
        os.rename(fileName, fileName.replace('_2.jpg', '_3.jpg'))