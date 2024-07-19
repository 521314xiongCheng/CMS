import _flattenDeep from 'lodash/flattenDeep'
import { cutString } from '@/utility/index.js'

function isObject(val) {
  return Object.prototype.toString.call(val) === '[object Object]'
}

export function htmlSplitCustom(html) {
  const customRegExp = /(<div([\s\S]*?)id="CUSTOM_PLACEHOLDER"([\s\S]*?)<\/div>)/g
  const customInputRegExp = /<input([\s\S]*?)\/>/g
  const contentRegExp = /id=['"]{1}([^'"]*)['"]{1}/i
  const customArr = []
  html = html.replace(customRegExp, function(it) {
    customArr.push(it)
    return '_RegExp_'
  })

  const hArr = html.split('_RegExp_')

  if (!customArr || !customArr.length) {
    return hArr
  }
  /**
   * 此时:
   * customArr: ['<div id="CUSTOM_PLACEHOLDER"><input xxx ></div>', '<div id="CUSTOM_PLACEHOLDER"><input xxx ></div>']
   * hArr: ['<xxx>xxxx</xxx>', '<xxx>xxxx</xxx>', '<xxx>xxxx</xxx>', '<xxx>xxxx</xxx>']
   */
  const arr = []
  hArr.forEach((item, index) => {
    arr.push(item)
    if (index < customArr.length) {
      const matchArr = customArr[index].match(customInputRegExp)
      if (!matchArr) {
        return arr.push(item)
      }
      const customItem = matchArr[0]
      let content = customItem.match(contentRegExp)
      // content: [id, note, imageUrl]
      if (content) {
        content = content[1].split('_$$_')
        const it = {
          type: 'Custom',
          contents: content[1],
          customId: content[0],
          content: customArr[index],
          sourceCode: customArr[index],
          customProductName: content[1],
          customProductValue: content[2]
        }
        if (content[3]) {
          it['customImageUrl'] = content[3]
        }
        arr.push(it)
      }
    }
  })
  /**
   * arr:
   * ['<xxx>xxxx</xxx>', { type: 'Custom', content: '<div id="CUSTOM_PLACEHOLDER"><input xxx ></div>', customId: xx }, '<xxx>xxxx</xxx>']
   */
  return arr
}

export function htmlSplitMedia(htmlArr) {
  const mediaRegExp = /(<video([\s\S]*?)<\/video>)/g
  const srcRegExp = /src=['"]?([^'"]*)['"]?/i
  const posterRegExp = /poster=['"]?([^'"]*)['"]?/i
  const typeRegExp = /type=['"]{1}([^'"]*)['"]{1}/i

  htmlArr.forEach((item, index) => {
    if (Object.prototype.toString.call(item) === '[object Object]') {
      return
    }
    const mediaArr = []
    item = item.replace(mediaRegExp, function(it) {
      mediaArr.push(it)
      return '_RegExp_'
    })
    if (mediaArr.length === 0) {
      return
    }
    const hArr = item.split('_RegExp_')

    const arr = []
    if (mediaArr && mediaArr.length) {
      hArr.forEach((item, i) => {
        arr.push(item)
        if (i < mediaArr.length) {
          const mediaItem = mediaArr[i]
          const src = mediaItem.match(srcRegExp)
          const type = mediaItem.match(typeRegExp)
          const poster = mediaItem.match(posterRegExp)
          if (src && type) {
            arr.push({
              sourceCode: mediaItem,
              type: type[1].indexOf('video') > -1 ? 'Video' : 'Audio',
              content: src[1],
              src: src[1],
              poster: poster[1]
            })
          }
        }
      })
    }
    htmlArr.splice(index, 1, arr)
  })

  return _flattenDeep(htmlArr)
}

export function videoPoster(html, editorVideo) {
  const mediaRegExp = /(<video([\s\S]*?)<\/video>)/g
  const srcRegExp = /src=['"]?([^'"]*)['"]?/i
  const posterRegExp = /poster=['"]?([^'"]*)['"]?/i
  const durationRegExp = /duration=['"]?([^'"]*)['"]?/i
  let videoArr = html.match(mediaRegExp) ? html.match(mediaRegExp) : []
  videoArr.forEach(o => {
    const src = o.match(srcRegExp)
    const poster = o.match(posterRegExp)
    const duration = o.match(durationRegExp)
    let videoPoster, length
    editorVideo.forEach(v => {
      if (src[1] == v.src) {
        videoPoster = v.poster
        length = v.duration
      }
    })
    let newText = o
    if (poster && !poster[1]) {
      newText = newText.replace(poster[0], `poster="${videoPoster}"`)
    }
    if (duration && !duration[1]) {
      newText = newText.replace(duration[0], `duration="${length}"`)
    }
    if (duration && !duration[1]) {
      newText = newText.replace(duration[0], `duration="${length}"`)
    }
    console.log()
    html = newText ? html.replace(o, newText) : html
  })
  return html
}

export function htmlSplitImage(htmlArr) {
  // console.log(htmlArr)
  const imgRegExp = /<img([\s\S]*?)\/>/g
  const srcRegExp = /src=['"]{1}([^'"]*)['"]{1}/i

  htmlArr.forEach((item, index) => {
    if (Object.prototype.toString.call(item) === '[object Object]') {
      return
    }
    const imgArr = []
    item = item.replace(imgRegExp, function(it) {
      imgArr.push(it)
      return '_RegExp_'
    })
    if (!imgArr.length) {
      return
    }
    const itemArr = item.split('_RegExp_')
    const arr = []
    if (imgArr && imgArr.length) {
      itemArr.forEach((item, i) => {
        arr.push(item)
        if (i < imgArr.length) {
          const imgItem = imgArr[i]
          const src = imgItem.match(srcRegExp)
          arr.push({
            sourceCode: imgArr[i],
            type: 'Image',
            content: src[1],
            src: src[1]
          })
        }
      })
    }
    htmlArr.splice(index, 1, arr)
  })
  return _flattenDeep(htmlArr)
}

export function htmlSplitText(htmlArr) {
  const tagRegExp = /<[\s\S]*?>/g
  const pRegExp = /(<p([\s\S]*?)<\/p>)/g
  const emptyRegExp = /[&nbsp; \r\n]/g
  htmlArr.forEach((item, index) => {
    if (isObject(item)) return
    const pArr = item.match(pRegExp)
    if (pArr) {
      item = pArr.join('')
    }
    const itemSourceCode = item
    item = item.replace(tagRegExp, '')
    item = item.replace(emptyRegExp, '')
    if (item) {
      htmlArr[index] = {
        type: 'Text',
        content: item,
        sourceCode: itemSourceCode
      }
    } else {
      htmlArr[index] = item
    }
  })
  return htmlArr.filter(item => item)
}

export function structuredHtml(htmlArr) {
  // native跳转 mk:/// 会被替换为 `mk://${location.hostname}`导致无法跳转到app
  let str = `mk://${location.hostname}`
  htmlArr.forEach((item, index) => {
    if (isObject(item)) return

    htmlArr[index] = {
      type: 'Text',
      content: item.indexOf(str) > -1 ? item.replace(str, 'mk://') : item,
      sourceCode: item.indexOf(str) > -1 ? item.replace(str, 'mk://') : item
    }
  })
  return htmlArr
}

export function article2RichText(detail, type) {
  let content = ''
  detail.forEach(item => {
    if (type === 'Struct') {
      if (item.type === 'Text') {
        content += item.sourceCode
      } else {
        content += `<p style="text-align: center;">${item.sourceCode}</p>`
      }
    } else {
      content += item.sourceCode
    }
  })

  return content
}

export function tinyMCEInsertCustom(editor, custom) {
  editor.insertContent(
    `<div id="CUSTOM_PLACEHOLDER"><input id="${custom.id}_$$_${
      custom.customProductName
    }_$$_${custom.customProductValue}_$$_${
      custom.imageUrl ? custom.imageUrl : ''
    }" style="text-align:center;" value="${
      custom.customProductName
    }" disabled></div>`
  )
}

export function tinyMCEInsertBgc(editor, bgc) {
  let params = {}
  params.id = bgc.id
  params.cover = bgc.cover
  params.title = bgc.title
  params.content = cutString(bgc.text_content, 80)
  editor.insertContent(
    `<a data-type="bgc" data-params='${JSON.stringify(
      params
    )}'><input type="button" value="Embed BGC__${bgc.title}"></a>`
  )
}

export function tinyMCEInsertProductLink(editor, product, selText) {
  let linkTab = `<a data-type="product" style="color:green;" data-params="${product.sku_id}">${selText}</a>`
  editor.selection.setContent(linkTab)
}

export function tinyMCEInsertProductBlock(editor, product, name) {
  editor.insertContent(
    `<p><a data-type="product" data-params="${product.sku_id}"><input type="button" value="Embed Product__${name}"></a></p>`
  )
}

export function tinyMCEInsertMaterial(editor, material, type) {
  let tab = ''
  if (type == 'Picture') {
    tab = `<p><a href=""><img src="${material.url}" data-params='${material.property}' alt="" width="50%" /></a></p>`
  } else if (type == 'Video') {
    tab = `<p><video controls="controls"  data-params='${material.property}' poster="${material.coverImageUrl}">
    <source src="${material.url}" type="video/mp4" /></video></p>`
  } else if (type == 'Audio') {
    tab = `<p><audio src="${material.url}"  data-params='${material.property}' controls="controls"></audio></p>`
  } else if (type == 'image/png') {
    tab = `<p><a href=""><img src="${material.url}" dataß-params='${material.property}' alt="" width="50%" /></a></p>`
  }
  editor.selection.setContent(tab)
}

export function tinyMCECreatePlugins(that, editor) {
  editor.ui.registry.addMenuButton('customButton', {
    text: 'custom',
    fetch: callback => {
      let items = []
      that.customs.forEach(item => {
        items.push({
          type: 'menuitem',
          text: item.name,
          onAction: function() {
            that.currentCustomForm = item
            that.showUploadCustomImageDialog = true
            // tinyMCEInsertCustom(editor, item)
          }
        })
      })
      callback(items)
    },
    onSetup: function(api) {
      function customEventCallback() {
        let el = editor.selection.getNode()

        if (el.nodeName === 'DIV' && el.id === 'CUSTOM_PLACEHOLDER') {
          const customItem = []
          for (const item of el.children) {
            if (item.nodeName === 'INPUT') {
              customItem.push(item)
            }
          }
          // 如果发现div_CUSTOM_PLACEHOLDER中没有input，说明input 被删除，div_CUSTOM_PLACEHOLDER也一起删除
          if (customItem.length === 0) {
            el.parentElement.removeChild(el)
            editor.selection.setRng(editor.selection.getRng())
          }
          api.setActive(true)
        } else {
          api.setActive(false)
        }
      }

      function isCustomPlaceHolderDiv(el) {
        if (el.nodeName === 'DIV' && el.id === 'CUSTOM_PLACEHOLDER') {
          return true
        }
        let parentEl = el.parentElement
        while (parentEl) {
          if (
            parentEl.nodeName === 'DIV' &&
            parentEl.id === 'CUSTOM_PLACEHOLDER'
          ) {
            return true
          }
          parentEl = parentEl.parentElement
        }
      }

      function preventEvent(e) {
        let el = editor.selection.getNode()
        if (isCustomPlaceHolderDiv(el)) {
          e.preventDefault(true)
          return false
        }
      }

      function paste() {
        let el = editor.selection.getNode()
        if (isCustomPlaceHolderDiv(el)) {
          return false
        }
      }
      editor.on('NodeChange', customEventCallback)
      editor.on('KeyPress', preventEvent)
      // editor.on('Paste', preventEvent)
      editor.on('PastePreProcess', paste)
      return function() {
        editor.off('NodeChange', customEventCallback)
        editor.off('KeyPress', preventEvent)
        // editor.off('Paste', preventEvent)
        editor.off('PastePreProcess', paste)
      }
    }
  })
  editor.ui.registry.addButton('searchResource', {
    text: 'search',
    onAction: () => {
      that.showFindResourcesDialog = true
      that.getResourcesList(1)
    }
  })
  // 避免与原有逻辑冲突
  editor.ui.registry.addButton('searchResources', {
    text: 'search',
    onAction: () => {
      that.tinymceSearch()
    }
  })
  // 添加链接
  editor.ui.registry.addButton('updatelink', {
    text: '',
    icon: 'link',
    onAction: () => {
      that.linkform = {
        rcapp: '',
        rcmini: '',
        local: ''
      }
      const anchorNode = editor.selection.getSel().anchorNode
      if (anchorNode.localName == 'a') {
        const attributes = {
          rcapp: anchorNode.getAttribute('data-rcapp'),
          rcmini: anchorNode.getAttribute('data-rcmini'),
          local: anchorNode.getAttribute('data-local')
        }
        console.log('attributes', attributes)
        that.linkform = attributes
      }
      that.linkdialog = true
    }
  })
  editor.ui.registry.addMenuItem('mytest', {
    text: 'Link',
    icon: 'link',
    onAction: () => {
      that.linkform = {
        rcapp: '',
        rcmini: '',
        local: ''
      }
      // console.log('selection', editor.selection)
      // console.log('rng', editor.selection.getRng(true))
      // console.log('getContent', editor.selection.getContent())
      // console.log('getBoundingClientRect', editor.selection.getBoundingClientRect())
      // console.log('getBookmark', editor.selection.getBookmark())
      // console.log('getEnd', editor.selection.getEnd())
      // console.log('getNode', editor.selection.getNode())
      // console.log('getNode parenNode', editor.selection.getNode().parenNode)
      // console.log('getSel', editor.selection.getSel())
      // console.log('getSelectedBlocks', editor.selection.getSelectedBlocks())
      // console.log('getStart', editor.selection.getStart())
      const anchorNode = editor.selection.getSel().anchorNode
      if (anchorNode.localName == 'a') {
        const attributes = {
          rcapp: anchorNode.getAttribute('data-rcapp'),
          rcmini: anchorNode.getAttribute('data-rcmini'),
          local: anchorNode.getAttribute('data-local')
        }
        console.log('attributes', attributes)
        that.linkform = attributes
      }
      that.linkdialog = true
    }
  })
  //editor.addMenuItem
  editor.ui.registry.addButton('uploadResource', {
    text: 'upload',
    onAction: () => {
      that.showAddResourceDialog = true
      that.tinymceUpload()
    }
  })
  // 设置文字环绕
  editor.ui.registry.addToggleButton('imgTextWrapping', {
    text: 'imgTextWrapping',
    onSetup: function(api) {
      const editorEventCallback = () => {
        let el = editor.selection.getNode()
        if (el.nodeName === 'IMG') {
          api.setDisabled(false)
          api.setActive(editor.selection.dom.getStyle(el, 'float'))
        } else {
          api.setDisabled(true)
        }
      }
      editor.on('NodeChange', editorEventCallback)

      return function() {
        editor.off('NodeChange', editorEventCallback)
      }
    },
    onAction: api => {
      // 判断图片是块儿还是在文字行内
      let el = editor.selection.getNode()
      if (!el.nodeName === 'IMG') {
        return
      }
      if (api.isActive()) {
        editor.selection.dom.setStyle(el, 'float', '')
        editor.selection.setRng(editor.selection.getRng())
        api.setActive(false)
        return
      }
      // 图片的父元素是span，
      let wrap = el.parentElement
      if (wrap.childNodes.length > 1) {
        // 行内
        editor.selection.setCursorLocation(wrap, 1)
        const elm = editor.selection.getNode()
        editor.selection.dom.setStyle(el, 'float', 'left')
        editor.selection.dom.setStyles(elm, {
          display: 'inline-block',
          overflow: 'hidden'
        })

        editor.selection.setRng(editor.selection.getRng())
        api.setActive(true)
      } else {
        // 行内
      }
    }
  })
  editor.ui.registry.addButton('setBlockStyle', {
    text: 'setBlockStyle',
    onAction: () => {
      // console.log('selection', editor.selection)
      // console.log('rng', editor.selection.getRng(true))
      // console.log('getContent', editor.selection.getContent())
      // console.log('getBoundingClientRect', editor.selection.getBoundingClientRect())
      // console.log('getBookmark', editor.selection.getBookmark())
      // console.log('getEnd', editor.selection.getEnd())
      // console.log('getNode', editor.selection.getNode())
      // console.log('getSel', editor.selection.getSel())
      // console.log('getSelectedBlocks', editor.selection.getSelectedBlocks())
      // console.log('getStart', editor.selection.getStart())
      let blocks = editor.selection.getSelectedBlocks()
      let cacheWrap = blocks[0].parentElement
      let hasWrap = true
      for (let index = 0; index < blocks.length; index++) {
        const element = blocks[index]
        if (element.parentElement !== cacheWrap) {
          hasWrap = false
        }
      }
      if (cacheWrap.children.length !== blocks.length) {
        hasWrap = false
      }
      if (cacheWrap.nodeName !== 'BODY' && hasWrap) {
        blocks = [blocks[0].parentElement]
      }
      // return
      // while (blocks[0].parentElement.nodeName !== 'BODY') {
      //   blocks = [blocks[0].parentElement]
      // }
      let block = null
      if (blocks.length === 1) {
        block = blocks[0]
      } else {
        block = document.createElement('div')
        editor.selection.dom.addClass(block, 'block-wrap')
      }

      editor.selection.setCursorLocation(block, 0)
      const padding = editor.selection.dom.getStyle(block, 'padding')
      const backgroundImage = editor.selection.dom.getStyle(
        block,
        'backgroundImage'
      )
      const backgroundSize = editor.selection.dom.getStyle(
        block,
        'backgroundSize'
      )
      const margin = editor.selection.dom.getStyle(block, 'margin')

      var dialogConfig = {
        title: 'Set Block Style',
        body: {
          type: 'panel',
          items: [
            {
              type: 'input',
              name: 'backgroundImage',
              label: 'background image'
            },
            {
              type: 'input',
              name: 'padding',
              label: 'padding'
            },
            {
              type: 'input',
              name: 'margin',
              label: 'margin'
            },
            {
              type: 'selectbox',
              name: 'backgroundSize',
              label: 'background size',
              items: [
                {
                  text: 'auto',
                  value: 'auto'
                },
                {
                  text: 'cover',
                  value: 'cover'
                },
                {
                  text: 'contain',
                  value: 'contain'
                }
              ]
            }
          ]
        },
        buttons: [
          {
            type: 'cancel',
            name: 'closeButton',
            text: 'Cancel'
          },
          {
            type: 'submit',
            name: 'submitButton',
            text: 'Do Cat Thing',
            primary: true
          }
        ],
        initialData: {
          backgroundImage: backgroundImage.replace(/url\("(.*?)"\)/, '$1'),
          backgroundSize: backgroundSize || 'auto',
          padding: padding,
          margin: margin
        },
        onSubmit: function(api) {
          var data = api.getData()
          editor.selection.dom.setStyles(block, {
            background: data.backgroundImage
              ? `url("${data.backgroundImage}") no-repeat`
              : '',
            backgroundSize: data.backgroundSize,
            padding: data.padding,
            margin: data.margin
          })
          if (blocks.length > 1) {
            for (let index = 0; index < blocks.length; index++) {
              const element = blocks[index]
              block.appendChild(element)
            }
            editor.selection.setNode(block)
          }
          editor.selection.setRng(editor.selection.getRng())
          api.close()
        }
      }
      editor.windowManager.open(dialogConfig)
    }
  })
  editor.ui.registry.addButton('previewMobile', {
    text: 'Preview',
    onAction: () => {
      that.showPreviewDialog = true
    }
  })
  //插入bgc文章
  editor.ui.registry.addButton('bgcButton', {
    text: 'Bgc',
    onAction: () => {
      that.showBgcListDialog = true
      that.getArticleList()
    }
  })

  //插入文本产品
  editor.ui.registry.addButton('productLinkButton', {
    text: 'Product&Link',
    onAction: () => {
      that.prductInsertType = 'Link'
      that.addProductLink()
      if (that.selText) {
        that.dialogProductTitle = 'Insert Product Link'
        that.showProductDialog = true
        that.productFrom.sku_id = ''
        that.product.name = ''
        that.product.sku = ''
      } else {
        that.$message.error('Please select the product you want to add')
      }
    }
  })

  //插入段落产品
  editor.ui.registry.addButton('productBlockButton', {
    text: 'Product&Block',
    onAction: () => {
      that.dialogProductTitle = 'Insert Product Block'
      that.prductInsertType = 'Block'
      that.showProductDialog = true
      that.productFrom.sku_id = ''
      that.product.name = ''
      that.product.sku = ''
    }
  })

  //图片管理
  editor.ui.registry.addButton('imageButton', {
    text: 'Images',
    onAction: () => {
      that.resourceRow = {}
      that.resourceRadio = ''
      that.resourceSelect = 'Picture'
      that.showResourceDialog = true
    }
  })

  //视频管理
  editor.ui.registry.addButton('videoButton', {
    text: 'Video',
    onAction: () => {
      that.resourceRow = {}
      that.resourceRadio = ''
      that.resourceSelect = 'Video'
      that.showResourceDialog = true
    }
  })

  //音频管理
  editor.ui.registry.addButton('audioButton', {
    text: 'Audio',
    onAction: () => {
      that.resourceRow = {}
      that.resourceRadio = ''
      that.resourceSelect = 'Audio'
      that.showResourceDialog = true
    }
  })
  // 插入 图片组
  editor.ui.registry.addButton('ImageGroup', {
    text: 'ImageGroup',
    onAction: () => {
      let ImageNum = 0
      const selectNumDialogConfig = {
        title: '选择图片数量',
        body: {
          type: 'panel',
          items: [
            {
              type: 'selectbox',
              name: 'imageNum',
              label: '图片数量',
              items: [
                {
                  text: '2',
                  value: '2'
                },
                {
                  text: '3',
                  value: '3'
                },
                {
                  text: '4',
                  value: '4'
                }
              ]
            }
          ]
        },
        buttons: [
          {
            type: 'cancel',
            name: 'closeButton',
            text: 'Cancel'
          },
          {
            type: 'submit',
            name: 'submitButton',
            text: 'confirm',
            primary: true
          }
        ],
        onSubmit: function(api) {
          var dialogData = api.getData()
          var panelItems = []
          ImageNum = Number(dialogData.imageNum)
          for (var i = 0; i < ImageNum; i++) {
            panelItems.push({
              type: 'urlinput', // component type
              name: 'image' + (i + 1), // identifier
              filetype: 'image', // restrict file types to image types
              label: '图片' + '：' + (i + 1), // text for component label
              disabled: true // disabled state
            })
          }
          dialogConfig.body.items = panelItems
          console.log('dialogConfig, ', dialogConfig)
          editor.windowManager.open(dialogConfig)
          api.close()
        }
      }
      var dialogConfig = {
        title: '上传图片',
        body: {
          type: 'panel',
          items: []
        },
        buttons: [
          {
            type: 'cancel',
            name: 'closeButton',
            text: 'Cancel'
          },
          {
            type: 'submit',
            name: 'submitButton',
            text: 'confirm',
            primary: true
          }
        ],
        onSubmit: function(api) {
          console.log(api)
          let blocks = editor.selection.getSelectedBlocks()
          let block = null
          if (blocks.length === 1) {
            block = blocks[0]
          } else {
            block = document.createElement('p')
          }
          editor.selection.dom.addClass(block, 'img-group-container')
          // editor.selection.dom.setStyles(block, {
          //   display: 'flex',
          //   justifyContent: 'flex-start',
          //   alignItem: 'center'
          // })
          const data = api.getData()
          for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
              const item = data[key]
              const img = document.createElement('img')
              editor.selection.dom.setStyles(img, {
                width: `${100 / ImageNum}%`,
                height: 'auto'
              })
              img.src = item.value
              block.appendChild(img)
            }
          }
          editor.selection.setRng(editor.selection.getRng())
          api.close()
        }
      }
      editor.windowManager.open(selectNumDialogConfig)
    }
  })
}
