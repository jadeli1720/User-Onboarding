import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Field, withFormik } from "formik";
import * as Yup from "yup";

const UsersForm = ({ errors, touched, values, status }) => {
    //Used to update users and display them below the form
    const [users, setUsers] = useState([]);
    console.log(users)

    //get the status from props
    useEffect(() => {
        if(status) {
            setUsers([...users, status]);
        }
    }, [status]);

    return (
        <div className='userForm-container'>
            <h1> User Sign in</h1>
            <p>Please use the following form to sign in.</p>
            <Form className="userForm">
                <Field type='text' name='name' placeholder="Please enter your name" />
                {touched.name && errors.name && (
                    <p className='errors'>{errors.name}</p>
                )}

                <Field type='email' name='email' placeholder='Email' />
                {touched.email && errors.email && (
                    <p className='errors'>{errors.email}</p>
                )}

                <Field type='password' name='password' placeholder='password'  />
                {touched.password && errors.password && (
                    <p className='errors'>{errors.password}</p>
                )}

                <label>
                    <Field
                        type='checkbox'
                        name='termsOfService'
                        value='checked'
                     />
                     I have read and agree with the <a href="#">Terms of Service</a>
                </label>
                {touched.termsOfService && errors.termsOfService && (
                    <p className='errors'>{errors.termsOfService}</p>
                )}

                <button type='submit'>Submit</button>
            </Form>
            {/* Displaying Returned Data to screen once the state of users has been updated and added to the array. useEffect is used to update the status and display the side effect used fromt he handleSubmit setStatus()*/}
            <div className="userList">
                {users.map(user => (
                    <p key={user.id} className="printedUsers">{user.name}</p>
                ))}
            </div>
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
                 .required("Name is required"),

        email: Yup.string()
                  .email('Email not valid')
                  .required('Email is required'),

        password: Yup.string()
                     .min(6, 'Password must be 6 characters or longer')
                     .required('Password is required'),

        termsOfService: Yup.bool()
                           .oneOf([true], 'Field must be checked')
    }),
    //======END VALIDATION SCHEMA==========

    //handle submit with axios post()
    handleSubmit(values, {resetForm, setStatus}) {
        // console.log('Form submitted', values);// coded before axios call to make sure the inputs are working and logging to the console.
        axios
            .post("https://reqres.in/api/users/", values)
            .then(res => {
                console.log('Form was a success', res)
                //call resetForm to reset the values(clear the inputs) of the form.
                resetForm();
                // call setStatus and pass in the object you want to add to state
                setStatus(res.data)
            })
            .catch(err => console.log('Opps! Something went wrong.',err.response));
    }
})(UsersForm);


export default FormikUsersForm;