/* import { Request, Response } from 'express';
import { Service } from 'typedi';

import ClientService from '../services/Client.services';

@Service()
export default class ClientController {
  constructor(private clientService: ClientService) {}

  public postData = async (_req: Request, res: Response) => {
    const data = _req.body;
    const response = await this.clientService.returnContactInfo(data);

    res.send(response);
  };
}
 */