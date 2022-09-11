import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import authenticationApi from "../api/auth/authenticationApi";
import { login } from "./userReduce";
import { logout } from "./userReduce";
import {useDispatch} from "react-redux";
function Login(){
    const dispatch = useDispatch();
    const history = useNavigate();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState(false);
    const [errorName, setErrorName] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const handleSetName = (value) => {
        setStatus(false);
        if(value.length <= 7 || value[0] === ' '){
             setErrorName("* Tên phải ít nhất 7 ký tự");
        }else {
             setErrorName(false);
        }
        setName(value);
    }
    const handleSetPassword = (value) => {
        setStatus(false);
        if(value.length <= 7 || value[0] === ' '){
             setErrorPassword("* Mật khẩu phải ít nhất 7 ký tự");
        }else {
             setErrorPassword(false);
        }
        setPassword(value);
    }
    const handleSubmit = async () => {
        if(name === '' || password === ''){
            if(name === '')  setErrorName("* Tên không được để trống");
            if(password === '')  setErrorPassword("* Mật khẩu không được để trống");
        }else {
            if(errorName === false && errorPassword === false){
                const response = await authenticationApi.login({name :name, password : password });
                if(response.status === 'error'){
                  dispatch(logout());
                  localStorage.setItem('_id',null);
                    localStorage.setItem('name',null);
                    setStatus(response.message);
                }else if(response.status === 'success'){
                    localStorage.setItem('_id',response.data._id);
                    localStorage.setItem('name',response.data.name);
                    dispatch(login({
                       id : response.data._id,
                       name : response.data.name
                    }))
                    history(`/`);
                }
            }
        }
    }
    return (
    <div className="login-page" style={{"minHeight": "496.781px"}}> 
    <div className="login-box">
    <div className="login-logo">
      <Link to="/"><b>Đăng nhập</b></Link>
    </div>
   
    <div className="card">
      <div className="card-body login-card-body">
        <p className="login-box-msg">Đăng nhập với phiên của bạn</p>
  
        <form >
          <div className="input-group mb-3">
            <input 
            onChange={(e) => handleSetName(e.target.value)}
            value={name}
            type="text" className="form-control" placeholder="Name" />
            <div className="input-group-append">
              <div className="input-group-text">
                <span className="fas fa-envelope"></span>
              </div>
            </div>
          </div>
          {errorName && <span style={{"color" : "red"}} >
            {errorName}
        </span>}
          <div className="input-group mb-3">
            <input 
             onChange={(e) => handleSetPassword(e.target.value)}
             value={password}
            type="password" className="form-control" placeholder="Password" />
            <div className="input-group-append">
              <div className="input-group-text">
                <span className="fas fa-lock"></span>
              </div>
            </div>
          </div>
          {errorPassword && <span style={{"color" : "red"}} >
            {errorPassword}
        </span>}
          <div className="row">
            <div className="col-8">
              <div className="icheck-primary">
                <input type="checkbox" id="remember" />
                <label >
                  Remember Me
                </label>
              </div>
            </div>
          
            <div className="col-4">
              <button type="button" onClick={() => handleSubmit()} className="btn btn-primary btn-block">Log gin</button>
            </div>
           
          </div>
          
        </form>
 
        <p className="mb-0">
          <Link to="/register" className="text-center">Đăng ký</Link>
        </p>
      </div>
      {status &&  <Link to="#" className="btn btn-block btn-danger">
          {status}
        </Link>}
     
    </div>
  </div> </div>)
}
export default Login;