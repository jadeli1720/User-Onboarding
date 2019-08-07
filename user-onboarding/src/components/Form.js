import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Field, withFormik } from "formik";
import * as Yup from "yup";

const UsersForm = (props) => {
    const [users, setUsers] = useState([])

    return (
        <div className='userForm-container'>
            <h1> Registration</h1>
            <p>Please use the following form to register</p>
            <Form className="userForm">
                <Field type='text' name='name' placeholder="Please enter your name" />
                <Field type='email' name='email' placeholder='Email' />
                <Field type='password' name='password' placeholder='password'  />
                <label>
                    <Field
                        type='checkbox'
                        name='termsOfService'
                        value='checked'
                     />
                     I have read and agree with the <a href="#">Terms of Service</a>
                </label>
                <button type='submit'>Submit</button>
            </Form>
        </div>
    )

}

//Higher Order Component - HOC
//This allows the form to work by wiring it up with Formik
const FormikUsersForm = withFormik({

    //handles state and state changes of the form
    mapPropsToValues({ name, email, password, termsOfService }) {
        return {
            name: name || '',
            email: email || '',
            password: password || '',
            termsOfService: termsOfService || false
        };
    },

    //======VALIDATION SCHEMA==========
    validationSchema: Yup.object().shape({
        name: Yup.string()
                 .required(),

        email: Yup.string()
                  .email('Email not valid')
                  .required('Email is required'),

        password: Yup.string()
                     .min(6, 'Password must be 6 characters or longer')
                     .required(),

        termsOfService: Yup.bool()
                           .oneOf([true], 'Field must be checked')
    }),
    //======END VALIDATION SCHEMA==========

    //handle submit with axios post()
    handleSubmit(values, {resetForm}) {
        // console.log('Form submitted', values);// coded before axios call to make sure the inputs are working and logging to the console.
        axios
            .post("https://reqres.in/api/users/", values)
            .then(res => {
                console.log('Form was a success', res)
                //call resetForm to reset the values(clear the inputs) of the form.
                resetForm();
            })
            .catch(err => console.log('Opps! Something went wrong.',err.response));
    }

})(UsersForm);


export default FormikUsersForm;