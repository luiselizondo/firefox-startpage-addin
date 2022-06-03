function onRejected(error) {
  console.log(`An error: ${error}`);
}

function onReady() {
  browser.bookmarks.getTree()
  .then(printTree, onRejected)
  .then(() => {
    const query = {
    text: "",
    startTime: 0,
    maxResults: 9
  }

    return browser.history.search(query)
  })
  .then(addHistory, onRejected)
  .then(() => {
    return browser.topSites.get()
  })
  .then(addTopSites)
}

function printTree(tree) {
  let root = tree[0].children[1]
  addFavorites(root.children)
}

function addFavorites(items) {
  const list = document.getElementById('favorites')
  const elements = document.createDocumentFragment()

  for (let item of items) {
    if (item.type === 'bookmark') {
      let randomColor = Math.floor(Math.random()*16777215).toString(16);
      let link = createLink(item, randomColor)
      elements.appendChild(link)
    }
  }

  list.appendChild(elements)
}

function createLink(item, randomColor) {
  let box = document.createElement('div')
  box.setAttribute('class', 'box')

  const icon = createIcon(item.url)

  let frame = document.createElement('a')

  frame.setAttribute('class', 'frame')
  frame.textContent = icon
  frame.setAttribute('href', item.url)
  frame.setAttribute('name', item.url)
  frame.setAttribute('style', `background-color: #${randomColor}`)

  let title = document.createElement('a')
  title.setAttribute('class', 'title')
  title.textContent = item.title
  title.setAttribute('href', item.url)
  title.setAttribute('name', item.url)

  box.appendChild(frame)
  box.appendChild(title)

  return box
}

function createIcon (href) {
  const url = new URL(href)
  const firstLetter = url.hostname.replace('www.', '').charAt(0)
  return firstLetter
}

function addHistory(items) {
  const list = document.getElementById('history')
  const elements = document.createDocumentFragment()

  for (let item of items) {
    let link = createHistoryLink(item)
    elements.appendChild(link)
  }

  list.appendChild(elements)
}

function createHistoryLink(item) {
  let box = document.createElement('div')
  box.setAttribute('class', 'history-box')

  let frame = document.createElement('a')
  frame.setAttribute('class', 'history-frame')
  frame.textContent = item.title
  frame.setAttribute('href', item.url)

  box.appendChild(frame)

  return box
}

function addTopSites(items) {
  const list = document.getElementById('topsites')
  const elements = document.createDocumentFragment()

  for (let item of items) {
    let link = createTopSite(item)
    elements.appendChild(link)
  }

  list.appendChild(elements)
}

function createTopSite(item) {
  let box = document.createElement('div')
  box.setAttribute('class', 'topsites-box')

  let frame = document.createElement('a')
  frame.setAttribute('class', 'topsites-frame')
  frame.textContent = item.title
  frame.setAttribute('href', item.url)

  box.appendChild(frame)

  return box
}

document.addEventListener("DOMContentLoaded", onReady);