import { useState, useEffect } from "react";
import Cliente from "../components/Cliente";
import swal from 'sweetalert';

const Inicio = () => {

  const [clientes, setClientes] = useState([]);

  //lee los datos del servidor la primera vez
  useEffect(() => {
    const obtenerClientesAPI = async () =>{
      try {
        const url = 'http://localhost:4000/clientes';
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();

        setClientes(resultado);
      } catch (error) {
        
      }
    }
    obtenerClientesAPI();
  }, [])

  //función eliminar
  const eliminarCliente = async id => {
    try {
      const url = `http://localhost:4000/clientes/${id}`;
        const respuesta = await fetch(url, {
          method: 'DELETE'
        })
        await respuesta.json();

        const arrayClientes = clientes.filter( cliente => cliente.id !== id );
        setClientes(arrayClientes);
    } catch (error) {
      console.log(error)
    }
  }

  //eliminando un cliente
  const handleEliminar = (id) => {
    swal({
      title: "Desea eliminar el cliente?",
      text: "no se podrán revertir los cambios!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        eliminarCliente(id)
        swal("Cliente eliminado con éxito!", {
          icon: "success",
        });
      } 
    });
  }

  return (
    <>
      <h1 className="font-black text-4xl text-blue-900">Clientes</h1>
      <p className="mt-3">Administra tus Clientes</p>

      <table className="w-full mt-5 table-auto shadow bg-white">
        <thead className="bg-blue-800 text-white">
          <tr>
            <th className="p-2">Nombre</th>
            <th className="p-2">Contacto</th>
            <th className="p-2">Empresa</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map( cliente => (
            <Cliente 
              key={cliente.id} 
              cliente={cliente} 
              handleEliminar={handleEliminar}
            />
          ))}
        </tbody>
      </table>
    </>
  )
}

export default Inicio;