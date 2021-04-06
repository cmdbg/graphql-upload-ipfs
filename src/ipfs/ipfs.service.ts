import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ReadStream } from 'fs';

@Injectable()
export class IpfsService {
  constructor(private configService: ConfigService) {}

  public async uploadFileFromStream(stream: ReadStream) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const IpfsHttpClient = require('ipfs-http-client');
    const ipfsClient = new IpfsHttpClient(
      new URL(this.configService.get('ipfs').endpoint),
    );

    const buffer = await this.streamToBuffer(stream);
    const res = await ipfsClient.add(buffer, { pin: true });
    return `${this.configService.get('ipfs').clientEndpoint}/${res.cid.string}`;
  }

  async streamToBuffer(stream: ReadStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const data = [];

      stream.on('data', (chunk: any) => {
        data.push(chunk);
      });

      stream.on('end', () => {
        resolve(Buffer.concat(data));
      });

      stream.on('error', (err: any) => {
        reject(err);
      });
    });
  }
}
