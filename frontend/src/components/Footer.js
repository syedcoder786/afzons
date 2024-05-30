import React from 'react'
// import { Container, Row, Col } from 'react-bootstrap'

import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    // <footer>
    //   <Container>
    //     <Row>
    //       <Col className='text-center py-3'>Copyright &copy; Afzone</Col>
    //     </Row>
    //   </Container>
    // </footer>

    <footer class="footer">
    <div class="container">
        <div class="row">
        <div class="col-sm-3">
            <h4 class="title">Contact Us</h4>
            <a style={{fontSize: "16px"}}><i class="fas fa-phone-square-alt" aria-hidden="true">  +91-8077563700</i></a><br/>
            <a style={{fontSize: "16px"}}><i class="fas fa-envelope-square" aria-hidden="true">  khanaliaamir2@gmail.com</i></a><br/><br/>
            <h4 class="title">About Us</h4>
            <p>We sell good quality furniture at reasonable price.</p>
            <ul class="social-icon">
            <a href="#" class="social"><i class="fa fa-facebook" aria-hidden="true"></i></a>
            <a href="#" class="social"><i class="fa fa-twitter" aria-hidden="true"></i></a>
            <a href="#" class="social"><i class="fa fa-instagram" aria-hidden="true"></i></a>
            <a href="#" class="social"><i class="fa fa-youtube-play" aria-hidden="true"></i></a>
            <a href="#" class="social"><i class="fa fa-google" aria-hidden="true"></i></a>
            {/* <a href="#" class="social"><i class="fa fa-dribbble" aria-hidden="true"></i></a> */}
            </ul>
            </div>
        <div class="col-sm-3">
            <h4 class="title">My Account</h4>
            <span class="acount-icon">          
            {/* <a href="#"><i class="fa fa-heart" aria-hidden="true"></i> Wish List</a> */}
            <Link to="/cart"><i class="fa fa-cart-plus" aria-hidden="true"></i> Cart</Link>
            <Link to="/profile"><i class="fa fa-user" aria-hidden="true"></i> Profile</Link>
            <Link to="/privacypolicy">
              {/* <i class="fa fa-user" aria-hidden="true"></i>  */}
              Privacy Policy
            </Link>
            {/* <a href="#"><i class="fa fa-globe" aria-hidden="true"></i> Language</a>*/}
          </span>
            </div>
        <div class="col-sm-3">
            <h4 class="title">Category</h4>
            <div class="category">
            <a >Furniture</a>
            <a >Sofa</a>
            <a >Bed</a>
            <a >Cupboard</a>
            {/* <a >girl</a>
            <a >bag</a>
            <a >teshart</a>
            <a >top</a>
            <a >shos</a>
            <a >glass</a>
            <a >kit</a>
            <a >baby dress</a>
            <a >kurti</a>*/}
            </div>
            </div>
        <div class="col-sm-3">
            <h4 class="title">Payment Methods</h4>
            <p>All types of payment methods are accepted. <span style={{color:"silver"}}>Paytm, PhonePay, GooglePay, UPI, NetBanking, Credit Card, Debit Card, Wallets, Pay Later.</span></p>
            <ul class="payment">
            <li><a><i class="fa fa-cc-mastercard" aria-hidden="true"></i></a></li>
            <li><a><i class="fa fa-credit-card" aria-hidden="true"></i></a></li>            
            <li><a><i class="fa fa-paypal" aria-hidden="true"></i></a></li>
            <li><a><i class="fa fa-cc-visa" aria-hidden="true"></i></a></li>
            <li><a><i class="fa fa fa-bank" aria-hidden="true"></i></a></li>
            </ul>
            </div>
        </div>
        <hr/>
        
        <div><center><span style={{color:"silver", fontSize: "16px"}}>Syed Mohdin (Jamia Millia Islamia)</span> Web Development © {new Date().getFullYear()}. <p>All rights reserved.</p></center> </div>
        </div>
    </footer>
  )
}

export default Footer
