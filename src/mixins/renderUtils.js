export default {
  methods: {
    renderScopes(groupDocumentScope) {
      return groupDocumentScope
        .map((scope) => {
          if (!scope.pathName) return ''
          return `<div>${scope.pathName}</div>`
        })
        .join('')
    }
  }
}
