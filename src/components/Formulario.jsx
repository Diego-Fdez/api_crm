import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Alert from "./Alerta";
import Spinner from "./Spinner";

const Formulario = ({ cliente, cargando }) => {
  //redireccionar a otra pagina
  const navigate = useNavigate();

  //schema de validación de Yup
  const nuevoClienteSchema = Yup.object().shape({
    nombre: Yup.string()
      .min(5, "El nombre es muy corto")
      .max(40, "El nombre es muy largo")
      .required("El Nombre del cliente es obligatorio"),
    empresa: Yup.string().required("El nombre de la empresa es obligatorio"),
    email: Yup.string()
      .email("Correo no válido")
      .required("El correo es obligatorio"),
    telefono: Yup.number()
      .positive("número no es válido")
      .integer("número no es válido")
      .typeError("El número no es válido"),
  });

  //recibe los valores del formulario
  const handleSubmit = async (valores) => {
    try {
      let respuesta;

      if (cliente.id) {
        //editando un registro
        const url = `http://localhost:4000/clientes/${cliente.id}`;

        respuesta = await fetch(url, {
          method: "PUT",
          body: JSON.stringify(valores),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        //nuevo registro
        const url = "http://localhost:4000/clientes";

        respuesta = await fetch(url, {
          method: "POST",
          body: JSON.stringify(valores),
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      await respuesta.json();
      navigate("/clientes");
    } catch (error) {
      console.log(error);
    }
  };

  return cargando ? (
    <Spinner />
  ) : (
    <div className='bg-white mt-10 px-5 py-10 rounded-md shadow-md md:w-3/4 mx-auto'>
      <h1 className='text-gray-600 font-bold text-xl uppercase text-center'>
        {cliente?.nombre ? "Editar Cliente" : "Agregar Cliente"}
      </h1>
      <Formik
        initialValues={{
          nombre: cliente?.nombre ?? "",
          empresa: cliente?.empresa ?? "",
          email: cliente?.email ?? "",
          telefono: cliente?.telefono ?? "",
          notas: cliente?.notas ?? "",
        }}
        enableReinitialize={true}
        onSubmit={async (values, { resetForm }) => {
          await handleSubmit(values);
          resetForm();
        }}
        validationSchema={nuevoClienteSchema}
      >
        {({ errors, touched }) => {
          return (
            <Form className='mt-10'>
              <div className='mb-4'>
                <label className='text-gray-800' htmlFor='nombre'>
                  Nombre:
                </label>
                <Field
                  type='text'
                  className='mt-2 block w-full p-3 bg-gray-50'
                  id='nombre'
                  placeholder='Nombre del Cliente'
                  name='nombre'
                />
                {errors.nombre && touched.nombre ? (
                  <Alert>{errors.nombre}</Alert>
                ) : null}
              </div>

              <div className='mb-4'>
                <label className='text-gray-800' htmlFor='empresa'>
                  Empresa:
                </label>
                <Field
                  type='text'
                  className='mt-2 block w-full p-3 bg-gray-50'
                  id='empresa'
                  placeholder='Nombre de la Empresa'
                  name='empresa'
                />
                {errors.empresa && touched.empresa ? (
                  <Alert>{errors.empresa}</Alert>
                ) : null}
              </div>

              <div className='mb-4'>
                <label className='text-gray-800' htmlFor='email'>
                  E-mail:
                </label>
                <Field
                  type='email'
                  className='mt-2 block w-full p-3 bg-gray-50'
                  id='email'
                  placeholder='Correo del Cliente'
                  name='email'
                />
                {errors.email && touched.email ? (
                  <Alert>{errors.email}</Alert>
                ) : null}
              </div>

              <div className='mb-4'>
                <label className='text-gray-800' htmlFor='telefono'>
                  Teléfono:
                </label>
                <Field
                  type='tel'
                  className='mt-2 block w-full p-3 bg-gray-50'
                  id='telefono'
                  placeholder='Teléfono del Cliente'
                  name='telefono'
                />
                {errors.telefono && touched.telefono ? (
                  <Alert>{errors.telefono}</Alert>
                ) : null}
              </div>

              <div className='mb-4'>
                <label className='text-gray-800' htmlFor='notas'>
                  Notas:
                </label>
                <Field
                  as='textarea'
                  type='text'
                  className='mt-2 block w-full p-3 bg-gray-50 h-40'
                  id='notas'
                  placeholder='Notas del Cliente'
                  name='notas'
                />
              </div>
              <input
                type='submit'
                value={cliente?.nombre ? "Editar Cliente" : "Agregar Cliente"}
                className='mt-5 w-full bg-blue-800 p-3 text-white uppercase font-bold text-lg rounded-md hover:bg-blue-400'
              />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

//props por defecto para que los parametros en nuevo cliente inicien vacíos
Formulario.defaultProps = {
  cliente: {},
  cargando: false,
};

export default Formulario;
