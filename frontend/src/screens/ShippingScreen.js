import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { saveShippingAddress } from '../actions/cartActions'
import { toast } from 'react-toastify'


const ShippingScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart

  const [address, setAddress] = useState(shippingAddress.address)
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
  const [city, setCity] = useState(shippingAddress.city)
  const [state, setState] = useState(shippingAddress.state)
  const [phone, setPhone] = useState(shippingAddress.phone)

  const dispatch = useDispatch()

  const submitHandler = (e) => {
    e.preventDefault()
    if(phone.length != 10){
      toast.error("Invalid Phone")
      return
    }
    if(address.length < 8){
      toast.error("Adddress must have atleast 8 characters")
      return
    }
    if(!city || !state){
      toast.error("Invalid Pin code")
      return
    }
    dispatch(saveShippingAddress({ address, postalCode, city, state, phone }))
    history.push('/payment')
  }


  const fetchAddress = async (pin) => {
    console.log(pin)
    const req = await fetch(`https://api.postalpincode.in/pincode/${pin}`)
    const location = await req.json()
    const status = location[0].Status
    if(status === "Success"){
      const city = location[0].PostOffice[0].Block
      const state = location[0].PostOffice[0].State
      console.log(city)
      console.log(state)
      setCity(city)
      setState(state)
    }else{
      setCity("")
      setState("")
      // setFormData((prevState) => ({
      //   ...prevState,
      //   city:"",
      //   state:"",
      // }));
    }

  }

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='address'>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter address'
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='postalCode'>
          <Form.Label>PIN/Postal Code</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter pin/postal code'
            value={postalCode}
            required
            onChange={(e) => {
              if(e.target.value.length === 6){
                // console.log("calling fetchAddress")
                fetchAddress(e.target.value)
              }else{
                setCity("")
                setState("")
              }
              setPostalCode(e.target.value)
            }}
          ></Form.Control>
        </Form.Group>


        <Form.Group controlId='city'>
          <Form.Label>City</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter city'
            value={city}
            required
            disabled
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='state'>
          <Form.Label>State</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter state'
            value={state}
            required
            disabled
            onChange={(e) => setState(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='phone'>
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Phone'
            value={phone}
            required
            onChange={(e) => setPhone(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  )
}

export default ShippingScreen
