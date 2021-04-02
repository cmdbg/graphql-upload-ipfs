import { Inject } from '@nestjs/common';
import { createWriteStream, unlinkSync } from 'fs';
import { IpfsService } from './ipfs.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { v4 as uuidv4 } from 'uuid';
import { Mutation, Args, Resolver } from '@nestjs/graphql';

@Resolver()
export class IpfsResolver {
  constructor(@Inject(IpfsService) private ipfsService: IpfsService) {}

  @Mutation(() => String)
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename }: FileUpload,
  ): Promise<string> {
    const guid = uuidv4();
    const filePath = `./uploads/${filename}-${guid}`;

    const res = new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(filePath))
        .on('finish', () => resolve(true))
        .on('error', () => reject(false)),
    );

    if (await res) {
      const uri = await this.ipfsService.uploadFile(filePath);
      unlinkSync(filePath);

      return uri;
    }

    throw new Error(`Ipfs upload of ${filename} failed!`);
  }
}
