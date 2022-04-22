/* import { Service } from 'typedi';
import ClientTransformer from '../transformers/Client.transformers';

@Service()
export default class ClientService {
  constructor(private clientTransformer: ClientTransformer) {}

  async returnContactInfo(data: any) {
    console.log('someone pinged here!!' + data);
    const transformedClient = this.clientTransformer.transform(data);
    return transformedClient;
  }
} */
