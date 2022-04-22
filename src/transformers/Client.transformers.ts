/* import { Service } from 'typedi';

@Service()
export default class ClientTransformer {
  public transform = (client: any) => {
    const callsRegister = client.properties.numero_de_telefono; //validación si es mayor a 1

    if (callsRegister >= 1) {
      return callsRegister;
    } else {
      console.error("Ops, we don't find any call");
    }

    const transformedClient = {
      cedula: client.properties.cedula,
      id: client.properties.hs_object_id,
      name: client.properties.nombre_cliente,
      lastname: client.properties.apellido_cliente,
      email: client.properties.correo_electronico_cliente.value,
    };
    return transformedClient;
  };
} */
