export default {
  app: {
    api: {
      // production.
      // url: 'https://service.mdo.com.vn/api/core/',
      // contract: 'https://service.mdo.com.vn/api/',
      // ticketUrl: 'https://service.mdo.com.vn/api/',
      // task: 'https://service.mdo.com.vn/api/'

      // staging
      // url: 'https://staging.mdo.com.vn/api/core/',
      // contract: 'https://staging.mdo.com.vn/api/',
      // ticketUrl: 'https://staging.mdo.com.vn/api/',
      // task: 'https://staging.mdo.com.vn/api/'

      // test
      // url: 'http://localhost:8282/api/core/',
      url: 'https://mdo-staging.bssd.vn/api/core/',
      contract: 'https://mdo-staging.bssd.vn/api/',
      ticketUrl: 'https://mdo-staging.bssd.vn/api/',
      task: 'https://mdo-staging.bssd.vn/api/'
      // task: 'http://localhost:8282/api/'
    },
    paging: {
      pageSize: 10
    },
    sidebarTransitionTime: 300, // ms
    chartColors: {
      axisColor: '#8EA1AB'
    }
  }
}
