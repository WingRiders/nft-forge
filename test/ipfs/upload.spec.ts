import { describe, expect, mock, test } from "bun:test";
import { IpfsUploadResponse, uploadFileToIpfs } from "../../src/ipfs/upload";

describe("IPFS upload", () => {
  test("Upload a file", async () => {
    const mockedResponse: IpfsUploadResponse = {
      name: "name a",
      cid: "aaa",
      size: 10,
      allocations: [],
    };

    mock.module("../../src/ipfs/common", () => {
      return {
        ipfsAxios: {
          post: (endpoint: string) => {
            if (endpoint === "/add")
              return Promise.resolve({
                data: mockedResponse,
              });
            return Promise.resolve({ data: {} });
          },
        },
      };
    });

    const response = await uploadFileToIpfs({} as File);
    expect(response).toEqual(mockedResponse);
  });
});
