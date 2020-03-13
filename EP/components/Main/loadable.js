import Loadable from 'react-loadable'
import CenterLoading from '../CenterLoading'

const LoadableComponent = Loadable({
  loader: () => import('./index'),
  loading: CenterLoading,
})

export default LoadableComponent
