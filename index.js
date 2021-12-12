const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const pool = require("./configs/dbConfig");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Handle item GET route for all items

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/item/", (req, res, next) => {
  const query = "SELECT * FROM item";
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message };
      res.send(response);
    }

    const items = [...results];
    const response = {
      data: items,
      message: "All items successfully retrieved.",
    };
    res.send(response);
  });
});

// Handle item GET route for specific item
app.get("/item/:id", (req, res, next) => {
  const id = req.params.id;
  const query = `SELECT * FROM item WHERE id=${id}`;
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message };
      res.send(response);
    }

    const item = results[0];
    const response = {
      data: item,
      message: `Item ${item.id} successfully retrieved.`,
    };
    res.status(200).send(response);
  });
});
//TODO: change
// Handle item POST route
app.post("/item/", (req, res, next) => {
  const { name, guarantee, date_of_sale, sales_location } = req.body;
  console.log(req.body);

  const query = `INSERT INTO item ( ${`name`}, ${`guarantee`}, ${`date_of_sale`}, ${`sales_location`}) VALUES ( '${name}', '${guarantee}', '${date_of_sale}', '${sales_location}');`;
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message };
      res.send(response);
    }

    const { insertId } = results;
    const item = { id: insertId, name, guarantee, date_of_sale, sales_location };
    const response = {
      data: item,
      message: `Item ${insertId} successfully added.`,
    };
    res.status(201).send(response);
  });
});

// Handle item PUT route
app.put("/item/:id", (req, res, next) => {
  const { id } = req.params;
  const query = `SELECT * FROM item WHERE id=${id} LIMIT 1`;
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message };
      res.send(response);
    }

    const { id, name, guarantee, date_of_sale, sales_location } = {
      ...results[0],
      ...req.body,
    };
    const query = `UPDATE item SET name='${name}', guarantee='${guarantee}', date_of_sale='${date_of_sale}', sales_location='${sales_location}' WHERE id='${id}'`;
    pool.query(query, (err, results, fields) => {
      if (err) {
        const response = { data: null, message: err.message };
        res.send(response);
      }

      const item = {
        id,
        name,
        guarantee,
        date_of_sale,
        sales_location
      };
      const response = {
        data: item,
        message: `Item ${id} is successfully updated.`,
      };
      res.send(response);
    });
  });
});

// Handler item DELETE route
app.delete("/item/:id", (req, res, next) => {
  const { id } = req.params;
  const query = `DELETE FROM item WHERE id=${id}`;
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message };
      res.send(response);
    }

    const response = {
      data: null,
      message: `Item with id: ${id} successfully deleted.`,
    };
    res.send(response);
  });
});

// wrap express app instance with serverless http function
module.exports.handler = serverless(app);
