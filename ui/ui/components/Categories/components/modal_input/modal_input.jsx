import Modal from 'react-modal'

require('./style.css')

// text-muted: rgb(119, 119, 119)
// text-primary: rgb(51, 122, 183)
// text-success: rgb(60, 118, 61)
// text-info: rgb(67, 124, 153)
// text-warning: rgb(138, 109, 59)
// text-danger rgb(169, 68, 66)
// const STATUS_COLOR = {
//   started: 'rgb(51, 122, 183)',
//   finished: 'rgb(60, 118, 61)',
//   errored: 'rgb(169, 68, 66)',
//   pending: 'rgb(119, 119, 119)',
//   queued: 'rgb(119, 119, 119)',
// }

class ModalInput extends React.Component {
  constructor(props) {
    super(props)

    this.onOpenModal = this.onOpenModal.bind(this)
    this.onCloseModal = this.onCloseModal.bind(this)
    this.handleSubmit = this.submit.bind(this)

    this.state = { show: false, dag: {}, colors: {} }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ show: nextProps.show })
  }

  onOpenModal() {
    this.setState({ show: true })
  }

  onCloseModal() {
    this.setState({ show: false })
  }

  submit() {
    const { submitHandler } = this.props
    const user = this.refs.user.value
    const password = this.refs.password.value
    if (user && password) {
      submitHandler(user, password)
    } else {
      alert('no user or password')
    }

    setTimeout(() => {
      this.setState({ show: false })
    }, 500)
  }


  render() {
    const { show } = this.state
    const { buttonTitle } = this.props

    return (
      <div className="showDag">
        <button className="btn btn-xs btn-info" onClick={ this.onOpenModal } > { buttonTitle } </button>
        <Modal
          isOpen={ show }
          onRequestClose={ this.onCloseModal }
          className="modalContent"
          overlayClassName="modalOverlay"
        >
          <div className="modalBody" ref="modalBody">
            <div className="input-group-sm">
              <input type="text" className="form-control" placeholder="Username" ref="user" />
            </div>
            <div className="input-group-sm">
              <input type="text" className="form-control" placeholder="Password" ref="password" />
            </div>
            <button className="btn btn-xs" onClick={ this.handleSubmit }> Submit </button>
          </div>
        </Modal>
      </div>
    )
  }
}

const { func, string } = React.PropTypes
ModalInput.propTypes = {
  submitHandler: func,
  buttonTitle: string,
}

export default ModalInput
