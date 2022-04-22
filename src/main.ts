import express, { Express } from 'express';
import asyncWrapper from 'async-wrapper-express-ts';
import nodemailer from 'nodemailer';
import { createTransport } from 'nodemailer';
import { Request, Response, NextFunction } from 'express';

/* client.transformer.ts */
class ClientTransformer {
  public transform = (client: any) => {
    //console.log(client, "client");
    const transformedClient = {
      cedula: client.properties.cedula.value,
      id: client.properties.hs_object_id.value,
      firstName: client.properties.nombre_cliente.value,
      lastName: client.properties.apellido_cliente.value,
      email: client.properties.correo_electronico_cliente.value,
    };
    //console.log(transformedClient, 'transformed');
    return transformedClient;
  };

  public tranformGet = (client: any) => {
    console.log(client, 'client');
    const transformeredId = {
      cedula: client.properties.cedula.value,
      id: client.properties.hs_object_id.value,
      firstName: client.properties.nombre_cliente.value,
      lastName: client.properties.apellido_cliente.value,
      email: client.properties.correo_electronico_cliente.value,
      phone: client.properties.numero_de_telefono.value,
    };
    return transformeredId;
  };
}

/* client.services.ts */
const allData = {};
class ClientService {
  private clientTransformer: ClientTransformer = new ClientTransformer();
  //Crear instancia emailService
  private clientEmail: SendEmailService = new SendEmailService();

  async returnClientInfo(data: any) {
    //console.log(data, "data")
    const transformedClient = this.clientTransformer.transform(data);
    allData[transformedClient.id] = data;
    //mandar correo emailService.send
    this.clientEmail.sendMail(transformedClient);
    return transformedClient;
  }

  async getOne(id: number) {
    const dataId = allData[id];

    if (!id || dataId === undefined || dataId === null) {
      throw new Error('id not found');
    }
    const tranformeredId = this.clientTransformer.tranformGet(dataId);
    return tranformeredId;
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
    const htmlCode =
      '<div><p>Se ha registrado el cliente:</p></b>' +
      '<p>cliente id:' +
      client.id +
      '</p></b>' +
      '<p>cedula:' +
      client.cedula +
      '</p></b>' +
      '<p>nombre:' +
      client.firstName +
      '</p></b>' +
      '<p>apellido:' +
      client.lastName +
      '</p></b>' +
      '<p>Correo:' +
      client.email +
      '</p></div>';

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

/* client.controller.ts */

class ClientController {
  private clientService: ClientService = new ClientService();

  public postData = async (_req: Request, res: Response) => {
    const data = _req.body;
    //console.log(data, "data controller")
    const response = await this.clientService.returnClientInfo(data);
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
  PATCH = 'patch',
  PUT = 'put',
  DELETE = 'delete',
  HEAD = 'head',
  OPTIONS = 'options',
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
