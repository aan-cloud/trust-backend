import { fromUrl, fromUrlStatus } from "@uploadcare/upload-client";

const uploadCarePk = process.env.UPLOADCARE_PUBLIC_KEY as string;

export async function uploadImage(url: string) {
    const uploadResponse = await fromUrl(url, { publicKey: uploadCarePk });

    let fileInfo;
    if ("uuid" in uploadResponse) {
        fileInfo = uploadResponse;
    } else {
        const pollingToken = uploadResponse.token;

        while (!fileInfo) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            try {
                const status = await fromUrlStatus(pollingToken, {
                    publicKey: uploadCarePk,
                });

                if (status.status === "success") {
                    fileInfo = status;
                }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error: Error | any) {
                console.log("Masih nunggu file siap...");
            }
        }
    }

    return fileInfo.uuid;
}

