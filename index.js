import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";
import multer from "multer";

const __dirname = dirname(fileURLToPath(import.meta.url));

const upload = multer({
  storage: multer.diskStorage({
    // директория для файлов
    destination(req, file, cb) {
      cb(null, "uploads/");
    },
    // названия файлов
    filename(req, file, cb) {
      cb(null, `${file.originalname}.mp3`);
    },
  }),
});

const app = express();
app.use(express.static("public"));
app.use(express.static("uploads"));

// поле, содержащее файл, должно называться `audio`
app.post("/save", upload.single("audio"), (req, res) => {
  // в ответ мы возвращаем статус `201`,
  // свидетельствующий об успешном сохранении файла на сервере
  res.sendStatus(201);
});

app.get("/records", async (req, res) => {
  try {
    // читаем содержимое директории `uploads`
    let files = await fs.readdir(`${__dirname}/uploads`);
    // нас интересуют только файлы с расширением `.mp3`
    files = files.filter((fileName) => fileName.split(".")[1] === "mp3");
    // отправляем файлы клиенту
    res.status(200).json(files);
  } catch (e) {
    console.log(e);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("🚀");
});
