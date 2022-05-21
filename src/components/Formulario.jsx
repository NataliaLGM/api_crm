import React from 'react'
import { Formik, Form, Field }from 'formik'
import * as Yup from 'yup'
import Alerta from './Alerta'
import { useNavigate } from 'react-router-dom'
import Spinner from './Spinner'

const Formulario = ({cliente, cargando}) => {

    const navigate = useNavigate()

    const nuevoClienteSchema = Yup.object().shape({
        nombre: Yup.string()
                   .min(3, 'El Nombre es muy corto')
                   .max(20, 'El Nombre es muy largo')
                   .required('El Nombre del Cliente es Obligatorio'),
        empresa: Yup.string()
                    .required('El Nombre de la Empresa es Obligatorio'),
        email: Yup.string()
                  .email('Email no válido')
                  .required('El email es Obligatorio'),
        telefono: Yup.number()
                     .positive('El número no es válido')
                     .integer('El número no es válido')
                     .typeError('El número no es válido'),
        notas: '',
    })

    const handleSubmit = async (valores) => {
        try {
           let respuesta
           if(cliente.id){
               //Editando un Registro
                const url = `http://localhost:4000/clientes/${cliente.id}`
                respuesta = await fetch(url, {
                    method: 'PUT',
                    body: JSON.stringify(valores),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

           } else {
               // Nuevo Registro
                const url = 'http://localhost:4000/clientes'
                respuesta = await fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(valores),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
           }
            await respuesta.json()
            navigate('/clientes')

        } catch (error) {
            console.log(error)
        }   
    }
  return (
      cargando ? <Spinner /> : (
        <div className='bg-white mt-10 px-5 py-10 rounded-md shadow-md md:w-3/4 mx-auto'>
        <h1 className='text-gray-600 font-bold text-xl uppercase text-center'>{cliente?.nombre ? 'Editar Cliente' : 'Agregar Cliente'}</h1>

        <Formik
            initialValues={{
                nombre: cliente?.nombre ?? '',
                empresa: cliente?.empresa ?? '',
                email: cliente?.email ?? '',
                telefono: cliente?.telefono ?? '',
                notas: cliente?.notas ?? '',
            }}
            enableReinitialize={true}
            onSubmit={ async (values, {resetForm}) => {
                await handleSubmit(values)
                resetForm()
            }}
            validationSchema={nuevoClienteSchema}
        >
            {({errors, touched}) => {
                
                return (
                <Form
                    className='mt-10'
                >
                    <div className='mb-4'>
                        <label
                            className='text-gray-800'
                            htmlFor='nombre
                        '>Nombre:</label>
                        <Field 
                            id='nombre'
                            type='text'
                            className='mt-2 block w-full p-3 bg-gray-50'
                            placeholder='Nombre del Cliente'
                            name='nombre'
                        />

                        {errors.nombre && touched.nombre ? (
                            <Alerta>{errors.nombre}</Alerta>
                        ): null }

                    </div>
                    <div className='mb-4'>
                        <label
                            className='text-gray-800'
                            htmlFor='empresa'
                            >Empresa:</label>
                        <Field 
                            id='empresa'
                            type='text'
                            className='mt-2 block w-full p-3 bg-gray-50'
                            placeholder='Empresa del Cliente'
                            name='empresa'
                        />
                         {errors.empresa && touched.empresa ? (
                            <Alerta>{errors.empresa}</Alerta>
                        ): null }
                    </div>
                    <div className='mb-4'>
                        <label
                            className='text-gray-800'
                            htmlFor='email'
                        >Email:</label>
                        <Field 
                            id='email'
                            type='email'
                            className='mt-2 block w-full p-3 bg-gray-50'
                            placeholder='Email del Cliente'
                            name='email'
                        />
                        {errors.email && touched.email ? (
                            <Alerta>{errors.email}</Alerta>
                        ): null }
                    </div>
                    <div className='mb-4'>
                        <label
                            className='text-gray-800'
                            htmlFor='telefono'
                        >Teléfono:</label>
                        <Field 
                            id='telefono'
                            type='tel'
                            className='mt-2 block w-full p-3 bg-gray-50'
                            placeholder='Teléfono del Cliente'
                            name='telefono'
                        />
                        {errors.telefono && touched.telefono ? (
                            <Alerta>{errors.telefono}</Alerta>
                        ): null }
                    </div>
                    <div className='mb-4'>
                        <label
                            className='text-gray-800'
                            htmlFor='notas'
                        >Notas:</label>
                        <Field 
                            as='textarea'
                            id='notas'
                            type='text'
                            className='mt-2 block w-full p-3 bg-gray-50 h-40'
                            placeholder='Notas del Cliente'
                            name='notas'
                        />
                    </div>
                    <input 
                        type='submit'
                        value={cliente?.nombre ? 'Editar Cliente' : 'Agregar Cliente'}
                        className='mt-5 w-full bg-blue-800 p-3 text-white uppercase font-bold text-lg'
                    
                    />
                </Form>
            )}}

            
        </Formik>
    </div>
    )
  )
}

Formulario.defaultProps = {
    cliente: {},
    cargando:false
}
export default Formulario