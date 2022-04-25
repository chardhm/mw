import express, { Express } from 'express';
import asyncWrapper from 'async-wrapper-express-ts';
import nodemailer from 'nodemailer';
import { createTransport } from 'nodemailer';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

/* client.transformer.ts */
class ClientTransformer {
  public transform = (client: any) => {
    //console.log(client, "client");
    const transformedClient = {
      cedula: client.properties.cedula.value,
      portalId: client.properties.hs_object_id.value,
      firstName: client.properties.nombre_cliente.value,
      lastName: client.properties.apellido_cliente.value,
      email: client.properties.correo_electronico_cliente.value,
    };

    const propsCedula = { property: 'cedula', value: '' };
    propsCedula.value = transformedClient.cedula;
    //const propsPortalId = { property: 'portalId', value: '' };
    //propsPortalId.value = transformedClient.portalId;
    const propsFirstName = { property: 'firstName', value: '' };
    propsFirstName.value = transformedClient.firstName;
    const propsLastName = { property: 'lastName', value: '' };
    propsLastName.value = transformedClient.lastName;
    const propsEmail = { property: 'email', value: '' };
    propsEmail.value = transformedClient.email;

    const propertyClient = {
      properties: [],
    };

    propertyClient.properties.push(propsCedula);
    //propertyClient.properties.push(propsPortalId);
    propertyClient.properties.push(propsFirstName);
    propertyClient.properties.push(propsLastName);
    propertyClient.properties.push(propsEmail);

    //console.log(transformedClient, 'transformed');
    return propertyClient;
  };

  public tranformGet = (client: any) => {
    //console.log(client, 'client');
    const transformeredId = {
      cedula: client.properties.cedula.value,
      id: client.vid,
      firstName: client.properties.firstname.value,
      lastName: client.properties.lastname.value,
      email: client.properties.email.value,
    };
    return transformeredId;
  };
}

/* client.services.ts */

class ClientService {
  private clientTransformer: ClientTransformer = new ClientTransformer();
  //crear instancia provider
  private clientProvider: ClientProvider = new ClientProvider();
  //Crear instancia emailService
  private clientEmail: SendEmailService = new SendEmailService();

  async returnClientInfo(data: any) {
    //console.log(data, "data")
    const transformedClient = this.clientTransformer.transform(data);

    //mandar correo emailService.send

    return transformedClient;
  }

  async createClient(body: any) {
    const transformedClient = this.clientTransformer.transform(body);
    const response = await this.clientProvider.createClient(transformedClient);
    this.clientEmail.sendMail(response);
    return response;
  }

  async getOne(id: number) {
    if (!id === undefined || id === null) {
      throw new Error('id not found');
    }
    const tranformeredId = await this.clientProvider.getOne(id);
    const response = await this.clientTransformer.tranformGet(tranformeredId)
    return response;
  }
}

class SendEmailService {
  public config = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'chard.hernandez@trade.ec',
      pass: 'Hernandez1',
    },
  };

  private createTransport = nodemailer.createTransport(this.config);

  async sendMail(client: any) { 

    const htmlCode = '<div><p>Se ha registrado el cliente:</p></b>' +
    '<p>Client id:' +
      client.vid +
      '</p></b>' +
      '<p>Cedula:' +
      client.properties.cedula.value +
      '</p></b>' +
      '<p>Nombre:' +
      client.properties.firstname.value +
      '</p></b>' +
      '<p>Apellido:' +
      client.properties.lastname.value +
      '</p></b>' +
      '<p>Correo:' +
      client.properties.email.value +
      '</p></div>'; 
      //'<p>Portal id:' +
      //${client.properties.portalId.value} +
      //'</p></b>' +

    this.email.html = htmlCode;
    this.createTransport.sendMail(this.email, function (error, _info) {
      if (error) {
        console.log('Error al enviar email', error);
      } else {
        console.log('Correo enviado correctamente');
      }
      createTransport;
    });
  }

  private email = {
    from: 'chard.hernandez@trade.ec', //remitente
    to: 'chard.hernandez@trade.ec', //destinatario
    subject: 'Data Service', //asunto del correo
    html: ` 
          <div> 
          <p>Hola</p> 
          <p>Esto es una prueba de la data</p> 
          <p>¿Cómo enviar correos eletrónicos con Nodemailer en NodeJS </p> 
          </div> 
      `,
  };
}

/* Provider */
class ClientProvider {
  async createClient(body: any) {
    const url = `https://api.hubspot.com/contacts/v1/contact/`;
    const config = {
      headers: { 'Content-Type': 'application/json' },
      params: {
        hapikey: 'c0522511-1883-4ed4-a14f-d97c1586f618',
      },
    };
    try {
      const response = await axios.post(url, body, config);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async getOne(dataId: number) {
    const url = `https://api.hubapi.com/contacts/v1/contact/vid/${dataId}/profile`;
    const config = {
      headers: { 'Content-Type': 'application/json' },
      params: {
        hapikey: 'c0522511-1883-4ed4-a14f-d97c1586f618',
      },
    };
    try {
      const response = await axios.get(url, config);

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
}

/* client.controller.ts */

class ClientController {
  private clientService: ClientService = new ClientService();

  public postData = async (_req: Request, res: Response) => {
    const data = _req.body;
    //console.log(data, "data controller")
    const response = await this.clientService.returnClientInfo(data);
    res.status(200).send(response);
  };

  public createClient = async (_req: Request, res: Response) => {
    const data = _req.body;
    //console.log(data, "data controller")
    const response = await this.clientService.createClient(data);
    res.status(200).send(response);
  };

  public getOne = async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await this.clientService.getOne(+id);
    res.status(200).send(response);
  };
}
const clientController = new ClientController();

/* index.routes.ts */
/* routes.types.ts */

// Common types for routes

export interface Route {
  path: string;
  method: Methods;
  middlewares: RouteHandler[];
  handler: RouteHandler;
}

// Common methods for routes
export enum Methods {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
}

type RouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void | Response>;

const mainRoute = '/client';

/* POST */
const clientRoutes: Route[] = [
  {
    path: `${mainRoute}`,
    method: Methods.POST,
    middlewares: [],
    handler: clientController.postData,
  },
  /* API HS */
  {
    path: `${mainRoute}/create`,
    method: Methods.POST,
    middlewares: [],
    handler: clientController.createClient,
  },
  /* GET */
  {
    path: `${mainRoute}/:id`,
    method: Methods.GET,
    middlewares: [],
    handler: clientController.getOne,
  },
];

const rutaClientes = [...clientRoutes];

/* common.utils.ts ^ applyRoutes */

//Routes to export and use for middleware, structure url: domain:port/api/Version/Route(path)
export const applyRoutes = (app: Express, routes: Route[]) => {
  const version = 'v1';
  for (const route of routes) {
    const { method, path, middlewares, handler } = route;
    const enhancedPath = `/api/${version}${path}`;
    app[method](enhancedPath, ...middlewares, asyncWrapper(handler));
  }
};

const app = express();
app.use(express.json()); //middleware que transforma la req.body a un json

const PORT = 3000;

// Routes
applyRoutes(app, rutaClientes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
