const toHttpUrl = (webcalUrl: string) => webcalUrl.replace(/^webcal:\/\//, "https://");

export default toHttpUrl;
