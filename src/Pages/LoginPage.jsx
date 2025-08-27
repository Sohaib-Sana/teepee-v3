import React from 'react'
import LoginForm from '../components/AuthComponents/LoginForm'
import LoginOptions from '../components/AuthComponents/LoginOptions'
import { useDispatch, useSelector } from 'react-redux'
import { loginSteps, setAuthView } from '../store/slices/authUiSlice'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const loginAuthView = useSelector((state)=>state.ui.authView)
  const handleCreateNewAccount = ()=>{
    navigate('/register')
  }
  return (
    <div>
      {loginAuthView === loginSteps.OptionsView? <LoginOptions onEmail={()=>{dispatch(setAuthView(loginSteps.EmailView))}}/> :<LoginForm/>}
      <div className="form-divider">Or</div>

      <button type="button" className="link-button" onClick={handleCreateNewAccount}>
        Create new account
      </button>
    </div>
  
  )
}

export default LoginPage