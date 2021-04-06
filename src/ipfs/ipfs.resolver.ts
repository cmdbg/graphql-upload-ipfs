import { Inject } from '@nestjs/common';
import { IpfsService } from './ipfs.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { Mutation, Args, Resolver } from '@nestjs/graphql';
@Resolver()
export class IpfsResolver {
  constructor(@Inject(IpfsService) private ipfsService: IpfsService) {}

  @Mutation(() => String)
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename, mimetype, encoding }: FileUpload,
  ): Promise<string> {
    console.log(`Filename: ${filename}`);
    console.log(`Mimetype: ${mimetype}`);
    console.log(`Encoding: ${encoding}`);

    if (
      !(
        mimetype === 'image/png' ||
        mimetype === 'image/jpeg' ||
        mimetype === 'image/jpg' ||
        filename === 'default.txt'
      )
    ) {
      throw new Error(`Forbidden file type ${mimetype}`);
    }

    console.log(`Creating read stream!`);
    const readStream = createReadStream();
    if (!readStream) throw new Error('Readstream should be defined!');

    console.log(`Uploading file!`);
    const uri = await this.ipfsService.uploadFileFromStream(readStream);
    return uri;
  }
}
