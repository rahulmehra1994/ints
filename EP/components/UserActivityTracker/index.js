import { createAsyncComponent } from 'react-async-component'

export default createAsyncComponent({
  resolve: () =>
    new Promise(resolve =>
      require.ensure([], require => {
        resolve(require('./component'))
      })
    ),
})
