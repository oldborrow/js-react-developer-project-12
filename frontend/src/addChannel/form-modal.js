import React, { memo } from "react";
import { withFormik, Form, FastField } from "formik";
import * as Yup from "yup";

const Schema = Yup.object().shape({
    name: Yup.string()
        .min(2, "Too Short!")
});

const FormModal = () => {
    return (
        <Form>
            <div className="box">
                <label htmlFor="name">Name</label>
                <FastField name="name" placeholder="name" />
            </div>
            <button className="button" type="submit">
                Создать
            </button>
        </Form>
    );
};

const enhanceWithFormik = withFormik({
    mapPropsToValues: () => ({ name: "" }),
    validationSchema: Schema,
    handleSubmit: values => {
        console.log(values);
    }
});

export default enhanceWithFormik(memo(FormModal));