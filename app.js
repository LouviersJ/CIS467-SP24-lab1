const express = require("express");

const app = express();
const PORT = 3000;
const mysql = require("mysql2/promise");
const config = require("./config");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = mysql.createPool(config.db);

app.listen(PORT, async () => {
  const host = process.env.HOSTNAME || "http://localhost";
  console.log(`Listening on ${host}:${PORT}`);
});

app.use((req, res, next) => {
  req.user = { id: 4, name: "LOUviers" }
  next()
});

app.get("/", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    console.log(req.user);
    const [users] = await conn.query("SELECT * FROM users");

    conn.release();
    //console.log(users)

    res.json(users);
  } catch (err) {
    res.json({ message: "error" });
    console.error(err);
  }
});

app.get("/api/v1/tags", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    console.log(req.user);
    const [tags] = await conn.query("SELECT * FROM tags");

    conn.release();
    //console.log(users)

    res.json(tags);
  } catch (err) {
    res.json({ message: "error" });
    console.error(err);
  }
});

app.get("/api/v1/tags/:id", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    console.log(req.user);
    const [tags] = await conn.query(
      "SELECT * FROM tags WHERE tagID=" + req.params.id
    );

    conn.release();
    //console.log(users)

    if (tags.length > 0) {
      res.json(tags[0]);
    } else {
      res.status(404).json({ message: "Resource not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "error" });
    console.error(err);
  }
});

// Create a new user
app.post("/api/v1/tags", async (req, res) => {
  const { tagDescription } = req.body;
  try {
    const connection = await pool.getConnection();
    await connection.query("INSERT INTO tags (tagDescription) VALUES (?)", [
      tagDescription,
    ]);
    const [newTag] = await connection.query(
      "SELECT * FROM tags WHERE tagDescription=?",
      [tagDescription]
    );
    connection.release();
    res.status(201).json(newTag[0]);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).send("Error creating user");
  }
});

app.put("/api/v1/tags/:id", async(req, res) => {
  const tagID = req.params.id
  const newTag = req.body

  if (!tagID || !newTag) {
    res.status(400).send("Invalid input data")
  }
  const connection = await pool.getConnection();
  const sql = "UPDATE tags SET ? WHERE tagID = ?"
  const values = [newTag, tagID];

  await connection.query(sql, values, (err, res_) => {
    if (err) {
      console.error("Error editing tag:", err)
      res.status(500).send("Database error")
    }
    if (res_.affectedRows == 0) {
      console.log("Tag not found")
      res.status(404).send("Tag not found")
    }
  })
  connection.release();
  console.log("Tag edit success")
  res.status(200).json(newTag);
});

app.delete('/api/v1/tags/:id', async (req, res) => {
  const {tagId} = req.params.id;
  
  try{
      const connection = await pool.getConnection();
      await connection.query('DELETE FROM tags WHERE tagID = ?', [tagId]);
      connection.release();
      res.status(204).send(); 
  }catch (error) {
      console.error('Error deleting tag:', err);
      connection.release();
      res.status(404).json({ error: 'ID not found' });
  }
  
});

app.get("/api/v1/prayers", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    console.log(req.user);
    const [prayers] = await conn.query("SELECT * FROM prayers");

    conn.release();
    //console.log(users)

    res.json(prayers);
  } catch (err) {
    res.json({ message: "error" });
    console.error(err);
  }
});

app.get("/api/v1/prayers/:id", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    console.log(req.user);
    const [prayers] = await conn.query(
      "SELECT * FROM prayers WHERE prayerID=" + req.params.id
    );

    conn.release();
    //console.log(users)

    if (prayers.length > 0) {
      res.json(prayers[0]);
    } else {
      res.status(404).json({ message: "Resource not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "error" });
    console.error(err);
  }
});


app.post("/api/v1/prayers", async (req, res) => {
  const { prayer } = req.body;
  try {
    const connection = await pool.getConnection();
    await connection.query("INSERT INTO prayers VALUES (?)", [
      prayer
    ]);
    const [newPrayer] = await connection.query(
      "SELECT * FROM prayers WHERE prayerID=?",
      [prayer.prayerID]
    );
    connection.release();
    res.status(201).json(newPrayer[0]);
  } catch (err) {
    console.error("Error creating prayer:", err);
    res.status(500).send("Error creating prayer");
  }
});

app.put("/api/v1/prayer/:id", async(req, res) => {
  const prayerID = req.params.id
  const newPrayer = req.body

  if (!prayerID || !newPrayer) {
    res.status(400).send("Invalid input data")
  }
  const connection = await pool.getConnection();
  const sql = "UPDATE prayers SET ? WHERE prayerID = ?"
  const values = [newPrayer, prayerID];

  await connection.query(sql, values, (err, res_) => {
    if (err) {
      console.error("Error editing prayer:", err)
      res.status(500).send("Database error")
    }
    if (res_.affectedRows == 0) {
      console.log("prayer not found")
      res.status(404).send("Tag not found")
    }
  })
  connection.release();
  console.log("Prayer edit success")
  res.status(200).json(newTag);
});

app.delete('/api/v1/prayer/:id', async (req, res) => {
  const {prayerID} = req.params.id;
  
  try{
      const connection = await pool.getConnection();
      await connection.query('DELETE FROM prayers WHERE prayerID = ?', [prayerID]);
      connection.release();
      res.status(204).send(); 
  }catch (error) {
      console.error('Error deleting prayer:', err);
      connection.release();
      res.status(404).json({ error: 'ID not found' });
  }
  
});


app.get("/api/v1/prayers/:id/likes", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    console.log(req.user);
    const [prayers] = await conn.query(
      "SELECT * FROM prayers WHERE prayerID=" + req.params.id
    );

    conn.release();
    //console.log(users)

    if (prayers.length > 0) {
      res.json(prayers[0]);
    } else {
      res.status(404).json({ message: "Resource not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "error" });
    console.error(err);
  }
});


app.post("/api/v1/prayers/:id/likes", async (req, res) => {
  const { prayer } = req.body;
  try {
    const connection = await pool.getConnection();
    await connection.query("INSERT INTO prayers VALUES (?)", [
      prayer
    ]);
    const [newPrayer] = await connection.query(
      "SELECT * FROM prayers WHERE prayerID=?",
      [prayer.prayerID]
    );
    connection.release();
    res.status(201).json(newPrayer[0]);
  } catch (err) {
    console.error("Error creating prayer:", err);
    res.status(500).send("Error creating prayer");
  }
});


app.delete('/api/v1/prayer/:id/likes', async (req, res) => {
  const {prayerID} = req.params.id;
  
  try{
      const connection = await pool.getConnection();
      await connection.query('DELETE FROM prayers WHERE prayerID = ?', [prayerID]);
      connection.release();
      res.status(204).send(); 
  }catch (error) {
      console.error('Error deleting prayer:', err);
      connection.release();
      res.status(404).json({ error: 'ID not found' });
  }
  
});

app.get("/api/v1/prayers/:id/saves", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    console.log(req.user);
    const [prayers] = await conn.query(
      "SELECT * FROM prayers WHERE prayerID=" + req.params.id
    );

    conn.release();
    //console.log(users)

    if (prayers.length > 0) {
      res.json(prayers[0]);
    } else {
      res.status(404).json({ message: "Resource not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "error" });
    console.error(err);
  }
});


app.post("/api/v1/prayers/:id/saves", async (req, res) => {
  const { prayer } = req.body;
  try {
    const connection = await pool.getConnection();
    await connection.query("INSERT INTO prayers VALUES (?)", [
      prayer
    ]);
    const [newPrayer] = await connection.query(
      "SELECT * FROM prayers WHERE prayerID=?",
      [prayer.prayerID]
    );
    connection.release();
    res.status(201).json(newPrayer[0]);
  } catch (err) {
    console.error("Error creating prayer:", err);
    res.status(500).send("Error creating prayer");
  }
});


app.delete('/api/v1/prayer/:id/saves', async (req, res) => {
  const {prayerID} = req.params.id;
  
  try{
      const connection = await pool.getConnection();
      await connection.query('DELETE FROM prayers WHERE prayerID = ?', [prayerID]);
      connection.release();
      res.status(204).send(); 
  }catch (error) {
      console.error('Error deleting prayer:', err);
      connection.release();
      res.status(404).json({ error: 'ID not found' });
  }
  
});