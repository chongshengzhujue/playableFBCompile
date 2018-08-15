#!/usr/bin/python
# -*- coding: UTF-8 -*-

from xml.dom.minidom import parse
import xml.dom.minidom
import json
import os
import time
import sys
import codecs
import cgi
import HTMLParser
import re
import base64

if sys.getdefaultencoding() != 'utf-8':
  reload(sys)
  sys.setdefaultencoding('utf-8')

RootDir = os.getcwd()
print(RootDir)

htmlPath = RootDir + '/build/web-mobile/index.html'
settingScrPath = RootDir + '/build/web-mobile/src/settings.js'
mainScrPath = RootDir + '/build/web-mobile/main.js'
engineScrPath = RootDir + '/build/web-mobile/cocos2d-js-min.js'
projectScrPath = RootDir + '/build/web-mobile/src/project.js'

resPath = RootDir + '/build/web-mobile/res'

settingMatchKey = '{#settings}'
mainMatchKey = '{#main}'
engineMatchKey = '{#cocosengine}'
projectMatchKey = '{#project}'
resMapMatchKey = '{#resMap}'

addScriptPathList = [settingScrPath, mainScrPath, engineScrPath, projectScrPath]

fileByteList = ['.png', '.jpg', '.mp3', '.ttf']

base64PreList = {
  '.png' : 'data:image/png;base64,',
  '.jpg' : 'data:image/jpeg;base64,',
  '.mp3' : '',
  '.ttf' : ''
}

def read_in_chunks(filePath, chunk_size=1024*1024):
  """
  Lazy function (generator) to read a file piece by piece.
  Default chunk size: 1M
  You can set your own chunk size
  """
  extName = os.path.splitext(filePath)[1]
  if extName in fileByteList:
    file_object = open(filePath, 'rb')
    base64Str = base64.b64encode(file_object.read())
    preName = base64PreList[extName]
    if preName != None:
      base64Str = preName + base64Str
    return base64Str
  elif extName == '':
    return None
  
  file_object = open(filePath)
  return file_object.read()

def writeToPath(path, data):
  with open(path,'w') as f: # 如果filename不存在会自动创建， 'w'表示写数据，写之前会清空文件中的原有数据！
    f.write(data)

def getResMap(jsonObj, path):
  fileList = os.listdir(path)
  for fileName in fileList:
    absPath = path + '/' + fileName
    if (os.path.isdir(absPath)):
      getResMap(jsonObj, absPath)
    elif (os.path.isfile(absPath)):
      dataStr = read_in_chunks(absPath)
      if dataStr != None:
        absPath = 'res' + absPath.replace(resPath, '')
        jsonObj[absPath] = dataStr
        print(absPath)

def getResMapScript():
  jsonObj = {}
  getResMap(jsonObj, resPath)
  resStr = unicode("window.resMap = ") + json.dumps(jsonObj)
  return resStr
  
def start():
  htmlStr = read_in_chunks(htmlPath)

  settingsStr = read_in_chunks(settingScrPath)
  htmlStr = htmlStr.replace(settingMatchKey, settingsStr, 1)
  
  projectStr = read_in_chunks(projectScrPath)
  htmlStr = htmlStr.replace(projectMatchKey, projectStr, 1)
  
  mainStr = read_in_chunks(mainScrPath)
  htmlStr = htmlStr.replace(mainMatchKey, mainStr, 1)
  
  engineStr = read_in_chunks(engineScrPath)
  htmlStr = htmlStr.replace(engineMatchKey, engineStr, 1)

  resStr = getResMapScript()
  htmlStr = htmlStr.replace(resMapMatchKey, resStr, 1)

  writeToPath(htmlPath, htmlStr)



if __name__ == '__main__':
  start()