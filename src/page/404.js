import { Link } from "react-router-dom";
function ErrorNot404(){
    return (<div  style={{"minHeight": "1604.44px"}}>
  
    <section className="content-header">
      <div className="container-fluid">
        <div className="row mb-2">
         
         
        </div>
      </div>
    </section>


    <section className="content">
      <div className="error-page">
        <h2 className="headline text-warning"> 404</h2>

        <div className="error-content">
          <h3><i className="fas fa-exclamation-triangle text-warning"></i> Làm gì có trang này.</h3>

          <p>
            Thông thể tìm thấy trang yêu cầu <Link to="/">Trở lại trang chủ</Link> hoặc refresh lại trang
          </p>

         
        </div>
       
      </div>
     
    </section>
    
  </div>)
}
export default ErrorNot404;