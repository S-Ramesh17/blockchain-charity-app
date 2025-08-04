import { create } from 'ipfs-http-client';

const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET;
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

export const uploadToIPFS = async (file) => {
  try {
    const added = await client.add(file);
    return added.path;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
};

export const getFromIPFS = async (hash) => {
  try {
    const chunks = [];
    for await (const chunk of client.cat(hash)) {
      chunks.push(chunk);
    }
    return chunks.join('');
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw error;
  }
};