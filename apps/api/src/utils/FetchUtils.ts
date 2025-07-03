import path from "path";
import fs from "fs";
import crypto from "crypto";

const DOWNLOAD_PATH = path.join(__dirname, "../../files");
if (!fs.existsSync(DOWNLOAD_PATH)) {
  fs.mkdirSync(DOWNLOAD_PATH);
}

async function FetchAndDownloadImage(url: string) {
  const res = await fetch(url.replace("t_thumb", "t_cover_big"));
  if (!res.ok) throw new Error("Failed to fetch image");

  const extension = path.extname(url.split("/")[url.split("/").length - 1]);
  const id = crypto.randomBytes(16).toString("hex") + extension;
  const blob = await res.blob();
  const stream = fs.createWriteStream(path.join(DOWNLOAD_PATH, id));
  const buffer = await blob.arrayBuffer();
  stream.write(Buffer.from(buffer));

  return id;
}

function DeleteImage(id: string) {
  if (fs.existsSync(path.join(DOWNLOAD_PATH, id))) {
    fs.rmSync(path.join(DOWNLOAD_PATH, id));
  }
}

export default {
  FetchAndDownloadImage,
  DeleteImage,
};
