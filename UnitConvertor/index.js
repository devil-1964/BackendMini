const express = require("express");
const bodyParser=require("body-parser");
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))

app.set("view engine","ejs")

const conversions = {
    length: {
        1: { 2: (d) => d / 1000, 3: (d) => d * 3.28084 },
        2: { 1: (d) => d * 1000, 3: (d) => d * 3280.84 },
        3: { 1: (d) => d / 3.28084, 2: (d) => d / 3280.84 }
    },
    weight: {
        1: { 2: (d) => d / 1000, 3: (d) => d * 2.20462 },
        2: { 1: (d) => d * 1000, 3: (d) => d * 2204.62 },
        3: { 1: (d) => d /2204.62, 2: (d) => d /  2.20462 }
    },
    temp: {
        1: { 2: (d) => (d * 9/5) + 32, 3: (d) => d + 273.15 },
        2: { 1: (d) => (d - 32) * 5/9, 3: (d) => ((d - 32) * 5/9) + 273.15 },
        3: { 1: (d) => d - 273.15, 2: (d) => ((d - 273.15) * 9/5) + 32 }
    }
};

const convert = ({ type, data, from, to }) => {
    if (conversions[type] && conversions[type][from] && conversions[type][from][to]) {
        return conversions[type][from][to](parseFloat(data));
    }
    return null;
};

app.get("/length", (req, res) => {
    res.render("length", { result: null });
});

app.get("/weight", (req, res) => {
    res.render("weight", { result: null });
});
app.get("/temp", (req, res) => {
    res.render("temp", { result: null });
});

app.post("/convert", (req, res) => {
    const { type, from, to, data } = req.body;
    const result = convert({ type, from, to, data });
    if (result !== null) {
        res.render(type, { result });
    } else {
        res.status(400).send("Invalid conversion request");
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
