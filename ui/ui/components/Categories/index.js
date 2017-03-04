import Component from './component'
import reducer from './reducer'
import { watchers } from './saga'

export default { reducer, saga: watchers, Component }
