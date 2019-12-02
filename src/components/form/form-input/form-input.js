import React from 'react'
import { useField } from 'formik'

import { Form, Label, Header } from 'semantic-ui-react'
import './form-input.module.scss'

const FormInput = ({ id, name, label, required, control: Component = 'input', rightHelp, help, ...props }) => {
  const [field, meta] = useField(name)
  return (
    <Form.Field required={required} styleName='app-form-input'>
      <label htmlFor={id}>{label}</label>
      <Component id={id} {...field} {...props} />
      <Header as='h6' floated='right' color='grey' styleName='right-help'>{rightHelp}</Header>
      {meta.touched && !!meta.error ? (
        <Label pointing color='red'>{meta.error}</Label>
      ) : (
        help && <Label pointing>{help}</Label>
      )}
    </Form.Field>
  )
}

export default FormInput