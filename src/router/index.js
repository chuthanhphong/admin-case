import {
  initCurrentUserStateMiddleware,
  checkAccessMiddleware,
  setPageTitleMiddleware
} from './middlewares'
import routes from './routes'

routes.beforeEach(initCurrentUserStateMiddleware)
routes.beforeEach(checkAccessMiddleware)
routes.beforeEach(setPageTitleMiddleware)
routes.onError(error => {
  if (/loading chunk \d* failed./i.test(error.message) && navigator.onLine) {
    window.location.reload()
  }
}) // onError
window.onerror = function(mMsg, mSource, mLineNo, mColNo, error) {
  // mMsg = Char. Error Msg: i.e. "Uncaugh SyntaxError: Unexpected token '<'"
  // mSource = Char. i.e. 'https://yoursite.com/js/chunk-431587f6.ff603bf5.js'
  // mLineNo = Numeric. Line no
  // mColNo = Numeric. Col no
  // error = Object. Error object
  if (mMsg.toLowerCase().indexOf("unexpected token '<'") > -1) {
    // this happens when a new update gets applies but my router.js file hasn't been pulled down for whatever reason. A page refresh fixes it.
    // mSource =
    if (navigator.onLine) {
      window.location.reload()
    }
  }
} // window.onerror

export default routes
