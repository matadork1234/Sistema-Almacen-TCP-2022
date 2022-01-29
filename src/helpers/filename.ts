import { extname } from "path"

export const filenameExt = (req, file, cb) => {
    var extFile = extname(file.originalname);
    var newFilename = new Date().getTime().toString();

    cb(null, `${ newFilename }${ extFile }`);
}