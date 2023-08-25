const express = require("express");
const app = express();
const config = require("./db/config");
const contact = require("./db/contact");
const cors = require("cors");
const multer = require("multer");

app.use(express.json());
app.use(cors());

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploadFolder");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now() + ".jpg");
    },
  }),
}).single("user.file");

app.post("/add-contact", upload, async (req, resp) => {
  let cont = new contact(req.body);
  const existingContact = await contact.findOne({ number: req.body.number });
  if (!existingContact) {
    let result = await cont.save();
    resp.send(result);
  } else {
    resp.send({ result: "Contact with this phone number already exists" });
  }
});

app.get("/all-contacts", async (req, resp) => {
  let contlist = await contact.find();
  if (contlist.length > 0) {
    resp.send(contlist);
  } else {
    resp.send({ result: "NO DATA FOUND" });
  }
});

app.delete("/contact/:id", async (req, resp) => {
  let result = await contact.deleteOne({ _id: req.params.id });
  resp.send(result);
});

app.get("/contact/:id", async (req, resp) => {
  let result = await contact.findOne({ _id: req.params.id });
  if (result) {
    resp.send(result);
  } else {
    resp.send({ result: "NO RECORD FOUND" });
  }
});

app.put("/contact/:id", async (req, resp) => {
  let result = await contact.updateOne(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  );
  resp.send(result);
});

app.get("/search/:key", async (req, resp) => {
  let result = await contact.find({
    $or: [
      { name: { $regex: req.params.key } },
      { number: { $regex: req.params.key } },
    ],
  });
  resp.send(result);
});

app.listen(5000);
