import React, { useState } from 'react';
import emailjs, { init } from 'emailjs-com';
import { Formik, Form, Field } from 'formik';
import LinearProgress from '@material-ui/core/LinearProgress';
import './Form.css';
init("user_GjTbLOgaR0oYUJB1ttByG");

// validate mail form
function validateEmail(value) {
    let error;
    if (!value) {
        error = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
        error = 'Invalid email address';
    }
    return error;
}




const MailForm = ({ message, submit }) => {
    const [isSending, setIsSending] = useState(false);
    const [isMailSent, setIsMailSent] = useState(false)
    // I use eamiljs service to sent emails
    function sendEmail({ username, email, message }) {
        setIsSending(true);
        console.log("in send email")
        emailjs.send("service_jq9ho0w", "template_7uec02u", {
            from_name: "Anas Balkhadir",
            username,
            message,
            email,
        },
            "user_GjTbLOgaR0oYUJB1ttByG").then(result => {
                if (result.status == 200 && result.text == "OK")
                    setIsSending(false);
                setIsMailSent(true);
                setTimeout(submit, 1500)

            });
    }
    // Formik form  validation 
    return <div>
        <Formik
            initialValues={{
                username: '',
                email: '',
            }}
            onSubmit={values => {
                sendEmail?.({ ...values, message })
            }}
        >
            {({ errors, touched, isValidating }) => (
                <Form className="mailFom">
                    <div>
                        <label>mail:      </label>
                        <Field name="email" validate={validateEmail} />
                    </div>
                    {errors.email && touched.email && <div style={{ color: "red" }}>{errors.email}</div>}
                    <div>
                        <label> name: </label>
                        <Field name="username" />
                    </div>
                    <button type="submit">Submit</button>
                    {isSending && <LinearProgress />}
                    {isMailSent && <div style={{ color: "green", fontWeight: "bold", alignItems: "center" }}>It's done</div>}
                </Form>
            )}
        </Formik>
    </div>
}

export default MailForm;